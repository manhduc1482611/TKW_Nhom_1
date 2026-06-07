/* =========================================
   POPUP
========================================= */
document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    document.getElementById("popupOverlay").classList.add("active");
  }, 1000);

  document.getElementById("popupClose").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("popupOverlay").classList.remove("active");
  });

  document.getElementById("popupOverlay").addEventListener("click", (e) => {
    if (e.target.id === "popupOverlay") {
      document.getElementById("popupOverlay").classList.remove("active");
    }
  });

  document.querySelector(".popup-box a").addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "/pages/promotion/html/promotion.html";
  });

});