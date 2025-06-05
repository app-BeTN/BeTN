// frontend/evento/evento.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const token = localStorage.getItem("token");
  const btn = document.getElementById("iscriviti-btn");

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

  // se già iscritto si disabilita il btn Iscriviti
  if (isAlready) {
    btn.disabled = true;
    btn.textContent = "Già iscritto";
    return;
  }

  // se raggiunta la capienza massima si disabilita il btn Iscriviti
  if (event.postiOccupati >= event.postiDisponibili) {
    btn.disabled = true;
    btn.textContent = "Posti esauriti";
    btn.classList.add("btn-esaurito");
    return;
  }

  // POST /api/event/:id/iscriviti per l'iscrizione
  btn.addEventListener("click", async () => {
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
        return;
      } else {
        // errore 409 con il messaggio del server
        alert(`Errore: ${signupData.message}`);
        // se già iscritto rimane iscritto
        if (signupRes.status === 409) {
          btn.textContent = "Già iscritto";
          return;
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
  });
  
  // implementazione bottone esci
  const esciBtn = document.getElementById("esci-btn");
  if (esciBtn) {
    esciBtn.addEventListener("click", () => {
      window.location.href = "./../home/home.html";
    });
  }
});