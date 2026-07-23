window.ZexAuth = {
  user: null,
  init: () => {
    const token = window.ZexStorage.get('token');
    if (token) {
      window.ZexAuth.user = window.ZexStorage.get('user');
      const authBtn = document.getElementById('authBtn');
      if (authBtn) {
        authBtn.innerHTML = `<span>👤 ${window.ZexAuth.user?.name || 'Account'}</span>`;
        authBtn.href = 'pages/profile.html';
      }
    }
  }
};