window.ZexVoice = {
  isListening: false,
  autoSpeak: false,
  recognition: null,

  init: () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      window.ZexVoice.recognition = new SpeechRecognition();
      window.ZexVoice.recognition.continuous = false;
      window.ZexVoice.recognition.interimResults = false;

      window.ZexVoice.recognition.onresult = (evt) => {
        const transcript = evt.results[0][0].transcript;
        const input = document.getElementById('userInput');
        if (input) input.value = transcript;
        window.ZexVoice.stopMic();
      };

      window.ZexVoice.recognition.onerror = () => window.ZexVoice.stopMic();
      window.ZexVoice.recognition.onend = () => window.ZexVoice.stopMic();
    }

    const micBtn = document.getElementById('voiceMicBtn');
    if (micBtn) {
      micBtn.addEventListener('click', () => window.ZexVoice.toggleMic());
    }

    const speakBtn = document.getElementById('voiceSpeakToggleBtn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        window.ZexVoice.autoSpeak = !window.ZexVoice.autoSpeak;
        speakBtn.classList.toggle('text-fuchsia-400', window.ZexVoice.autoSpeak);
      });
    }
  },

  toggleMic: () => {
    if (!window.ZexVoice.recognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    if (window.ZexVoice.isListening) {
      window.ZexVoice.stopMic();
    } else {
      window.ZexVoice.isListening = true;
      const pulse = document.getElementById('micPulse');
      if (pulse) pulse.classList.remove('hidden');
      window.ZexVoice.recognition.start();
    }
  },

  stopMic: () => {
    window.ZexVoice.isListening = false;
    const pulse = document.getElementById('micPulse');
    if (pulse) pulse.classList.add('hidden');
    if (window.ZexVoice.recognition) window.ZexVoice.recognition.stop();
  },

  speakText: (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>?/gm, ''));
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
};