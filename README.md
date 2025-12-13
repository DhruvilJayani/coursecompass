# CourseCompass - AI-Powered Academic Assistant

> **Intelligent Course Planning and Scheduling System with Multi-AI Agents**

CourseCompass is a full-stack web application that helps students navigate their academic journey with AI-powered course recommendations, schedule generation, and conflict detection.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)

---

## Features

### Core Functionality
- **🤖 AI-Powered Chat Interface** - Conversational assistant powered by Groq LLM
- **📚 Course Recommendations** - Personalized suggestions based on interests and goals
- **📅 Schedule Generation** - Automatic conflict-free class schedule creation
- **🔍 Prerequisite Analysis** - Deep understanding of course dependencies
- **🔐 Secure Authentication** - JWT-based email/password authentication
- **🌓 Dark/Light Mode** - Comfortable viewing in any environment
- **📱 Responsive Design** - Works seamlessly on all devices

### AI Agent Architecture
- **Router Agent** - Intelligent query classification
- **Course Detail Agent** - Handles course information and recommendations
- **Schedule Agent** - Manages scheduling and conflict detection
- **Vector Search** - Semantic search using Qdrant and Jina AI embeddings

---

## Screenshots

### Authentication Flow

**Registration Page**

![Registration Page](images/register-page.png)

**Login Page**

![Login Page](images/login-page.png)

**OTP Email Verification**

![OTP Email](images/otp-mail.png)

**OTP Entry Page**

![OTP Enter Page](images/otp-enter-page.png)

### Chat Interface

**Main Chat Interface**

![Chat Interface](images/chat-ui.png)

**Light Mode**

![Light Mode Chat](images/light-mode-chat.png)

**Dark Mode**

![Dark Mode Chat](images/dark-mode-chat.png)

---

## Project Structure

```
coursecompass/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components (Auth, Chat)
│   │   ├── services/     # API service layer
│   │   ├── store/        # State management (Zustand)
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
└── backend/              # Node.js + Express backend
    ├── agents/           # AI agent implementations
    ├── controllers/      # Route controllers
    ├── routes/           # API routes
    ├── services/         # External services (Groq, Qdrant, Jina)
    ├── prisma/           # Database schema & migrations
    ├── scripts/          # Utility scripts (seeding, testing)
    └── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+
- **Docker** (for containerized services)
- **API Keys**: Groq, Jina AI

### 1. Clone Repository

```bash
git clone https://github.com/DhruvilJayani/coursecompass.git
cd coursecompass
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start required services (MySQL, Redis, Qdrant)
docker run -d --name coursecompass-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=coursecompass \
  -p 3306:3306 mysql:8.0

docker run -d --name coursecompass-redis -p 6379:6379 redis:latest

docker run -d --name coursecompass-qdrant \
  -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database  
node scripts/seed.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env to point to backend (default: http://localhost:3000)

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Configuration

### Backend Environment Variables

```env
# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="mysql://root:password@localhost:3306/coursecompass"

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
GROQ_API_KEY=your-groq-api-key
JINA_API_KEY=your-jina-api-key
```

### Frontend Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chat/chatUser` | Send chat message | ✅ |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/chat/chatUser \
  -H "Content-Type: application/json" \
  -H "auth-token: YOUR_JWT_TOKEN" \
  -d '{"message": "What are the prerequisites for CMPE 280?"}'
```

**Example Response:**
```json
{
  "message": "The prerequisites for CMPE 280 are CMPE 202.",
  "from_knowledge_base": true,
  "source": "courseDetail"
}
```

---

## Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool
- **Material-UI 7.3.5** - Component library
- **Zustand 5.0.8** - State management
- **Axios 1.13.2** - HTTP client

### Backend
- **Node.js 20+** - Runtime
- **Express 5.1.0** - Web framework
- **Prisma 6.13.0** - ORM
- **MySQL** - Database
- **Redis** - Caching
- **Qdrant** - Vector database
- **Groq SDK** - LLM inference (Llama 3.3 70B)
- **Jina AI** - Text embeddings

---

## Development Scripts

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev              # Start dev server with nodemon
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
```

---

## Testing Sample Queries

Try these queries in the chat interface:

**Course Details:**
- "What are the prerequisites for CMPE 258?"
- "I'm interested in AI and machine learning. Which courses should I take?"
- "Tell me about cloud computing courses"

**Scheduling:**
- "When is CMPE 202 offered?"
- "Generate a schedule for CMPE 202, CMPE 272, and CMPE 280"
- "Who teaches CMPE 272?"

---

## AI Tool Usage Disclosure

This project utilized AI-powered development tools to enhance productivity:

### Tools Used
- **Google Gemini AI (Antigravity)** - Code generation, architecture design, debugging
- **GitHub Copilot** - Code completion and suggestions
- **ChatGPT** - Documentation and problem-solving

### AI Contributions
- Component architecture and React patterns
- TypeScript type definitions
- Multi-agent system design
- Vector search implementation
- Database schema optimization
- API endpoint design
- Documentation generation

### Human Contributions
- Overall system architecture
- Business logic and requirements
- User experience design
- Final code review and testing
- Integration and deployment
- Security implementation

**Disclosure**: AI tools served as intelligent assistants to accelerate development. All code has been reviewed, tested, and validated by human developers.

---

## Database Schema

**Users Table:**
- id (Int, Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- phoneNo (String, Unique)
- createdAt, updatedAt (DateTime)

**Qdrant Collections:**
- **CourseDetails** (58 courses) - Course information with vector embeddings
- **CourseSchedule** (76 schedules) - Class schedules with vector embeddings

---

## Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```

**Backend:**
```bash
cd backend
npm start
# Deploy to Railway, Render, AWS, etc.
```


## Troubleshooting

**Qdrant Connection Issues:**
```bash
curl http://localhost:6333/collections
docker restart coursecompass-qdrant
```

**Database Issues:**
```bash
npx prisma generate
npx prisma migrate dev
```

**Frontend Not Connecting:**
- Check `VITE_API_BASE_URL` in frontend/.env
- Verify backend is running on correct port
- Check browser console for CORS errors

---

## Acknowledgments

- San José State University - CMPE 280 Course Project
- Material-UI for component library
- Groq for LLM inference
- Qdrant for vector search
- Jina AI for embeddings

---


**Made with ❤️ for SJSU Students**
