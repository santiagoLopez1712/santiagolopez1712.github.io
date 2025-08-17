<script>
(function() {
    // ================== ESTILOS (se cargan igual que antes) ==================
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-accent: #ff4d4d;
            font-family: futura-pt;
        }
        /* ... (todos tus estilos CSS originales aquí, no se eliminan) ... */
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

    // ================== CONFIG ==================
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '', name: '', welcomeText: '', responseTimeText: '',
            poweredBy: { text: 'Powered by AMARETIS AI', link: 'https://www.amaretis.de' }
        },
        style: { primaryColor: '', secondaryColor: '', position: 'right', backgroundColor: '#ffffff', fontColor: '#333333' }
    };

    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // ================== CREACIÓN UI ==================
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    widgetContainer.appendChild(chatContainer);

    document.body.appendChild(widgetContainer);

    // Insertamos aquí tu HTML dinámico (newConversation, chatInterface, etc.)
    chatContainer.innerHTML = `
        <div class="new-conversation-wrapper">
            <div class="new-conversation">
                <h2 class="welcome-text">WELCOME</h2>
                <p class="response-text">AI Assistant</p>
                <div class="privacy-checkbox">
                    <input type="checkbox" id="datenschutz">
                    <label for="datenschutz">Privacy</label>
                </div>
                <button class="new-chat-btn"><span>Start</span></button>
            </div>
        </div>
        <div class="chat-interface">
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="${translations.de.placeholder}"></textarea>
                <button class="mic-button" title="Mic">🎤</button>
                <button class="send-button" title="Send">➤</button>
                <div id="audio-visualizer"></div>
            </div>
        </div>
        <button class="chat-toggle">💬</button>
    `;

    // ================== REFERENCIAS ==================
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const newConversationWrapper = chatContainer.querySelector('.new-conversation-wrapper');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const privacyCheckbox = chatContainer.querySelector('#datenschutz');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.send-button');
    const micButton = chatContainer.querySelector('.mic-button');
    const chatInputContainer = chatContainer.querySelector('.chat-input');
    const toggleButton = chatContainer.querySelector('.chat-toggle');

    // ================== CHATBOT TOGGLE ==================
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // ================== SPEECH RECOGNITION ==================
    let recognition;
    let isRecording = false;
    let shouldSendMessageAfterStop = false;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    const micSVG = "🎤";
    const stopSVG = "✖️";

    function startNewRecordingSession() {
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

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) textarea.value = finalTranscript;
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            stopRecording(false);
        };

        recognition.onend = () => {
            stopRecording(false);
        };

        recognition.start();
    }

    function stopRecording(send = true) {
        if (!isRecording) return;
        isRecording = false;
        chatInputContainer.classList.remove('is-recording');
        micButton.classList.remove('recording');
        micButton.innerHTML = micSVG;
        textarea.placeholder = translations.de.placeholder;
        textarea.style.color = "";

        if (send || shouldSendMessageAfterStop) {
            const message = textarea.value.trim();
            if (message) sendMessage(message);
            textarea.value = '';
            shouldSendMessageAfterStop = false;
        }

        if (recognition) {
            recognition.stop();
            recognition = null;
        }
    }

    micButton.addEventListener('click', () => {
        if (isRecording) {
            shouldSendMessageAfterStop = true;
            stopRecording(true);
        } else {
            startNewRecordingSession();
        }
    });

    // ================== ENVÍO DE MENSAJES ==================
    async function sendMessage(message) {
        if (!message) return;
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message user';
        userDiv.textContent = message;
        messagesContainer.appendChild(userDiv);

        const botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        botDiv.textContent = "Respuesta de ejemplo (webhook)";
        messagesContainer.appendChild(botDiv);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        if (isRecording) {
            shouldSendMessageAfterStop = true;
            stopRecording(true);
        } else {
            sendMessage(textarea.value.trim());
            textarea.value = '';
        }
    });

})();
</script>
