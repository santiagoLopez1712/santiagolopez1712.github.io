<script>
(function() {
    // ================== ESTILOS ==================
    const styles = `
        .n8n-chat-widget { 
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-accent: #ff4d4d;
            font-family: futura-pt;
        }
        .n8n-chat-widget .chat-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: none; width: 380px; height: 600px; background: var(--chat--color-background); border-radius: 12px; box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15); border: 1px solid rgba(133, 79, 255, 0.2); font-family: inherit; }
        .n8n-chat-widget .chat-container.open { display: flex; flex-direction: column; overflow: hidden; }
        .n8n-chat-widget .chat-messages { flex-grow: 1; overflow-y: auto; padding: 20px; background: var(--chat--color-background); display: flex; flex-direction: column; }
        .n8n-chat-widget .chat-input { flex-shrink: 0; padding: 16px; display: flex; gap: 8px; align-items: center; position: relative; border-top: 1px solid rgba(133, 79, 255, 0.1); }
        .n8n-chat-widget .chat-input textarea { flex-grow: 1; padding: 12px; border: 1px solid rgba(133, 79, 255, 0.2); border-radius: 8px; resize: none; font-size: 14px; }
        .n8n-chat-widget .chat-input button { border: none; border-radius: 8px; padding: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 44px; width: 44px; }
        .n8n-chat-widget .chat-input button.mic-button.recording { background: var(--chat--color-accent); color: white; }
        .n8n-chat-widget .chat-input button.send-button { background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary)); color: white; }
        .n8n-chat-widget #audio-visualizer { flex-grow: 1; height: 44px; background-color: #f8f8f8; border-radius: 8px; display: none; }
        .n8n-chat-widget .chat-input.is-recording #audio-visualizer { display: block; }
        .n8n-chat-widget .chat-toggle { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary)); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ================== TRADUCCIONES ==================
    const translations = {
        de: { placeholder: "Text oder Sprache eingeben…", micUnsupported: "Spracherkennung nicht unterstützt" },
        en: { placeholder: "Enter text or voice...", micUnsupported: "Speech recognition not supported" },
        es: { placeholder: "Escribe o dicta un mensaje…", micUnsupported: "Reconocimiento de voz no soportado" }
    };
    const recordingPlaceholders = { de: "Aufnahme läuft…", en: "Recording…", es: "Grabando…" };
    const langCodes = { de: 'de-DE', en: 'en-US', es: 'es-ES' };

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
    textarea.placeholder = translations.de.placeholder;
    chatInputContainer.appendChild(textarea);

    const micButton = document.createElement('button');
    micButton.className = 'mic-button';
    micButton.innerHTML = "🎤";
    chatInputContainer.appendChild(micButton);

    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.textContent = "➤";
    chatInputContainer.appendChild(sendButton);

    const visualizerCanvas = document.createElement('div');
    visualizerCanvas.id = 'audio-visualizer';
    chatInputContainer.appendChild(visualizerCanvas);

    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.textContent = "💬";
    widgetContainer.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => chatContainer.classList.toggle('open'));

    // ================== RECONOCIMIENTO DE VOZ ==================
    let recognition;
    let isRecording = false;
    let shouldSendMessageAfterStop = false;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    const micSVG = "🎤";
    const stopSVG = "✖️";

    const handleMicClick = () => {
        if (!SpeechRecognitionAPI) {
            micButton.disabled = true;
            micButton.title = translations.de.micUnsupported;
            return;
        }
        if (isRecording) {
            if (recognition) recognition.stop();
        } else {
            startNewRecordingSession();
        }
    };

    const startNewRecordingSession = () => {
        recognition = new SpeechRecognitionAPI();
        recognition.lang = langCodes.de;
        recognition.interimResults = true;
        if (!/Mobi|Android/i.test(navigator.userAgent)) recognition.continuous = true;

        recognition.onstart = () => {
            isRecording = true;
            chatInputContainer.classList.add('is-recording');
            micButton.classList.add('recording');
            micButton.innerHTML = stopSVG;
            textarea.placeholder = recordingPlaceholders.de;
            textarea.style.color = "red";
        };

        recognition.onend = () => {
            isRecording = false;
            chatInputContainer.classList.remove('is-recording');
            micButton.classList.remove('recording');
            micButton.innerHTML = micSVG;
            textarea.placeholder = translations.de.placeholder;
            textarea.style.color = "";
            if (shouldSendMessageAfterStop) {
                const message = textarea.value.trim();
                if (message) { sendMessage(message); textarea.value = ''; }
                shouldSendMessageAfterStop = false;
            }
            recognition = null;
        };

        recognition.onerror = (event) => {
            console.error("Error:", event.error);
            isRecording = false;
            recognition = null;
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) textarea.value = finalTranscript;
        };

        recognition.start();
    };

    micButton.addEventListener('click', handleMicClick);

    // ================== ENVÍO DE MENSAJES ==================
    async function sendMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message user';
        userDiv.textContent = message;
        messagesContainer.appendChild(userDiv);

        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        botDiv.textContent = "Respuesta de ejemplo (conectar webhook)";
        messagesContainer.appendChild(botDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        if (isRecording) {
            shouldSendMessageAfterStop = true;
            recognition.stop();
        } else {
            const message = textarea.value.trim();
            if (message) { sendMessage(message); textarea.value = ''; }
        }
    });
})();
</script>
