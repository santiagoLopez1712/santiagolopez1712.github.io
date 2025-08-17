<script>
(function () {
  // ================== ESTILOS ==================
  const styles = `
    .n8n-chat-widget { 
      --chat--color-primary: #854fff;
      --chat--color-secondary: #6b3fd4;
      --chat--color-background: #ffffff;
      --chat--color-font: #333333;
      --chat--color-accent: #ff4d4d;
      font-family: futura-pt, sans-serif;
    }
    .n8n-chat-widget .chat-container { 
      position: fixed; bottom: 90px; right: 20px; 
      z-index: 1000; display: none; 
      width: 380px; max-width: calc(100vw - 40px); height: 600px; 
      background: var(--chat--color-background); 
      border-radius: 12px; 
      box-shadow: 0 8px 32px rgba(133,79,255,0.15); 
      border: 1px solid rgba(133,79,255,0.2); 
      flex-direction: column; overflow: hidden;
    }
    .n8n-chat-widget .chat-container.open { display: flex; }
    .n8n-chat-widget .chat-messages { flex-grow: 1; overflow-y: auto; padding: 20px; }
    .n8n-chat-widget .chat-message { padding: 12px 16px; margin: 8px 0; border-radius: 12px; max-width: 80%; font-size: 14px; line-height: 1.5; }
    .n8n-chat-widget .chat-message.user { align-self: flex-end; background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary)); color: #fff; }
    .n8n-chat-widget .chat-message.bot { align-self: flex-start; background: #fff; border: 1px solid rgba(133,79,255,0.2); color: var(--chat--color-font); }
    .n8n-chat-widget .chat-input { flex-shrink: 0; padding: 16px; display: flex; gap: 8px; align-items: center; border-top: 1px solid rgba(133,79,255,0.1); }
    .n8n-chat-widget .chat-input textarea { flex-grow: 1; padding: 12px; border: 1px solid rgba(133,79,255,0.2); border-radius: 8px; resize: none; font-size: 14px; min-height: 44px; }
    .n8n-chat-widget .chat-input button { border: none; border-radius: 8px; padding: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 44px; width: 44px; }
    .n8n-chat-widget .chat-input button.mic-button.recording { background: var(--chat--color-accent); color: white; }
    .n8n-chat-widget .chat-input button.send-button { background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary)); color: white; }
    .n8n-chat-widget #audio-visualizer { display: none; } /* placeholder si luego quieres reactivar el visualizador */
    .n8n-chat-widget .chat-input.is-recording #audio-visualizer { display: none; } /* no usamos getUserMedia para evitar conflictos en móvil */
    .chat-toggle { 
      position: fixed; bottom: 20px; right: 20px; 
      width: 60px; height: 60px; 
      border-radius: 50%; 
      background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary)); 
      color: white; border: none; cursor: pointer; 
      display: flex; align-items: center; justify-content: center; 
      box-shadow: 0 4px 12px rgba(133,79,255,0.3); 
      z-index: 2000; font-size: 22px;
    }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ================== TRADUCCIONES BÁSICAS ==================
  const translations = {
    de: { placeholder: "Text oder Sprache eingeben…", micUnsupported: "Spracherkennung nicht unterstützt", recording: "Aufnahme läuft…" },
    en: { placeholder: "Enter text or voice...", micUnsupported: "Speech recognition not supported", recording: "Recording…" },
    es: { placeholder: "Escribe o dicta un mensaje…", micUnsupported: "Reconocimiento de voz no soportado", recording: "Grabando…" }
  };
  const langCodes = { de: 'de-DE', en: 'en-US', es: 'es-ES' };
  let currentLang = 'de';

  // ================== CREACIÓN DEL CHAT ==================
  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'n8n-chat-widget';
  document.body.appendChild(widgetContainer);

  const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  widgetContainer.appendChild(chatContainer);

  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'chat-messages';
  chatContainer.appendChild(messagesContainer);

  const chatInputContainer = document.createElement('div');
  chatInputContainer.className = 'chat-input';
  chatContainer.appendChild(chatInputContainer);

  const textarea = document.createElement('textarea');
  textarea.placeholder = translations[currentLang].placeholder;
  chatInputContainer.appendChild(textarea);

  const micButton = document.createElement('button');
  micButton.className = 'mic-button';
  micButton.setAttribute('aria-label', 'Mic');
  micButton.textContent = '🎤';
  chatInputContainer.appendChild(micButton);

  const sendButton = document.createElement('button');
  sendButton.className = 'send-button';
  sendButton.setAttribute('aria-label', 'Send');
  sendButton.textContent = '➤';
  chatInputContainer.appendChild(sendButton);

  const visualizerCanvas = document.createElement('div'); // no usamos getUserMedia para evitar conflictos
  visualizerCanvas.id = 'audio-visualizer';
  chatInputContainer.appendChild(visualizerCanvas);

  // Botón flotante toggle
  const toggleButton = document.createElement('button');
  toggleButton.className = 'chat-toggle';
  toggleButton.textContent = '💬';
  document.body.appendChild(toggleButton);

  toggleButton.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
  });

  // ================== RECONOCIMIENTO DE VOZ (ROBUSTO EN MÓVIL) ==================
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  let recognition = null;
  let isRecording = false;
  let shouldSendMessageAfterStop = false;

  const micIcon = '🎤';
  const stopIcon = '✖️';

  function destroyRecognition() {
    if (!recognition) return;
    try { recognition.onstart = recognition.onend = recognition.onresult = recognition.onerror = null; } catch (_) {}
    try { recognition.abort(); } catch (_) {}
    recognition = null;
  }

  function createRecognition() {
    if (!SpeechRecognitionAPI) return null;
    const rec = new SpeechRecognitionAPI();
    rec.lang = langCodes[currentLang] || langCodes.de;
    rec.interimResults = true;
    // Importante: en móvil NO usar continuous; en desktop sí
    rec.continuous = !isMobile;

    rec.onstart = () => {
      isRecording = true;
      chatInputContainer.classList.add('is-recording');
      micButton.classList.add('recording');
      micButton.textContent = stopIcon;
      textarea.placeholder = translations[currentLang].recording;
      textarea.style.color = 'red';
      // Limpiamos el textarea al iniciar para nueva toma
      textarea.value = '';
    };

    rec.onresult = (event) => {
      let interim = '';
      let finalText = textarea.value || '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += (finalText ? ' ' : '') + res[0].transcript.trim();
        } else {
          interim += res[0].transcript;
        }
      }
      textarea.value = (finalText + (interim ? ' ' + interim : '')).trim();
    };

    rec.onerror = (event) => {
      // Errores esperables en móvil: 'aborted', 'no-speech', 'network'
      console.warn('Speech error:', event.error);
      // Forzamos limpieza para garantizar que la siguiente sesión pueda iniciar
      destroyRecognition();
      isRecording = false;
      resetMicUI();
    };

    rec.onend = () => {
      // Fin de la sesión (ya sea por stop o por límite del navegador)
      isRecording = false;
      resetMicUI();

      // No conservamos instancia; esto es clave para que funcione de nuevo en móvil
      destroyRecognition();

      if (shouldSendMessageAfterStop) {
        const msg = textarea.value.trim();
        if (msg) sendMessage(msg);
        shouldSendMessageAfterStop = false;
      }
    };

    return rec;
  }

  function resetMicUI() {
    chatInputContainer.classList.remove('is-recording');
    micButton.classList.remove('recording');
    micButton.textContent = micIcon;
    textarea.placeholder = translations[currentLang].placeholder;
    textarea.style.color = '';
  }

  async function startRecordingOnce() {
    if (!SpeechRecognitionAPI) {
      micButton.disabled = true;
      micButton.title = translations[currentLang].micUnsupported;
      return;
    }
    if (isRecording) return;

    // Asegurar que no quede instancia colgada (clave en móvil)
    destroyRecognition();

    recognition = createRecognition();
    if (!recognition) return;

    try {
      recognition.start();
    } catch (err) {
      // En algunos móviles puede lanzar InvalidStateError si algo quedó activo
      console.warn('start() failed, resetting:', err);
      destroyRecognition();
      // Devolvemos UI a estado normal
      resetMicUI();
    }
  }

  // Usamos pointerup para móvil/desktop y evitar dobles eventos
  micButton.addEventListener('pointerup', () => {
    if (isRecording) {
      try { recognition && recognition.stop(); } catch (_) { destroyRecognition(); }
    } else {
      startRecordingOnce();
    }
  });

  // Seguridad extra: si la pestaña pierde foco, paramos
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isRecording) {
      try { recognition && recognition.stop(); } catch (_) { destroyRecognition(); }
    }
  });

  // ================== ENVÍO DE MENSAJES (DEMO) ==================
  async function sendMessage(message) {
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.textContent = message;
    messagesContainer.appendChild(userDiv);

    // TODO: reemplaza por tu webhook/fetch real
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-message bot';
    botDiv.textContent = 'Respuesta de ejemplo (conectar webhook)';
    messagesContainer.appendChild(botDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendButton.addEventListener('click', () => {
    if (isRecording) {
      shouldSendMessageAfterStop = true;
      try { recognition && recognition.stop(); } catch (_) { destroyRecognition(); }
    } else {
      const message = textarea.value.trim();
      if (message) {
        sendMessage(message);
        textarea.value = '';
      }
    }
  });

  // Enter para enviar (Shift+Enter = salto de línea)
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isRecording) {
        shouldSendMessageAfterStop = true;
        try { recognition && recognition.stop(); } catch (_) { destroyRecognition(); }
      } else {
        const message = textarea.value.trim();
        if (message) {
          sendMessage(message);
          textarea.value = '';
        }
      }
    }
  });
})();
</script>
