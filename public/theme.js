window.ZexTheme = {
  init: () => {
    const savedTheme = window.ZexStorage.get('theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        window.ZexStorage.set('theme', next);
      });
    }
  }
};