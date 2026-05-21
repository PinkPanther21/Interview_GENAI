import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/agentcoach.scss";

const AgentCoach = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get logged in user from localStorage (same way your app does it)
  // Decode JWT to get user ID
const token = localStorage.getItem("token");
let userId = "guest_user";
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userId = payload.id;
  } catch {
    userId = "guest_user";
  }
}

  const handlePrepare = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

   try {
  const res = await fetch("http://localhost:8001/agent/prep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      job_description: message,
    }),
  });

  if (!res.ok) throw new Error("Agent failed to respond");
  const data = await res.json();

  if (data.error) {
    setError(`Error: ${data.error}`);
  } else if (!data.plan || data.plan.trim() === "") {
    setError("Agent returned empty response. API quota may be exhausted.");
  } else {
    setResponse(data.plan);
  }
} catch (err) {
  setError(`Agent is unavailable: ${err.message}`);
} finally {
  setLoading(false);
}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePrepare();
    }
  };

  return (
    <div className="agent-coach">

      {/* Header */}
      <div className="agent-coach__header">
        <button className="agent-coach__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="agent-coach__title">
          <span className="agent-coach__dot" />
          <h1>AI Interview Coach</h1>
        </div>
        <p className="agent-coach__subtitle">
          Tell me about your upcoming interview. I'll check your history and
          build a personalized prep plan just for you.
        </p>
      </div>

      {/* Input area */}
      <div className="agent-coach__input-section">
        <textarea
          className="agent-coach__textarea"
          placeholder={`Example:\n"I have a Google interview next week for a Software Engineer role. I'm good at React but weak in system design."`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
        />
        <button
          className="agent-coach__btn"
          onClick={handlePrepare}
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <span className="agent-coach__spinner" />
          ) : (
            "✦ Prepare Me"
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="agent-coach__thinking">
          <div className="agent-coach__thinking-dots">
            <span /><span /><span />
          </div>
          <p>Agent is analyzing your history and building your plan...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="agent-coach__error">
          {error}
        </div>
      )}

      {/* Response */}
      {response !== null && (
        <div className="agent-coach__response">

          <div className="agent-coach__response-header">
            <span className="agent-coach__dot" />
            <h2>Your Personalized Plan</h2>
          </div>
          <div className="agent-coach__response-body">
            {response.split("\n").map((line, i) => {
              // Bold lines that start with ** 
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="agent-coach__bold-line">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              // Numbered lines
              if (/^\d+\./.test(line)) {
                return <p key={i} className="agent-coach__numbered">{line}</p>;
              }
              // Empty lines
              if (!line.trim()) return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentCoach;