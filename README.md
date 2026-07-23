# Flex CX - Professional Customer Experience AI Suite

Flex CX is an enterprise-grade AI platform designed to enhance customer experience operations through intelligent chat, data analysis, smart work suggestions, document processing, and visual generation, powered by Google Gemini models.

---

## 📁 Project Architecture & File Directory

```
flex-cx/
├── index.html            # Main Flex CX Web Interface & Workspace
├── styles.css            # Core Tailwind & Custom Glassmorphism Theme
├── app.js                # Frontend Orchestration Controller
├── config.js             # Client Configuration Settings
├── package.json          # Root Dependencies & NPM Scripts
├── README.md             # Complete Documentation Guide
├── .gitignore            # Git Ignore Rules
├── .env.example          # Environment Secrets Template
├── manifest.json         # Progressive Web App (PWA) Manifest
├── sw.js                 # Service Worker Offline Caching
├── css/
│   ├── chat.css          # Message Bubbles, Image Preview & Code Highlighter Styles
│   ├── auth.css          # Auth Pages Styling
│   ├── settings.css      # Settings Page Layout
│   ├── responsive.css    # Mobile Breakpoints & Drawer Transitions
│   └── animations.css    # Pulse & Typing Animations
├── js/
│   ├── chat.js           # Chat Stream, Message Handlers & File Attachments
│   ├── auth.js           # JWT Authentication Engine
│   ├── api.js            # Gemini API Backend Proxy Fetcher & New Feature APIs
│   ├── history.js        # LocalStorage Session Saver
│   ├── image.js          # AI Image Studio Logic
│   ├── voice.js          # Speech Recognition & Synthesis
│   ├── settings.js       # User Preferences Controller
│   ├── storage.js        # Persistent Data Utilities
│   ├── theme.js          # Dark & Light Theme Switcher
│   └── utils.js          # Formatting, Escaping & File Conversion Helpers
├── pages/
│   ├── login.html        # User Login Page
│   ├── register.html     # User Registration Page
│   ├── profile.html      # User Profile Settings
│   ├── settings.html     # System & API Configuration
│   ├── history.html      # Conversation Logs Search
│   ├── image-generator.html # Dedicated Image Generator Studio
│   ├── data-insights.html   # Data Analysis & Visualizations
│   ├── work-suggestions.html # Smart Work Recommendations
│   ├── document-reader.html  # Document Processing & Summarization
│   └── knowledge-base.html   # Smart Guides & Knowledge Hub
└── server/
    ├── server.js         # Node.js Express Server
    ├── package.json      # Server Dependencies
    ├── routes/           # API Endpoints (/api/chat, /api/auth, /api/data-analysis, etc.)
    ├── controllers/      # Gen AI SDK Logic
    └── middleware/       # JWT Token Validator
```

---

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory using `.env.example`:
```env
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=flex_cx_super_secret_key_2026
```

### 3. Launch Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your web browser.

---

## 🔒 Security Best Practices
1.  **API Keys Hidden**: Gemini API key is accessed strictly inside Node.js (`process.env.GEMINI_API_KEY`) and never exposed in browser bundles.
2.  **JWT Authorization**: Requests to protected routes require Bearer token validation.
3.  **Password Hashing**: User credentials hashed using `bcryptjs` with salt rounds.
