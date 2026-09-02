window.ZexUtils = {
  escapeHtml: (str) => {
    return str.replace(/[&<>"]/g, (m) => {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  },
  formatTimestamp: () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
  copyToClipboard: (text, btnElement) => {
    navigator.clipboard.writeText(text).then(() => {
      if (btnElement) {
        const oldText = btnElement.innerText;
        btnElement.innerText = 'Copied!';
        setTimeout(() => { btnElement.innerText = oldText; }, 2000);
      }
    });
  },
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
};