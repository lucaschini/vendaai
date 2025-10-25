// ============================================
// ELEMENTOS DO DOM
// ============================================
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const aiConfigCard = document.getElementById("aiConfigCard");
const productDescription = document.getElementById("productDescription");
const charCount = document.getElementById("charCount");
const creativitySlider = document.getElementById("creativitySlider");
const creativityValue = document.getElementById("creativityValue");
const toneSelect = document.getElementById("toneSelect");
const detailLevelSelect = document.getElementById("detailLevelSelect");
const focusObjecciones = document.getElementById("focusObjecciones");
const focusInterest = document.getElementById("focusInterest");
const focusPainPoints = document.getElementById("focusPainPoints");
const focusCompetition = document.getElementById("focusCompetition");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const minimizeBtn = document.getElementById("minimizeBtn");

// ============================================
// CONFIGURAÇÕES PADRÃO
// ============================================
const defaultSettings = {
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
};

let aiSettings = { ...defaultSettings };

// ============================================
// ABRIR/FECHAR CARD
// ============================================
menuBtn.addEventListener("click", toggleAIConfigCard);
overlay.addEventListener("click", closeAIConfigCard);
minimizeBtn.addEventListener("click", closeAIConfigCard);

function toggleAIConfigCard() {
  aiConfigCard.classList.toggle("active");
  overlay.classList.toggle("active");

  if (aiConfigCard.classList.contains("active")) {
    productDescription.focus();
  }
}

function closeAIConfigCard() {
  aiConfigCard.classList.remove("active");
  overlay.classList.remove("active");
}

// ============================================
// CONTADOR DE CARACTERES
// ============================================
productDescription.addEventListener("input", (e) => {
  const length = e.target.value.length;
  const maxLength = 500;

  charCount.textContent = length;

  // Mudar cor se estiver próximo do limite
  if (length > maxLength * 0.9) {
    charCount.style.color = "#fbbc05";
  } else if (length === maxLength) {
    charCount.style.color = "#ea4335";
  } else {
    charCount.style.color = "rgba(255, 255, 255, 0.5)";
  }

  // Limitar caracteres
  if (length > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength);
    charCount.textContent = maxLength;
  }
});

// ============================================
// SLIDER DE CRIATIVIDADE
// ============================================
creativitySlider.addEventListener("input", (e) => {
  const value = e.target.value;
  creativityValue.textContent = value + "%";

  // Atualizar cor do valor baseado no nível
  if (value < 33) {
    creativityValue.parentElement.style.background = "rgba(66, 133, 244, 0.2)";
    creativityValue.style.color = "#4285f4";
  } else if (value < 67) {
    creativityValue.parentElement.style.background = "rgba(102, 126, 234, 0.2)";
    creativityValue.style.color = "#667eea";
  } else {
    creativityValue.parentElement.style.background = "rgba(118, 75, 162, 0.2)";
    creativityValue.style.color = "#764ba2";
  }
});

// ============================================
// CARREGAR CONFIGURAÇÕES SALVAS
// ============================================
function loadSettings() {
  // ==========================================
  // 🔴 BACKEND: Buscar configurações da IA
  // ==========================================
  /*
    async function fetchAISettings() {
        try {
            const response = await fetch('https://sua-api.com/ai/settings', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer SEU_TOKEN',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            aiSettings = data.settings;
            applySettings();

        } catch (error) {
            console.error('Error loading AI settings:', error);
            loadDefaultSettings();
        }
    }
    */

  // Por enquanto, carregar do localStorage
  const savedSettings = localStorage.getItem("vendai-ai-settings");

  if (savedSettings) {
    aiSettings = JSON.parse(savedSettings);
  }

  applySettings();
}

function applySettings() {
  productDescription.value = aiSettings.productDescription;
  charCount.textContent = aiSettings.productDescription.length;

  creativitySlider.value = aiSettings.creativity;
  creativityValue.textContent = aiSettings.creativity + "%";

  toneSelect.value = aiSettings.tone;
  detailLevelSelect.value = aiSettings.detailLevel;

  focusObjecciones.checked = aiSettings.focus.objections;
  focusInterest.checked = aiSettings.focus.interest;
  focusPainPoints.checked = aiSettings.focus.painPoints;
  focusCompetition.checked = aiSettings.focus.competition;
}

// ============================================
// SALVAR CONFIGURAÇÕES
// ============================================
saveBtn.addEventListener("click", saveSettings);

async function saveSettings() {
  // Coletar valores atuais
  aiSettings = {
    productDescription: productDescription.value.trim(),
    creativity: parseInt(creativitySlider.value),
    tone: toneSelect.value,
    detailLevel: detailLevelSelect.value,
    focus: {
      objections: focusObjecciones.checked,
      interest: focusInterest.checked,
      painPoints: focusPainPoints.checked,
      competition: focusCompetition.checked,
    },
  };

  // Validar se há pelo menos um foco selecionado
  const hasFocus = Object.values(aiSettings.focus).some(
    (value) => value === true,
  );

  if (!hasFocus) {
    showError("Selecione pelo menos uma área de foco para a análise.");
    return;
  }

  // ==========================================
  // 🔴 BACKEND: Salvar configurações da IA
  // ==========================================
  /*
    try {
        const response = await fetch('https://sua-api.com/ai/settings', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                settings: aiSettings,
                userId: 'USER_ID',
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('AI settings saved successfully');

            // ==========================================
            // 🔴 IA: Reconfigurar modelo com novos parâmetros
            // ==========================================
            // Após salvar, notificar a IA para usar as novas configurações
            await fetch('https://sua-api.com/ai/reconfigure', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer SEU_TOKEN',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: 'CURRENT_SESSION_ID',
                    settings: aiSettings
                })
            });

            showSuccess();
        } else {
            throw new Error('Failed to save settings');
        }

    } catch (error) {
        console.error('Error saving AI settings:', error);
        showError('Erro ao salvar configurações. Tente novamente.');
    }
    */

  // Por enquanto, salvar no localStorage
  localStorage.setItem("vendai-ai-settings", JSON.stringify(aiSettings));

  console.log("AI Settings saved:", aiSettings);
  showSuccess();

  // Fechar após salvar
  setTimeout(() => {
    closeAIConfigCard();
  }, 1500);
}

// ============================================
// RESTAURAR CONFIGURAÇÕES PADRÃO
// ============================================
resetBtn.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
    aiSettings = { ...defaultSettings };
    applySettings();

    // Disparar evento de input para atualizar o slider visualmente
    creativitySlider.dispatchEvent(new Event("input"));

    showInfo("Configurações restauradas para o padrão.");
  }
});

// ============================================
// MENSAGENS DE FEEDBACK
// ============================================
function showSuccess() {
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "✓ Salvo com sucesso!";
  saveBtn.style.background =
    "linear-gradient(135deg, #34a853 0%, #2d8e47 100%)";

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, 2000);
}

function showError(message) {
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "✗ " + message;
  saveBtn.style.background =
    "linear-gradient(135deg, #ea4335 0%, #d33828 100%)";

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, 3000);
}

function showInfo(message) {
  const originalText = resetBtn.textContent;
  resetBtn.textContent = message;
  resetBtn.style.background = "rgba(66, 133, 244, 0.3)";
  resetBtn.style.color = "#4285f4";

  setTimeout(() => {
    resetBtn.textContent = originalText;
    resetBtn.style.background = "rgba(255, 255, 255, 0.1)";
    resetBtn.style.color = "white";
  }, 2000);
}

// ============================================
// PREVIEW DAS CONFIGURAÇÕES EM TEMPO REAL
// ============================================
// Mostrar como a IA se comportará com as configurações atuais
function showSettingsPreview() {
  const creativity = parseInt(creativitySlider.value);
  const tone = toneSelect.value;

  let previewText = "";

  // Exemplo de como a IA responderá baseado nas configurações
  if (tone === "professional") {
    previewText = "Identifiquei que o cliente demonstrou interesse no produto.";
  } else if (tone === "friendly") {
    previewText =
      "Opa! Parece que o cliente está bem interessado no que você oferece!";
  } else if (tone === "formal") {
    previewText =
      "Foi identificado interesse significativo por parte do interlocutor.";
  } else if (tone === "casual") {
    previewText = "O cliente tá curtindo a proposta, hein!";
  }

  // Ajustar baseado na criatividade
  if (creativity < 33) {
    previewText +=
      " Sugiro continuar com a apresentação dos benefícios principais.";
  } else if (creativity > 67) {
    previewText +=
      " Que tal explorar uma história de caso de sucesso para reforçar o valor?";
  }

  console.log("Preview:", previewText);
}

// Atualizar preview quando mudar configurações
toneSelect.addEventListener("change", showSettingsPreview);
creativitySlider.addEventListener("change", showSettingsPreview);

// ==========================================
// 🔴 IA: Validar descrição do produto
// ==========================================
// Usar IA para sugerir melhorias na descrição
async function analyzeProductDescription() {
  const description = productDescription.value.trim();

  if (description.length < 50) {
    return; // Muito curto para analisar
  }

  /*
    try {
        const response = await fetch('https://sua-api.com/ai/analyze-description', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description
            })
        });

        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
            // Mostrar sugestões de melhoria
            console.log('Sugestões para descrição:', data.suggestions);
            // Você pode adicionar um tooltip ou modal com as sugestões
        }

    } catch (error) {
        console.error('Error analyzing description:', error);
    }
    */
}

// Analisar descrição após o usuário parar de digitar (debounce)
let descriptionTimeout;
productDescription.addEventListener("input", () => {
  clearTimeout(descriptionTimeout);
  descriptionTimeout = setTimeout(analyzeProductDescription, 2000);
});

// ============================================
// ATALHOS DE TECLADO
// ============================================
document.addEventListener("keydown", (e) => {
  // ESC para fechar
  if (e.key === "Escape" && aiConfigCard.classList.contains("active")) {
    closeAIConfigCard();
  }

  // Ctrl/Cmd + S para salvar
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    if (aiConfigCard.classList.contains("active")) {
      saveSettings();
    }
  }

  // Ctrl/Cmd + Shift + A para abrir configurações da IA
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "A") {
    e.preventDefault();
    toggleAIConfigCard();
  }
});

// ============================================
// DICAS CONTEXTUAIS
// ============================================
function showContextualHints() {
  // Adicionar dicas baseadas nas configurações atuais
  const creativity = parseInt(creativitySlider.value);

  if (creativity > 80) {
    console.log(
      "Dica: Alta criatividade pode gerar insights mais variados, mas menos previsíveis.",
    );
  } else if (creativity < 20) {
    console.log(
      "Dica: Baixa criatividade mantém respostas mais consistentes e conservadoras.",
    );
  }
}

// ============================================
// EXPORTAR/IMPORTAR CONFIGURAÇÕES
// ============================================
function exportSettings() {
  const dataStr = JSON.stringify(aiSettings, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "vendai-ai-config.json";
  link.click();

  URL.revokeObjectURL(url);
}

function importSettings(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      aiSettings = imported;
      applySettings();
      showSuccess("Configurações importadas com sucesso!");
    } catch (error) {
      showError("Erro ao importar configurações.");
      console.error("Import error:", error);
    }
  };

  reader.readAsText(file);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Carregar configurações salvas
  loadSettings();

  // Disparar evento inicial do slider
  creativitySlider.dispatchEvent(new Event("input"));

  console.log("VendAI AI Configuration initialized");
});
