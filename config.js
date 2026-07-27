// Flex CX Application Global Configuration
// This file configures all API endpoints and features

window.ZEX_CONFIG = {
  appName: "Flex CX",
  version: "1.0.0",
  environment: "production",
  defaultModel: "gemini-2.5-flash",
  
  // API Endpoints - All use relative paths for Vercel compatibility
  apiEndpoints: {
    base: "/api",
    health: "/api/health",
    chat: "/api/chat",
    image: "/api/generate-image",
    authLogin: "/api/auth/login",
    authRegister: "/api/auth/register",
    analyzeDocument: "/api/analyze-document",
    workSuggestions: "/api/work-suggestions",
    processGuide: "/api/process-guide"
  },

  // Available Gemini Models
  models: [
    { id: "gemini-2.5-flash", name: "Flex Flash 2.5 (Fast)", context: 1000000 },
    { id: "gemini-2.0-flash", name: "Flex Ultra 2.0 (Pro)", context: 1000000 },
    { id: "gemini-1.5-flash", name: "Flex Core 1.5", context: 1000000 }
  ],

  // Feature Flags
  features: {
    voiceInput: true,
    voiceOutput: true,
    imageGeneration: true,
    jwtAuth: true,
    pwaSupported: true,
    dataAnalysis: true,
    workSuggestions: true,
    documentProcessing: true,
    smartGuide: true,
    realTimeCollab: false  // Coming soon
  },

  // API Configuration
  api: {
    timeout: 30000,  // 30 seconds
    retries: 3,
    retryDelay: 1000  // 1 second
  },

  // File Upload Configuration
  upload: {
    maxSize: 50 * 1024 * 1024,  // 50MB
    allowedFormats: [
      'image/png', 'image/jpeg', 'image/webp', 'image/gif',
      'text/plain', 'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  }
};
