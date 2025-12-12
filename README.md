# CourseCompass Frontend

> **An AI-Powered Academic Assistant for Course Planning and Scheduling**

CourseCompass is a modern web application that helps students navigate their academic journey with intelligent course recommendations, schedule generation, and conflict detection powered by multi-AI agents.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
![Material-UI](https://img.shields.io/badge/MUI-7.3.5-007FFF?logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)

---

## Features

### Core Features
- **Intelligent Chat Interface** - AI-powered conversational assistant for course queries
- **User Authentication** - Secure login and registration system
- **Course Recommendations** - Get personalized course suggestions based on your interests
- **Schedule Planning** - Generate conflict-free class schedules
- **Prerequisite Analysis** - Understand complete prerequisite chains
- **Real-time Updates** - Instant responses with streaming message display

### UI/UX Features
- **Modern Design** - Beautiful, premium interface with smooth animations
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Micro-animations** - Engaging interactions with hover effects and transitions
- **Chat History** - Persistent conversation history with local storage
- **Typing Indicators** - Real-time feedback during AI processing

### Security Features
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Route guards for authenticated pages
- **Secure API Communication** - Axios interceptors with automatic token injection
- **Environment Variables** - Sensitive data protected via environment configuration

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Backend API running (see [Archive README](../Archive/README.md))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DhruvilJayani/coursecompass.git
   cd coursecompass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## Project Structure

```
coursecompass/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/           # Configuration files (env, constants)
│   ├── context/          # React Context providers (Theme)
│   ├── pages/            # Page components
│   │   ├── auth/        # Login & Registration pages
│   │   └── chat/        # Chat interface
│   ├── services/         # API service layer
│   │   ├── apiClient.ts # Axios instance with interceptors
│   │   ├── authService.ts
│   │   └── chatService.ts
│   ├── store/            # State management (Zustand)
│   │   └── authStore.ts
│   ├── utils/            # Utility functions
│   │   └── errorHandler.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Application entry point
├── .env.example          # Environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Tech Stack

### Core Technologies
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool and dev server
- **React Router 7.9.5** - Client-side routing

### UI Framework & Styling
- **Material-UI (MUI) 7.3.5** - Component library
- **Emotion** - CSS-in-JS styling
- **Custom animations** - Keyframe animations for enhanced UX

### State Management & Data Fetching
- **Zustand 5.0.8** - Lightweight state management
- **TanStack Query 5.90.7** - Server state management
- **Axios 1.13.2** - HTTP client

### Form Handling & Validation
- **React Hook Form 7.66.0** - Form state management
- **Zod 4.1.12** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting
- **Testing Library** - Component testing

---

## Features Showcase

### Authentication System
- Secure login and registration
- JWT token management
- Protected routes with automatic redirection
- User session persistence

### Chat Interface
- **Streaming responses** - Word-by-word message display
- **Message history** - Persistent chat storage
- **Typing indicators** - Visual feedback during AI processing
- **Error handling** - Graceful degradation with offline mode
- **Theme switching** - Seamless dark/light mode transitions

### Course Intelligence
- **Query Classification** - Automatically routes queries to appropriate agents
- **Course Detail Agent** - Provides detailed course information and recommendations
- **Schedule Agent** - Generates conflict-free schedules
- **Vector Search** - Semantic search powered by Qdrant embeddings

---

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Optional: Add more environment-specific configs
# VITE_ENABLE_ANALYTICS=false
```

### API Client Configuration

The `apiClient.ts` automatically handles:
- JWT token injection in request headers
- Global error handling
- Request/response interceptors
- Base URL configuration from environment variables

---

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

---

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1920x1080 and above)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

---

## AI Tool Usage Disclosure

This project utilized AI-powered development tools to enhance productivity and code quality:

### Tools Used
- **Google Gemini AI (via Antigravity)** - Code generation, debugging, and architecture design
- **GitHub Copilot** - Code completion and suggestions
- **ChatGPT** - Documentation and problem-solving assistance

### AI Contribution Areas
1. **Component Architecture** - AI-assisted design of React component structure
2. **TypeScript Types** - AI-generated type definitions and interfaces
3. **Error Handling** - AI-suggested error handling patterns
4. **Animation Logic** - AI-assisted keyframe animation implementations
5. **Code Optimization** - Performance improvements and refactoring suggestions
6. **Documentation** - README generation and code comments

### Human Contributions
- Overall application architecture and design decisions
- Business logic and feature requirements
- User experience design and interaction patterns
- Final code review, testing, and validation
- Integration with backend services
- Custom styling and theming

**Disclosure**: While AI tools significantly accelerated development, all code has been reviewed, tested, and validated by human developers. The AI served as an intelligent assistant to enhance productivity, not as a replacement for human expertise and judgment.

---

## Known Issues

- None reported at this time. Please open an issue if you encounter any problems.

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables in deployment settings
4. Deploy!

---

## Acknowledgments

- San José State University - CMPE 280 Course Project
- Material-UI for the component library
- Vite team for the amazing build tool
- React team for the powerful UI library

---

**Made with ❤️ for SJSU Students**
