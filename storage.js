window.ZexStorage = {
  get: (key, defaultVal = null) => {
    try {
      const item = localStorage.getItem('zex_' + key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem('zex_' + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};