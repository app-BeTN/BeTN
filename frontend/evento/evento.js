document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  //se l'evento non esiste
  if (!eventId) {
    document.body.innerHTML = "<p>Evento non trovato.</p>";
    return;
  }

  const token = localStorage.getItem("token");
  const btn = document.getElementById("iscriviti-btn");

  //ritorno dell'evento cercato
  try {
    const res = await fetch(`/event/${eventId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!res.ok) {
      document.body.innerHTML = "<p>Errore nel recupero dell'evento.</p>";
      return;
    }

    const event = await res.json();

    document.getElementById("titolo-evento").textContent = event.nome;
    document.getElementById("categoria").textContent = event.tipoEvento;
    document.getElementById("descrizione-evento").textContent = event.descrizione;
    document.getElementById("data-evento").textContent = new Date(event.data).toLocaleDateString("it-IT");
    document.getElementById("ora-evento").textContent = event.ora;
    document.getElementById("luogo-evento").textContent = event.luogo;
    document.getElementById("posti-disponibili").textContent = event.postiDisponibili;
    document.getElementById("posti-occupati").textContent = event.postiOccupati ?? 0;

    //controllo se l'utente ha fatto il login
    if (!token) {
      btn.disabled = true;
      btn.textContent = "Accedi per iscriverti";
      //controllo posti disponibili
    } else if (event.postiOccupati >= event.postiDisponibili) {
      btn.disabled = true;
      btn.textContent = "Posti esauriti";
      btn.classList.add("btn-esaurito");
      //controllo se l'utente è già iscritto
    } else if (event.giàIscritto) {
      btn.disabled = true;
      btn.textContent = "Già iscritto";
      //possibilità di iscrizione
    } else {
      btn.addEventListener("click", async () => {
        const res = await fetch(`/event/${eventId}/iscriviti`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          location.reload();
        }
      });
    }

    // uscita dall'evento selezionato
    const esciBtn = document.getElementById("esci-btn");
    if (esciBtn) {
      esciBtn.addEventListener("click", () => {
        window.location.href = "./../home/home.html";
      });
    }

  } catch (error) {
    console.error("Errore caricamento evento:", error);
    document.body.innerHTML = "<p>Errore di rete nel caricamento dell'evento.</p>";
  }
});
