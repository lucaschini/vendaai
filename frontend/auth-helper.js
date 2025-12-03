// auth-helper.js
// Use este arquivo em todas as páginas que requerem autenticação

const API_URL = "http://127.0.0.1:8000"; // Ajuste para a URL da sua API

/**
 * Verifica se o usuário está autenticado
 * Redireciona para login se não estiver
 */
async function requireAuth() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      ["access_token", "isAuthenticated"],
      async (result) => {
        if (!result.isAuthenticated || !result.access_token) {
          window.location.href = "login.html";
          reject("Não autenticado");
          return;
        }

        // Verificar se o token ainda é válido
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${result.access_token}`,
            },
          });

          if (!response.ok) {
            // Token inválido ou expirado
            await logout();
            window.location.href = "login.html";
            reject("Token inválido");
            return;
          }

          const user = await response.json();
          resolve({ token: result.access_token, user });
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          reject(error);
        }
      },
    );
  });
}

/**
 * Faz logout do usuário
 */
async function logout() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(
      ["access_token", "user", "isAuthenticated"],
      () => {
        resolve();
      },
    );
  });
}

/**
 * Retorna o token de acesso
 */
async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["access_token"], (result) => {
      resolve(result.access_token || null);
    });
  });
}

/**
 * Retorna os dados do usuário
 */
async function getUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user"], (result) => {
      resolve(result.user || null);
    });
  });
}

/**
 * Faz uma requisição autenticada para a API
 */
async function fetchWithAuth(endpoint, options = {}) {
  const token = await getToken();

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    ...defaultOptions,
  });

  if (response.status === 401) {
    // Token expirado, fazer logout
    await logout();
    window.location.href = "login.html";
    throw new Error("Sessão expirada");
  }

  return response;
}

// Exemplo de uso em uma página protegida:
//
// <!DOCTYPE html>
// <html>
// <head>
//     <script src="auth-helper.js"></script>
// </head>
// <body>
//     <script>
//         // Proteger a página
//         requireAuth().then(({ user, token }) => {
//             console.log('Usuário autenticado:', user);
//             // Carregar conteúdo da página
//         }).catch(error => {
//             console.error('Erro de autenticação:', error);
//         });
//
//         // Fazer requisição autenticada
//         async function carregarDados() {
//             try {
//                 const response = await fetchWithAuth('/vendas');
//                 const vendas = await response.json();
//                 console.log(vendas);
//             } catch (error) {
//                 console.error('Erro ao carregar vendas:', error);
//             }
//         }
//     </script>
// </body>
// </html>
