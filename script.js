function toggleMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  mobileNav.classList.toggle('show');
}

function openSubMenu(menuId) {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById(menuId).classList.add("show");
}

function closeSubMenu(menuId) {
  document.getElementById(menuId).classList.remove("show");
  document.getElementById("main-menu").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const yayButtons = document.querySelectorAll(".btn.yay");
  const nayButtons = document.querySelectorAll(".btn.nay");

  function waveCard(card, waveClass, finalClass) {
    // Remove any existing wave/final classes so we can restart cleanly
    card.classList.remove("yay-wave", "nay-wave", "final-green", "final-red");

    // Force reflow to reset animation
    void card.offsetWidth;

    // Start the wave animation
    card.classList.add(waveClass);

    // After the wave finishes, remove wave class and add final color
    setTimeout(() => {
      card.classList.remove(waveClass);
      card.classList.add(finalClass);
    }, 1000); // match the duration in CSS
  }

  yayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      waveCard(card, "yay-wave", "final-green");
    });
  });

  nayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      waveCard(card, "nay-wave", "final-red");
    });
  });
});  
