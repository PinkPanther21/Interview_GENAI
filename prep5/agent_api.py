import os
import asyncio
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

load_dotenv("./Backend/.env")

_key = os.getenv("GOOGLE_GENAI_API_KEY") or os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = _key

client = MongoClient(os.getenv("MONGO_URI"))
db = client["practice-interview"]

# ── Tools ─────────────────────────────────────────────────

def get_user_weak_areas(user_id: str) -> dict:
    """Fetches past interview reports and finds recurring skill gaps"""
    print(f"[TOOL CALLED] get_user_weak_areas with user_id={user_id}")
    def _safe_objectid(val: str):
        try:
            return ObjectId(val)
        except Exception:
            return None

    obj_id = _safe_objectid(user_id)

    reports = []
    for q in ([{"user": obj_id}] if obj_id else []) + [{"user": user_id}]:
        candidate = list(db.interviewreports.find(q))
        if candidate:
            reports = candidate
            break

    if not reports:
        return {"found": False, "message": "No past interviews found"}

    all_gaps = []
    job_titles = []
    match_scores = []

    for r in reports:
        gaps = r.get("skillGaps", [])
        if isinstance(gaps, list):
            for gap in gaps:
                # your skillGaps are objects like {"skill": "...", "severity": "..."}
                if isinstance(gap, dict):
                    skill = gap.get("skill", "")
                    if skill:
                        all_gaps.append(skill)
                else:
                    all_gaps.append(str(gap))

        title = r.get("jobTitle", "") or r.get("title", "")
        if title:
            job_titles.append(title)

        score = r.get("matchScore", None)
        if score:
            match_scores.append(score)

    gap_counts = {}
    for gap in all_gaps:
        gap_counts[gap] = gap_counts.get(gap, 0) + 1

    recurring = sorted(gap_counts.items(), key=lambda x: x[1], reverse=True)
    avg_score = sum(match_scores) / len(match_scores) if match_scores else 0

    return {
        "found": True,
        "total_past_interviews": len(reports),
        "past_job_titles": job_titles,
        "recurring_weak_areas": recurring[:5],
        "average_match_score": round(avg_score, 1),
        "message": f"Found {len(reports)} past interviews with real skill gap data"
    }

def save_agent_plan(user_id: str, job_title: str, plan: str, weak_areas: str) -> dict:
    """Saves the agent plan to MongoDB"""
    try:
        obj_id = ObjectId(user_id)
    except:
        obj_id = user_id

    db.agentplans.insert_one({
        "user": obj_id,
        "jobTitle": job_title,
        "plan": plan,
        "addressedWeakAreas": weak_areas,
        "createdByAgent": True,
    })
    return {"status": "saved successfully"}

# ── Agent ─────────────────────────────────────────────────

interview_agent = Agent(
    name="interview_prep_agent",
    model="gemini-2.5-flash",
    description="Personalized interview coach that learns from user history",
    instruction="""
    You are an expert interview coach with access to the user's full interview history.

    When a user tells you about an upcoming interview, follow these steps:

    STEP 1: Call get_user_weak_areas with their user_id to fetch their history.

    STEP 2: Analyze the results carefully:
    - If found=True, you have REAL data about their weak areas from past interviews
    - Note their recurring_weak_areas, average_match_score, and past_job_titles
    - If found=False, treat as a fresh user

    STEP 3: Generate a PERSONALIZED prep plan that:
    - Starts by naming their specific weak areas from the data
    - Weights MORE questions toward those weak areas
    - Includes 5 technical questions (3 on weak areas, 2 on job requirements)
    - Includes 3 behavioral questions
    - Gives study priority order based on their actual gaps

    STEP 4: Call save_agent_plan to save the plan.

    STEP 5: Present the plan. If they have history, start EXACTLY with:
    "Based on your [total_past_interviews] past interviews, I noticed you consistently struggle with [list the recurring_weak_areas]. Your average match score was [average_match_score]%. Here's your personalized plan targeting these gaps:"

    If no history:
    "Welcome! Since this is your first session, here's a comprehensive plan:"

    Be specific, encouraging, and actionable.
    """,
    tools=[get_user_weak_areas, save_agent_plan]
)

# ── FastAPI ────────────────────────────────────────────────

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PrepRequest(BaseModel):
    user_id: str
    job_description: str

@app.post("/agent/prep")
async def generate_prep(request: PrepRequest):
    session_service = InMemorySessionService()
    session = await session_service.create_session(
        app_name="interview_prep",
        user_id=request.user_id,
        session_id=f"session_{request.user_id}"
    )

    runner = Runner(
        agent=interview_agent,
        app_name="interview_prep",
        session_service=session_service
    )

    message = types.Content(
        role="user",
        parts=[types.Part(text=f"User ID: {request.user_id}. {request.job_description}")]
    )

    response_text = ""
    try:
        async for event in runner.run_async(
            user_id=request.user_id,
            session_id=session.id,
            new_message=message
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
    except Exception as e:
        return {"plan": "", "error": str(e)}

    return {"plan": response_text}

@app.get("/health")
def health():
    return {"status": "agent running"}

@app.get("/test/{user_id}")
def test_mongo(user_id: str):
    def _to_jsonable(x):
        if isinstance(x, ObjectId):
            return str(x)
        if isinstance(x, list):
            return [_to_jsonable(i) for i in x]
        if isinstance(x, dict):
            return {k: _to_jsonable(v) for k, v in x.items()}
        return x
    try:
        obj_id = ObjectId(user_id)
        count = int(db.interviewreports.count_documents({"user": obj_id}))
        sample = db.interviewreports.find_one({"user": obj_id})
        return {"count": count, "sample": _to_jsonable(sample) if sample else None}
    except Exception as e:
        return {"error": str(e)}

@app.get("/collections")
def list_collections():
    cols = db.list_collection_names()
    return {c: db[c].count_documents({}) for c in cols}

@app.get("/whohas")
def who_has_reports():
    reports = list(db.interviewreports.find({}, {"user": 1, "_id": 0}))
    return {"user_ids_with_reports": list(set([str(r.get("user", "")) for r in reports]))}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)