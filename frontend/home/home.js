
const eventi = [
  {
    titolo: "Concerto in piazza",
    data: "12 maggio 2025",
    luogo: "Piazza Duomo",
    descrizione: "Band dal vivo e street food.",
    privato: false
  },
  {
    titolo: "Workshop Startup",
    data: "15 maggio 2025",
    luogo: "Università Trento",
    descrizione: "Evento privato con registrazione previa.",
    privato: true
  },
  {
    titolo: "Fiera dell'artigianato",
    data: "20 maggio 2025",
    luogo: "Centro storico",
    descrizione: "Mercatini e artigiani locali.",
    privato: false
  }
];

function isLoggedIn() {
  return localStorage.getItem("userId") !== null;
}

function renderAuthButtons() {
  const container = document.getElementById("auth-buttons");
  if (isLoggedIn()) {
    container.innerHTML = `
      <button class="btn btn-secondary" onclick="logout()">Logout</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-primary" onclick="location.href='./../signup/signup.html'">Login</button>
    `;
  }
}

function logout() {
  localStorage.removeItem("userId");
  location.reload();
}

function renderEventi() {
  const container = document.getElementById("event-list");
  const visibili = isLoggedIn() ? eventi : eventi.filter(e => !e.privato);

  container.innerHTML = visibili.map(ev => `
    <div class="event-card">
      <h3>${ev.titolo}</h3>
      <div class="event-meta">${ev.data} · ${ev.luogo}</div>
      <div class="event-description">${ev.descrizione}</div>
      <button class="btn btn-primary" onclick="location.href='login.html'">Iscriviti</button>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAuthButtons();
  renderEventi();
});
