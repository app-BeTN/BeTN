document.addEventListener("DOMContentLoaded", async() => {

  const token = localStorage.getItem('token');
  const containerAuth = document.getElementById('auth-buttons');

  //controllo se l'utente ha effettuato il login
  if (!token) {
    containerAuth.innerHTML = `<button id="login-btn">Login</button>`;
    document.getElementById('login-btn')
      .addEventListener('click', () => location.href = '../login/login.html');
    return;
  }

  //ritorno dell'utente che ha effettuato il login
  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Token non valido');

    const data = await res.json();
    const userName = data.nome;

    containerAuth.innerHTML = `
      <button id="creaEvento-btn">Crea Evento</button>
      <div id="dropdown">
        <div id="dropdown-header">
          <span>${userName}</span>
          <!-- Avatar placeholder -->
          <div class="avatar-placeholder">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
        </div>
        <div id="dropdown-items">
          <div class="menu-item" id="profile">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            Profilo
          </div>
          <div class="menu-item" id="settings">
            <svg viewBox="0 0 24 24">
              <path d="M19.4 13c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.5.1-.7l-2-3.4c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1-.7-1.6-.9l-.4-2.7c0-.2-.2-.4-.4-.4h-4c-.2 0-.4.2-.4.4l-.4 2.7c-.6.2-1.1.5-1.6.9l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.4c-.1.2-.1.5.1.7L4.6 11c-.1.3-.1.7-.1 1s0 .7.1 1l-2.1 1.6c-.2.2-.2.5-.1.7l2 3.4c.1.2.4.3.6.2l2.5-1c.5.4 1 .7 1.6.9l.4 2.7c0 .2.2.4.4.4h4c.2 0 .4-.2.4-.4l.4-2.7c.6-.2 1.1-.5 1.6-.9l2.5 1c.2.1.5 0 .6-.2l2-3.4c.1-.2.1-.5-.1-.7L19.4 13zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
            </svg>
            Impostazioni
          </div>
          <div class="menu-item" id="logout">
            <svg viewBox="0 0 24 24">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3H10v2h10v14H10v2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            Logout
          </div>
        </div>
      </div>
    `;
    initUserDropdown();
  } catch (err) {
    console.error(err);
    localStorage.removeItem('token');
    location.reload();
  }
  
  const cardsContainer = document.getElementById("cards-container");
  const listaEventiSection = document.getElementById("lista-eventi");
  const eventiContainer = document.getElementById("eventi-container");
  const titoloEventi = document.getElementById("titolo-eventi");
  const btnBack = document.getElementById("back-to-cards");

  // Mostra subito le card, nascondendo la lista-eventi
  showCardsView();

  // 1) Event listener per ogni card
  document
    .getElementById("card-tutti-eventi")
    .addEventListener("click", () => showEvents("tutti"));

  document
    .getElementById("card-eventi-musicali")
    .addEventListener("click", () => showEvents("musica"));

  document
    .getElementById("card-eventi-culturali")
    .addEventListener("click", () => showEvents("cultura"));

  document
    .getElementById("card-eventi-sportivi")
    .addEventListener("click", () => showEvents("sport"));

  document
    .getElementById("card-altri-eventi")
    .addEventListener("click", () => showEvents("altro"));

  document
    .getElementById("card-miei-eventi")
    .addEventListener("click", () => showEvents("miei"));

  document
    .getElementById("card-eventi-iscritti")
    .addEventListener("click", () => showEvents("iscritti"));

  // 2) Bottone “Torna alle categorie”
  btnBack.addEventListener("click", showCardsView);

  // ——————————————————————————————————————————
  // FUNZIONI AUSILIARIE
  // ——————————————————————————————————————————

  function showCardsView() {
    cardsContainer.style.display = "grid";
    listaEventiSection.style.display = "none";
  }

  function showEventsView() {
    cardsContainer.style.display = "none";
    listaEventiSection.style.display = "block";
  }

  async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Errore fetch /api/me:", err);
      return null;
    }
  }

  async function fetchAllEvents() {
    const token = localStorage.getItem("token");
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    try {
      const res = await fetch("/api/events", { headers });
      if (!res.ok) {
        console.error("Errore fetch /eventi:", res.status);
        return [];
      }
      const eventi = await res.json();
      return eventi;
    } catch (err) {
      console.error("Errore di rete fetch /eventi:", err);
      return [];
    }
  }

  function renderEventi(eventiArray) {
    eventiContainer.innerHTML = "";
    if (eventiArray.length === 0) {
      eventiContainer.innerHTML = "<p>Nessun evento trovato.</p>";
      return;
    }

    eventiArray.forEach((e) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("evento-card");
      cardDiv.innerHTML = `
        <h3>${e.nome}</h3>
        <p><strong>Data:</strong> ${new Date(e.data).toLocaleDateString("it-IT")}</p>
        <p><strong>Luogo:</strong> ${e.luogo}</p>
        <span class="badge ${e.tipoVisibilita}">${e.tipoVisibilita}</span>
      `;
      cardDiv.addEventListener("click", () => {
        window.location.href = `./../evento/evento.html?id=${e._id}`;
      });

      eventiContainer.appendChild(cardDiv);
    });
  }

  async function showEvents(filterType) {
    const eventi = await fetchAllEvents();

    let user = null;
    if (filterType === "miei" || filterType === "iscritti") {
      user = await getCurrentUser();
    }

    let filtrati = eventi;
    switch (filterType) {
      case "musica":
      case "cultura":
      case "sport":
      case "altro": {
        const mapTipo = {
          musica: "Musica",
          cultura: "Cultura",
          sport: "Sport",
          altro: "Altro",
        };
        const tipoSelezionato = mapTipo[filterType];
        filtrati = eventi.filter((e) => e.tipo === tipoSelezionato);
        titoloEventi.innerText = `Eventi ${tipoSelezionato}`;
        break;
      }

      case "miei": {
        if (!user) {
          filtrati = [];
        } else {
          // Adatta “creatoreId” al campo esatto fornito dalla tua API
          filtrati = eventi.filter((e) => e.creatoreId === user.id);
        }
        titoloEventi.innerText = "I miei eventi";
        break;
      }

      case "iscritti": {
        if (!user) {
          filtrati = [];
        } else {
          // Adatta “partecipanti” al campo della tua API
          filtrati = eventi.filter(
            (e) =>
              Array.isArray(e.partecipanti) &&
              e.partecipanti.includes(user.id)
          );
        }
        titoloEventi.innerText = "Eventi a cui sono iscritto";
        break;
      }

      case "tutti":
      default: {
        filtrati = eventi;
        titoloEventi.innerText = "Tutti gli eventi";
        break;
      }
    }

    showEventsView();
    renderEventi(filtrati);
  }
});

//dropdown funzionalità dell'utente 
function initUserDropdown() {
  const dropdown = document.getElementById('dropdown');
  const overlay = document.getElementById('overlay');
  const header = document.getElementById('dropdown-header');

  document.getElementById('creaEvento-btn')
    .addEventListener('click', () => location.href = '../creaEvento/creaEvento.html');

  header.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    overlay.classList.toggle('active', open);
  });
  overlay.addEventListener('click', () => {
    dropdown.classList.remove('open');
    overlay.classList.remove('active');
  });

  document.getElementById('profile')
    .addEventListener('click', () => location.href = '../profile/profile.html');
  document.getElementById('settings')
    .addEventListener('click', () => location.href = '../settings/settings.html');
  document.getElementById('logout')
    .addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = 'home.html';
    });
}
