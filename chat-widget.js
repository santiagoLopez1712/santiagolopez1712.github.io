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
         .n8n-chat-widget .chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: none;
                width: 380px;
                height: 600px;
                background: var(--chat--color-background);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
                border: 1px solid rgba(133, 79, 255, 0.2);
                font-family: inherit;
            }
    
            .n8n-chat-widget .chat-container.position-left {
                right: auto;
                left: 20px;
            }
            
            .n8n-chat-widget .chat-container.open {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
    
            .n8n-chat-widget .brand-header {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(133, 79, 255, 0.1);
                position: relative;
                flex-shrink: 0;
            }
    
            .n8n-chat-widget .language-select {
                margin-left: auto;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid rgba(133, 79, 255, 0.2);
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                font-size: 14px;
                font-family: inherit;
                cursor: pointer;
            }
    
            .n8n-chat-widget .close-button {
                background: none;
                border: none;
                color: var(--chat--color-font);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                font-size: 20px;
                opacity: 0.6;
                margin-left: 8px;
            }
    
            .n8n-chat-widget .close-button:hover {
                opacity: 1;
            }
    
            .n8n-chat-widget .brand-header img {
                width: 32px;
                height: 32px;
            }
    
            .n8n-chat-widget .brand-header span {
                font-size: 18px;
                font-weight: 500;
                color: var(--chat--color-font);
            }
            
            .n8n-chat-widget .new-conversation-wrapper {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .n8n-chat-widget .new-conversation {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                text-align: center;
            }
    
            .n8n-chat-widget .welcome-text {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 28px;
                line-height: 1.3;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
    
            .n8n-chat-widget .new-chat-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                max-width: 300px;
                padding: 16px 24px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.3s;
                font-weight: 500;
                font-family: inherit;
                margin-bottom: 12px;
            }
            
            .n8n-chat-widget .new-chat-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
                opacity: 0.6;
                transform: none;
            }
    
            .n8n-chat-widget .new-chat-btn:hover {
                transform: scale(1.02);
            }
    
            .n8n-chat-widget .chat-btn-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
    
            .n8n-chat-widget .chat-line {
                display: block;
                margin-bottom: 8px;
                font-weight: 200;
                font-size: 14px;
            }
    
            .n8n-chat-widget .message-icon {
                width: 20px;
                height: 20px;
            }
    
            .n8n-chat-widget .response-text {
                font-size: 14px;
                color: #000;
                opacity: 0.7;
                margin-bottom:28px;
                font-weight: 400;
            }
            
            .n8n-chat-widget .chat-interface {
                display: none;
                flex-direction: column;
                height: 100%;
                position: relative;
            }
    
            .n8n-chat-widget .chat-interface.active {
                display: flex;
            }
            
            .n8n-chat-widget .chat-messages {
                flex-grow: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--chat--color-background);
                display: flex;
                flex-direction: column;
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            .n8n-chat-widget .chat-messages::-webkit-scrollbar {
                display: none;
            }
    
            .n8n-chat-widget .chat-message {
                padding: 12px 16px;
                margin: 8px 0;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
            }
    
            .n8n-chat-widget .chat-message.user {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                align-self: flex-end;
                box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
                border: none;
            }
    
            .n8n-chat-widget .chat-message.bot {
                background: var(--chat--color-background);
                border: 1px solid rgba(133, 79, 255, 0.2);
                color: var(--chat--color-font);
                align-self: flex-start;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
    
            .n8n-chat-widget .chat-input {
                flex-shrink: 0;
                padding: 16px;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
                display: flex;
                gap: 8px;
                align-items: center;
                box-sizing: border-box;
                position: relative;
            }
    
            /* Tooltip CSS */
            .n8n-chat-widget .chat-input button[title]:hover::after {
                content: attr(title);
                position: absolute;
                bottom: 60px;
                background: #333;
                color: #fff;
                font-size: 12px;
                padding: 5px 8px;
                border-radius: 6px;
                white-space: nowrap;
                z-index: 10;
            }
    
            .n8n-chat-widget .chat-input textarea {
                flex-grow: 1;
                padding: 12px;
                border: 1px solid rgba(133, 79, 255, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                resize: none;
                font-family: inherit;
                font-size: 14px;
                min-height: 40px;
                overflow: hidden;
            }
    
            .n8n-chat-widget .chat-input textarea::placeholder {
                color: var(--chat--color-font);
                opacity: 0.6;
            }
    
            .n8n-chat-widget .chat-input button {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                transition: transform 0.2s;
                font-family: inherit;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 44px;
                width: 44px;
                flex-shrink: 0;
                position: relative;
            }
    
            /* Cambios de estilo para el botón de micrófono */
            .n8n-chat-widget .chat-input button.mic-button.recording {
                background: var(--chat--color-accent);
                color: white;
            }
    
            .n8n-chat-widget .chat-input button.send-button {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            }
    
            .n8n-chat-widget .chat-input button svg {
                width: 20px;
                height: 20px;
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin="round"
            }
    
            .n8n-chat-widget .chat-input button:hover {
                transform: scale(1.05);
            }
            
            .n8n-chat-widget .chat-input button.mic-button[title]:hover::after {
                right: 60px;
            }
            
            .n8n-chat-widget .chat-input button.send-button[title]:hover::after {
                right: 16px;
            }
    
            /* --- NUEVOS ESTILOS PARA EL VISUALIZADOR --- */
            .n8n-chat-widget #audio-visualizer {
                flex-grow: 1;
                height: 44px;
                background-color: #f8f8f8;
                border-radius: 8px;
                display: none;
                border: 1px solid rgba(133, 79, 255, 0.2);
            }
            .n8n-chat-widget .chat-input.is-recording #audio-visualizer {
                display: block;
            }
            .n8n-chat-widget .chat-input.is-recording textarea {
                display: none;
            }
            /* --- FIN DE NUEVOS ESTILOS --- */
            
            .n8n-chat-widget .chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 12px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
                z-index: 999;
                transition: transform 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
    
            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 20px;
            }
    
            .n8n-chat-widget .chat-toggle:hover {
                transform: scale(1.05);
            }
    
            .n8n-chat-widget .chat-toggle svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }
    
            .n8n-chat-widget .chat-footer {
                flex-shrink: 0;
                padding: 8px;
                text-align: center;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
            }
    
            .n8n-chat-widget .chat-footer a {
                color: var(--chat--color-primary);
                text-decoration: none;
                font-size: 12px;
                opacity: 0.8;
                transition: opacity 0.2s;
                font-family: inherit;
            }
    
            .n8n-chat-widget .chat-footer a:hover {
                opacity: 1;
            }
    
            .n8n-chat-widget .privacy-checkbox {
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: left;
                margin-top: 1.5rem;
                margin-bottom: 20px;
                font-family: inherit;
            }
    
            .n8n-chat-widget .privacy-checkbox input[type="checkbox"] {
                display: none;
            }
    
            .n8n-chat-widget .privacy-checkbox label {
                position: relative;
                padding-left: 28px;
                font-size: 14px;
                color: #000;
                cursor: pointer;
                max-width: 300px;
                font-weight: 400;
                opacity: 0.7;
            }
    
            .n8n-chat-widget .privacy-checkbox label::before {
                content: "";
                position: absolute;
                left: 0;
                top: 2px;
                width: 18px;
                height: 18px;
                border: 1.5px solid rgba(133, 79, 255, 0.6);
                border-radius: 4px;
                background-color: #fff;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(133, 79, 255, 0.1);
            }
    
            .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::before {
                background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
                border-color: transparent;
            }
    
            .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::after {
                content: "";
                position: absolute;
                display: block;
                left: 6px;
                top: 4px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2.5px 2.5px 0;
                transform: rotate(45deg);
            }
    
            .n8n-chat-widget .privacy-checkbox a {
                color: var(--chat--color-primary);
                text-decoration: underline;
                transition: color 0.2s;
            }
    
            .n8n-chat-widget .privacy-checkbox a:hover {
                color: var(--chat--color-secondary);
            }
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
