window.ZexImage = {
  generate: async (prompt) => {
    return await window.ZexApi.generateImage(prompt);
  }
};