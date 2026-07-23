window.ZexChat = {
  attachedFile: null,
  attachedFileData: null,

  init: () => {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('userInput');
    const fileInput = document.getElementById('fileUploadInput');
    const uploadBtn = document.getElementById('uploadFileBtn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.ZexChat.handleSend();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          window.ZexChat.handleSend();
        }
      });
    }

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          window.ZexChat.attachedFile = file;
          const fileData = await window.ZexUtils.fileToBase64(file);
          window.ZexChat.attachedFileData = fileData;

          const previewBar = document.getElementById('filePreviewBar');
          const nameSpan = document.getElementById('attachedFileName');
          if (previewBar && nameSpan) {
            nameSpan.innerText = file.name;
            previewBar.classList.remove('hidden');
          }
        }
      });
    }

    const removeFileBtn = document.getElementById('removeFileBtn');
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', () => {
        window.ZexChat.attachedFile = null;
        window.ZexChat.attachedFileData = null;
        const previewBar = document.getElementById('filePreviewBar');
        if (previewBar) previewBar.classList.add('hidden');
      });
    }

    // Quick Prompts
    document.querySelectorAll('.quickPromptBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.querySelector('.font-bold')?.innerText || '';
        if (input) {
          input.value = title.replace(/^[^a-zA-Z]+/, '');
          window.ZexChat.handleSend();
        }
      });
    });
  },

  handleSend: async () => {
    const input = document.getElementById('userInput');
    if (!input || !input.value.trim() && !window.ZexChat.attachedFile) return;

    const messageText = input.value.trim();
    input.value = '';

    const file = window.ZexChat.attachedFile;
    const fileData = window.ZexChat.attachedFileData;
    const fileName = file ? file.name : null;

    // Clear attached file display
    window.ZexChat.attachedFile = null;
    window.ZexChat.attachedFileData = null;
    document.getElementById('filePreviewBar')?.classList.add('hidden');

    // Hide hero
    const hero = document.getElementById('welcomeHero');
    if (hero) hero.classList.add('hidden');

    // Append User Bubble
    window.ZexChat.appendBubble(messageText, 'user', fileData, fileName);
    window.ZexHistory.saveMessage(messageText, 'user', fileData, fileName);

    // Append AI Typing Loading Bubble
    const typingId = 'typing_' + Date.now();
    window.ZexChat.appendTypingBubble(typingId);

    try {
      const model = document.getElementById('modelSelector')?.value || window.ZEX_CONFIG.defaultModel;
      const data = await window.ZexApi.sendMessage(messageText, model, [], fileData, fileName);

      // Remove typing bubble
      document.getElementById(typingId)?.remove();

      const aiReply = data.reply || data.response || 'Response generated successfully.';
      window.ZexChat.appendBubble(aiReply, 'ai');
      window.ZexHistory.saveMessage(aiReply, 'ai');

      if (window.ZexVoice && window.ZexVoice.autoSpeak) {
        window.ZexVoice.speakText(aiReply);
      }
    } catch (err) {
      document.getElementById(typingId)?.remove();
      window.ZexChat.appendBubble(`⚠️ Error connecting to Flex CX: ${err.message}`, 'ai');
    }
  },

  appendBubble: (text, sender, fileData = null, fileName = null) => {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';

    let contentHtml = window.ZexUtils.escapeHtml(text);
    if (fileData) {
      if (fileData.startsWith('data:image')) {
        contentHtml += `<img src="${fileData}" alt="Attached image" class="mt-3 rounded-lg max-w-full h-auto shadow-md">`;
      } else if (fileData.startsWith('data:application/pdf') || fileData.startsWith('data:text') || fileData.includes('application/msword') || fileData.includes('application/vnd.openxmlformats-officedocument')) {
        // Display a link for document files, or a small preview if possible
        contentHtml += `<div class="mt-3 p-2 bg-slate-800 rounded-md text-xs flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span class="text-slate-300">Attached: ${window.ZexUtils.escapeHtml(fileName || 'document')}</span>
        </div>`;
      }
    }

    if (sender === 'user') {
      div.innerHTML = `<div class="user-msg-bubble">${contentHtml}</div>`;
    } else {
      // Format code blocks for AI messages
      contentHtml = contentHtml.replace(/```(\w*)([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="code-block"><div class="code-header"><span>${lang || 'code'}</span><button onclick="window.ZexUtils.copyToClipboard(this.parentElement.nextElementSibling.innerText, this)" class="copy-code-btn">Copy</button></div><code>${code.trim()}</code></pre>`;
      });

      div.innerHTML = `
        <div class="ai-msg-bubble">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">F</span>
            <span class="text-xs font-bold text-indigo-300">Flex CX Assistant</span>
          </div>
          <div>${contentHtml}</div>
          <div class="msg-actions">
            <span class="action-chip" onclick="window.ZexUtils.copyToClipboard('${text.replace(/'/g, "\\'")}', this)">📋 Copy</span>
            <span class="action-chip" onclick="window.ZexChat.handleSend()">🔄 Regenerate</span>
          </div>
        </div>
      `;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  appendTypingBubble: (id) => {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex justify-start';
    div.innerHTML = `
      <div class="ai-msg-bubble flex items-center gap-2">
        <span class="text-xs text-slate-400">Flex CX is thinking</span>
        <div class="flex space-x-1">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }
};
