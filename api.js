window.ZexApi = {
  sendMessage: async (prompt, model, history = [], fileData = null, fileName = null) => {
    const res = await fetch(window.ZEX_CONFIG.apiEndpoints.chat, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, model: model, history: history, fileData: fileData, fileName: fileName })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  },

  generateImage: async (prompt) => {
    const res = await fetch(window.ZEX_CONFIG.apiEndpoints.image, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return await res.json();
  },

  analyzeDocument: async (fileData, fileName) => {
    console.log(`[API] Analyzing document: ${fileName}`);
    const res = await fetch(window.ZEX_CONFIG.apiEndpoints.analyzeDocument, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileData, fileName })
    });
    if (!res.ok) throw new Error('Failed to analyze document');
    return await res.json();
  },

  getWorkSuggestions: async (context) => {
    console.log(`[API] Getting work suggestions for: ${context}`);
    const res = await fetch(window.ZEX_CONFIG.apiEndpoints.workSuggestions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context })
    });
    if (!res.ok) throw new Error('Failed to get work suggestions');
    return await res.json();
  },

  processGuide: async (query) => {
    console.log(`[API] Processing guide query: ${query}`);
    const res = await fetch(window.ZEX_CONFIG.apiEndpoints.processGuide, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to process guide');
    return await res.json();
  }
};