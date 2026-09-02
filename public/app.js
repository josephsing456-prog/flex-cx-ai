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
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
    });
  }
});