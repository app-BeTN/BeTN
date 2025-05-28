
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const descrizione = document.getElementById("descrizione").value.trim();
    const data = document.getElementById("data").value.trim();
    const ora = document.getElementById("ora").value.trim();
    const luogo = document.getElementById("luogo").value.trim();
    const tipoEvento = document.getElementById("tipoEvento").value.trim();
    const postiDisponibili = document.getElementById("postiDisponibili").value.trim();
    const tipoVisibilita = document.getElementById("tipoVisibilita").value;

    const erroreData = document.getElementById("errore-data");
    const erroreOra = document.getElementById("errore-ora");

    erroreData.classList.add("hidden");
    erroreOra.classList.add("hidden");

    const [anno, mese, giorno] = data.split("-").map(Number);
    const inputOnlyDate = new Date(anno, mese - 1, giorno);
    const inputDateTime = new Date(`${data}T${ora}`);

    const now = new Date();
    const todayOnlyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    //controllo della data se è passata
    if (inputOnlyDate.getTime() < todayOnlyDate.getTime()) {
        erroreData.classList.remove("hidden");
        return;
    }

    //controllo orario passato se il giorno è oggi
    if (inputOnlyDate.getTime() === todayOnlyDate.getTime() && inputDateTime <= now) {
        erroreOra.classList.remove("hidden");
        return;
    }

    //Controllo campi di input
    if (!nome || !descrizione || !data || !ora || !luogo || !tipoEvento || !postiDisponibili) {
        return;
    }

    //creazione evento
    const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descrizione, data, ora, luogo, tipoEvento, postiDisponibili, tipoVisibilita })
    });

    const result = await response.json();

    if (response.ok) {
        //const eventId = result.eventId;
        //window.location.href = `./../evento/evento.html?id=${eventId}`;
        window.location.href = `./../home/home.html`;
    } else {
        alert("Errore nella creazione dell'evento: " + result.message);
    }
});

//annulla creazione dell'evento
document.getElementById("annulla-btn").addEventListener("click", () => {
    window.location.href = "./../home/home.html";
});

const textarea = document.getElementById("descrizione");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto"; 
  textarea.style.height = textarea.scrollHeight + "px"; 
});
