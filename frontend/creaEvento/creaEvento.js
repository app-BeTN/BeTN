
document.getElementById('eventForm').addEventListener('submit', async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descrizione = document.getElementById("descrizione").value.trim();
    const data = document.getElementById("data").value.trim();
    const ora = document.getElementById("ora").value.trim();
    const luogo = document.getElementById("luogo").value.trim();
    const tipoEvento = document.getElementById("tipoEvento").value.trim();
    const postiDisponibili = document.getElementById("postiDisponibili").value.trim();

    const erroreData = document.getElementById("errore-data");
    const erroreOra = document.getElementById("errore-ora");

    erroreData.classList.add("hidden");
    erroreOra.classList.add("hidden");

    // --- Conversione robusta della data ---
    const [anno, mese, giorno] = data.split("-").map(Number);
    const inputOnlyDate = new Date(anno, mese - 1, giorno); // solo data
    const inputDateTime = new Date(`${data}T${ora}`);       // data + ora completa

    const now = new Date();
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Data nel passato
    if (inputOnlyDate.getTime() < todayOnlyDate.getTime()) {
        erroreData.classList.remove("hidden");
        return;
    }

    // 2. Oggi con orario nel passato
    if (inputOnlyDate.getTime() === todayOnlyDate.getTime() && inputDateTime <= now) {
        erroreOra.classList.remove("hidden");
        return;
    }

    //Controllo campi inseriti
    if (!nome || !descrizione || !data || !ora || !luogo || !tipoEvento || !postiDisponibili) {
        return;
    }

    const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descrizione, data, ora, luogo, tipoEvento, postiDisponibili })
    });

    const result = await response.json();

    if (response.ok) {
        const eventId = result.eventId;
        //window.location.href = `./../evento/evento.html?id=${eventId}`;
        window.location.href = `./../home/home.html`;
    } else {
        alert("Errore nella creazione dell'evento: " + result.message);
    }
});

//Gestione bottone annulla
document.getElementById("annulla-btn").addEventListener("click", () => {
    window.location.href = "./../home/home.html";
});

const textarea = document.getElementById("descrizione");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto"; 
  textarea.style.height = textarea.scrollHeight + "px"; 
});
