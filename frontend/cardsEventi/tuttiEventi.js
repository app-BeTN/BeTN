document.addEventListener("DOMContentLoaded", () => {
  showEvents("tutti");
  const btnBack = document.getElementById("back-to-cards");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      window.location.href = "/home/home.html";
    });
  } else {
    console.warn("tuttiEventi.js: elemento #btn-indietro non trovato");
  }
});
