// frontend/evento/evento.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const token = localStorage.getItem("token");
  const btn = document.getElementById("iscriviti-btn");

  // 1) Se non ho eventId in URL, mostro messaggio di errore
  if (!eventId) {
    document.body.innerHTML = "<p>Evento non trovato.</p>";
    return;
  }

  // 2) Chiamo GET /event/:id per avere i dettagli dell'evento
  let event;
  try {
    const res = await fetch(`/event/${eventId}`, {
      // Se ho il token, lo mando per eventuale controllo di visibilità
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

  // 3) Popolo la pagina con i dati dell'evento
  document.getElementById("titolo-evento").textContent = event.nome;
  document.getElementById("categoria").textContent = event.tipoEvento;
  document.getElementById("descrizione-evento").textContent = event.descrizione;
  document.getElementById("data-evento").textContent =
    new Date(event.data).toLocaleDateString("it-IT");
  document.getElementById("ora-evento").textContent = event.ora;
  document.getElementById("luogo-evento").textContent = event.luogo;
  document.getElementById("posti-disponibili").textContent = event.postiDisponibili;
  document.getElementById("posti-occupati").textContent = event.postiOccupati ?? 0;

  // Se non sono loggato, disabilito subito il bottone
  if (!token) {
    btn.disabled = true;
    btn.textContent = "Accedi per iscriverti";
    return;
  }

  // 4) Recupero l'userId chiamando GET /api/me (usa il token)
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

  // 5) Controllo se l'utente è già iscritto, guardando event.iscritti
  //    (event.iscritti è un array di ObjectId come stringhe)
  const iscrittiArray = Array.isArray(event.iscritti)
    ? event.iscritti.map((uid) => uid.toString())
    : [];

  const isAlready = iscrittiArray.includes(userId.toString());

  // 6) Se già iscritto → disabilito il pulsante e cambio testo
  if (isAlready) {
    btn.disabled = true;
    btn.textContent = "Già iscritto";
    return;
  }

  // 7) Altrimenti, controllo posti disponibili: se finiti disabilito
  if (event.postiOccupati >= event.postiDisponibili) {
    btn.disabled = true;
    btn.textContent = "Posti esauriti";
    btn.classList.add("btn-esaurito"); // puoi aggiungere stile in CSS
    return;
  }

  // 8) Se arrivo qui, l'utente non è iscritto e ci sono posti liberi:
  //    fissiamo l'event listener per inviare la POST /api/event/:id/iscriviti
  btn.addEventListener("click", async () => {
    // Disabilito subito per evitare doppioni
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
        // Iscrizione andata a buon fine, aggiorno il bottone
        btn.textContent = "Già iscritto";
        return;
      } else {
        // Se ricevo 409 o altro, mostro alert con il messaggio del server
        alert(`Errore: ${signupData.message}`);
        // Se l'errore è “già iscritto”, mantengo “Già iscritto”
        if (signupRes.status === 409) {
          btn.textContent = "Già iscritto";
          return;
        }
        // Altrimenti riabilito il bottone per riprovare
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
  
  // 9) Gestisco il bottone “Esci”
  const esciBtn = document.getElementById("esci-btn");
  if (esciBtn) {
    esciBtn.addEventListener("click", () => {
      window.location.href = "./../home/home.html";
    });
  }
});