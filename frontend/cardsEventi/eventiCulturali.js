document.addEventListener("DOMContentLoaded", () => {
  showEvents("cultura");
  const btnBack = document.getElementById("back-to-cards");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      window.location.href = "/home/home.html";
    });
  } else {
    console.warn("eventiCulturali.js: elemento #btn-indietro non trovato");
  }
});
