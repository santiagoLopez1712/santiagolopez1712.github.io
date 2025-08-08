<script>
// Chat Widget Script
(function() {
    // ====== 1. CSS del widget y la animación de ondas ======
    const styles = `
    .n8n-chat-widget {
        --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
        --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
        --chat--color-background: var(--n8n-chat-background-color, #ffffff);
        --chat--color-font: var(--n8n-chat-font-color, #333333);
        font-family: futura-pt;
    }
    /* ... (todo tu CSS original) ... */

    /* Textarea auto-expandible + ondas */
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
        min-height: 36px;
        max-height: 160px;
        overflow: auto;
        position: relative;
        z-index: 1;
    }
    /* Contenedor con ondas animadas */
    .n8n-chat-widget .chat-input.listening textarea {
        background-image: repeating-linear-gradient(
            to right,
            transparent 0,
            transparent 4px,
            rgba(133,79,255,0.3) 4px,
            rgba(133,79,255,0.3) 8px
        );
        background-size: 200% 100%;
        animation: waveMove 1s linear infinite;
    }
    @keyframes waveMove {
        from { background-position: 0 0; }
        to { background-position: 200% 0; }
    }
    `;

    // ====== 2. Inyectar estilos ======
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ====== 3. Configuración y creación del widget ======
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: { logo: '', name: '', welcomeText: '', responseTimeText: '', poweredBy: { text: 'Powered by AMARETIS AI', link: 'https://www.amaretis.de' }},
        style: { primaryColor: '', secondaryColor: '', position: 'right', backgroundColor: '#ffffff', fontColor: '#333333' }
    };
    const config = window.ChatWidgetConfig ? 
        { webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
          branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
          style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style } }
        : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    // HTML inicial (igual que el tuyo)
    chatContainer.innerHTML = `
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
                Starten Sie Ihre Anfrage!
            </button>             
        </div>
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Text oder Sprache eingeben – mit Senden abschicken …" rows="1"></textarea>
                <button type="button" class="mic-btn" title="Nachricht diktieren" aria-pressed="false">
                    <img src="https://github.com/AMARETIS/AMARETIS.github.io/blob/main/Mikrofon%20Farben%20bold.png?raw=true" alt="Micrófono" class="mic-icon" width="32" height="32">
                </button>
                <button type="submit">Senden</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12..."/></svg>`;

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // ====== 4. Referencias ======
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const privacyCheckbox = chatContainer.querySelector('#datenschutz');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const micButton = chatContainer.querySelector('.mic-btn');
    const chatInputBox = chatContainer.querySelector('.chat-input');

    // ====== 5. Reconocimiento de voz con ondas ======
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.interimResults = true;
        recognition.continuous = true;

        let isRecognizing = false;
        let manualStop = false;

        micButton.addEventListener('click', () => {
            if (!isRecognizing) {
                manualStop = false;
                recognition.start();
            } else {
                manualStop = true;
                recognition.stop();
            }
        });

        recognition.onstart = () => {
            micButton.classList.add('active');
            micButton.setAttribute('aria-pressed', 'true');
            chatInputBox.classList.add('listening');
            isRecognizing = true;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            textarea.value += transcript.trim() + ' ';
            autosize(textarea);
        };

        recognition.onerror = () => {
            stopMicAnimation();
        };

        recognition.onend = () => {
            if (!manualStop) {
                recognition.start();
            } else {
                stopMicAnimation();
            }
        };

        function stopMicAnimation() {
            micButton.classList.remove('active');
            micButton.setAttribute('aria-pressed', 'false');
            chatInputBox.classList.remove('listening');
            isRecognizing = false;
        }
    }

    // ====== 6. Funciones del chat ======
    function autosize(el) {
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';
    }

    newChatBtn.addEventListener('click', () => {
        currentSessionId = crypto.randomUUID();
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
    });

    sendButton.addEventListener('click', sendMessageHandler);
    textarea.addEventListener('input', () => autosize(textarea));
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageHandler();
        }
    });

    function sendMessageHandler() {
        const message = textarea.value.trim();
        if (!message) return;
        textarea.value = '';
        autosize(textarea);
        // Aquí iría tu lógica de envío al servidor
    }

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });
    chatContainer.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', () => chatContainer.classList.remove('open'));
    });
})();
</script>
