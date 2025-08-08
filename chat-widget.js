// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
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
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
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

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 28px;
            line-height: 1.3;

            /* 1. Aplica el gradiente como fondo */
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
    
            /* 2. Recorta el fondo a la forma del texto (con prefijo para compatibilidad) */
            -webkit-background-clip: text;
            background-clip: text;
    
            /* 3. Hace que el color del texto sea transparente para mostrar el fondo */
            color: transparent;
        }

       .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
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
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
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
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
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
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

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
            align-items: center; /* Alinea el checkbox y el texto verticalmente */
            text-align: left; /* Asegura que el texto no esté centrado si hay saltos de línea */
            margin-top: 1.5rem;
            margin-bottom: 20px;
            font-family: inherit;
        }

       .n8n-chat-widget .privacy-checkbox input[type="checkbox"] {
            /* Esto está BIEN. Oculta el checkbox original para poder darle un estilo personalizado */
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

        /* Esta es la caja del checkbox personalizado */
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

        /* Estilo cuando el checkbox está marcado */
       .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::before {
            background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
            border-color: transparent;
        }
        
        /* El símbolo de check (palomita) */
       .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::after {
            content: "✔";
            position: absolute;
            left: 4px;
            top: 4px;  /* Ajuste ligero para centrar mejor */
            font-size: 12px;
            color: #fff;
        }

        /* Estilo para el enlace dentro del label */
       .n8n-chat-widget .privacy-checkbox a {
            color: var(--chat--color-primary); /* Usa el color primario para consistencia */
            text-decoration: underline;
            transition: color 0.2s;
        }
        
       .n8n-chat-widget .privacy-checkbox a:hover {
            color: var(--chat--color-secondary);
        }

       .n8n-chat-widget .chat-input .mic-btn {
            background: transparent;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 18px;
            margin-right: 4px;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .n8n-chat-widget .chat-input .mic-btn:hover {
            transform: scale(1.05);
        }
        
        .n8n-chat-widget .chat-input .mic-btn .mic-icon {
            width: 24px;
            height: 24px;
            transition: filter 0.3s ease;
        }
        
        /* Estado activo: pulso y cambio de color */
        .n8n-chat-widget .chat-input .mic-btn.active .mic-icon path,
        .n8n-chat-widget .chat-input .mic-btn.active .mic-icon line {
            stroke: #ff3b3b; /* rojo más fuerte para indicar grabación */
            filter: drop-shadow(0 0 4px #ff3b3b);
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                filter: drop-shadow(0 0 4px #ff3b3b);
            }
            50% {
                filter: drop-shadow(0 0 10px #ff3b3b);
            }
        }

    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by AMARETIS AI',
                link: 'https://www.amaretis.de'
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
  const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <p class="response-text">${config.branding.responseTimeText}</p>    
            <div class="privacy-checkbox">
                <input type="checkbox" id="datenschutz" name="datenschutz">
                <label for="datenschutz">
                    Ich habe die <a href="https://www.amaretis.de/datenschutz/" target="_blank">Datenschutzerklärung</a> gelesen und akzeptiere sie.
                </label>
            </div>
            <button class="new-chat-btn" disabled>
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Starten Sie Ihre Anfrage!
            </button>             
        </div>
    `;

    const chatInterfaceHTML = `
    <div class="chat-interface">
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="chat-messages"></div>
        <div class="chat-input">
            <textarea placeholder="Schreiben Sie uns hier..." rows="1"></textarea>
            <button type="button" class="mic-btn" title="Nachricht diktieren" aria-pressed="false">
                <!-- SVG micrófono base -->
                <svg class="mic-icon" width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="https://github.com/AMARETIS/AMARETIS.github.io/blob/main/mikrofon.svg" aria-hidden="true" focusable="false">
                    <defs>
                        <linearGradient id="micGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#854fff"/>
                            <stop offset="100%" stop-color="#dd0c0d"/>
                        </linearGradient>
                    </defs>
                    <path d="M32 4C26.48 4 22 8.48 22 14V34C22 39.52 26.48 44 32 44C37.52 44 42 39.52 42 34V14C42 8.48 37.52 4 32 4Z" 
                          stroke="url(#micGradient)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M48 26V34C48 41.73 41.73 48 34 48H30C22.27 48 16 41.73 16 34V26" 
                          stroke="url(#micGradient)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="32" y1="48" x2="32" y2="60" stroke="url(#micGradient)" stroke-width="4" stroke-linecap="round"/>
                    <line x1="24" y1="60" x2="40" y2="60" stroke="url(#micGradient)" stroke-width="4" stroke-linecap="round"/>
                </svg>
            </button>
            <button type="submit">Senden</button>
        </div>
        <div class="chat-footer">
            <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
        </div>
    </div>
`;

    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const privacyCheckbox = chatContainer.querySelector('#datenschutz'); 
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', function() {
                // Habilita o deshabilita el botón basado en el estado del checkbox
                newChatBtn.disabled = !this.checked;
        });
    }
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const micButton = chatContainer.querySelector('.mic-btn');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        micButton.disabled = true;
        micButton.title = "Diktat in der Browser nicht Verfügbar";
    } else {
        const recognition = new SpeechRecognition();
        recognition.lang = 'de-DE'; // O 'es-ES' si quieres español
        recognition.interimResults = false;
    
        let isRecognizing = false;
    
        micButton.addEventListener('click', () => {
            if (!isRecognizing) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    
        recognition.onstart = () => {
            micButton.classList.add('active');
            micButton.setAttribute('aria-pressed', 'true');
            isRecognizing = true;
        };
    
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            textarea.value += transcript.trim() + ' ';
            textarea.focus();
        };
    
        recognition.onerror = (event) => {
            console.error("Error en el reconocimiento de voz:", event.error);
            micButton.classList.remove('active');
            micButton.setAttribute('aria-pressed', 'false');
            isRecognizing = false;
        };
    
        recognition.onend = () => {
            micButton.classList.remove('active');
            micButton.setAttribute('aria-pressed', 'false');
            isRecognizing = false;
        };
    }

    
    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');
            
            // Begrüßung
            const optInMessage = document.createElement('div');
            optInMessage.className = 'chat-message bot';
            optInMessage.innerHTML = `
                Hallo! 👋 Ich bin Ihr persönlicher Assistent der Agentur für Kommunikation AMARETIS.
                Wir sind eine Full-Service-Werbeagentur mit Sitz in Göttingen und arbeiten für Kundinnen und Kunden in ganz Deutschland.
                Wie kann ich Ihnen heute weiterhelfen?
                Möchten Sie einen Termin vereinbaren – telefonisch, per Videocall oder vor Ort?
                Oder haben Sie eine allgemeine Anfrage zu unseren Leistungen?
 
            `;
            messagesContainer.appendChild(optInMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;


        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
