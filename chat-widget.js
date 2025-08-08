<!-- Chat Widget Script -->
<script>
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

        .n8n-chat-widget .chat-container.position-left { right: auto; left: 20px; }
        .n8n-chat-widget .chat-container.open { display: flex; flex-direction: column; }

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
        .n8n-chat-widget .close-button:hover { opacity: 1; }

        .n8n-chat-widget .brand-header img { width: 32px; height: 32px; }
        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px; text-align: center; width: 100%; max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px; font-weight: 600; margin-bottom: 28px; line-height: 1.3;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white; border: none; border-radius: 8px; cursor: pointer;
            font-size: 16px; transition: transform 0.3s; font-weight: 500; font-family: inherit;
            margin-bottom: 12px;
        }
        .n8n-chat-widget .new-chat-btn:hover { transform: scale(1.02); }

        .n8n-chat-widget .chat-btn-content { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .n8n-chat-widget .chat-line { display: block; margin-bottom: 8px; font-weight: 200; font-size: 14px; }
        .n8n-chat-widget .message-icon { width: 20px; height: 20px; }

        .n8n-chat-widget .response-text {
            font-size: 14px; color: #000; opacity: 0.7; margin-bottom:28px; font-weight: 400;
        }

        .n8n-chat-widget .chat-interface { display: none; flex-direction: column; height: 100%; }
        .n8n-chat-widget .chat-interface.active { display: flex; }

        .n8n-chat-widget .chat-messages {
            flex: 1; overflow-y: auto; padding: 20px; background: var(--chat--color-background);
            display: flex; flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px; margin: 8px 0; border-radius: 12px;
            max-width: 80%; word-wrap: break-word; font-size: 14px; line-height: 1.5;
        }
        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white; align-self: flex-end; box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2); border: none;
        }
        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-input {
            padding: 16px; background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex; gap: 8px; position: relative; overflow: hidden;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1; padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: rgba(255,255,255,0.9);
            color: var(--chat--color-font);
            resize: none; font-family: inherit; font-size: 14px;
            min-height: 36px; max-height: 160px; overflow: auto;
            position: relative; z-index: 1;
        }
        .n8n-chat-widget .chat-input textarea::placeholder { color: var(--chat--color-font); opacity: 0.6; }

        /* Canvas de la onda dentro del input */
        .n8n-chat-widget .chat-input .voice-vis{
          position:absolute; inset:16px 16px; border-radius:8px;
          pointer-events:none; opacity:0; transition: opacity .2s ease; z-index:0;
        }
        .n8n-chat-widget .chat-input.listening .voice-vis{ opacity:.9; }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white; border: none; border-radius: 8px; padding: 0 20px;
            cursor: pointer; transition: transform 0.2s; font-family: inherit; font-weight: 500;
        }
        .n8n-chat-widget .chat-input button:hover { transform: scale(1.05); }

        .n8n-chat-widget .chat-toggle {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999; transition: transform 0.3s; display: flex; align-items: center; justify-content: center;
        }
        .n8n-chat-widget .chat-toggle.position-left { right:auto; left:20px; }
        .n8n-chat-widget .chat-toggle:hover { transform: scale(1.05); }
        .n8n-chat-widget .chat-toggle svg { width: 24px; height: 24px; fill: currentColor; }

        .n8n-chat-widget .chat-footer {
            padding: 8px; text-align: center; background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }
        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary); text-decoration: none; font-size: 12px; opacity: 0.8;
            transition: opacity 0.2s; font-family: inherit;
        }
        .n8n-chat-widget .chat-footer a:hover { opacity: 1; }

        .n8n-chat-widget .privacy-checkbox {
            display: flex; justify-content: center; align-items: center;
            text-align: left; margin-top: 1.5rem; margin-bottom: 20px; font-family: inherit;
        }
        .n8n-chat-widget .privacy-checkbox input[type="checkbox"] { display: none; }
        .n8n-chat-widget .privacy-checkbox label {
            position: relative; padding-left: 28px; font-size: 14px; color:#000; cursor:pointer;
            max-width: 300px; font-weight: 400; opacity: 0.7;
        }
        .n8n-chat-widget .privacy-checkbox label::before {
            content:""; position:absolute; left:0; top:2px; width:18px; height:18px;
            border:1.5px solid rgba(133, 79, 255, 0.6); border-radius:4px; background:#fff;
            transition: all .2s ease; box-shadow: 0 2px 4px rgba(133, 79, 255, 0.1);
        }
        .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::before {
            background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
            border-color: transparent;
        }
        .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::after {
            content:"✔"; position:absolute; left:4px; top:4px; font-size:12px; color:#fff;
        }
        .n8n-chat-widget .privacy-checkbox a { color: var(--chat--color-primary); text-decoration: underline; transition: color .2s; }
        .n8n-chat-widget .privacy-checkbox a:hover { color: var(--chat--color-secondary); }

        .n8n-chat-widget .chat-input .mic-btn {
            background: transparent; color: white; border: none; border-radius: 8px;
            padding: 6px 12px; cursor: pointer; font-size: 18px; margin-right: 4px;
            transition: transform 0.2s; font-family: inherit; font-weight: 500;
            display: flex; align-items: center; justify-content: center;
        }
        .n8n-chat-widget .chat-input .mic-btn:hover { transform: scale(1.05); }
        .n8n-chat-widget .chat-input .mic-btn .mic-icon { width: 24px; height: 24px; transition: filter 0.3s ease; }

        /* Estado activo: pulso y cambio de color del PNG/SVG del mic */
        .n8n-chat-widget .chat-input .mic-btn.active .mic-icon path,
        .n8n-chat-widget .chat-input .mic-btn.active .mic-icon line {
            stroke:#ff3b3b; filter: drop-shadow(0 0 4px #ff3b3b); animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0%,100%{filter: drop-shadow(0 0 4px #ff3b3b);} 50%{filter: drop-shadow(0 0 10px #ff3b3b);} }

        /* Halo externo (si deseas mantenerlo además del canvas) */
        .n8n-chat-widget .chat-input::before{
          content:""; position:absolute; inset:-2px; border-radius:10px;
          background: conic-gradient(from 0deg, var(--chat--color-primary), #9b6bff, var(--chat--color-secondary), #ff6a3b, var(--chat--color-primary));
          filter: blur(8px); opacity:0; pointer-events:none; transition: opacity .25s ease;
          -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 3px), #000 0);
                  mask: radial-gradient(closest-side, transparent calc(100% - 3px), #000 0);
        }
        @keyframes n8n-spin { to { transform: rotate(360deg); } }
        .n8n-chat-widget .chat-input.listening::before{ opacity:.6; animation: n8n-spin 2.2s linear infinite; }
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
        webhook: { url: '', route: '' },
        branding: {
            logo: '', name: '', welcomeText: '', responseTimeText: '',
            poweredBy: { text: 'Powered by AMARETIS AI', link: 'https://www.amaretis.de' }
        },
        style: {
            primaryColor: '', secondaryColor: '', position: 'right',
            backgroundColor: '#ffffff', fontColor: '#333333'
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
            <canvas class="voice-vis"></canvas>
            <textarea placeholder="Text oder Sprache eingeben – mit Senden abschicken …" rows="1"></textarea>
            <button type="button" class="mic-btn" title="Nachricht diktieren" aria-pressed="false">
                <img src="https://github.com/AMARETIS/AMARETIS.github.io/blob/main/Mikrofon%20Farben%20bold.png?raw=true" 
                     alt="Micrófono" class="mic-icon" width="24" height="24">
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

    // --- Refs ---
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
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const micButton = chatContainer.querySelector('.mic-btn');
    const chatInputBox = chatContainer.querySelector('.chat-input');

    // Canvas visualizador ya existe en el HTML (lo referenciamos)
    const visCanvas = chatContainer.querySelector('.voice-vis');
    const visCtx = visCanvas.getContext('2d');

    // --- Auto-expand textarea ---
    function autosize(el){
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
    textarea.addEventListener('input', () => autosize(textarea));
    window.addEventListener('load', () => autosize(textarea));

    // Ajuste dinámico del canvas al tamaño del input
    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(chatInputBox);

    function sizeCanvas(){
      const rect = chatInputBox.getBoundingClientRect();
      visCanvas.width  = Math.max(100, rect.width  - 32);
      visCanvas.height = Math.max(50,  rect.height - 32);
    }
    sizeCanvas();

    // --- Visualizador (Web Audio API) ---
    let audioCtx, analyser, sourceNode, mediaStream, dataArray, rafId;

    function setupAudio(){
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      dataArray = new Uint8Array(bufferLength);
    }

    async function startVisualizer(){
      try {
        if (!audioCtx) setupAudio();
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        sourceNode = audioCtx.createMediaStreamSource(mediaStream);
        sourceNode.connect(analyser);
        drawWave();
      } catch (err) {
        console.error('getUserMedia error:', err);
      }
    }

    function stopVisualizer(){
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (sourceNode) { try { sourceNode.disconnect(); } catch(_) {} sourceNode = null; }
      if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
      if (visCtx) { visCtx.clearRect(0,0,visCanvas.width, visCanvas.height); }
    }

    function drawWave(){
      analyser.getByteTimeDomainData(dataArray);
      const w = visCanvas.width, h = visCanvas.height;
      visCtx.clearRect(0,0,w,h);

      // fondo sutil
      const bg = visCtx.createLinearGradient(0,0,0,h);
      bg.addColorStop(0,'rgba(133,79,255,0.08)');
      bg.addColorStop(1,'rgba(221,12,13,0.06)');
      visCtx.fillStyle = bg;
      visCtx.fillRect(0,0,w,h);

      // trazo de la onda
      visCtx.lineWidth = 2;
      const strokeGrad = visCtx.createLinearGradient(0,0,0,h);
      strokeGrad.addColorStop(0,'#854fff');
      strokeGrad.addColorStop(1,'#dd0c0d');
      visCtx.strokeStyle = strokeGrad;
      visCtx.beginPath();

      const sliceWidth = w / dataArray.length;
      let x = 0;
      for (let i=0; i<dataArray.length; i++){
        const v = dataArray[i] / 128.0;
        const y = (v * h/2);
        if (i === 0) visCtx.moveTo(x, y);
        else visCtx.lineTo(x, y);
        x += sliceWidth;
      }
      visCtx.stroke();

      // opcional: variar opacidad con RMS (respira con volumen)
      let sum=0;
      for (let i=0;i<dataArray.length;i++){ const d = dataArray[i]-128; sum += d*d; }
      const rms = Math.sqrt(sum / dataArray.length); // 0..~50
      visCanvas.style.opacity = Math.min(.3 + rms/60, 1);

      rafId = requestAnimationFrame(drawWave);
    }

    // --- SpeechRecognition (escucha continua reiniciable) ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      micButton.disabled = true;
      micButton.title = "Diktat in der Browser nicht Verfügbar";
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE';          // o 'es-ES'
      recognition.interimResults = true;   // texto parcial
      recognition.continuous = true;       // no para por silencio (aunque onend puede dispararse)

      let isRecognizing = false;
      let manualStop = false;

      micButton.addEventListener('click', () => {
        if (!isRecognizing) {
          manualStop = false;
          recognition.start();
          startVisualizer(); // feedback inmediato
        } else {
          manualStop = true;
          recognition.stop();
          stopVisualizer();  // detén visualizador solo en stop manual
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
        textarea.focus();
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz:", event.error);
        micButton.classList.remove('active');
        micButton.setAttribute('aria-pressed', 'false');
        chatInputBox.classList.remove('listening');
        isRecognizing = false;
        stopVisualizer();
      };

      recognition.onend = () => {
        if (!manualStop) {
          // vuelve a arrancar para continuidad; mantenemos el visualizador encendido
          recognition.start();
          return;
        }
        micButton.classList.remove('active');
        micButton.setAttribute('aria-pressed', 'false');
        chatInputBox.classList.remove('listening');
        isRecognizing = false;
        stopVisualizer();
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
            metadata: { userId: "" }
        }];

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            await response.json();
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

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

        } catch (error) { console.error('Error:', error); }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: { userId: "" }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
            const data = await response.json();

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) { console.error('Error:', error); }
    }

    // Listeners finales
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    newChatBtn.addEventListener('click', startNewConversation);

    sendButton.addEventListener('click', () => {
      const message = textarea.value.trim();
      if (message) {
        sendMessage(message);
        textarea.value = '';
        textarea.style.height = 'auto'; autosize(textarea);
      }
    });

    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = textarea.value.trim();
        if (message) {
          sendMessage(message);
          textarea.value = '';
          textarea.style.height = 'auto'; autosize(textarea);
        }
      }
    });

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
</script>
