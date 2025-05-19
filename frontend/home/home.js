const eventi = [
  {
    titolo: "Concerto in piazza",
    data: "12 maggio 2025",
    luogo: "Piazza Duomo",
    descrizione: "Band dal vivo e street food.",
    privato: false
  }
];

//Bottoni
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById("auth-buttons");

  if (!token) {
    container.innerHTML = `<button id="login-btn" class="btn btn-primary" onclick="location.href='./../signup/signup.html'">Login</button>`;
    return;
  }


  const res = await fetch('/api/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    container.innerHTML = `
      <button id="creaEvento-btn" class="btnCreaEvento" onclick="location.href='./../creaEvento/creaEvento.html'">Crea Evento</button>
      <span id="nome-utente" class="nome-utente">${data.nome}</span>
      <button id="logout-btn" class="btn btn-secondary" onclick="logout()">Logout</button>
    `;
  } else {
    container.innerHTML = `<button id="login-btn" class="btn btn-primary" onclick="location.href='./../signup/signup.html'">Login</button>`;
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/home/home.html";
}
