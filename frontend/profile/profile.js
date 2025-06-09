// frontend/profile/profile.js
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Controllo token
  const token = localStorage.getItem('token');
  if (!token) return location.href = '../login/login.html';

  // 2) Carico dati utente per sapere il tipo
  let user;
  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error();
    user = await res.json();
  } catch {
    return location.href = '../login/login.html';
  }

  // 3) Riferimenti ai campi
  const nomeInput  = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const pwdInput   = document.getElementById('password');
  const pivaCont   = document.getElementById('piva-container');
  const pivaInput  = document.getElementById('piva');

  // 4) Imposto campi vuoti + placeholder statici
  nomeInput.value        = '';
  nomeInput.placeholder  = 'Inserisci nome';

  emailInput.value       = '';
  emailInput.placeholder = 'Inserisci email';

  pwdInput.value         = '';
  pwdInput.placeholder   = 'Inserisci password';

  // 5) Solo per aziende mostro il campo P.IVA
  if (user.tipo === 'azienda') {
    pivaCont.classList.remove('hidden');
    pivaInput.value        = '';
    pivaInput.placeholder  = 'Inserisci partita IVA';
  }

  // 6) Gestione submit
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {};

    const vNome  = nomeInput.value.trim();
    if (vNome) payload.nome = vNome;

    const vEmail = emailInput.value.trim();
    if (vEmail) payload.email = vEmail;

    if (user.tipo === 'azienda') {
      const vPiva = pivaInput.value.trim();
      if (vPiva) payload.azienda = vPiva;
    }

    const vPwd = pwdInput.value;
    if (vPwd) payload.password = vPwd;

    // se non ha compilato nulla, non faccio chiamata
    if (!Object.keys(payload).length) {
      return alert('Compila almeno un campo per salvare.');
    }

    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || res.statusText);
      alert('Profilo aggiornato con successo!');
      window.location.reload();
    } catch (err) {
      alert('Errore: ' + err.message);
    }
  });
});