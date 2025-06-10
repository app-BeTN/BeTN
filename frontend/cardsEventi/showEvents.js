const cardsContainer = document.getElementById("cards-container");
const listaEventiSection = document.getElementById("lista-eventi");
const eventiContainer = document.getElementById("eventi-container");
const titoloEventi = document.getElementById("titolo-eventi");

//visualizzazione card eventi
function showEventsView() {
  listaEventiSection.style.display = "block";
}

// ritorna l'utente che ha fatto il login
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

// ritorna tutti gli eventi pubblici: se effettuato il login anche i privati
async function fetchAllEvents() {
  const token = localStorage.getItem("token");
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const res = await fetch("/api/events", { headers });
    if (!res.ok) {
      console.error("Errore fetch /api/events:", res.status);
      return [];
    }
    const eventi = await res.json();
    return eventi;
  } catch (err) {
    console.error("Errore di rete fetch /api/events:", err);
    return [];
  }
}

// stampa a video tutti gli eventi
function renderEventi(eventiArray) {
  //eventiContainer.innerHTML = "";
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

// filtra gli eventi dato il tipo
async function showEvents(filterType) {

  const token = localStorage.getItem("token"); // può essere null
  const res = await fetch("/api/events", {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  let filtrati;
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

      if (!token) {
        window.location.href = "./../login/login.html";
        return;
      }

      const tipoSelezionato = mapTipo[filterType];
      const eventi = await fetchAllEvents();
      filtrati = eventi.filter((e) => e.tipoEvento === tipoSelezionato);
      titoloEventi.innerText = `Eventi ${tipoSelezionato}`;
      break;
    }

    case "miei": {

      if (!token) {
        window.location.href = "./../login/login.html";
        return;
      }

      try {
        const res = await fetch("/api/events/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          alert("Token non valido o scaduto. Effettua nuovamente il login.");
          localStorage.removeItem("token");
          window.location.href = "./../login/login.html";
          return;
        }
        const container = document.getElementById("eventi-container");
        if (!res.ok) {
          const errData = await res.json();
          container.innerHTML = `<p>Errore: ${errData.message}</p>`;
          return;
        }

        const eventi = await res.json();

        filtrati = eventi;

      } catch (err) {
        console.error("Errore fetch miei eventi:", err);
        container.innerHTML = "<p>Errore di rete, riprova più tardi.</p>";
      }
      break;
    }

    case "iscritti": {

      if (!token) {
        window.location.href = "./../login/login.html";
        return;
      }

      try {
        const res = await fetch("/api/events/iscritto", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          alert("Token non valido o scaduto. Effettua nuovamente il login.");
          localStorage.removeItem("token");
          window.location.href = "./../login/login.html";
          return;
        }

        const container = document.getElementById("eventi-container");
        if (!res.ok) {
          const errData = await res.json();
          container.innerHTML = `<p>Errore: ${errData.message}</p>`;
          return;
        }

        const eventi = await res.json();

        filtrati = eventi;

      } catch (err) {
        console.error("Errore fetch miei eventi:", err);
        container.innerHTML = "<p>Errore di rete, riprova più tardi.</p>";
      }
      break;
    }

    case "tutti":
    default: {
      const eventi = await fetchAllEvents();
      filtrati = eventi;
      titoloEventi.innerText = "Tutti gli eventi";
      break;
    }
  }

  showEventsView();
  renderEventi(filtrati);
}
