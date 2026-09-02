// Frontend API Client for Flex CX
// Handles all communication with the backend

window.ZexApi = {
  // Helper function to make API calls with error handling
  call: async (endpoint, method = 'GET', data = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  // Check server health
  checkHealth: async () => {
    try {
      return await window.ZexApi.call(window.ZEX_CONFIG.apiEndpoints.health);
    } catch (error) {
      console.error('[API] Server health check failed:', error.message);
      return { status: 'error', message: error.message };
    }
  },

  // Send chat message with optional file attachment
  sendMessage: async (prompt, model = window.ZEX_CONFIG.defaultModel, history = [], fileData = null, fileName = null) => {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const payload = {
      message: prompt,
      model: model,
      history: history,
      fileData: fileData,
      fileName: fileName
    };

    return await window.ZexApi.call(window.ZEX_CONFIG.apiEndpoints.chat, 'POST', payload);
  },

  // Generate image from prompt
  generateImage: async (prompt) => {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    return await window.ZexApi.call(window.ZEX_CONFIG.apiEndpoints.image, 'POST', { prompt });
  },

  // Analyze document with AI
  analyzeDocument: async (fileData, fileName) => {
    console.log(`[API] Analyzing document: ${fileName}`);
    
    if (!fileData || !fileName) {
      throw new Error('File data and name are required');
    }

    return await window.ZexApi.call(
      window.ZEX_CONFIG.apiEndpoints.analyzeDocument,
      'POST',
      { fileData, fileName }
    );
  },

  // Get work suggestions from AI
  getWorkSuggestions: async (context) => {
    console.log(`[API] Getting work suggestions for: ${context}`);
    
    if (!context || context.trim().length === 0) {
      throw new Error('Context cannot be empty');
    }

    return await window.ZexApi.call(
      window.ZEX_CONFIG.apiEndpoints.workSuggestions,
      'POST',
      { context }
    );
  },

  // Process guide/knowledge base query
  processGuide: async (query) => {
    console.log(`[API] Processing guide query: ${query}`);
    
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    return await window.ZexApi.call(
      window.ZEX_CONFIG.apiEndpoints.processGuide,
      'POST',
      { query }
    );
  }
};
