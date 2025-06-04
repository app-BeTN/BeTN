//tooltip_messaggi_di_errore
function showTooltip(inputId, message) {
  const input = document.getElementById(inputId);

  let tooltip = document.getElementById(`tooltip-${inputId}`);
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = `tooltip-${inputId}`;
    tooltip.className = "tooltip-content";
    input.insertAdjacentElement("afterend", tooltip);
  }
  tooltip.textContent = message;
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = "1";
  input.classList.add("input-error");
}

//gestione_nome_utente/nome_azienda_con_creazione_input_piva
function gestisciTipoUtente() {
  const tipo = document.getElementById("tipo").value;
  const campoPiva = document.getElementById("piva");
  const campoNome = document.getElementById("nome");

  if (tipo === "azienda") {
    document.getElementById("piva").required = true;
    campoPiva.style.display = "block";
    campoNome.placeholder = "Nome azienda";
  } else {
    document.getElementById("piva").required = false;
    campoPiva.style.display = "none";
    campoNome.placeholder = "Nome utente";
  }
}

//listener_signUp_btn_onclick
document.getElementById('signup-btn').addEventListener('click', async (e) => {
  e.preventDefault();

  const form = document.getElementById("signup-form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  //prende_in_input_i_valori_dal_form
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const piva = document.getElementById("piva").value.trim();
  const password = document.getElementById("password").value.trim();
  const confermaPassword = document.getElementById("conferma-password").value.trim();
  const tipo = document.getElementById("tipo").value;
  const azienda = tipo === "azienda" ? nome : null;

  //check_dei_campi_in_input
  if (!nome || !email || !password || !confermaPassword || !tipo) {
    return;
  }

  //controllo_corrispondenza_password
  const errorePassword = document.getElementById("errore-password");
  const passwordInput = document.getElementById("password");
  const confermaInput = document.getElementById("conferma-password");

  if (password !== confermaPassword) {
    //errore_corrispondenza_password
    errorePassword.style.display = "block";
    passwordInput.classList.add("input-error");
    confermaInput.classList.add("input-error");
    return;
  } else {
    //password_corrette
    errorePassword.style.display = "none";
    passwordInput.classList.remove("input-error");
    confermaInput.classList.remove("input-error");
  }

  //controllo_piva_se_azienda
  if (tipo === "azienda" && (!piva || piva.length < 11)) {
    return;
  }

  //controllo_inserimento_email
  const emailInput = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //errore_email_esistente
  const erroreEmail = document.getElementById("errore-email") || (() => {
    const s = document.createElement('small');
    s.id = 'errore-email';
    s.style.color = 'red';
    s.style.display = 'none';
    s.style.marginTop = '-15px';
    s.style.marginBottom = '5px';
    s.innerText = 'Email non valida o già esistente.';
    emailInput.insertAdjacentElement('afterend', s);
    return s;
  })();

  //errore_formato_email
  if (!emailRegex.test(email)) {
    erroreEmail.style.display = "block";
    emailInput.classList.add("input-error");
    return;
  } else {
    erroreEmail.style.display = "none";
    emailInput.classList.remove("input-error");
  }

  //invio_dati_al_backend
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, password, tipo, azienda })
  });

  //dati_ricevuti_dal_backend
  const data = await res.json();

  //controllo_ricezione_corretta_token
  if (res.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = '/login/login.html';
  } else if (res.status === 409) {
    if (data.message && data.message.toLowerCase().includes("email")) {
      erroreEmail.style.display = "block";
      emailInput.classList.add("input-error");
    } else if (data.message && data.message.toLowerCase().includes("nome")) {
      showTooltip("nome", "Nome utente già esistente.");
    }
  }
});

//listener_annullamento_messaggio_errore_email
document.getElementById("email").addEventListener("input", function () {
  if (document.getElementById("errore-email")) {
    const erroreEmail = document.getElementById("errore-email");
    erroreEmail.style.display = "none";
    const emailInput = document.getElementById("email");
    emailInput.classList.remove("input-error");
  }
});

document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.classList.add('visible');
    } else {
      input.type = 'password';
      btn.classList.remove('visible');
    }
  });
});

//listener_validazione_live_password
document.getElementById("password").addEventListener("input", function () {
  const password = this.value;

  //controllo_formato_password
  let error = document.getElementById("errore-password2");
  if (!error) {
    error = document.createElement("small");
    error.id = "errore-password2";
    error.style.color = "red";
    error.style.display = "none";
    error.style.marginTop = "-15px";
    error.innerText = "La password non rispetta i requisiti richiesti.";
    this.insertAdjacentElement("afterend", error);
  }

  //regole_formato_password
  const regole = document.getElementById("regole-password");
  const lengthOK = password.length >= 6;
  const upperOK = /[A-Z]/.test(password);
  const digitOK = /[0-9]/.test(password);
  const symbolOK = /[!@#$%^&*]/.test(password);
  if (!lengthOK || !upperOK || !digitOK || !symbolOK) {
    //formato_password_errato
    error.style.display = "block";
    this.classList.add("input-error");
    if (regole) regole.style.color = "red";
  } else {
    //formato_password_corretto
    error.style.display = "none";
    this.classList.remove("input-error");
    if (regole) regole.style.color = "#2ecc71";
  }
});

//listener_validazione_live_nome_utente
document.getElementById("nome").addEventListener("input", async function () {
  const nome = this.value.trim();
  
  //messaggio_di_errore
  const tooltip = document.getElementById("errore-nome") || (() => {
    const t = document.createElement("small");
    t.id = "errore-nome";
    t.className = "tooltip-content";
    t.style.color = "red";
    this.insertAdjacentElement("afterend", t);
    return t;
  })();

  //rimuove_errore_se_nome_vuoto
  if (!nome) {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
    this.classList.remove("input-error");
    return;
  }

  //controllo_nome_utente_nel_database
  try {
    const res = await fetch(`/api/check-nome?nome=${encodeURIComponent(nome)}`, {
      cache: "no-store"
    });
    const data = await res.json();
    if (data.esiste) {
      //errore_utente_esistente
      tooltip.textContent = "Nome utente già esistente.";
      tooltip.style.marginTop = "-15px";
      tooltip.style.marginBottom = "5px";
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
      this.classList.add("input-error");
    } else {
      //utente_corretto
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
      this.classList.remove("input-error");
    }
  } catch (err) {
    console.error("Errore controllo nome:", err);
  }
});

