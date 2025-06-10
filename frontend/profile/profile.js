// profile.js

// mostra tooltip di errore sotto l'input
function showTooltip(inputId, message) {
  const input = document.getElementById(inputId);
  let tip = document.getElementById(`tooltip-${inputId}`);
  if (!tip) {
    tip = document.createElement('div');
    tip.id = `tooltip-${inputId}`;
    tip.className = 'tooltip-content';
    input.insertAdjacentElement('afterend', tip);
  }
  tip.textContent = message;
  tip.style.visibility = 'visible';
  tip.style.opacity = '1';
  input.classList.add('input-error');
}

// rimuove tooltip e bordo rosso
function clearTooltip(inputId) {
  const input = document.getElementById(inputId);
  const tip = document.getElementById(`tooltip-${inputId}`);
  if (tip) tip.remove();
  input.classList.remove('input-error');
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    location.href = '/login/login.html';
    return;
  }

  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');

  // validazione live nome utente
  nomeInput.addEventListener('input', async () => {
    clearTooltip('nome');
    const v = nomeInput.value.trim();
    if (!v) return;
    try {
      const res = await fetch(`/api/check-nome?nome=${encodeURIComponent(v)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
    
      const data = await res.json();
      console.log(data.esiste);
      if (!data.esiste) {
        showTooltip('nome', 'Nome già in uso');
      }
      
    } catch (err) {
      console.error('Errore controllo nome:', err);
    }
  });


  // Validazione live email
  emailInput.addEventListener('input', async () => {
    clearTooltip('email');
    const v = emailInput.value.trim();
    if (!v) return;
    // Controllo formato
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) {
      showTooltip('email', 'Formato email non valido');
      return;
    }
    try {
      const res = await fetch(`/api/check-email?email=${encodeURIComponent(v)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      if (!data.exists) {
        showTooltip('email', 'Email già registrata');
      }
    } catch (err) {
      console.error('Errore controllo email:', err);
    }
  });
});

// abilita l’input quando clicchi “Modifica”
document.querySelectorAll('.edit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const inp = document.getElementById(target);
    inp.disabled = false;
    inp.focus();
  });
});

// all'interno di document.addEventListener('DOMContentLoaded', ...)
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // ripulisce eventuali tooltip/errori già mostrati
  ['nome', 'email', 'piva', 'password'].forEach(id => clearTooltip(id));

  // costruisce il payload includendo solo i campi modificati
  const payload = {};
  const nomeEl = document.getElementById('nome');
  const emailEl = document.getElementById('email');
  const pivaEl = document.getElementById('piva');
  const pwdEl = document.getElementById('password');

  if (!nomeEl.disabled && nomeEl.value.trim()) {
    payload.nome = nomeEl.value.trim();
  }
  if (!emailEl.disabled && emailEl.value.trim()) {
    payload.email = emailEl.value.trim();
  }
  // P.IVA compare solo per aziende, ed è optional
  if (pivaEl && !pivaEl.disabled && pivaEl.value.trim()) {
    payload.azienda = pivaEl.value.trim();
  }
  if (!pwdEl.disabled && pwdEl.value) {
    payload.password = pwdEl.value;
  }

  // se non c'è nulla da inviare, return
  if (!Object.keys(payload).length) return;

  // fai la call
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('/api/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok) {
      window.location.href = '../home/home.html';
      return;
    }

    // gestisce 409 per nome/email già esistenti
    if (res.status === 409) {
      const msg = data.message.toLowerCase();
      if (msg.includes('nome')) showTooltip('nome', 'Nome già in uso');
      if (msg.includes('email')) showTooltip('email', 'Email già registrata');
      return;
    }

    // altri errori
    alert('Errore: ' + (data.message || res.statusText));

  } catch (err) {
    console.error('Errore di rete:', err);
    alert('Problemi di rete, riprova più tardi.');
  }
});