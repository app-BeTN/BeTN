document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    document.body.innerHTML = "<p>Evento non trovato.</p>";
    return;
  }

  const iscritto = JSON.parse(localStorage.getItem("iscrizioni")) || [];

  try {
    const res = await fetch(`/event/${eventId}`);
    if (!res.ok) {
      document.body.innerHTML = "<p>Errore nel recupero dell'evento.</p>";
      return;
    }

    const event = await res.json();

    document.getElementById("titolo-evento").textContent = event.nome;
    document.getElementById("descrizione-evento").textContent = event.descrizione;
    const dataFormattata = new Date(event.data).toLocaleDateString("it-IT");
    document.getElementById("data-evento").textContent = dataFormattata;
    document.getElementById("ora-evento").textContent = event.ora;
    document.getElementById("luogo-evento").textContent = event.luogo;
    document.getElementById("posti-disponibili").textContent = event.postiDisponibili;
    document.getElementById("posti-occupati").textContent = event.postiOccupati ?? 0;

    const btn = document.getElementById("iscriviti-btn");

    if (iscritto.includes(eventId)) {
      btn.disabled = true;
      btn.textContent = "Iscritto";
    } else {
      btn.addEventListener("click", async () => {
        const res = await fetch(`/event/${eventId}/iscriviti`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        if (res.ok) {
          // Salva l'iscrizione localmente
          iscritto.push(eventId);
          localStorage.setItem("iscrizioni", JSON.stringify(iscritto));
          location.reload();
        } else {
          alert("Errore: " + result.message);
        }
      });
    }

    // Gestione bottone Esci
    document.getElementById("esci-btn").addEventListener("click", () => {
      window.location.href = "./../home/home.html";
    });

  } catch (error) {
    document.body.innerHTML = "<p>Errore di rete nel caricamento dell'evento.</p>";
    console.error(error);
  }
});
