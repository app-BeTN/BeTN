document.addEventListener("DOMContentLoaded", () => {
  showEvents("musica");
  const btnBack = document.getElementById("back-to-cards");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      window.location.href = "/home/home.html";
    });
  } else {
    console.warn("eventiSportivi.js: elemento #btn-indietro non trovato");
  }
});
