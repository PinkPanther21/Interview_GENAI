# AI-Powered Interview Preparation Platform

An intelligent interview preparation tool that leverages AI to create personalized interview strategies based on job descriptions and user profiles. Built as a full-stack MERN application with Google Gemini AI integration.

## 🚀 Features

### Core Functionality
- **AI-Driven Interview Analysis**: Uses Google Gemini AI to analyze job descriptions and user profiles
- **Personalized Interview Plans**: Generates tailored technical and behavioral questions with model answers
- **Resume Upload & Parsing**: Supports PDF resume uploads with automatic parsing
- **Skill Gap Analysis**: Identifies areas for improvement based on job requirements
- **Learning Roadmap**: Creates structured preparation schedules
- **Match Score Calculation**: Provides compatibility percentage between candidate and job

### User Management
- **Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- **Profile Management**: User registration, login, and protected routes
- **Interview History**: Save and access previous interview reports

### Additional Features
- **PDF Resume Generation**: Generate formatted PDF resumes from interview data
- **Responsive Design**: Modern, mobile-friendly UI built with React and Sass
- **Real-time Feedback**: Loading states and progress indicators

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcrypt
- **AI Integration**: Google Gemini AI (@google/genai)
- **File Handling**: Multer for uploads, pdf-parse for PDF processing
- **PDF Generation**: Puppeteer for dynamic PDF creation
- **Validation**: Zod for schema validation
- **CORS & Cookies**: cors, cookie-parser

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router v7
- **Styling**: Sass/SCSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Vite with Hot Module Replacement

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini AI API key
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prep5
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Configuration**

   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/interview-prep
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_GENAI_API_KEY=your-google-gemini-api-key
   ```

5. **Start MongoDB**
   Ensure MongoDB is running on your system or update the MONGO_URI accordingly.

## 🚀 Usage

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server will run on http://localhost:3000

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Access the Application**
   Open your browser and navigate to http://localhost:5173

### How to Use

1. **Register/Login**: Create an account or log in to your existing account
2. **Create Interview Plan**:
   - Paste the target job description
   - Upload your resume (PDF) or provide a quick self-description
   - Click "Generate Interview Plan"
3. **Review Your Plan**:
   - View your match score
   - Study technical and behavioral questions with model answers
   - Follow the personalized learning roadmap
   - Identify and address skill gaps
4. **Access Previous Reports**: View all your saved interview preparations
5. **Generate PDF Resume**: Create a formatted resume based on your interview data

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /get-me` - Get current user info (protected)

### Interview Routes (`/api/interview`)
- `POST /` - Generate interview report (protected, multipart/form-data)
- `GET /` - Get all user's interview reports (protected)
- `GET /report/:interviewId` - Get specific interview report (protected)
- `POST /resume/pdf/:interviewReportId` - Generate PDF resume (protected)

## 🏗️ Project Structure

```
prep5/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── blacklist.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   └── services/
│   │   │   └── interview/
│   │   │       ├── Pages/
│   │   │       ├── Services/
│   │   │       └── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── app.router.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built following tutorial guidance by Sheriyans coding school
- Powered by Google Gemini AI
- UI inspired by modern interview preparation platforms


**Note**: This is a tutorial-based project demonstrating full-stack development with AI integration. For production use, consider additional security measures, error handling, and testing.</content>
