document.addEventListener("DOMContentLoaded", () => {
  showEvents("altro");
  const btnBack = document.getElementById("back-to-cards");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      window.location.href = "/home/home.html";
    });
  } else {
    console.warn("altriEventi.js: elemento #btn-indietro non trovato");
  }
});
