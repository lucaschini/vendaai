// ============================================
// CONTENT SCRIPT - Injetado nas páginas de videochamada
// ============================================

console.log("VendAI Content Script loaded");

let currentOpenPanel = null;

// ============================================
// CRIAR CONTAINER PRINCIPAL DA EXTENSÃO
// ============================================
function createVendAIContainer() {
  // Verificar se já existe
  if (document.getElementById("vendai-root")) {
    return;
  }

  const container = document.createElement("div");
  container.id = "vendai-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "999999";

  document.body.appendChild(container);
}

// ============================================
// CARREGAR E EXIBIR PAINEL
// ============================================
function loadPanel(panelName) {
  const panelFiles = {
    openInsights: "insights.html",
    openChat: "chat.html",
    openConfig: "configuracoes.html",
    openAIConfig: "configuracoes-ia.html",
  };

  const htmlFile = panelFiles[panelName];
  if (!htmlFile) return;

  // Fechar painel atual se houver
  if (currentOpenPanel) {
    closeCurrentPanel();
  }

  // Criar iframe para o painel
  const iframe = document.createElement("iframe");
  iframe.id = "vendai-panel";
  iframe.src = chrome.runtime.getURL(htmlFile);
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.pointerEvents = "all";
  iframe.style.background = "transparent";

  const container = document.getElementById("vendai-root");
  if (container) {
    container.appendChild(iframe);
    currentOpenPanel = iframe;
  }
}

// ============================================
// FECHAR PAINEL ATUAL
// ============================================
function closeCurrentPanel() {
  if (currentOpenPanel) {
    currentOpenPanel.remove();
    currentOpenPanel = null;
  }
}

// ============================================
// ESCUTAR MENSAGENS DO POPUP
// ============================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);

  if (request.action) {
    createVendAIContainer();
    loadPanel(request.action);
    sendResponse({ success: true });
  }

  return true;
});

// ============================================
// CRIAR BOTÃO FLUTUANTE (OPCIONAL)
// ============================================
function createFloatingButton() {
  const button = document.createElement("button");
  button.id = "vendai-floating-btn";
  button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

  // Estilos do botão
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.width = "56px";
  button.style.height = "56px";
  button.style.borderRadius = "50%";
  button.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  button.style.border = "none";
  button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  button.style.cursor = "pointer";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.zIndex = "999998";
  button.style.transition = "all 0.3s";

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.1)";
    button.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  });

  button.addEventListener("click", () => {
    createVendAIContainer();
    loadPanel("openInsights");
  });

  document.body.appendChild(button);
}

// ============================================
// DETECTAR ÁUDIO DA VIDEOCHAMADA
// ============================================
function setupAudioCapture() {
  // ==========================================
  // 🔴 CAPTURA DE ÁUDIO
  // ==========================================
  // Aqui você implementaria a lógica para capturar
  // o áudio da videochamada
  /*
    // Exemplo: Capturar áudio do microfone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // Enviar chunk de áudio para o background script
                    chrome.runtime.sendMessage({
                        action: 'audioChunk',
                        data: event.data
                    });
                }
            };

            mediaRecorder.start(1000); // Chunks de 1 segundo
        })
        .catch(error => {
            console.error('Error capturing audio:', error);
        });
    */
}

// ============================================
// DETECTAR INÍCIO DE REUNIÃO
// ============================================
function detectMeetingStart() {
  // Detectar quando uma reunião começa
  // Isso varia por plataforma (Meet, Zoom, Teams)

  const url = window.location.href;

  if (url.includes("meet.google.com")) {
    // Lógica específica para Google Meet
    console.log("Google Meet detected");
  } else if (url.includes("zoom.us")) {
    // Lógica específica para Zoom
    console.log("Zoom detected");
  } else if (url.includes("teams.microsoft.com")) {
    // Lógica específica para Teams
    console.log("Teams detected");
  }
}

// ============================================
// ATALHOS DE TECLADO GLOBAIS
// ============================================
document.addEventListener("keydown", (e) => {
  // Alt + V para abrir insights
  if (e.altKey && e.key === "v") {
    e.preventDefault();
    createVendAIContainer();
    loadPanel("openInsights");
  }

  // Alt + C para abrir chat
  if (e.altKey && e.key === "c") {
    e.preventDefault();
    createVendAIContainer();
    loadPanel("openChat");
  }

  // ESC para fechar painel
  if (e.key === "Escape" && currentOpenPanel) {
    e.preventDefault();
    closeCurrentPanel();
  }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
window.addEventListener("load", () => {
  console.log("VendAI initialized on:", window.location.href);

  // Criar container
  createVendAIContainer();

  // Criar botão flutuante (opcional - remova se não quiser)
  createFloatingButton();

  // Detectar início de reunião
  detectMeetingStart();

  // Setup de captura de áudio (comentado por padrão)
  // setupAudioCapture();
});
