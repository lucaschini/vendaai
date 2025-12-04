const LOGIN_URL = "http://localhost:3000/auth/login";
const API_URL = "http://localhost:8000"; // Ajuste para a porta do seu backend Python

async function checkAuthentication() {
    // 1. Verifica se o token existe no localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        handleUnauthenticated();
        return;
    }

    // 2. (Opcional mas recomendado) Valida o token com o backend
    try {
        // Ajuste a rota '/users/me' ou similar conforme suas rotas em backend/routers/
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error("Token expirado ou inválido");
        }
    } catch (error) {
        console.error("Falha na validação do token:", error);
        localStorage.removeItem("token"); // Limpa o token inválido
        handleUnauthenticated();
    }
}

function handleUnauthenticated() {
    // Em extensões, não podemos simplesmente redirecionar a "página" da extensão para um site externo
    // sem perder o contexto da extensão. O padrão é abrir uma nova aba.
    
    // Abre a página de login em uma nova aba
    window.open(LOGIN_URL, '_blank');

    // Atualiza a interface da extensão para mostrar que o login é necessário
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
            <h3>Autenticação Necessária</h3>
            <p>Por favor, faça login para continuar.</p>
            <button onclick="window.open('${LOGIN_URL}', '_blank')" style="padding: 10px 20px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px;">
                Fazer Login
            </button>
        </div>
    `;
}

// Executa a verificação assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", checkAuthentication);