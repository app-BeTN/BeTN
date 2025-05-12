
function gestisciTipoUtente() {
  const tipo = document.getElementById("tipo").value;
  const campoPiva = document.getElementById("piva");
  const campoNome = document.getElementById("nome");

  if (tipo === "azienda") {
    campoPiva.style.display = "block";
    campoNome.placeholder = "Nome azienda";
  } else {
    campoPiva.style.display = "none";
    campoNome.placeholder = "Nome utente";
  }
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const piva = document.getElementById("piva").value.trim();
  const password = document.getElementById("password").value.trim();
  const confermaPassword = document.getElementById("conferma-password").value.trim();
  const tipo = document.getElementById("tipo").value;

  if (!nome || !email || !password || !confermaPassword || !tipo) {
    alert("Compila tutti i campi obbligatori.");
    return;
  }

  if (password !== confermaPassword) {
    alert("Le password non corrispondono.");
    return;
  }

  if (tipo === "azienda" && (!piva || piva.length < 11)) {
    alert("Inserisci una Partita IVA valida.");
    return;
  }

  const nuovoUtente = { nome, email, password, tipo, partitaIVA: tipo === "azienda" ? piva : null };
  console.log("Registrazione utente:", nuovoUtente);

  alert("Registrazione completata");
});

function redirectspid() {
  //window.location.href = "/signup/spid/spid.ejs";
}
