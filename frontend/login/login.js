document.addEventListener('DOMContentLoaded', () => {
  // toggle per mostrare/nascondere la password
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const inp = document.getElementById(id);
      if (inp.type === 'password') {
        inp.type = 'text';
        btn.classList.add('visible');
      } else {
        inp.type = 'password';
        btn.classList.remove('visible');
      }
    });
  });

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const formError = document.getElementById('form-error');

  // rimozione dell’errore quando l’utente modifica gli input
  [emailInput, passInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const small = input.parentElement.querySelector('.error-message');
      if (small) {
        small.textContent = '';
        small.style.display = 'none';
      }
      formError.style.display = 'none';
      formError.textContent = '';
    });
  });

  // gestione del submit del form di login
  form.addEventListener('submit', async event => {
    event.preventDefault();
    let valid = true;
    formError.style.display = 'none';
    formError.textContent = '';

    // validazione email
    const email = emailInput.value.trim();
    if (!email) {
      showFieldError(emailInput, "L'email è obbligatoria");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, 'Formato email non valido');
      valid = false;
    }

    // validazione password
    const pwd = passInput.value;
    if (!pwd) {
      showFieldError(passInput, 'La password è obbligatoria');
      valid = false;
    } else if (pwd.length < 6) {
      showFieldError(passInput, 'La password deve contenere almeno 6 caratteri');
      valid = false;
    }

    if (!valid) return;

    // POST /api/login
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
      });
      const result = await res.json();
      console.log("LOGIN response JSON:", result, "res.ok =", res.ok);

      if (res.ok) {
        // login effettuato
        localStorage.setItem('token', result.token);
        window.location.href = '../home/home.html';
      } else {
        // login fallito
        showFormError(result.message || 'Credenziali non valide');
      }
    } catch (err) {
      console.error("Errore fetch/login:", err);
      showFormError('Si è verificato un errore di rete. Riprova.');
    }
  });

  // errore sotto il campo di input errato
  function showFieldError(input, msg) {
    input.classList.add('error');
    const small = input.parentElement.querySelector('.error-message');
    if (!small) return;
    small.textContent = msg;
    small.style.display = 'block';
  }

  // errore generico in cima al form
  function showFormError(msg) {
    formError.textContent = msg;
    formError.style.display = 'block';
  }
});