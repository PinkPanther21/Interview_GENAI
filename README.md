# AI-Powered Interview Preparation Platform

An intelligent interview preparation platform that uses AI to create personalized interview strategies based on job descriptions and past interview history. Built as a full-stack MERN application with Google Gemini AI and an intelligent agent layer.

## 🚀 Features

### Core Functionality
- **AI-Driven Interview Analysis**: Uses Google Gemini AI to analyze job descriptions and user profiles
- **Personalized Interview Plans**: Generates tailored technical and behavioral questions with model answers
- **Resume Upload & Parsing**: Supports PDF resume uploads with automatic parsing
- **Skill Gap Analysis**: Identifies areas for improvement based on job requirements
- **Learning Roadmap**: Creates structured preparation schedules
- **Match Score Calculation**: Provides compatibility percentage between candidate and job

### 🤖 Intelligent Agent (New)
- **Persistent Memory**: Agent reads your past interview reports from MongoDB to understand your history
- **Weak Area Detection**: Automatically identifies recurring skill gaps across multiple interviews
- **Personalized Prep Plans**: Generates questions weighted toward YOUR specific weak areas
- **Plan Storage**: Saves every generated plan to MongoDB for future reference
- **Multi-step Reasoning**: Agent fetches history → analyzes gaps → generates plan → saves results

### User Management
- **Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- **Profile Management**: User registration, login, and protected routes
- **Interview History**: Save and access previous interview reports

### Additional Features
- **PDF Resume Generation**: Generate formatted PDF resumes from interview data
- **Responsive Design**: Modern, mobile-friendly UI built with React and Sass

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcrypt
- **AI Integration**: Google Gemini AI (@google/genai)
- **File Handling**: Multer for uploads, pdf-parse for PDF processing
- **PDF Generation**: Puppeteer for dynamic PDF creation

### Agent API (Python)
- **Framework**: FastAPI
- **Agent Framework**: Google ADK (Agent Development Kit)
- **Model**: Gemini 2.5 Flash
- **Database**: MongoDB (reads interview history, writes agent plans)
- **Tools**: get_user_weak_areas, save_agent_plan

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Sass/SCSS
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.10+
- MongoDB (local or Atlas)
- Google Gemini AI API key

## 🔧 Installation

1. **Clone the repository**
```bash
   git clone 
   cd prep5
```

2. **Backend Setup**
```bash
   cd Backend
   npm install
```

3. **Frontend Setup**
```bash
   cd Frontend
   npm install
```

4. **Agent API Setup**
```bash
   pip install fastapi uvicorn google-adk pymongo python-dotenv
```

5. **Environment Configuration**

   Create `.env` in the Backend directory:
```env
   MONGO_URI=mongodb://localhost:27017/practice-interview
   JWT_SECRET=your-jwt-secret
   GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

   Create `.env` in the Backend directory for Agent:
```env
   MONGO_URI=mongodb://localhost:27017/practice-interview
   GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

## 🚀 Usage

1. **Start the Backend Server**
```bash
   cd Backend && npm run dev
```

2. **Start the Agent API**
```bash
   python agent_api.py
```
   Runs on http://localhost:8001

3. **Start the Frontend**
```bash
   cd Frontend && npm run dev
```
   Runs on http://localhost:5173

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register
- `POST /login` - Login
- `GET /logout` - Logout
- `GET /get-me` - Current user

### Interview (`/api/interview`)
- `POST /` - Generate interview report
- `GET /` - Get all reports
- `GET /report/:id` - Get specific report
- `POST /resume/pdf/:id` - Generate PDF resume

### Agent (`localhost:8001`)
- `POST /agent/prep` - Generate personalized prep plan using past history
- `GET /health` - Health check
- `GET /test/:user_id` - Test MongoDB connection for user

## 🏗️ Project Structure
prep5/
├── Backend/          # Node.js + Express API
├── Frontend/         # React + Vite
├── agent_api.py      # Python AI Agent (Google ADK + FastAPI)
└── README.md

## 📝 License

MIT License

## 🙏 Acknowledgments
- Built following tutorial guidance by Sheriyans Coding School
- Agent layer powered by Google ADK and Gemini 2.5 Flash
- Database powered by MongoDB