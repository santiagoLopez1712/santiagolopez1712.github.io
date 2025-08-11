(function() {
    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Default configuration
    const defaultConfig = {
        webhook: { url: '', route: '' },
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
            primaryColor: '#854fff',
            secondaryColor: '#6b3fd4',
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
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Schreiben Sie uns hier..." rows="1"></textarea>
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
    const privacyCheckbox = chatContainer.querySelector('#datenschutz');
    const newConversationSection = chatContainer.querySelector('.new-conversation');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    const toggleBtn = toggleButton;
    const chatMessages = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendBtn = chatContainer.querySelector('button[type="submit"]');

    privacyCheckbox.addEventListener('change', () => {
        newChatBtn.disabled = !privacyCheckbox.checked;
    });

    toggleBtn.addEventListener('click', () => {
        chatContainer.classList.add('open');
        toggleBtn.style.display = 'none';
        newConversationSection.style.display = 'block';
        chatInterface.classList.remove('active');
        textarea.value = '';
        chatMessages.innerHTML = '';
        currentSessionId = '';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chatContainer.classList.remove('open');
            toggleBtn.style.display = 'flex';
            newConversationSection.style.display = 'block';
            chatInterface.classList.remove('active');
            textarea.value = '';
            chatMessages.innerHTML = '';
            currentSessionId = '';
        });
    });

    newChatBtn.addEventListener('click', () => {
        if (!privacyCheckbox.checked) return;
        newConversationSection.style.display = 'none';
        chatInterface.classList.add('active');
        textarea.focus();
        startNewSession();
    });

    function startNewSession() {
        currentSessionId = `session-${Date.now()}`;
        chatMessages.innerHTML = '';
    }

    function appendMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(text) {
        if (!text.trim()) return;
        appendMessage(text, 'user');
        textarea.value = '';

        try {
            const response = await fetch(config.webhook.url + (config.webhook.route || ''), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: currentSessionId, message: text })
            });
            const data = await response.json();
            if (data.reply) {
                appendMessage(data.reply, 'bot');
            } else {
                appendMessage('Keine Antwort erhalten.', 'bot');
            }
        } catch (error) {
            appendMessage('Fehler beim Senden der Nachricht.', 'bot');
            console.error(error);
        }
    }

    sendBtn.addEventListener('click', () => {
        sendMessage(textarea.value);
    });

    textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(textarea.value);
        }
    });

    // Speech recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.continuous = false;
        recognition.interimResults = false;

        const micButton = document.createElement('button');
        micButton.type = 'button';
        micButton.className = 'mic-btn';
        micButton.title = 'Spracheingabe starten';
        micButton.style.background = `linear-gradient(135deg, ${config.style.primaryColor} 0%, ${config.style.secondaryColor} 100%)`;
        micButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 7a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7z"/>
            </svg>
        `;
        chatContainer.querySelector('.chat-input').appendChild(micButton);

        let recognizing = false;

        micButton.addEventListener('click', () => {
            if (recognizing) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.addEventListener('start', () => {
            recognizing = true;
            micButton.style.opacity = '0.7';
        });

        recognition.addEventListener('end', () => {
            recognizing = false;
            micButton.style.opacity = '1';
        });

        recognition.addEventListener('result', e => {
            const transcript = e.results[e.results.length - 1][0].transcript.trim();
            if (transcript) {
                if (textarea.value.length > 0 && !textarea.value.endsWith(' ')) {
                    textarea.value += ' ';
                }
                textarea.value += transcript;
                textarea.focus();
            }
        });
    }
})();
