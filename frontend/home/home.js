document.addEventListener("DOMContentLoaded", async() => {

  const token = localStorage.getItem('token');
  const containerAuth = document.getElementById('auth-buttons');

  //controllo se l'utente ha effettuato il login
  if (!token) {
    containerAuth.innerHTML = `<button id="login-btn">Login</button>`;
    document.getElementById('login-btn')
      .addEventListener('click', () => location.href = '../login/login.html');
    return;
  }

  //ritorno dell'utente che ha effettuato il login
  try {
    const res = await fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Token non valido');

    const data = await res.json();
    const userName = data.nome;

    containerAuth.innerHTML = `
      <button id="creaEvento-btn">Crea Evento</button>
      <div id="dropdown">
        <div id="dropdown-header">
          <span>${userName}</span>
          <!-- Avatar placeholder -->
          <div class="avatar-placeholder">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
        </div>
        <div id="dropdown-items">
          <div class="menu-item" id="profile">
            <svg viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            Profilo
          </div>
          <div class="menu-item" id="settings">
            <svg viewBox="0 0 24 24">
              <path d="M19.4 13c.1-.3.1-.7.1-1s0-.7-.1-1l2.1-1.6c.2-.2.2-.5.1-.7l-2-3.4c-.1-.2-.4-.3-.6-.2l-2.5 1c-.5-.4-1-.7-1.6-.9l-.4-2.7c0-.2-.2-.4-.4-.4h-4c-.2 0-.4.2-.4.4l-.4 2.7c-.6.2-1.1.5-1.6.9l-2.5-1c-.2-.1-.5 0-.6.2l-2 3.4c-.1.2-.1.5.1.7L4.6 11c-.1.3-.1.7-.1 1s0 .7.1 1l-2.1 1.6c-.2.2-.2.5-.1.7l2 3.4c.1.2.4.3.6.2l2.5-1c.5.4 1 .7 1.6.9l.4 2.7c0 .2.2.4.4.4h4c.2 0 .4-.2.4-.4l.4-2.7c.6-.2 1.1-.5 1.6-.9l2.5 1c.2.1.5 0 .6-.2l2-3.4c.1-.2.1-.5-.1-.7L19.4 13zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
            </svg>
            Impostazioni
          </div>
          <div class="menu-item" id="logout">
            <svg viewBox="0 0 24 24">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3H10v2h10v14H10v2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            Logout
          </div>
        </div>
      </div>
    `;
    initUserDropdown();
  } catch (err) {
    console.error(err);
    localStorage.removeItem('token');
    location.reload();
  }

  const cardsContainer = document.getElementById("cards-container");

  // mostro subito le card categorie
  showCardsView();

  // listener per ogni card categoria
  document
    .getElementById("card-tutti-eventi")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/tuttiEventi.html";
    });

  document
    .getElementById("card-eventi-musicali")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/eventiMusicali.html";
    });
  document
    .getElementById("card-eventi-culturali")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/eventiCulturali.html";
    });
  document
    .getElementById("card-eventi-sportivi")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/eventiSportivi.html";
    });
  document
    .getElementById("card-altri-eventi")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/altriEventi.html";
    });
  document
    .getElementById("card-miei-eventi")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/mieiEventi.html";
    });

  document
    .getElementById("card-eventi-iscritti")
    .addEventListener("click", () => {
      window.location.href = "../cardsEventi/eventiIscritti.html";
    });
  // visualizzazione card categorie
  function showCardsView() {
    cardsContainer.style.display = "grid";
  }
});

//dropdown funzionalità dell'utente 
function initUserDropdown() {
  const dropdown = document.getElementById('dropdown');
  const overlay = document.getElementById('overlay');
  const header = document.getElementById('dropdown-header');

  document.getElementById('creaEvento-btn')
    .addEventListener('click', () => location.href = '../creaEvento/creaEvento.html');

  header.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    overlay.classList.toggle('active', open);
  });
  overlay.addEventListener('click', () => {
    dropdown.classList.remove('open');
    overlay.classList.remove('active');
  });

  document.getElementById('profile')
    .addEventListener('click', () => location.href = '../profile/profile.html');
  document.getElementById('settings')
    .addEventListener('click', () => location.href = '../settings/settings.html');
  document.getElementById('logout')
    .addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = 'home.html';
    });
}
