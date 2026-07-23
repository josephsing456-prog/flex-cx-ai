// Flex CX Application Global Configuration
window.ZEX_CONFIG = {
  appName: "Flex CX",
  version: "1.0.0",
  environment: "production",
  defaultModel: "gemini-2.5-flash",
  apiEndpoints: {
    chat: "/api/chat",
    image: "/api/generate-image",
    authLogin: "/api/auth/login",
    authRegister: "/api/auth/register",
    analyzeDocument: "/api/analyze-document",
    workSuggestions: "/api/work-suggestions",
    processGuide: "/api/process-guide"
  },
  features: {
    voiceInput: true,
    voiceOutput: true,
    imageGeneration: true,
    jwtAuth: true,
    pwaSupported: true,
    dataAnalysis: true,
    workSuggestions: true,
    documentProcessing: true,
    smartGuide: true
  }
};