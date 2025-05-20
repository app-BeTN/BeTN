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

//Lista eventi
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("eventi-container");
  
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/eventi", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });


    const eventi = await res.json();

    if (eventi.length === 0) {
      container.innerHTML = "<p>Nessun evento disponibile.</p>";
      return;
    }

    eventi.forEach(evento => {
      const card = document.createElement("div");
      card.className = "card-evento";
      card.innerHTML = `
        <h3>${evento.nome}</h3>
        <p><strong>Data:</strong> ${new Date(evento.data).toLocaleDateString("it-IT")}</p>
        <p><strong>Luogo:</strong> ${evento.luogo}</p>
        <span class="badge ${evento.tipoVisibilita}">${evento.tipoVisibilita}</span>
      `;
      card.addEventListener("click", () => {
        window.location.href = `./../evento/evento.html?id=${evento._id}`;
      });

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Errore nel caricamento degli eventi.</p>";
    console.error(err);
  }
});


function logout() {
  localStorage.removeItem("token");
  window.location.href = "/home/home.html";
}
