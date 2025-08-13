<script>
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
        }

        .n8n-chat-widget .chat-input button svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
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
            content: "✔";
            position: absolute;
            left: 4px;
            top: 4px;
            font-size: 12px;
            color: #fff;
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
        },
        settings: {
            // Idioma por defecto (puedes sobreescribir con window.ChatWidgetConfig.settings.language)
            language: 'de-DE' 
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            settings: { ...defaultConfig.settings, ...(window.ChatWidgetConfig.settings || {}) }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let currentLang = (config.settings && config.settings.language) || (navigator.language || 'de-DE');

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
                <textarea placeholder="Schreiben Sie uns hier..." rows="1" spellcheck="true"></textarea>
                <button type="submit" aria-label="Enviar">
                    <!-- Flecha hacia la derecha -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="lucide lucide-arrow-right">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
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
            newChatBtn.disabled = !this.checked;
        });
    }

    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');

    // ======= Corrección ortográfica básica (ES/EN/DE) =======
    function normalizeSpaces(str) {
        return str
            .replace(/\s+/g, ' ')           // espacios múltiples -> uno
            .replace(/\s+([,.;:!?])/g, '$1')// quitar espacio antes de puntuación
            .replace(/([,.;:!?])(?!\s|$)/g, '$1 ') // asegurar un espacio tras puntuación (si no fin)
            .replace(/\s+$/,'')             // quitar espacios al final
            .replace(/^\s+/, '');           // quitar espacios al inicio
    }

    function capitalizeSentenceStarts(str) {
        // Mayúscula al inicio del texto y tras .!? (manejo simple)
        return str.replace(/(^|[.!?]\s+)([a-zäöüßáéíóúàèìòùñç])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    }

    function ensureTerminalPunctuation(str) {
        // Si no termina en .!? entonces añade punto
        return /[.!?…]$/.test(str.trim()) ? str.trim() : (str.trim() + '.');
    }

    function fixEnglishI(str){
        // Capitaliza el pronombre inglés "I" cuando va solo o en contracciones
        return str
            .replace(/(^|\s)i(\s|$)/g, '$1I$2')
            .replace(/(^|\s)i(['’][a-z]+)/g, (m, p1, p2)=> p1 + 'I' + p2);
    }

    function fixSpanishInverted(str){
        // Si una oración termina en ? o ! y no tiene ¿/¡ al inicio de esa oración, añadir de forma simple.
        // Implementación simple para la última oración.
        const t = str.trim();
        if (/[?]$/.test(t) && !/¿/.test(t)) return '¿' + t;
        if (/[!]$/.test(t) && !/¡/.test(t)) return '¡' + t;
        return str;
    }

    function germanCapitalizeAfterDeterminers(str){
        // Heurística simple: capitaliza la palabra tras determinantes/artículos comunes
        const det = '(der|die|das|dem|den|des|ein|eine|einer|einem|einen|eines|mein|dein|sein|ihr|unser|euer|Ihr)';
        return str.replace(new RegExp(`\\b${det}\\s+([a-zäöüß][\\wäöüß-]*)`, 'g'), (m, d, w) => `${d} ${w.charAt(0).toUpperCase()}${w.slice(1)}`);
    }

    function basicNormalize(text, lang) {
        if (!text) return text;
        let t = text;

        // Normalización general
        t = normalizeSpaces(t);
        t = capitalizeSentenceStarts(t);

        // Ajustes por idioma
        const l = (lang || '').toLowerCase();
        if (l.startsWith('en')) {
            t = fixEnglishI(t);
        } else if (l.startsWith('es')) {
            t = fixSpanishInverted(t);
        } else if (l.startsWith('de')) {
            t = germanCapitalizeAfterDeterminers(t);
            // Asegurar mayúscula de "Ich" al inicio de oración (ya lo hace capitalizeSentenceStarts)
        }

        // Evitar añadir punto si termina en ?, !, …
        if (!/[!?…]$/.test(t.trim())) {
            t = ensureTerminalPunctuation(t);
        }

        return t;
    }

    // Debounce corrección al tipear (evita saltos de cursor)
    let inputNormalizeTimer = null;
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        if (inputNormalizeTimer) clearTimeout(inputNormalizeTimer);
        inputNormalizeTimer = setTimeout(() => {
            if (!isRecording) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = textarea.value;
                const after = basicNormalize(before, currentLang);
                if (after !== before) {
                    textarea.value = after;
                    // Recolocar cursor al final (más seguro)
                    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                }
            }
        }, 400);
    });

    // Validación mínima
    textarea.addEventListener('blur', () => {
        if (textarea.value.trim() === '') {
            textarea.setCustomValidity('Texto vacío no permitido');
        } else {
            textarea.setCustomValidity('');
        }
    });

    const sendButton = chatContainer.querySelector('button[type="submit"]');

    // Iconos mic/stop
    const micSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="lucide lucide-mic">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>`;
    const stopSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="lucide lucide-square">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    </svg>`;

    // Crear el botón de micrófono
    const micButton = document.createElement('button');
    micButton.type = 'button';
    micButton.classList.add('mic-button');
    micButton.innerHTML = micSVG;
    micButton.title = 'Spracheingabe starten/stoppen';
    sendButton.before(micButton);

    // ======= Speech Recognition con concatenación =======
    let recognition;
    let isRecording = false;
    let committedText = ''; // texto ya "confirmado" por resultados finales
    let lastDisplayedValue = ''; // para evitar re-render innecesario

    function setRecognitionLang(lang) {
        if (recognition) {
            try { recognition.abort(); } catch(e){}
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        recognition = new SpeechRecognition();
        recognition.lang = lang || 'de-DE';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalChunk = '';
            let interimChunk = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                const txt = res[0].transcript;
                if (res.isFinal) {
                    finalChunk += txt;
                } else {
                    interimChunk += txt;
                }
            }

            // Si hay finales, los "comiteamos" con normalización y concatenación
            if (finalChunk) {
                const joiner = committedText && !/[ \n]$/.test(committedText) ? ' ' : '';
                committedText = basicNormalize((committedText + joiner + finalChunk).trim(), currentLang);
            }

            // Lo que se muestra es committed + interim (sin normalizar en exceso el interim)
            const joiner2 = (committedText && interimChunk && !/[ \n]$/.test(committedText)) ? ' ' : '';
            const displayValue = (committedText + joiner2 + interimChunk).trim();

            if (displayValue !== lastDisplayedValue) {
                textarea.value = displayValue;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
                lastDisplayedValue = displayValue;
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopRecording();
        };

        recognition.onend = () => {
            if (isRecording) stopRecording();
        };
    }

    // Inicializar si disponible
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        setRecognitionLang(currentLang);
    } else {
        micButton.disabled = true;
        micButton.title = 'Spracherkennung nicht unterstützt';
    }
    
    function startRecording() {
        if (!recognition) return;
        isRecording = true;
        micButton.classList.add('recording');
        micButton.innerHTML = stopSVG;
        committedText = textarea.value || '';
        lastDisplayedValue = committedText;
        try { recognition.start(); } catch(e) { console.warn(e); }
    }
    
    function stopRecording() {
        if (!recognition) return;
        isRecording = false;
        micButton.classList.remove('recording');
        micButton.innerHTML = micSVG;
        try { recognition.stop(); } catch(e) { console.warn(e); }

        // Al parar, normalizamos todo lo que quedó en pantalla
        if (textarea.value.trim()) {
            textarea.value = basicNormalize(textarea.value, currentLang);
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }
    
    micButton.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    // Exponer función para cambiar idioma en runtime
    window.ChatWidgetSetLanguage = function(langCode) {
        if (typeof langCode !== 'string' || !langCode) return;
        currentLang = langCode;
        if (recognition) {
            const wasRecording = isRecording;
            try { recognition.abort(); } catch(e){}
            setRecognitionLang(currentLang);
            if (wasRecording) {
                startRecording();
            }
        }
    };

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
            
            // Greeting
            const optInMessage = document.createElement('div');
            optInMessage.className = 'chat-message bot';
            optInMessage.innerHTML = `
                Hallo! 👋 Ich bin Ihr persönlicher Assistent der Agentur für Kommunikation AMARETIS.
                Wir sind eine Full-Service-Werbeagentur mit Sitz in Göttingen und arbeiten für Kundinnen und Kund*innen in ganz Deutschland.
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
        const cleaned = basicNormalize(message, currentLang);

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: cleaned,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = cleaned;
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

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    newChatBtn.addEventListener('click', startNewConversation);
    
    const submit = () => {
        const message = textarea.value.trim();
        if (message) {
            // Normaliza antes de enviar
            const norm = basicNormalize(message, currentLang);
            textarea.value = '';
            sendMessage(norm);
        }
    };

    const sendButtonEl = chatContainer.querySelector('button[type="submit"]');
    sendButtonEl.addEventListener('click', submit);
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
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

