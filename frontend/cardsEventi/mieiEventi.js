document.addEventListener("DOMContentLoaded", () => {
  showEvents("miei");
  const btnBack = document.getElementById("back-to-cards");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      window.location.href = "/home/home.html";
    });
  } else {
    console.warn("mieiEventi.js: elemento #btn-indietro non trovato");
  }
});
