// Chat Widget Script
(function() {
    // Load font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            --chat--color-accent: #ff4d4d; /* Nuevo color de acento para la grabación */
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
    (function() {
    const styles = `
        /* Tus estilos existentes aquí */
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Objeto de traducciones
    const translations = {
        de: {
            language: "Deutsch",
            welcomeText: "HERZLICH WILLKOMMEN BEI AMARETIS!",
            responseTimeText: "AMARETIS AI ist Ihr digitaler Assistent – direkt, unkompliziert und rund um die Uhr erreichbar. Ob Sie einen Termin vereinbaren möchten, Fragen zu unseren Leistungen haben oder herausfinden wollen, ob AMARETIS zu Ihrem Vorhaben passt – wir sind für Sie da.",
            privacyLabel: "Ich habe die <a href='https://www.amaretis.de/datenschutz/' target='_blank'>Datenschutzerklärung</a> gelesen und akzeptiere sie.",
            newChatBtnText: "Starten Sie Ihre Anfrage!",
            placeholder: "Text oder Sprache eingeben…",
            micTitle: "Spracheingabe starten/stoppen",
            sendTitle: "Nachricht senden",
            micUnsupported: "Spracherkennung nicht unterstützt",
            botGreeting: "Hallo! 👋 Ich bin Ihr persönlicher Assistent der Agentur für Kommunikation AMARETIS. Wir sind eine Full-Service-Werbeagentur mit Sitz in Göttingen und arbeiten für Kundinnen und Kunden in ganz Deutschland. Wie kann ich Ihnen heute weiterhelfen?"
        },
        en: {
            language: "English",
            welcomeText: "WELCOME TO AMARETIS!",
            responseTimeText: "AMARETIS AI is your digital assistant – direct, uncomplicated, and available around the clock. Whether you want to schedule an appointment, have questions about our services, or want to find out if AMARETIS is a good fit for your project – we're here for you.",
            privacyLabel: "I have read and accept the <a href='https://www.amaretis.de/datenschutz/' target='_blank'>privacy policy</a>.",
            newChatBtnText: "Start your request!",
            placeholder: "Enter text or voice...",
            micTitle: "Start/stop voice input",
            sendTitle: "Send message",
            micUnsupported: "Speech recognition not supported",
            botGreeting: "Hello! 👋 I am your personal assistant from the AMARETIS communication agency. We are a full-service advertising agency based in Göttingen and work for clients throughout Germany. How can I help you today?"
        },
        es: {
            language: "Español",
            welcomeText: "¡BIENVENIDO A AMARETIS!",
            responseTimeText: "AMARETIS AI es tu asistente digital: directo, sencillo y disponible las 24 horas. Ya sea que quieras programar una cita, tengas preguntas sobre nuestros servicios o quieras saber si AMARETIS es adecuado para tu proyecto, estamos aquí para ayudarte.",
            privacyLabel: "He leído y acepto la <a href='https://www.amaretis.de/datenschutz/' target='_blank'>política de privacidad</a>.",
            newChatBtnText: "¡Inicia tu consulta!",
            placeholder: "Escribe o dicta un mensaje…",
            micTitle: "Iniciar/detener entrada de voz",
            sendTitle: "Enviar mensaje",
            micUnsupported: "Reconocimiento de voz no soportado",
            botGreeting: "¡Hola! 👋 Soy tu asistente personal de la agencia de comunicación AMARETIS. Somos una agencia de publicidad de servicio completo con sede en Göttingen y trabajamos para clientes en toda Alemania. ¿En qué puedo ayudarte hoy?"
        }
    };

    // Textos de "grabando" para el placeholder en cada idioma
    const recordingPlaceholders = {
        de: "Aufnahme läuft…",
        en: "Recording…",
        es: "Grabando…"
    };

    // Default config
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

    let currentSessionId = '';
    let currentLang = 'de'; // Idioma por defecto

    const langCodes = { de: 'de-DE', en: 'en-US', es: 'es-ES' };

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    // ... aquí va tu HTML de newConversationHTML y chatInterfaceHTML como en tu código original ...

    // Selección de elementos del DOM
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const newChatBtnTextSpan = newChatBtn.querySelector('span');
    const newConversationWrapper = chatContainer.querySelector('.new-conversation-wrapper');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const privacyCheckbox = chatContainer.querySelector('#datenschutz');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.send-button');
    const micButton = chatContainer.querySelector('.mic-button');
    const chatInputContainer = chatContainer.querySelector('.chat-input');
    const visualizerCanvas = chatContainer.querySelector('#audio-visualizer');
    const languageSelects = chatContainer.querySelectorAll('.language-select');

    // SVGs para los iconos
    const micSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>`;
    const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>`;

    function updateUI() {
        const langCode = currentLang.split('-')[0];
        const t = translations[langCode] || translations.de;
        
        chatContainer.querySelector('.welcome-text').textContent = t.welcomeText;
        chatContainer.querySelector('.response-text').textContent = t.responseTimeText;
        chatContainer.querySelector('.privacy-checkbox label').innerHTML = t.privacyLabel;
        newChatBtnTextSpan.textContent = t.newChatBtnText;
        textarea.placeholder = t.placeholder;
        chatContainer.querySelector('.mic-button').title = t.micTitle;
        chatContainer.querySelector('.send-button').title = t.sendTitle;

        languageSelects.forEach(select => { select.value = langCode; });
        
        const botGreeting = messagesContainer.querySelector('.bot-greeting-message');
        if (botGreeting) { botGreeting.textContent = t.botGreeting; }
    }

    updateUI();

    let recognition;
    let isRecording = false;
    let audioContext;
    let analyser;
    let source;
    let animationFrameId;

    function createRecognitionInstance() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        rec.lang = langCodes.de;
        rec.continuous = true;
        rec.interimResults = true;

        rec.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript.trim();
                if (event.results[i].isFinal) {
                    const corrected = correctTextRealtime(transcript);
                    textarea.value += (textarea.value ? ' ' : '') + corrected;
                    textarea.style.height = 'auto';
                    textarea.style.height = `${textarea.scrollHeight}px`;
                }
            }
        };

        rec.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (isRecording && event.error !== 'no-speech') {
                rec.stop();
                recognition = createRecognitionInstance();
                recognition.start();
            }
        };

        rec.onend = () => {
            if (isRecording) {
                recognition = createRecognitionInstance();
                recognition.start();
            }
        };

        return rec;
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = createRecognitionInstance();
    } else {
        micButton.disabled = true;
        micButton.title = translations[currentLang.split('-')[0]].micUnsupported;
    }

    privacyCheckbox.addEventListener('change', () => { newChatBtn.disabled = !privacyCheckbox.checked; });

    languageSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            currentLang = e.target.value;
            if (recognition) recognition.lang = langCodes[currentLang];
            updateUI();
        });
    });

    function startRecording() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;

        recognition = createRecognitionInstance();
        isRecording = true;
        chatInputContainer.classList.add('is-recording');
        micButton.classList.add('recording');
        micButton.innerHTML = stopSVG;

        // Placeholder "grabando" en rojo
        textarea.placeholder = recordingPlaceholders[currentLang.split('-')[0]] || recordingPlaceholders.de;
        textarea.style.color = 'red';

        textarea.value = '';
        recognition.start();
        startAudioVisualizer();
    }

    function stopRecording(send = true) {
        if (!recognition) return;

        isRecording = false;
        chatInputContainer.classList.remove('is-recording');
        micButton.classList.remove('recording');
        micButton.innerHTML = micSVG;
        recognition.stop();
        stopAudioVisualizer();

        // Restaurar placeholder y color original
        const langCode = currentLang.split('-')[0];
        textarea.placeholder = translations[langCode].placeholder;
        textarea.style.color = '';

        if (send) {
            const message = textarea.value.trim();
            if (message) sendMessage(message);
            textarea.value = '';
            textarea.style.height = 'auto';
        }
    }

    micButton.addEventListener('click', () => {
        if (isRecording) stopRecording(true);
        else startRecording();
    });

    function generateUUID() { return crypto.randomUUID(); }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{ action: "loadPreviousSession", sessionId: currentSessionId, route: config.webhook.route, metadata: { userId: "" } }];
        try {
            const response = await fetch(config.webhook.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            await response.json();
            newConversationWrapper.style.display = 'none';
            chatInterface.classList.add('active');

            const langCode = currentLang.split('-')[0];
            const botGreetingMessage = document.createElement('div');
            botGreetingMessage.className = 'chat-message bot bot-greeting-message';
            botGreetingMessage.innerHTML = translations[langCode].botGreeting;
            messagesContainer.appendChild(botGreetingMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) { console.error('Error:', error); }
    }

    async function sendMessage(message) {
        const messageData = { action: "sendMessage", sessionId: currentSessionId, route: config.webhook.route, chatInput: message, metadata: { userId: "", lang: currentLang } };
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) });
            const data = await response.json();
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) { console.error('Error:', error); }
    }

    function correctTextRealtime(text) {
        const words = [...new Intl.Segmenter(recognition.lang, { granularity: 'word' }).segment(text)];
        let corrected = '';
        words.forEach((w, idx) => {
            let word = w.segment;
            if (!word.trim()) return;
            if (idx === 0 || /[.!?]\s*$/.test(corrected)) word = word.charAt(0).toUpperCase() + word.slice(1);
            if (/[.,!?]/.test(word)) corrected = corrected.trim() + word;
            else corrected += (corrected ? ' ' : '') + word;
        });
        if (corrected && !/[.!?]$/.test(corrected)) corrected += '.';
        return corrected;
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        if (isRecording) stopRecording();
        else {
            const message = textarea.value.trim();
            if (message) sendMessage(message);
            textarea.value = '';
            textarea.style.height = 'auto';
        }
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isRecording) stopRecording();
            else {
                const message = textarea.value.trim();
                if (message) sendMessage(message);
                textarea.value = '';
                textarea.style.height = 'auto';
            }
        }
    });

    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => { button.addEventListener('click', () => { chatContainer.classList.remove('open'); }); });
    
    const toggleButton = chatContainer.querySelector('.chat-toggle');
    toggleButton.addEventListener('click', () => { chatContainer.classList.toggle('open'); });

})();

