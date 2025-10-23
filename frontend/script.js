// Login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Login attempt:", { email, password });

  // Aqui você implementaria a lógica de autenticação
  // Por exemplo, chamar uma API
  alert("Login functionality would be implemented here");

  // Exemplo de redirecionamento após login bem-sucedido:
  // window.location.href = 'dashboard.html';
});

// Google login button
document.querySelector(".google-btn").addEventListener("click", function () {
  console.log("Google login clicked");

  // Aqui você implementaria o Google OAuth
  alert("Google OAuth would be implemented here");

  // Exemplo de implementação real:
  // window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';
});

// Close button
document.querySelector(".close-btn").addEventListener("click", function () {
  console.log("Close clicked");

  // Para extensão, você usaria:
  // window.close();

  // Ou para fechar um modal:
  // document.querySelector('.login-container').style.display = 'none';
});

// Minimize button
document.querySelector(".minimize-btn").addEventListener("click", function () {
  console.log("Minimize clicked");

  // Para extensão, você pode minimizar ou ocultar temporariamente
  // document.querySelector('.login-container').style.transform = 'scale(0.1)';
});
