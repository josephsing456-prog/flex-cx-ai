window.ZexHistory = {
  sessions: [],
  activeSessionId: null,

  init: () => {
    window.ZexHistory.sessions = window.ZexStorage.get('sessions', []);
    window.ZexHistory.renderList();

    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => window.ZexHistory.createNewSession());
    }
  },

  renderList: () => {
    const container = document.getElementById('chatHistoryList');
    if (!container) return;

    if (window.ZexHistory.sessions.length === 0) {
      container.innerHTML = '<div class="text-[11px] text-slate-500 px-3 py-2">No history saved yet.</div>';
      return;
    }

    container.innerHTML = window.ZexHistory.sessions.map(s => `
      <button onclick="window.ZexHistory.loadSession('${s.id}')" class="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition truncate flex items-center justify-between group">
        <span class="truncate">💬 ${window.ZexUtils.escapeHtml(s.title || 'New Chat')}</span>
      </button>
    `).join('');
  },

  createNewSession: () => {
    const id = 'sess_' + Date.now();
    window.ZexHistory.activeSessionId = id;
    const hero = document.getElementById('welcomeHero');
    if (hero) hero.classList.remove('hidden');
    const msgContainer = document.getElementById('chatMessages');
    if (msgContainer) {
      msgContainer.innerHTML = '';
      if (hero) msgContainer.appendChild(hero);
    }
  },

  loadSession: (sessionId) => {
    window.ZexHistory.activeSessionId = sessionId;
    const session = window.ZexHistory.sessions.find(s => s.id === sessionId);
    const msgContainer = document.getElementById('chatMessages');
    if (!msgContainer) return;
    msgContainer.innerHTML = ''; // Clear current messages
    const hero = document.getElementById('welcomeHero');
    if (hero) hero.classList.add('hidden'); // Hide hero on session load

    if (session && session.messages) {
      session.messages.forEach(msg => {
        window.ZexChat.appendBubble(msg.text, msg.sender, msg.fileData, msg.fileName);
      });
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },

  saveMessage: (text, sender, fileData = null, fileName = null) => {
    if (!window.ZexHistory.activeSessionId) {
      window.ZexHistory.activeSessionId = 'sess_' + Date.now();
    }
    let session = window.ZexHistory.sessions.find(s => s.id === window.ZexHistory.activeSessionId);
    if (!session) {
      session = { id: window.ZexHistory.activeSessionId, title: text.slice(0, 30) + (fileData ? ' (with file)' : ''), messages: [] };
      window.ZexHistory.sessions.unshift(session);
    }
    session.messages.push({ text, sender, time: new Date(), fileData, fileName });
    window.ZexStorage.set('sessions', window.ZexHistory.sessions);
    window.ZexHistory.renderList();
  }
};
