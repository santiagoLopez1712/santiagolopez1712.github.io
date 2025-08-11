// Chat Widget Script
(function() {
  // ===== styles =====
  const styles = `
    .n8n-chat-widget {
      --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
      --chat--color-secondary: var(--n8n-chat-secondary-color, #dd0c0d);
      --chat--color-background: var(--n8n-chat-background-color, #ffffff);
      --chat--color-font: var(--n8n-chat-font-color, #333333);
      font-family: futura-pt;
    }
    .n8n-chat-widget .chat-container{position:fixed;bottom:20px;right:20px;z-index:1000;display:none;width:380px;height:600px;background:var(--chat--color-background);border-radius:12px;box-shadow:0 8px 32px rgba(133,79,255,.15);border:1px solid rgba(133,79,255,.2);overflow:hidden;font-family:inherit}
    .n8n-chat-widget .chat-container.position-left{right:auto;left:20px}
    .n8n-chat-widget .chat-container.open{display:flex;flex-direction:column}
    .n8n-chat-widget .brand-header{padding:16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(133,79,255,.1);position:relative}
    .n8n-chat-widget .close-button{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--chat--color-font);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;transition:color .2s;font-size:20px;opacity:.6}
    .n8n-chat-widget .close-button:hover{opacity:1}
    .n8n-chat-widget .brand-header img{width:32px;height:32px}
    .n8n-chat-widget .brand-header span{font-size:18px;font-weight:500;color:var(--chat--color-font)}
    .n8n-chat-widget .new-conversation{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:20px;text-align:center;width:100%;max-width:300px}
    .n8n-chat-widget .welcome-text{font-size:24px;font-weight:600;margin-bottom:28px;line-height:1.3;background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
    .n8n-chat-widget .new-chat-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px 24px;background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:16px;transition:transform .3s;font-weight:500;font-family:inherit;margin-bottom:12px}
    .n8n-chat-widget .new-chat-btn:hover{transform:scale(1.02)}
    .n8n-chat-widget .chat-interface{display:none;flex-direction:column;height:100%}
    .n8n-chat-widget .chat-interface.active{display:flex}
    .n8n-chat-widget .chat-messages{flex:1;overflow-y:auto;padding:20px;background:var(--chat--color-background);display:flex;flex-direction:column}
    .n8n-chat-widget .chat-message{padding:12px 16px;margin:8px 0;border-radius:12px;max-width:80%;word-wrap:break-word;font-size:14px;line-height:1.5}
    .n8n-chat-widget .chat-message.user{background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff;align-self:flex-end;box-shadow:0 4px 12px rgba(133,79,255,.2);border:none}
    .n8n-chat-widget .chat-message.bot{background:var(--chat--color-background);border:1px solid rgba(133,79,255,.2);color:var(--chat--color-font);align-self:flex-start;box-shadow:0 4px 12px rgba(0,0,0,.05)}
    .n8n-chat-widget .chat-input{padding:16px;background:var(--chat--color-background);border-top:1px solid rgba(133,79,255,.1);display:flex;gap:8px;align-items:center}
    .n8n-chat-widget .chat-input textarea{flex:1;padding:12px;border:1px solid rgba(133,79,255,.2);border-radius:8px;background:var(--chat--color-background);color:var(--chat--color-font);resize:none;font-family:inherit;font-size:14px;max-height:400px;overflow-y:auto}
    .n8n-chat-widget .chat-input textarea::placeholder{color:var(--chat--color-font);opacity:.6}
    .n8n-chat-widget .chat-input button{background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff;border:none;border-radius:8px;padding:0 20px;cursor:pointer;transition:transform .2s;font-family:inherit;font-weight:500;height:40px}
    .n8n-chat-widget .chat-input button:hover{transform:scale(1.05)}
    .n8n-chat-widget .chat-toggle{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:12px;background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(133,79,255,.3);z-index:999;transition:transform .3s;display:flex;align-items:center;justify-content:center}
    .n8n-chat-widget .chat-toggle.position-left{right:auto;left:20px}
    .n8n-chat-widget .chat-toggle:hover{transform:scale(1.05)}
    .n8n-chat-widget .chat-footer{padding:8px;text-align:center;background:var(--chat--color-background);border-top:1px solid rgba(133,79,255,.1)}
    .n8n-chat-widget .chat-footer a{color:var(--chat--color-primary);text-decoration:none;font-size:12px;opacity:.8;transition:opacity .2s;font-family:inherit}
    .n8n-chat-widget .chat-footer a:hover{opacity:1}
    .n8n-chat-widget .privacy-checkbox{display:flex;justify-content:center;align-items:center;text-align:left;margin-top:1.5rem;margin-bottom:20px;font-family:inherit}
    .n8n-chat-widget .privacy-checkbox input[type="checkbox"]{display:none}
    .n8n-chat-widget .privacy-checkbox label{position:relative;padding-left:28px;font-size:14px;color:#000;cursor:pointer;max-width:300px;font-weight:400;opacity:.7}
    .n8n-chat-widget .privacy-checkbox label::before{content:"";position:absolute;left:0;top:2px;width:18px;height:18px;border:1.5px solid rgba(133,79,255,.6);border-radius:4px;background-color:#fff;transition:all .2s ease;box-shadow:0 2px 4px rgba(133,79,255,.1)}
    .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::before{background:linear-gradient(135deg,var(--chat--color-primary),var(--chat--color-secondary));border-color:transparent}
    .n8n-chat-widget .privacy-checkbox input[type="checkbox"]:checked + label::after{content:"✔";position:absolute;left:4px;top:4px;font-size:12px;color:#fff}
    /* Mic pequeño como en la captura */
    .n8n-chat-widget .mic-btn{background:#fff;border:1px solid rgba(133,79,255,.25);border-radius:8px;height:40px;padding:0 10px;display:flex;align-items:center;justify-content:center}
    .n8n-chat-widget .mic-btn.active{border-color:#ff3b3b;box-shadow:0 0 0 2px rgba(255,59,59,.15) inset}
    .n8n-chat-widget .mic-btn .message-icon{width:20px;height:20px}
  `;

  // font + styles
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
  document.head.appendChild(fontLink);

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // default config
  const defaultConfig = {
    webhook:{url:'',route:''},
    branding:{
      logo:'',name:'',welcomeText:'',responseTimeText:'',
      poweredBy:{text:'Powered by AMARETIS AI',link:'https://www.amaretis.de'}
    },
    style:{primaryColor:'',secondaryColor:'',position:'right',backgroundColor:'#ffffff',fontColor:'#333333'}
  };

  const config = window.ChatWidgetConfig ?
    { webhook:{...defaultConfig.webhook,...window.ChatWidgetConfig.webhook},
      branding:{...defaultConfig.branding,...window.ChatWidgetConfig.branding},
      style:{...defaultConfig.style,...window.ChatWidgetConfig.style} } : defaultConfig;

  if (window.N8NChatWidgetInitialized) return;
  window.N8NChatWidgetInitialized = true;

  let currentSessionId = '';

  // ===== helpers (voz, corrección, merge, autoresize) =====
  function autoResize(el){
    const max = 400; // px
    el.style.height = 'auto';
    const newH = Math.min(el.scrollHeight, max);
    el.style.height = newH + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }

  // anti-repetición
  function collapseWordRepeats(text){
    return text.replace(/\b([A-Za-zÄÖÜäöüß\-']+)(\s+\1){1,}\b/gu,"$1");
  }
  function collapsePhraseRepeats(text){
    const pattern = (n)=>new RegExp(String.raw`\b((?:[A-Za-zÄÖÜäöüß\-']+\s+){${n-1}}[A-Za-zÄÖÜäöüß\-']+)(?:\s+\1){1,}\b`,"giu");
    let out=text; [4,3,2].forEach(n=>{ out = out.replace(pattern(n),"$1"); }); return out;
  }
  function trimInitialFillers(text){
    return text.replace(/^(?:\s*hallo[,.!?]?\s*){1,5}/i,"");
  }
  function smartMerge(base, addition){
    let merged = (base + " " + addition).replace(/\s+/g," ").trim();
    merged = collapseWordRepeats(merged);
    merged = collapsePhraseRepeats(merged);
    merged = trimInitialFillers(merged);
    return merged;
  }
  function correctGerman(raw){
    let text = (raw||"").replace(/\s+/g," ").trim();
    if(!text) return "";
    if(!/[.!?…]$/.test(text)) text += ".";
    text = text.replace(/(^|[.!?]\s+)([a-zäöüß])/g, (_,p1,p2)=>p1 + p2.toUpperCase());
    const conns = ["aber","jedoch","denn","sondern","allerdings","trotzdem","hingegen","wobei"];
    conns.forEach(w=>{
      const re = new RegExp(`\\s${w}\\s`,"gi");
      text = text.replace(re, (m)=> (/, \s*$/i.test(m.slice(0,2))? m : `, ${w} `));
    });
    return text.trim();
  }

  // ===== DOM =====
  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'n8n-chat-widget';
  widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
  widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
  widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
  widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

  const chatContainer = document.createElement('div');
  chatContainer.className = `chat-container${config.style.position==='left' ? ' position-left':''}`;

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
        <!-- Mic a la izquierda de Senden -->
        <button type="button" class="mic-btn" title="Nachricht diktieren" aria-pressed="false">
          <!-- Tu SVG base + contenido de micrófono -->
          <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#854fff"/><stop offset="100%" stop-color="#dd0c0d"/>
              </linearGradient>
            </defs>
            <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a1 1 0 1 0 2 0V9a1 1 0 1 0-2 0v3Zm12 0a1 1 0 1 0 2 0V9a1 1 0 1 0-2 0v3Zm-5 6v2a1 1 0 1 0 2 0v-2a7 7 0 0 0 6-7 1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 7Z" fill="url(#g1)"/>
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
  toggleButton.className = `chat-toggle${config.style.position==='left' ? ' position-left':''}`;
  toggleButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
    </svg>`;

  widgetContainer.appendChild(chatContainer);
  widgetContainer.appendChild(toggleButton);
  document.body.appendChild(widgetContainer);

  // refs
  const newChatBtn = chatContainer.querySelector('.new-chat-btn');
  const privacyCheckbox = chatContainer.querySelector('#datenschutz');
  const chatInterface = chatContainer.querySelector('.chat-interface');
  const closeButtons = chatContainer.querySelectorAll('.close-button');
  const messagesContainer = chatContainer.querySelector('.chat-messages');
  const textarea = chatContainer.querySelector('textarea');
  const sendButton = chatContainer.querySelector('button[type="submit"]');
  const micButton = chatContainer.querySelector('.mic-btn');

  // autoresize on input
  textarea.addEventListener('input', ()=>autoResize(textarea));
  // inicial
  autoResize(textarea);

  // open/close
  toggleButton.addEventListener('click', ()=>{
    chatContainer.classList.toggle('open');
    if(!chatContainer.classList.contains('open')) stopListening(true);
  });
  closeButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      chatContainer.classList.remove('open');
      stopListening(true);
    });
  });

  // privacy/new chat
  privacyCheckbox?.addEventListener('change', ()=> newChatBtn.disabled = !privacyCheckbox.checked);
  newChatBtn.addEventListener('click', ()=>{
    if(!privacyCheckbox.checked){ alert('Bitte akzeptieren Sie die Datenschutzerklärung.'); return; }
    currentSessionId = crypto.randomUUID();
    messagesContainer.innerHTML='';
    chatInterface.classList.add('active');
    textarea.focus();
  });

  // enviar demo (conecta tu webhook aquí)
  async function sendMessage(message){
    const userDiv = document.createElement('div');
    userDiv.className='chat-message user';
    userDiv.textContent=message;
    messagesContainer.appendChild(userDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // demo de respuesta
    const botDiv = document.createElement('div');
    botDiv.className='chat-message bot';
    botDiv.textContent='Danke für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.';
    messagesContainer.appendChild(botDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  sendButton.addEventListener('click', ()=>{
    const msg = textarea.value.trim();
    if(!msg) return;
    if(isListening) stopListening(); // volcamos y corregimos antes
    sendMessage(msg);
    textarea.value='';
    autoResize(textarea);
  });

  textarea.addEventListener('keypress', (e)=>{
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      const msg = textarea.value.trim();
      if(!msg) return;
      if(isListening) stopListening();
      sendMessage(msg);
      textarea.value='';
      autoResize(textarea);
    }
  });

  // ====== VOICE (solo volcar al desactivar) ======
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition, isListening=false, resultCursor=0, bufferText="";

  function startListening(){
    if(!SR){ alert("Spracherkennung wird in diesem Browser nicht unterstützt."); return; }
    recognition = new SR();
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    resultCursor = 0;
    bufferText = "";

    recognition.onresult = (event)=>{
      // No pintamos en textarea; acumulamos en buffer con merge + anti-repetición
      for(let i=resultCursor; i<event.results.length; i++){
        const res = event.results[i];
        // mejor alternativa simple: la más larga
        let best = res[0].transcript;
        if(recognition.maxAlternatives && res.length>1){
          best = [...res].map(a=>a.transcript).sort((a,b)=>b.length-a.length)[0] || best;
        }
        if(res.isFinal){
          bufferText = smartMerge(bufferText, best);
        }
        // si es interim, no hacemos nada (no se muestra)
      }
      resultCursor = event.results.length;
    };

    recognition.onerror = (e)=>{
      console.warn('Speech error:', e?.error || e);
      stopListening(); // volcamos lo que haya
    };

    recognition.onstart = ()=>{
      isListening = true;
      micButton.classList.add('active');
      micButton.setAttribute('aria-pressed','true');
    };

    recognition.onend = ()=>{
      // al finalizar (por sistema), volcamos texto corregido
      if(isListening) stopListening();
    };

    recognition.start();
  }

  function stopListening(silent){
    if(recognition){
      try{ recognition.stop(); }catch{}
    }
    isListening = false;
    micButton.classList.remove('active');
    micButton.setAttribute('aria-pressed','false');

    if(!silent){
      // volcamos buffer + corrección al textarea
      const merged = smartMerge(textarea.value, bufferText).trim();
      const finalText = correctGerman(merged);
      textarea.value = finalText;
      autoResize(textarea);
      // limpiamos buffer para la siguiente sesión
      bufferText = "";
    } else {
      bufferText = "";
    }
  }

  micButton.addEventListener('click', ()=>{
    if(isListening) stopListening();
    else startListening();
  });

})();
