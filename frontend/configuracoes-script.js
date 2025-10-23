// ============================================
// ELEMENTOS DO DOM
// ============================================
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const configCard = document.getElementById("configCard");
const languageSelect = document.getElementById("languageSelect");
const transparencyToggle = document.getElementById("transparencyToggle");
const layoutSelect = document.getElementById("layoutSelect");
const textSizeSlider = document.getElementById("textSizeSlider");
const textSizeValue = document.getElementById("textSizeValue");
const notificationsToggle = document.getElementById("notificationsToggle");
const saveBtn = document.getElementById("saveBtn");

// ============================================
// OBJETO DE CONFIGURAÇÕES
// ============================================
let settings = {
  language: "pt",
  transparency: true,
  layout: "fixo",
  textSize: 14,
  notifications: true,
};

// ============================================
// ABRIR/FECHAR CARD DE CONFIGURAÇÕES
// ============================================
menuBtn.addEventListener("click", toggleConfigCard);
overlay.addEventListener("click", closeConfigCard);

function toggleConfigCard() {
  configCard.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeConfigCard() {
  configCard.classList.remove("active");
  overlay.classList.remove("active");
}

// ============================================
// CARREGAR CONFIGURAÇÕES SALVAS
// ============================================
function loadSettings() {
  // ==========================================
  // 🔴 BACKEND: Buscar configurações do usuário
  // ==========================================
  /*
    async function fetchUserSettings() {
        try {
            const response = await fetch('https://sua-api.com/user/settings', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer SEU_TOKEN',
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            settings = data.settings;
            applySettings();

        } catch (error) {
            console.error('Error loading settings:', error);
            // Usar configurações padrão em caso de erro
            loadDefaultSettings();
        }
    }
    */

  // Por enquanto, carregar do localStorage
  const savedSettings = localStorage.getItem("vendai-settings");

  if (savedSettings) {
    settings = JSON.parse(savedSettings);
  }

  applySettings();
}

function applySettings() {
  // Aplicar valores nos inputs
  languageSelect.value = settings.language;
  transparencyToggle.checked = settings.transparency;
  layoutSelect.value = settings.layout;
  textSizeSlider.value = settings.textSize;
  textSizeValue.textContent = settings.textSize + "px";
  notificationsToggle.checked = settings.notifications;

  // Aplicar mudanças visuais
  applyTextSize(settings.textSize);
  applyTransparency(settings.transparency);
  applyLayout(settings.layout);
}

// ============================================
// ATUALIZAR VALOR DO SLIDER EM TEMPO REAL
// ============================================
textSizeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  textSizeValue.textContent = value + "px";
  applyTextSize(value);
});

function applyTextSize(size) {
  // Aplicar tamanho do texto na interface
  document.documentElement.style.setProperty("--text-size", size + "px");
  console.log("Text size changed to:", size);
}

// ============================================
// APLICAR TRANSPARÊNCIA
// ============================================
transparencyToggle.addEventListener("change", (e) => {
  applyTransparency(e.target.checked);
});

function applyTransparency(enabled) {
  if (enabled) {
    document.body.style.setProperty("--card-opacity", "0.95");
    console.log("Transparency enabled");
  } else {
    document.body.style.setProperty("--card-opacity", "1");
    console.log("Transparency disabled");
  }
}

// ============================================
// APLICAR LAYOUT
// ============================================
layoutSelect.addEventListener("change", (e) => {
  applyLayout(e.target.value);
});

function applyLayout(layout) {
  document.body.setAttribute("data-layout", layout);
  console.log("Layout changed to:", layout);

  // Ajustar estilos baseado no layout escolhido
  switch (layout) {
    case "fixo":
      // Layout fixo mantém os cards sempre no mesmo lugar
      break;
    case "flutuante":
      // Layout flutuante permite arrastar os cards
      break;
    case "minimalista":
      // Layout minimalista reduz elementos visuais
      break;
  }
}

// ============================================
// NOTIFICAÇÕES
// ============================================
notificationsToggle.addEventListener("change", (e) => {
  const enabled = e.target.checked;

  if (enabled && "Notification" in window) {
    // Pedir permissão para notificações
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications enabled");
        showNotification(
          "Notificações ativadas!",
          "Você receberá alertas importantes.",
        );
      }
    });
  } else {
    console.log("Notifications disabled");
  }
});

function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "/path/to/icon.png",
      badge: "/path/to/badge.png",
    });
  }
}

// ============================================
// SALVAR CONFIGURAÇÕES
// ============================================
saveBtn.addEventListener("click", saveSettings);

async function saveSettings() {
  // Atualizar objeto de configurações
  settings = {
    language: languageSelect.value,
    transparency: transparencyToggle.checked,
    layout: layoutSelect.value,
    textSize: parseInt(textSizeSlider.value),
    notifications: notificationsToggle.checked,
  };

  // ==========================================
  // 🔴 BACKEND: Salvar configurações no servidor
  // ==========================================
  /*
    try {
        const response = await fetch('https://sua-api.com/user/settings', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer SEU_TOKEN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            console.log('Settings saved successfully');
            showSuccessMessage();
        } else {
            throw new Error('Failed to save settings');
        }

    } catch (error) {
        console.error('Error saving settings:', error);
        showErrorMessage();
    }
    */

  // Por enquanto, salvar no localStorage
  localStorage.setItem("vendai-settings", JSON.stringify(settings));

  console.log("Settings saved:", settings);
  showSuccessMessage();

  // Aplicar as configurações
  applySettings();

  // Fechar o card após salvar
  setTimeout(() => {
    closeConfigCard();
  }, 1000);
}

// ============================================
// MENSAGENS DE FEEDBACK
// ============================================
function showSuccessMessage() {
  // Mudar temporariamente o texto do botão
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "✓ Configurações Salvas!";
  saveBtn.style.background =
    "linear-gradient(135deg, #34a853 0%, #2d8e47 100%)";

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, 2000);
}

function showErrorMessage() {
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "✗ Erro ao salvar";
  saveBtn.style.background =
    "linear-gradient(135deg, #ea4335 0%, #d33828 100%)";

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, 2000);
}

// ============================================
// MUDANÇA DE IDIOMA
// ============================================
languageSelect.addEventListener("change", (e) => {
  const language = e.target.value;
  changeLanguage(language);
});

function changeLanguage(language) {
  // ==========================================
  // 🔴 BACKEND: Buscar traduções do servidor
  // ==========================================
  /*
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`https://sua-api.com/translations/${lang}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer SEU_TOKEN',
                    'Content-Type': 'application/json'
                }
            });

            const translations = await response.json();
            applyTranslations(translations);

        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }
    */

  console.log("Language changed to:", language);

  // Exemplo simples de mudança de idioma (pode expandir com arquivo de traduções)
  const translations = {
    pt: {
      title: "Configurações",
      language: "Linguagem",
      transparency: "Transparência do fundo",
      layout: "Estilo de layout",
      textSize: "Tamanho do texto",
      notifications: "Notificações",
      save: "Salvar Configurações",
    },
    en: {
      title: "Settings",
      language: "Language",
      transparency: "Background transparency",
      layout: "Layout style",
      textSize: "Text size",
      notifications: "Notifications",
      save: "Save Settings",
    },
    es: {
      title: "Configuración",
      language: "Idioma",
      transparency: "Transparencia de fondo",
      layout: "Estilo de diseño",
      textSize: "Tamaño de texto",
      notifications: "Notificaciones",
      save: "Guardar Configuración",
    },
    fr: {
      title: "Paramètres",
      language: "Langue",
      transparency: "Transparence du fond",
      layout: "Style de mise en page",
      textSize: "Taille du texte",
      notifications: "Notifications",
      save: "Enregistrer les paramètres",
    },
  };

  // Aplicar traduções na interface (exemplo básico)
  if (translations[language]) {
    document.querySelector(".card-title").textContent =
      translations[language].title;
    saveBtn.textContent = translations[language].save;
  }
}

// ============================================
// ATALHOS DE TECLADO
// ============================================
document.addEventListener("keydown", (e) => {
  // ESC para fechar o card
  if (e.key === "Escape" && configCard.classList.contains("active")) {
    closeConfigCard();
  }

  // Ctrl/Cmd + S para salvar
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    if (configCard.classList.contains("active")) {
      saveSettings();
    }
  }

  // Ctrl/Cmd + , para abrir configurações
  if ((e.ctrlKey || e.metaKey) && e.key === ",") {
    e.preventDefault();
    toggleConfigCard();
  }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Carregar configurações salvas
  loadSettings();

  console.log("VendAI Configurações initialized");
});
