document.querySelectorAll(".hero-video").forEach((heroVideo) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncVideo = () => {
    if (prefersReducedMotion.matches) {
      heroVideo.pause();
      heroVideo.removeAttribute("autoplay");
    } else {
      heroVideo.play().catch(() => {});
    }
  };
  syncVideo();
  prefersReducedMotion.addEventListener("change", syncVideo);
});

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const navMobile = document.querySelector(".nav-mobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMobile.hidden = isOpen;
  });

  navMobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMobile.hidden = true;
    });
  });
}

document.querySelectorAll(".hero-form").forEach((contactForm) => {
  contactForm.addEventListener("submit", (event) => {
    if (contactForm.action.includes("placeholder")) {
      event.preventDefault();
      alert("Connect a form handler (Formspree, Netlify Forms, etc.) before going live.");
    }
  });
});
