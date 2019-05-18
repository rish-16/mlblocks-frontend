document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");

  const productTab = document.getElementById("product");
  const storyTab = document.getElementById("story");
  const teamTab = document.getElementById("team");

  productTab.addEventListener("click", function() {
    console.log("product");
    productTab.classList.toggle("chosen");
    storyTab.classList.remove("chosen");
    teamTab.classList.remove("chosen");
  });

  storyTab.addEventListener("click", function() {
    console.log("story");
    productTab.classList.remove("chosen");
    storyTab.classList.toggle("chosen");
    teamTab.classList.remove("chosen");
  });

  teamTab.addEventListener("click", function() {
    console.log("team");
    productTab.classList.remove("chosen");
    storyTab.classList.remove("chosen");
    teamTab.classList.toggle("chosen");
  });

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
