(function() {
  // Create shadow root host
  const host = document.createElement('div');
  host.id = 'va-ext-host';
  Object.assign(host.style, { position: 'fixed', inset: '0', zIndex: 2147483647, pointerEvents: 'none' });
  const root = host.attachShadow({ mode: 'open' });
  document.documentElement.appendChild(host);

  // Helper to load a resource and return text
  const loadText = async (path) => {
    const url = chrome.runtime.getURL(path);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.text();
  };

  // Build UI inside shadow root
  const init = async () => {
    // Load CSS
    const [varsCss, baseCss, hudCss, panelCss, chatCss] = await Promise.all([
      loadText('css/variables.css'),
      loadText('css/base.css'),
      loadText('css/hud.css'),
      loadText('css/panel.css'),
      loadText('css/chat.css')
    ]);
    const style = document.createElement('style');
    style.textContent = `${varsCss}\n${baseCss}\n${hudCss}\n${panelCss}\n${chatCss}`;
    root.appendChild(style);

    // Root container for our overlay (allows pointer events)
    const container = document.createElement('div');
    Object.assign(container.style, { position: 'fixed', inset: '0', pointerEvents: 'none' });
    root.appendChild(container);

    // HUD markup
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `
      <button class=\"icon-btn\" aria-label=\"Pausar\" title=\"Pausar\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <rect x=\"6\" y=\"5\" width=\"4\" height=\"14\" rx=\"1.2\"></rect>\n          <rect x=\"14\" y=\"5\" width=\"4\" height=\"14\" rx=\"1.2\"></rect>\n        </svg>\n      </button>\n      <div class=\"timer\" aria-live=\"polite\">00:00</div>\n      <button class=\"icon-btn neutral chat-btn\" aria-label=\"Abrir chat\" title=\"Abrir chat\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <path d=\"M6.5 4h11A3.5 3.5 0 0 1 21 7.5v6A3.5 3.5 0 0 1 17.5 17H10l-4.2 3.15A1 1 0 0 1 4 19.33V17A3.5 3.5 0 0 1 2 13.5v-6A3.5 3.5 0 0 1 5.5 4h1Z\"/>\n        </svg>\n      </button>\n      <button class=\"icon-btn neutral\" id=\"insights-btn\" aria-label=\"Insights\" title=\"Insights\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <path d=\"M12 2c-3.87 0-7 3.13-7 7 0 2.56 1.32 4.79 3.31 6.05.43.27.69.75.69 1.26V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-.69c0-.51.26-.99.69-1.26A7.005 7.005 0 0 0 19 9c0-3.87-3.13-7-7-7zm-3 19h6v-1H9v1z\"></path>\n        </svg>\n      </button>\n      <button class=\"icon-btn\" aria-label=\"Configurações\" title=\"Configurações\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n          <path d=\"M12 8.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 1 0 12 8.75Zm7.5 3.25c0 .49-.05.97-.16 1.43l2.02 1.56-1.8 3.12-2.43-.94a7.88 7.88 0 0 1-2.48 1.43l-.37 2.58h-3.6l-.37-2.58a7.88 7.88 0 0 1-2.48-1.43l-2.43.94-1.8-3.12 2.02-1.56A7.9 7.9 0 0 1 4.5 12c0-.49.05-.97.16-1.43L2.64 9.01l1.8-3.12 2.43.94c.74-.6 1.58-1.08 2.48-1.43l.37-2.58h3.6l.37 2.58c.9.35 1.74.83 2.48 1.43l2.43-.94 1.8 3.12-2.02 1.56c.11.46.16.94.16 1.43Z\"/>\n        </svg>\n      </button>\n    `;
    container.appendChild(hud);

    // Panel containers
    const panelContainer = document.createElement('div');
    panelContainer.id = 'panel-container';
    panelContainer.style.pointerEvents = 'auto';

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.pointerEvents = 'auto';

    container.appendChild(panelContainer);
    container.appendChild(chatContainer);

    // Load components HTML
    const [panelHtml, chatHtml] = await Promise.all([
      loadText('components/Panel.html'),
      loadText('components/Chat.html')
    ]);
    panelContainer.innerHTML = panelHtml;
    chatContainer.innerHTML = chatHtml;

    // JS Logic: HUD timer & pause/play icon
    let seconds = 0;
    let isRunning = true;
    const timerEl = hud.querySelector('.timer');
    const pauseBtn = hud.querySelector('[aria-label="Pausar"]');
    const renderPauseIcon = () => {
      pauseBtn.title = isRunning ? 'Pausar' : 'Reproduzir';
      pauseBtn.setAttribute('aria-label', isRunning ? 'Pausar' : 'Reproduzir');
      pauseBtn.innerHTML = isRunning
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"></rect><rect x="14" y="5" width="4" height="14" rx="1.2"></rect></svg>`
        : `<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5v14l10-7-10-7z\"></path></svg>`;
    };
    renderPauseIcon();
    setInterval(() => {
      if (!isRunning) return;
      seconds++;
      const m = String(Math.floor(seconds/60)).padStart(2,'0');
      const s = String(seconds%60).padStart(2,'0');
      if (timerEl) timerEl.textContent = `${m}:${s}`;
    }, 1000);
    pauseBtn.addEventListener('click', () => { isRunning = !isRunning; renderPauseIcon(); });

    // Toggle handlers
    const chatBtn = hud.querySelector('.chat-btn');
    const insightsBtn = hud.querySelector('#insights-btn');
    const settingsBtn = hud.querySelector('[aria-label="Configurações"]');

    settingsBtn?.addEventListener('click', () => {
      window.open('http://localhost:3000/dashboard', '_blank');
    });

    const wireChatSend = () => {
      const input = chatContainer.querySelector('.chat-input');
      const sendBtn = chatContainer.querySelector('.send-btn');
      const messages = chatContainer.querySelector('#chat-messages');
      if (!input || !sendBtn || !messages) return;
      if (sendBtn._bound) return; sendBtn._bound = true;
      
      // Histórico de conversação
      let conversationHistory = [];
      
      // Função para converter Markdown em HTML
      const parseMarkdown = (text) => {
        let html = text;
        
        // Code blocks (```language\ncode\n```
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
        });
        
        // Inline code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold (**text** ou __text__)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic (*text* ou _text_)
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Headers (# text)
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        
        // Lists
        html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
      };
      
      // Função para animar o texto como streaming
      const streamText = (element, text, speed = 45) => {
        return new Promise((resolve) => {
          let index = 0;
          element.textContent = '';
          let displayText = '';
          
          const interval = setInterval(() => {
            if (index < text.length) {
              displayText += text[index];
              element.innerHTML = parseMarkdown(displayText);
              index++;
              messages.scrollTop = messages.scrollHeight;
            } else {
              clearInterval(interval);
              resolve();
            }
          }, speed);
        });
      };
      
      const send = async () => {
        const text = input.value.trim();
        if (!text) return;
        
        // Adiciona mensagem do usuário
        const user = document.createElement('div');
        user.className = 'message user';
        user.innerHTML = `<div class="message-bubble"></div>`;
        user.querySelector('.message-bubble').textContent = text;
        messages.appendChild(user);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        
        // Adiciona mensagem do usuário ao histórico
        conversationHistory.push({
          role: 'user',
          parts: [{ text: text }]
        });
        
        // Adiciona indicador de carregamento
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message assistant';
        loadingMsg.innerHTML = `<div class="message-bubble">Pensando...</div>`;
        messages.appendChild(loadingMsg);
        messages.scrollTop = messages.scrollHeight;
        
        try {
          // Chama a API do Gemini com system instruction
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
            method: 'POST',
            headers: {
              'x-goog-api-key': 'AIzaSyDqyOUEHV0Lk0ZginSkXPBZlD3yAPAuHTM', 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{
                  text: `Você é um assistente de vendas inteligente chamado Venda.AI. Seu objetivo é ajudar vendedores a melhorar seu desempenho, fornecendo insights, dicas e respondendo perguntas sobre técnicas de vendas, negociação e relacionamento com clientes.

Seja sempre:
- Profissional e prestativo
- Objetivo e direto nas respostas
- Focado em vendas e relacionamento comercial
- Encorajador e motivacional

Evite:
- Respostas muito longas
- Assuntos não relacionados a vendas
- Linguagem informal demais`
                }]
              },
              contents: conversationHistory
            })
          });
          
          if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
          }
          
          const data = await response.json();
          const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua pergunta.';
          
          // Adiciona resposta do modelo ao histórico
          conversationHistory.push({
            role: 'model',
            parts: [{ text: botResponse }]
          });
          
          // Remove indicador de carregamento
          loadingMsg.remove();
          
          // Adiciona resposta do assistente com animação de streaming
          const bot = document.createElement('div');
          bot.className = 'message assistant';
          bot.innerHTML = `<div class="message-bubble"></div>`;
          messages.appendChild(bot);
          
          const bubble = bot.querySelector('.message-bubble');
          await streamText(bubble, botResponse);
          
        } catch (error) {
          console.error('Erro ao chamar API Gemini:', error);
          loadingMsg.querySelector('.message-bubble').textContent = 'Erro ao processar sua pergunta. Tente novamente.';
          // Remove a última mensagem do histórico em caso de erro
          conversationHistory.pop();
        }
      };
      
      sendBtn.addEventListener('click', send);
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
    };

    const repositionPanels = () => {
      const hudRect = hud.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gap = 12; const margin = 8;
      const place = (containerEl) => {
        if (!containerEl.classList.contains('active')) return;
        const panelEl = containerEl.querySelector('.panel');
        if (!panelEl) return;
        const rect = panelEl.getBoundingClientRect();
        const panelW = rect.width; const panelH = rect.height;
        const hudCenterX = hudRect.left + hudRect.width/2;
        let left = hudCenterX - panelW/2; left = Math.max(margin, Math.min(left, vw - panelW - margin));
        let top = hudRect.bottom + gap; if (top + panelH + margin > vh) { top = Math.max(margin, hudRect.top - panelH - gap); }
        containerEl.style.left = left + 'px';
        containerEl.style.top = top + 'px';
      };
      place(chatContainer); place(panelContainer);
    };

    // Button toggles
    chatBtn?.addEventListener('click', () => {
      const isOpen = chatContainer.classList.contains('active');
      if (isOpen) {
        chatContainer.classList.remove('active');
        chatBtn.classList.remove('is-active');
      } else {
        chatContainer.classList.add('active');
        panelContainer.classList.remove('active');
        chatBtn.classList.add('is-active');
        insightsBtn?.classList.remove('is-active');
        wireChatSend(); repositionPanels();
      }
    });

    insightsBtn?.addEventListener('click', () => {
      const isOpen = panelContainer.classList.contains('active');
      if (isOpen) {
        panelContainer.classList.remove('active');
        insightsBtn.classList.remove('is-active');
      } else {
        panelContainer.classList.add('active');
        chatContainer.classList.remove('active');
        insightsBtn.classList.add('is-active');
        chatBtn?.classList.remove('is-active');
        repositionPanels();
      }
    });

    // Drag HUD across screen and save position
    let dragging = false, shiftX = 0, shiftY = 0;
    hud.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return; // don't start drag from buttons
      const rect = hud.getBoundingClientRect();
      hud.style.transform = '';
      hud.style.left = rect.left + 'px'; hud.style.top = rect.top + 'px';
      shiftX = e.clientX - rect.left; shiftY = e.clientY - rect.top; dragging = true; hud.classList.add('dragging');
      try { hud.setPointerCapture(e.pointerId); } catch {}
      const move = (ev) => {
        if (!dragging) return; const vw = innerWidth; const vh = innerHeight; const r = hud.getBoundingClientRect();
        let left = ev.clientX - shiftX; let top = ev.clientY - shiftY;
        const maxLeft = vw - r.width; const maxTop = vh - r.height;
        left = Math.min(Math.max(0, left), Math.max(0, maxLeft));
        top = Math.min(Math.max(0, top), Math.max(0, maxTop));
        hud.style.left = left + 'px'; hud.style.top = top + 'px';
        repositionPanels();
      };
      const up = () => {
        dragging = false; hud.classList.remove('dragging');
        window.removeEventListener('pointermove', move);
        const r = hud.getBoundingClientRect();
        try { localStorage.setItem('va:hud-pos', JSON.stringify({ left: r.left, top: r.top })); } catch {}
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
    });

    // Restore saved HUD position and reposition panels
    try {
      const saved = localStorage.getItem('va:hud-pos');
      if (saved) {
        const pos = JSON.parse(saved);
        if (typeof pos.left === 'number' && typeof pos.top === 'number') {
          hud.style.transform = '';
          hud.style.left = pos.left + 'px';
          hud.style.top = pos.top + 'px';
        }
      }
    } catch {}

    // Ensure panels are placed initially
    repositionPanels();
    window.addEventListener('resize', repositionPanels);

    // Allow clicking inside our overlay
    hud.style.pointerEvents = 'auto';
  };

  init().catch(err => console.error('[Venda.AI HUD] init error:', err));
})();
