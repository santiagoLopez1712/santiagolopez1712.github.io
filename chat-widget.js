// Chat Widget Script (versión corregida)
(function() {
    // Create and inject styles (uso tu bloque CSS ya preparado)
    const styles = `/* ... tu CSS tal cual (omito aquí por brevedad) ... */
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: futura-pt;
        }

        /* (incluye aquí todo el CSS que tenías, incluyendo las reglas del mic-btn y keyframes) */
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by AMARETIS AI', link: 'https://www.amaretis.de' }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...(window.ChatWidgetConfig.webhook || {}) },
            branding: { ...defaultConfig.branding, ...(window.ChatWidgetConfig.branding || {}) },
            style: { ...defaultConfig.style, ...(window.ChatWidgetConfig.style || {}) }
        } : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    // Create widget container and chat container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    // set CSS variable names that your CSS expects
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor || '');
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor || '');
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor || '');
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor || '');

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    // HTML fragments (tu HTML, sin duplicar)
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button" aria-label="Cerrar">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText || 'Willkommen'}</h2>
            <p class="response-text">${config.branding.responseTimeText || ''}</p>
            <div class="privacy-checkbox">
                <input type="checkbox" id="datenschutz" name="datenschutz">
                <label for="datenschutz">
                    Ich habe die <a href="https://www.amaretis.de/datenschutz/" target="_blank" rel="noopener">Datenschutzerklärung</a> gelesen und akzeptiere sie.
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
                <button class="close-button" aria-label="Cerrar">×</button>
            </div>
            <div class="chat-messages" role="log" aria-live="polite"></div>
            <form class="chat-input-form" autocomplete="off" role="search">
                <div class="chat-input">
                    <textarea placeholder="Schreiben Sie uns hier..." rows="1" aria-label="Mensaje"></textarea>
                    <button type="button" class="mic-btn" title="Nachricht diktieren" aria-pressed="false" aria-label="Activar reconocimiento de voz">
                        <svg class="mic-icon" width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
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
            </form>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank" rel="noopener">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;

    // Set innerHTML of chatContainer (una sola vez)
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

    // Append chatContainer into widgetContainer, then append widgetContainer to body
    widgetContainer.appendChild(chatContainer);
    document.body.appendChild(widgetContainer);

    // Create and append the toggle button (al body, por encima del widget)
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.title = 'Chat öffnen';
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
        </svg>
    `;
    document.body.appendChild(toggleButton);

    // References to DOM elements inside widget (con comprobaciones)
    const newConv = widgetContainer.querySelector('.new-conversation');
    const chatInterface = widgetContainer.querySelector('.chat-interface');
    const closeButtons = widgetContainer.querySelectorAll('.close-button');
    const newChatBtn = widgetContainer.querySelector('.new-chat-btn');
    const privacyCheckbox = widgetContainer.querySelector('#datenschutz');
    const textarea = widgetContainer.querySelector('textarea');
    const chatMessages = widgetContainer.querySelector('.chat-messages');
    const chatInputForm = widgetContainer.querySelector('.chat-input-form');
    const micBtn = widgetContainer.querySelector('.mic-btn');

    // Safety: only add listeners if elements exist
    if (privacyCheckbox && newChatBtn) {
        privacyCheckbox.addEventListener('change', () => {
            newChatBtn.disabled = !privacyCheckbox.checked;
        });
    } else {
        // no hay checkbox / botón — log para debug, pero no se rompe el script
        console.warn('Privacy checkbox or newChatBtn not found.');
    }

    // Toggle widget open/close
    toggleButton.addEventListener('click', () => {
        const isOpen = chatContainer.classList.contains('open');
        if (isOpen) {
            chatContainer.classList.remove('open');
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            chatContainer.classList.add('open');
            toggleButton.setAttribute('aria-expanded', 'true');
        }
    });

    // Close buttons (pueden ser dos, uno en new-conversation y otro en chat-interface)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chatContainer.classList.remove('open');
            toggleButton.setAttribute('aria-expanded', 'false');
        });
    });

    // Start new chat
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            if (privacyCheckbox && !privacyCheckbox.checked) {
                alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
                return;
            }
            // iniciar la sesión
            try { currentSessionId = crypto.randomUUID(); } catch (e) { currentSessionId = Date.now().toString(); }
            if (chatMessages) chatMessages.innerHTML = '';
            if (newConv) newConv.style.display = 'none';
            if (chatInterface) chatInterface.classList.add('active');
            if (textarea) textarea.focus();
        });
    }

    // Send message handler
    if (chatInputForm) {
        chatInputForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = textarea ? textarea.value.trim() : '';
            if (!message) return;
            appendMessage('user', message);
            if (textarea) textarea.value = '';
            // Demo response, sustituir por llamada real al webhook
            appendMessage('bot', 'Danke für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.');
        });
    }

    function appendMessage(sender, text) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- MIC BUTTON INTEGRATION (robusta) ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!micBtn) {
        // no hay mic button en DOM (por alguna razón). Salimos silenciosamente.
        console.warn('Mic button no encontrado en widget.');
    } else {
        if (!SpeechRecognition) {
            micBtn.disabled = true;
            micBtn.title = "Diktat im Browser nicht verfügbar";
        } else {
            const recognition = new SpeechRecognition();
            recognition.lang = 'de-DE'; // o 'es-ES' si prefieres
            recognition.interimResults = false;

            let isRecognizing = false;

            micBtn.addEventListener('click', () => {
                try {
                    if (!isRecognizing) {
                        recognition.start();
                    } else {
                        recognition.stop();
                    }
                } catch (err) {
                    console.error('SpeechRecognition start/stop error:', err);
                }
            });

            recognition.onstart = () => {
                micBtn.classList.add('active');
                micBtn.setAttribute('aria-pressed', 'true');
                isRecognizing = true;
            };

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript || '';
                if (textarea) {
                    textarea.value += transcript.trim() + ' ';
                    textarea.focus();
                }
            };

            recognition.onerror = (event) => {
                console.error("Error en el reconocimiento de voz:", event.error);
                micBtn.classList.remove('active');
                micBtn.setAttribute('aria-pressed', 'false');
                isRecognizing = false;
            };

            recognition.onend = () => {
                micBtn.classList.remove('active');
                micBtn.setAttribute('aria-pressed', 'false');
                isRecognizing = false;
            };
        }
    }

    // variable session id (opcional)
    let currentSessionId = '';
})();
