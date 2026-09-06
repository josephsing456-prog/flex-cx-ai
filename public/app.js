// Flex CX Main Orchestration
document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ Flex CX Pro Suite Initialized.');

  // Initialize UI Event Listeners & Controllers
  if (window.ZexTheme) window.ZexTheme.init();
  if (window.ZexVoice) window.ZexVoice.init();
  if (window.ZexAuth) window.ZexAuth.init();
  if (window.ZexHistory) window.ZexHistory.init();
  if (window.ZexChat) window.ZexChat.init();

  // Sidebar Mobile Toggle
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  const openSidebar = () => {
    if (sidebar) sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
  };

  const closeSidebar = () => {
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  };

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = !sidebar.classList.contains('-translate-x-full');
      if (isOpen) closeSidebar(); else openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Auto-close sidebar on mobile after picking any item inside it
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      const target = e.target.closest('button, a');
      if (target && window.innerWidth < 768) {
        closeSidebar();
      }
    });
  }
});
