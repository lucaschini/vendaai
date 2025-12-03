// Configuração da API
const API_URL = "http://localhost:8000"; // Ajuste para a URL da sua API

// Elementos do DOM
const loginForm = document.getElementById("loginForm");
const googleBtn = document.querySelector(".google-btn");
const minimizeBtn = document.querySelector(".minimize-btn");
const closeBtn = document.querySelector(".close-btn");

// Função para salvar token no storage da extensão
function saveToken(token, user) {
  chrome.storage.local.set(
    {
      access_token: token,
      user: user,
      isAuthenticated: true,
    },
    () => {
      console.log("Token salvo com sucesso");
    },
  );
}

// Função para fazer login
async function login(email, password) {
  try {
    // O schema UserLogin usa alias, então envia 'password' mas aceita 'e_mail' também
    const loginData = {
      e_mail: email,
      password: password, // ← Mudado de 'senha' para 'password'
    };

    console.log("Enviando dados:", loginData); // Debug

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erro ao fazer login");
    }

    const data = await response.json();

    // Salvar token e dados do usuário
    saveToken(data.access_token, data.user);

    // Mostrar mensagem de sucesso
    showMessage("Login realizado com sucesso!", "success");

    // Redirecionar para a página principal da extensão após 1 segundo
    setTimeout(() => {
      window.location.href = "http://localhost:3000/dashboard"; // Ajuste para sua página principal
    }, 1000);
  } catch (error) {
    showMessage(error.message, "error");
    console.error("Erro no login:", error);
  }
}

// Função para mostrar mensagens
function showMessage(message, type) {
  // Remove mensagem anterior se existir
  const existingMsg = document.querySelector(".message");
  if (existingMsg) {
    existingMsg.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;

  const container = document.querySelector(".login-container");
  container.insertBefore(messageDiv, loginForm);

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Event listener do formulário
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validação básica
  if (!email || !password) {
    showMessage("Por favor, preencha todos os campos", "error");
    return;
  }

  // Desabilitar botão durante o login
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Entrando...";

  try {
    await login(email, password);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Entrar";
  }
});

// Login com Google (placeholder - requer configuração OAuth)
googleBtn.addEventListener("click", () => {
  showMessage("Login com Google em desenvolvimento", "info");
  // TODO: Implementar OAuth do Google
  // Referência: https://developer.chrome.com/docs/extensions/reference/identity/
});

// Botão minimizar (para extensão)
minimizeBtn.addEventListener("click", () => {
  window.close(); // Fecha a janela da extensão
});

// Botão fechar (para extensão)
closeBtn.addEventListener("click", () => {
  window.close(); // Fecha a janela da extensão
});

// Verificar se já está autenticado ao carregar a página
chrome.storage.local.get(["access_token", "isAuthenticated"], (result) => {
  if (result.isAuthenticated && result.access_token) {
    // Já está logado, redirecionar
    window.location.href = "index.html";
  }
});

// Função auxiliar para fazer logout (pode ser usada em outras páginas)
function logout() {
  chrome.storage.local.remove(
    ["access_token", "user", "isAuthenticated"],
    () => {
      window.location.href = "login.html";
    },
  );
}

// Exportar funções úteis para outras páginas
window.authUtils = {
  logout,
  getToken: () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(["access_token"], (result) => {
        resolve(result.access_token);
      });
    });
  },
  getUser: () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(["user"], (result) => {
        resolve(result.user);
      });
    });
  },
};
