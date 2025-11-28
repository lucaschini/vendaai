// ============================================
// ELEMENTOS DO DOM
// ============================================
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const chatCard = document.getElementById("chatCard");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const minimizeBtn = document.getElementById("minimizeBtn");

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let conversationHistory = [];
let isAITyping = false;

// ============================================
// ABRIR/FECHAR CARD DE CHAT
// ============================================
menuBtn.addEventListener("click", toggleChatCard);
overlay.addEventListener("click", closeChatCard);
minimizeBtn.addEventListener("click", closeChatCard);

function toggleChatCard() {
  chatCard.classList.toggle("active");
  overlay.classList.toggle("active");

  if (chatCard.classList.contains("active")) {
    chatInput.focus();
    scrollToBottom();
  }
}

function closeChatCard() {
  chatCard.classList.remove("active");
  overlay.classList.remove("active");
}

// ============================================
// ENVIAR MENSAGEM
// ============================================
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = chatInput.value.trim();

  if (!message || isAITyping) return;

  // Adicionar mensagem do usuário
  addMessage(message, "user");

  // Limpar input
  chatInput.value = "";

  // Salvar no histórico
  conversationHistory.push({
    role: "user",
    content: message,
    timestamp: new Date().toISOString(),
  });

  // Mostrar indicador de digitação
  showTypingIndicator();

  // ==========================================
  // 🔴 BACKEND/IA: Enviar mensagem para a IA
  // ==========================================
  /*
    try {
        const response = await fetch('https://sua-api.com/chat', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemPrompt: "Você é um assistente de vendas chamado VendAI. Responda de forma direta, objetiva e prática, evitando explicações longas ou redundantes.",
                message: message,
                conversationHistory: conversationHistory,
                context: {
                    // Contexto da reunião atual
                    meetingDuration: '00:41',
                    participants: ['User', 'Client'],
                    insights: [] // Insights gerados até o momento
                }
            })
        });

        const data = await response.json();

        // Esconder indicador e mostrar resposta
        hideTypingIndicator();
        addMessage(data.response, 'ai');

        // Salvar resposta no histórico
        conversationHistory.push({
            role: 'ai',
            content: data.response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'ai');
    }
    */

  // Por enquanto, simular resposta da IA
  setTimeout(() => {
    hideTypingIndicator();
    const aiResponse = generateAIResponse(message);
    addMessage(aiResponse, "ai");

    conversationHistory.push({
      role: "ai",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });
  }, 1500);
}

// ============================================
// ADICIONAR MENSAGEM AO CHAT
// ============================================
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const bubbleDiv = document.createElement("div");
  bubbleDiv.className = "message-bubble";
  bubbleDiv.textContent = text;

  const timeSpan = document.createElement("div");
  timeSpan.className = "message-time";
  timeSpan.textContent = getCurrentTime();

  messageDiv.appendChild(bubbleDiv);
  bubbleDiv.appendChild(timeSpan);

  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

// ============================================
// INDICADOR DE DIGITAÇÃO
// ============================================
function showTypingIndicator() {
  isAITyping = true;
  typingIndicator.classList.add("active");
  sendBtn.disabled = true;
  scrollToBottom();
}

function hideTypingIndicator() {
  isAITyping = false;
  typingIndicator.classList.remove("active");
  sendBtn.disabled = false;
}

// ============================================
// HELPERS
// ============================================
function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================================
// SIMULAÇÃO: Gerar resposta da IA
// ============================================
// Esta função simula respostas da IA
// Em produção, as respostas virão da API
/*
function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  // Respostas baseadas em palavras-chave
  if (lowerMessage.includes("churn")) {
    return "Churn é a taxa de clientes que cancelam ou deixam de usar um produto/serviço em certo período. É uma métrica importante para entender a saúde do negócio.";
  }

  if (lowerMessage.includes("objeção") || lowerMessage.includes("preço")) {
    return "Para lidar com objeções de preço, tente: 1) Reforçar o valor e ROI do produto, 2) Comparar com custos de não resolver o problema, 3) Oferecer planos flexíveis de pagamento.";
  }

  if (lowerMessage.includes("fechamento") || lowerMessage.includes("fechar")) {
    return "Técnicas de fechamento eficazes: 1) Assumir a venda (when, not if), 2) Oferecer escolha entre opções, 3) Criar senso de urgência, 4) Resumir benefícios acordados.";
  }

  if (
    lowerMessage.includes("qualificação") ||
    lowerMessage.includes("qualificar")
  ) {
    return "Use o framework BANT para qualificar leads: Budget (orçamento), Authority (autoridade de decisão), Need (necessidade real), Timeline (prazo de decisão).";
  }

  // Resposta genérica
  return "Entendi sua pergunta. Como assistente de vendas, posso ajudar com técnicas de fechamento, qualificação de leads, gestão de objeções e estratégias de negociação. Como posso ajudar especificamente?";
} */

// ==========================================
// 🔴 BACKEND: Carregar histórico de chat
// ==========================================
async function loadChatHistory() {
  /*
    try {
        const response = await fetch('https://sua-api.com/chat/history', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            params: {
                meetingId: 'current-meeting-id',
                limit: 50
            }
        });

        const data = await response.json();

        // Limpar chat atual
        chatMessages.innerHTML = '';

        // Adicionar mensagens do histórico
        data.messages.forEach(msg => {
            addMessage(msg.content, msg.role);
        });

        conversationHistory = data.messages;

    } catch (error) {
        console.error('Error loading chat history:', error);
    }
    */
}

// ==========================================
// 🔴 IA: WebSocket para respostas em streaming
// ==========================================
// Para respostas mais naturais e em tempo real
/*
let ws = null;

function connectWebSocket() {
    ws = new WebSocket('wss://sua-api.com/chat/stream');

    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'start') {
            showTypingIndicator();
        } else if (data.type === 'chunk') {
            // Adicionar texto progressivamente
            updateLastMessage(data.content);
        } else if (data.type === 'end') {
            hideTypingIndicator();
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconectar após 3 segundos
        setTimeout(connectWebSocket, 3000);
    };
}

function sendMessageViaWebSocket(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'message',
            content: message,
            context: {
                conversationHistory: conversationHistory
            }
        }));
    }
}
*/

// ============================================
// ATALHOS DE TECLADO
// ============================================
document.addEventListener("keydown", (e) => {
  // ESC para fechar o chat
  if (e.key === "Escape" && chatCard.classList.contains("active")) {
    closeChatCard();
  }

  // Ctrl/Cmd + K para abrir chat
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggleChatCard();
  }
});

// ============================================
// MENSAGEM DE BOAS-VINDAS
// ============================================
function showWelcomeMessage() {
  addMessage(
    "Olá! Sou seu assistente de vendas VendAI. Estou aqui para ajudar durante sua reunião. Como posso ajudá-lo?",
    "ai",
  );
}

// ============================================
// LIMPAR CHAT
// ============================================
function clearChat() {
  chatMessages.innerHTML = "";
  conversationHistory = [];
  showWelcomeMessage();
}

// ============================================
// SALVAR HISTÓRICO LOCALMENTE
// ============================================
function saveChatHistory() {
  localStorage.setItem(
    "vendai-chat-history",
    JSON.stringify(conversationHistory),
  );
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar mensagem de boas-vindas
  showWelcomeMessage();

  // Carregar histórico se existir
  // loadChatHistory();

  // Conectar WebSocket se implementado
  // connectWebSocket();

  console.log("VendAI Chat initialized");

  // Salvar histórico periodicamente
  setInterval(saveChatHistory, 30000); // A cada 30 segundos
});
