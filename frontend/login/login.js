// login.js

document.addEventListener('DOMContentLoaded', () => {
  // ==== eye-toggle per password ====
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

  const form       = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passInput  = document.getElementById('password');
  const formError  = document.getElementById('form-error');

  // Rimuove errori al digitare
  [emailInput, passInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const small = input.parentElement.querySelector('.error-message');
      small.textContent = '';
      small.style.display = 'none';
      formError.style.display = 'none';
    });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    let valid = true;
    formError.style.display = 'none';

    // Email: required + formato
    const email = emailInput.value.trim();
    if (!email) {
      showFieldError(emailInput, 'L\'email è obbligatoria');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, 'Formato email non valido');
      valid = false;
    }

    // Password: required + min 6
    const pwd = passInput.value;
    if (!pwd) {
      showFieldError(passInput, 'La password è obbligatoria');
      valid = false;
    } else if (pwd.length < 6) {
      showFieldError(passInput, 'La password deve contenere almeno 6 caratteri');
      valid = false;
    }

    if (!valid) return;

    // Chiamata login
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd })
      });
      const result = await res.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        window.location.href = '../home/home.html';
      } else {
        showFormError(result.message);
      }
    } catch (err) {
      showFormError('Si è verificato un errore di rete. Riprova.');
    }
  });

  function showFieldError(input, msg) {
    input.classList.add('error');
    const small = input.parentElement.querySelector('.error-message');
    small.textContent = msg;
    small.style.display = 'block';
  }

  function showFormError(msg) {
    formError.textContent = msg;
    formError.style.display = 'block';
  }
});