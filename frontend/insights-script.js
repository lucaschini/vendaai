// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let isRecording = false;
let isPaused = false;
let timerInterval = null;
let elapsedSeconds = 0;
let audioStream = null;

// ============================================
// ELEMENTOS DO DOM
// ============================================
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const insightsCard = document.getElementById("insightsCard");
const insightsList = document.getElementById("insightsList");
const actionsList = document.getElementById("actionsList");
const audioBtn = document.getElementById("audioBtn");
const pauseBtn = document.getElementById("pauseBtn");
const minimizeCardBtn = document.getElementById("minimizeCardBtn");
const expandBtn = document.getElementById("expandBtn");

// ============================================
// ABRIR/FECHAR CARD DE INSIGHTS
// ============================================
menuBtn.addEventListener("click", toggleInsightsCard);
overlay.addEventListener("click", closeInsightsCard);

function toggleInsightsCard() {
  insightsCard.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeInsightsCard() {
  insightsCard.classList.remove("active");
  overlay.classList.remove("active");
}

// ============================================
// CONTROLE DE ÁUDIO
// ============================================
audioBtn.addEventListener("click", toggleAudio);

async function toggleAudio() {
  if (!isRecording) {
    await startRecording();
  } else {
    stopRecording();
  }
}

async function startRecording() {
  try {
    // ==========================================
    // 🔴 BACKEND: Iniciar captura de áudio
    // ==========================================
    // Aqui você captura o áudio da videochamada
    // Pode usar getUserMedia para capturar o microfone
    // Ou use a API da plataforma de videochamada (Meet, Zoom, etc)

    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // ==========================================
    // 🔴 BACKEND/IA: Enviar áudio para transcrição
    // ==========================================
    // Exemplo de envio de chunks de áudio para a API
    /*
        const mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                // Enviar chunk de áudio para o backend
                await fetch('https://sua-api.com/transcribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'audio/webm',
                        'Authorization': 'Bearer SEU_TOKEN'
                    },
                    body: event.data
                });
            }
        };

        mediaRecorder.start(1000); // Captura chunks a cada 1 segundo
        */

    isRecording = true;
    audioBtn.style.background = "rgba(234, 67, 53, 0.3)";
    audioBtn.style.color = "#ea4335";

    startTimer();

    // ==========================================
    // 🔴 IA: Iniciar análise em tempo real
    // ==========================================
    // Conectar com WebSocket para receber insights em tempo real
    /*
        const ws = new WebSocket('wss://sua-api.com/insights');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'insight') {
                addInsight(data.content);
            } else if (data.type === 'action') {
                addAction(data.content, data.icon);
            }
        };
        */

    console.log("Recording started");
  } catch (error) {
    console.error("Error starting recording:", error);
    alert("Erro ao iniciar captura de áudio. Verifique as permissões.");
  }
}

function stopRecording() {
  // ==========================================
  // 🔴 BACKEND: Parar captura de áudio
  // ==========================================
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }

  isRecording = false;
  audioBtn.style.background = "rgba(66, 133, 244, 0.2)";
  audioBtn.style.color = "#4285f4";

  stopTimer();

  console.log("Recording stopped");
}

// ============================================
// CONTROLE DE PAUSA
// ============================================
pauseBtn.addEventListener("click", togglePause);

function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;

    // ==========================================
    // 🔴 BACKEND: Pausar processamento da IA
    // ==========================================
    /*
        await fetch('https://sua-api.com/pause', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN'
            }
        });
        */
  } else {
    pauseBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
        `;

    // ==========================================
    // 🔴 BACKEND: Retomar processamento da IA
    // ==========================================
    /*
        await fetch('https://sua-api.com/resume', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN'
            }
        });
        */
  }
}

// ============================================
// TIMER
// ============================================
function startTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      elapsedSeconds++;
      updateTimerDisplay();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timerElement = document.querySelector(".timer");
  timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ============================================
// ADICIONAR INSIGHTS E AÇÕES DINAMICAMENTE
// ============================================
function addInsight(text) {
  const li = document.createElement("li");
  li.textContent = text;
  li.style.opacity = "0";
  insightsList.appendChild(li);

  // Animação de entrada
  setTimeout(() => {
    li.style.transition = "opacity 0.3s";
    li.style.opacity = "1";
  }, 10);
}

function addAction(text, iconType = "suggest") {
  const li = document.createElement("li");

  const iconColors = {
    search: "#4285f4",
    suggest: "#34a853",
    warning: "#fbbc05",
  };

  const icons = {
    search: "🔍",
    suggest: "💡",
    warning: "⚠️",
  };

  li.innerHTML = `
        <span class="action-icon ${iconType}" style="color: ${iconColors[iconType]}">${icons[iconType]}</span>
        <span>${text}</span>
    `;

  li.style.opacity = "0";
  actionsList.appendChild(li);

  // Animação de entrada
  setTimeout(() => {
    li.style.transition = "opacity 0.3s";
    li.style.opacity = "1";
  }, 10);
}

// ============================================
// MINIMIZAR E EXPANDIR CARD
// ============================================
minimizeCardBtn.addEventListener("click", () => {
  closeInsightsCard();
});

expandBtn.addEventListener("click", () => {
  insightsCard.style.maxWidth = "90%";
  insightsCard.style.maxHeight = "90vh";
});

// ============================================
// 🔴 SIMULAÇÃO: Carregar insights iniciais
// ============================================
// Esta função simula o recebimento de insights da IA
// Em produção, isso viria do backend/WebSocket
function loadInitialInsights() {
  // Simular delay de carregamento
  setTimeout(() => {
    addInsight("Você apresentou o [NOME DO PRODUTO] e suas funcionalidades");
    addInsight(
      "O possível cliente mostrou interesse, porém o preço pode ser uma objeção",
    );
    addInsight("O possível cliente explicou a situação atual da empresa dele");
  }, 500);

  setTimeout(() => {
    addAction("Pesquisar a empresa dele na internet", "search");
    addAction("Sugerir perguntas para continuar", "suggest");
    addAction("Quebra de objeções", "warning");
  }, 1000);
}

// ==========================================
// 🔴 BACKEND: Buscar insights do servidor
// ==========================================
// Em produção, você faria algo assim:
/*
async function fetchInsightsFromAPI() {
    try {
        const response = await fetch('https://sua-api.com/insights', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        // Limpar listas
        insightsList.innerHTML = '';
        actionsList.innerHTML = '';

        // Adicionar insights
        data.insights.forEach(insight => {
            addInsight(insight.text);
        });

        // Adicionar ações
        data.actions.forEach(action => {
            addAction(action.text, action.iconType);
        });

    } catch (error) {
        console.error('Error fetching insights:', error);
    }
}
*/

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Carregar insights iniciais (simulação)
  loadInitialInsights();

  // Em produção, você chamaria:
  // fetchInsightsFromAPI();

  console.log("VendAI Insights initialized");
});
