// frontend/evento/evento.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const token = localStorage.getItem("token");

  // errore se eventId non è nell'url
  if (!eventId) {
    document.body.innerHTML = "<p>Evento non trovato.</p>";
    return;
  }

  // GET /event/:id per i dettagli dell'evento
  let event;
  try {
    const res = await fetch(`/event/${eventId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) {
      document.body.innerHTML = "<p>Errore nel recupero dell'evento.</p>";
      return;
    }
    event = await res.json();
  } catch (err) {
    console.error("Errore nel fetch di dettaglio evento:", err);
    document.body.innerHTML = "<p>Errore di rete nel caricamento dell'evento.</p>";
    return;
  }

  // aggiunta dei dati alla pagina
  document.getElementById("titolo-evento").textContent = event.nome;
  document.getElementById("categoria").textContent = event.tipoEvento;
  document.getElementById("descrizione-evento").textContent = event.descrizione;
  document.getElementById("data-evento").textContent =
    new Date(event.data).toLocaleDateString("it-IT");
  document.getElementById("ora-evento").textContent = event.ora;
  document.getElementById("luogo-evento").textContent = event.luogo;
  document.getElementById("posti-disponibili").textContent = event.postiDisponibili;
  document.getElementById("posti-occupati").textContent = event.postiOccupati ?? 0;

  // se non sono loggato, disabilito subito il bottone
  if (!token) {
    btn.disabled = true;
    btn.textContent = "Accedi per iscriverti";
    return;
  }

  // recupero userId tramite GET /api/me
  let userId = null;
  try {
    const meRes = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      // supponendo che il JSON di /api/me contenga _id o id
      userId = meData._id || meData.id;
    } else {
      // token non valido o scaduto: disabilito il pulsante
      btn.disabled = true;
      btn.textContent = "Sessione scaduta";
      return;
    }
  } catch (err) {
    console.error("Errore fetch /api/me:", err);
    btn.disabled = true;
    btn.textContent = "Errore di rete";
    return;
  }

  // controllo iscrizione utente
  const iscrittiArray = Array.isArray(event.iscritti)
    ? event.iscritti.map((uid) => uid.toString())
    : [];

  const isAlready = iscrittiArray.includes(userId.toString());

  // se raggiunta la capienza massima si disabilita il btn Iscriviti
  if (event.postiOccupati >= event.postiDisponibili) {
    btn.disabled = true;
    btn.textContent = "Posti esauriti";
    btn.classList.add("btn-esaurito");
  }

  // POST /api/event/:id/iscriviti per l'iscrizione
  /*btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Sto iscrivendo...";

    try {
      const signupRes = await fetch(`/api/event/${eventId}/iscriviti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const signupData = await signupRes.json();

      if (signupRes.ok) {
        // iscrizione effettuata, aggiorno il bottone
        btn.textContent = "Già iscritto";
        //return;
      } else {
        // errore 409 con il messaggio del server
        alert(`Errore: ${signupData.message}`);
        // se già iscritto rimane iscritto
        if (signupRes.status === 409) {
          btn.textContent = "Già iscritto";
          //return;
        }
        // altrimenti riabilito il bottone per riprovare
        btn.disabled = false;
        btn.textContent = "Iscriviti";
      }
    } catch (err) {
      console.error("Errore durante iscrizione:", err);
      alert("Errore di rete, riprova più tardi");
      btn.disabled = false;
      btn.textContent = "Iscriviti";
    }
  });*/

  let iscritto = event.iscritti.includes(userId);
  const btn = document.getElementById("iscriviti-btn");
  btn.textContent = iscritto ? "Disiscrivimi" : "Iscriviti";

  btn.addEventListener("click", async () => {
    const method = iscritto ? "DELETE" : "POST";
    try {
      const response = await fetch(`/api/event/${eventId}/iscriviti`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore iscrizione");
      }

      iscritto = !iscritto;
      btn.textContent = iscritto ? "Disiscrivimi" : "Iscriviti";
    } catch (err) {
      console.error("Errore iscrizione:", err);
    }
  });


  // implementazione bottone esci
  const esciBtn = document.getElementById("esci-btn");
  if (esciBtn) {
    esciBtn.addEventListener("click", () => {
      window.location.href = "./..";
    });
  }

  const eliminaBtn = document.getElementById("elimina-btn");
  if (userId && userId === event.creatore) {
    eliminaBtn.classList.add("btn");
    eliminaBtn.style.display = "inline-block";
    eliminaBtn.addEventListener("click", async () => {
      const confirmed = await showPopup("Confermi di voler eliminare questo evento?");
      if (!confirmed) return;

      try {
        const delRes = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (delRes.ok) {
          window.location.href = "./..";
        } else {
          const errData = await delRes.json();
          alert(`Errore: ${errData.message}`);
        }
      } catch (err) {
        console.error("Errore delete:", err);
        alert("Errore di rete, riprova più tardi.");
      }
    });
  }
});

function showPopup(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-box">
        <p>${message}</p>
        <div class="popup-buttons">
          <button class="btn" id="confirm-yes">Sì</button>
          <button class="btn" id="confirm-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("confirm-yes").onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };

    document.getElementById("confirm-no").onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };
  });
}
