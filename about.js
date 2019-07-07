document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");

  const heroTitleSpan = document.getElementById("hero-title-span");

  const teamTab = document.getElementById('team')
  const productTab = document.getElementById('product')
  const storyTab = document.getElementById('story')

  teamTab.addEventListener('click', () => {
    $([document.documentElement, document.body]).animate({
      scrollTop: document.body.clientHeight
    }, 500);
  })

  productTab.addEventListener('click', () => {
    $([document.documentElement, document.body]).animate({
      scrollTop: document.body.clientHeight * 2
    }, 500);
  })

  var typewriter = new Typewriter(heroTitleSpan, {
    loop: false,
    typingSpeed: 100
  });

  typewriter.typeString("Simplified.").start();

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
