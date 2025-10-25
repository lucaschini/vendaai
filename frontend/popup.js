// ============================================
// POPUP DA EXTENSÃO
// ============================================

// Enviar mensagem para o content script abrir a tela correspondente
document.getElementById("openInsights").addEventListener("click", () => {
  sendMessageToContent("openInsights");
  window.close();
});

document.getElementById("openChat").addEventListener("click", () => {
  sendMessageToContent("openChat");
  window.close();
});

document.getElementById("openConfig").addEventListener("click", () => {
  sendMessageToContent("openConfig");
  window.close();
});

document.getElementById("openAIConfig").addEventListener("click", () => {
  sendMessageToContent("openAIConfig");
  window.close();
});

// Função para enviar mensagem ao content script
function sendMessageToContent(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
          // Se não houver content script, verificar se está em uma página suportada
          checkIfSupportedPage(tabs[0]);
        }
      });
    }
  });
}

// Verificar se está em uma página de videochamada suportada
function checkIfSupportedPage(tab) {
  const supportedDomains = [
    "meet.google.com",
    "zoom.us",
    "teams.microsoft.com",
  ];

  const isSupported = supportedDomains.some((domain) =>
    tab.url.includes(domain),
  );

  if (!isSupported) {
    alert(
      "VendAI funciona em Google Meet, Zoom e Microsoft Teams. Navegue para uma dessas plataformas para usar a extensão.",
    );
  }
}

// Verificar status da extensão ao abrir o popup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    const url = tabs[0].url;
    const statusText = document.getElementById("statusText");

    if (url.includes("meet.google.com")) {
      statusText.textContent = "Ativo no Google Meet";
    } else if (url.includes("zoom.us")) {
      statusText.textContent = "Ativo no Zoom";
    } else if (url.includes("teams.microsoft.com")) {
      statusText.textContent = "Ativo no Teams";
    } else {
      statusText.textContent = "Aguardando videochamada";
      document.querySelector(".status-dot").style.background = "#fbbc05";
    }
  }
});
