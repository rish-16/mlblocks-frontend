document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");

  window.onscroll = e => {
    if ($(window).scrollTop() > 0) {
      header.style.backgroundColor = "white";
      header.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "none";
      header.style.boxShadow = "none";
    }
  };
});
