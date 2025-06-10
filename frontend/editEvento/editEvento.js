document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Devi effettuare il login per modificare un evento.");
    window.location.href = "./../login/login.html";
    return;
  }
  if (!eventId) {
    document.body.innerHTML = "<p>Evento non trovato.</p>";
    return;
  }

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./../login/login.html";
  });

  // annulla
  document.getElementById("annulla-btn").addEventListener("click", () => {
    window.location.href = "./../mieiEventi/mieiEventi.html";
  });

  // carico i dettagli dell’evento corrente: GET /api/events/:id
  try {
    const res = await fetch(`/api/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Token non valido o evento non tuo.");
      localStorage.removeItem("token");
      window.location.href = "./../login/login.html";
      return;
    }
    if (!res.ok) {
      const err = await res.json();
      alert(`Errore: ${err.message}`);
      window.location.href = "./../mieiEventi/mieiEventi.html";
      return;
    }

    const ev = await res.json();
    // prepopolo i campi
    document.getElementById("nome").value = ev.nome;
    document.getElementById("descrizione").value = ev.descrizione;
    document.getElementById("data").value = ev.data.split("T")[0];  // YYYY-MM-DD
    document.getElementById("ora").value = ev.ora;
    document.getElementById("luogo").value = ev.luogo;
    document.getElementById("tipoEvento").value = ev.tipoEvento;
    document.getElementById("postiDisponibili").value = ev.postiDisponibili;
    document.getElementById("tipoVisibilita").value = ev.tipoVisibilita || "pubblico";
  } catch (err) {
    console.error("Errore fetch dettaglio evento:", err);
    alert("Errore di rete, riprova più tardi.");
    window.location.href = "./../mieiEventi/mieiEventi.html";
    return;
  }

  // gestisco il submit di modifica: PUT /api/events/:id
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // rileggo i valori
    const nome = document.getElementById("nome").value.trim();
    const descrizione = document.getElementById("descrizione").value.trim();
    const data = document.getElementById("data").value.trim();
    const ora = document.getElementById("ora").value.trim();
    const luogo = document.getElementById("luogo").value.trim();
    const tipoEvento = document.getElementById("tipoEvento").value.trim();
    const postiDisponibili = document.getElementById("postiDisponibili").value.trim();
    const tipoVisibilita = document.getElementById("tipoVisibilita").value;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          descrizione,
          data,
          ora,
          luogo,
          tipoEvento,
          postiDisponibili,
          tipoVisibilita
        })
      });

      if (res.status === 403) {
        const err = await res.json();
        alert(`Non autorizzato: ${err.message}`);
        window.location.href = "./../mieiEventi/mieiEventi.html";
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        alert(`Errore: ${err.message}`);
        return;
      }

      window.location.href = "./../mieiEventi/mieiEventi.html";
    } catch (err) {
      console.error("Errore di rete durante update:", err);
      alert("Errore di rete, riprova più tardi.");
    }
  });
});
