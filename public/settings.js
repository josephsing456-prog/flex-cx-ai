window.ZexSettings = {
  getSettings: () => window.ZexStorage.get('settings', { model: 'gemini-2.5-flash', voice: true }),
  saveSettings: (newSettings) => window.ZexStorage.set('settings', newSettings)
};
