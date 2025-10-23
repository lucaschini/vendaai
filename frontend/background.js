// ============================================
// BACKGROUND SERVICE WORKER
// ============================================

console.log("VendAI Background Service Worker loaded");

// ============================================
// BACKGROUND SERVICE WORKER
// ============================================

console.log("VendAI Background Service Worker loaded");

// ============================================
// INSTALAÇÃO DA EXTENSÃO
// ============================================
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("VendAI installed for the first time");

    // Abrir página de boas-vindas ou configuração inicial
    chrome.tabs.create({
      url: chrome.runtime.getURL("login.html"),
    });

    // Configurações padrão
    chrome.storage.sync.set({
      "vendai-settings": {
        language: "pt",
        transparency: true,
        layout: "fixo",
        textSize: 14,
        notifications: true,
      },
      "vendai-ai-settings": {
        productDescription: "",
        creativity: 50,
        tone: "professional",
        detailLevel: "moderate",
        focus: {
          objections: true,
          interest: true,
          painPoints: true,
          competition: false,
        },
      },
    });
  } else if (details.reason === "update") {
    console.log(
      "VendAI updated to version",
      chrome.runtime.getManifest().version,
    );
  }
});

// ============================================
// ESCUTAR MENSAGENS
// ============================================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);

  if (request.action === "audioChunk") {
    // ==========================================
    // 🔴 BACKEND: Processar chunk de áudio
    // ==========================================
    handleAudioChunk(request.data);
    sendResponse({ success: true });
  }

  if (request.action === "startRecording") {
    // Iniciar gravação
    startRecording();
    sendResponse({ success: true });
  }

  if (request.action === "stopRecording") {
    // Parar gravação
    stopRecording();
    sendResponse({ success: true });
  }

  if (request.action === "getSettings") {
    // Buscar configurações
    getSettings(request.type).then((settings) => {
      sendResponse({ settings: settings });
    });
    return true; // Mantém o canal aberto para resposta assíncrona
  }

  if (request.action === "saveSettings") {
    // Salvar configurações
    saveSettings(request.type, request.settings).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  return true;
});

// ============================================
// PROCESSAR ÁUDIO
// ============================================
async function handleAudioChunk(audioData) {
  // ==========================================
  // 🔴 BACKEND/IA: Enviar áudio para transcrição
  // ==========================================
  /*
    try {
        const formData = new FormData();
        formData.append('audio', audioData);

        const response = await fetch('https://sua-api.com/transcribe', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN'
            },
            body: formData
        });

        const data = await response.json();

        // Enviar transcrição de volta para o content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'transcriptionResult',
                    text: data.text,
                    timestamp: data.timestamp
                });
            }
        });

        // Processar com IA para gerar insights
        processWithAI(data.text);

    } catch (error) {
        console.error('Error processing audio:', error);
    }
    */

  console.log("Audio chunk received:", audioData);
}

// ============================================
// PROCESSAR COM IA
// ============================================
async function processWithAI(transcription) {
  // ==========================================
  // 🔴 IA: Analisar transcrição e gerar insights
  // ==========================================
  /*
    try {
        const response = await fetch('https://sua-api.com/ai/analyze', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: transcription,
                context: {
                    // Contexto adicional da reunião
                }
            })
        });

        const insights = await response.json();

        // Enviar insights para o content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'newInsight',
                    insights: insights
                });
            }
        });

    } catch (error) {
        console.error('Error processing with AI:', error);
    }
    */
}

// ============================================
// GERENCIAR CONFIGURAÇÕES
// ============================================
async function getSettings(type) {
  return new Promise((resolve) => {
    const key = type === "ai" ? "vendai-ai-settings" : "vendai-settings";

    chrome.storage.sync.get([key], (result) => {
      resolve(result[key] || {});
    });
  });
}

async function saveSettings(type, settings) {
  return new Promise((resolve) => {
    const key = type === "ai" ? "vendai-ai-settings" : "vendai-settings";

    chrome.storage.sync.set({ [key]: settings }, () => {
      console.log("Settings saved:", settings);
      resolve();
    });
  });
}

// ============================================
// GRAVAÇÃO DE ÁUDIO
// ============================================
let recordingStream = null;
let mediaRecorder = null;

async function startRecording() {
  try {
    // ==========================================
    // 🔴 CAPTURA: Obter stream de áudio
    // ==========================================
    // Nota: Em extensões, você pode precisar de permissões especiais
    // para capturar áudio da aba
    /*
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordingStream = stream;

        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm'
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                handleAudioChunk(event.data);
            }
        };

        mediaRecorder.start(1000); // Chunks de 1 segundo
        console.log('Recording started');
        */
  } catch (error) {
    console.error("Error starting recording:", error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    console.log("Recording stopped");
  }

  if (recordingStream) {
    recordingStream.getTracks().forEach((track) => track.stop());
    recordingStream = null;
  }
}

// ============================================
// NOTIFICAÇÕES
// ============================================
function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title,
    message: message,
    priority: 2,
  });
}

// ============================================
// MONITORAR ABAS
// ============================================
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Detectar quando usuário entra em uma videochamada
  if (changeInfo.status === "complete") {
    const url = tab.url || "";

    if (
      url.includes("meet.google.com") ||
      url.includes("zoom.us") ||
      url.includes("teams.microsoft.com")
    ) {
      console.log("Video call detected on:", url);

      // Notificar usuário (opcional)
      showNotification(
        "VendAI Pronto",
        "Extensão ativa para esta videochamada",
      );
    }
  }
});

// ============================================
// MANTER SERVICE WORKER VIVO
// ============================================
// Service workers podem ser desativados após inatividade
// Este código mantém ele ativo
let keepAliveInterval;

function keepAlive() {
  keepAliveInterval = setInterval(() => {
    console.log("Keeping service worker alive");
  }, 20000); // A cada 20 segundos
}

keepAlive();

// ============================================
// LIMPAR RECURSOS AO DESLIGAR
// ============================================
self.addEventListener("beforeunload", () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  stopRecording();
});
