document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const navMobile = document.querySelector(".nav-mobile");

if (navToggle && navMobile) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMobile.hidden = isOpen;
  });

  });

  navMobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMobile.hidden = true;
    });
  });
}

const regionTabs = document.querySelectorAll(".region-tab");
const regionPanels = document.querySelectorAll(".plans-panel");

regionTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const region = tab.dataset.region;

    regionTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });

    regionPanels.forEach((panel) => {
      const active = panel.dataset.regionPanel === region;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  });
});

const contactForm = document.querySelector(".hero-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    if (contactForm.action.includes("placeholder")) {
      event.preventDefault();
      alert("Connect a form handler (Formspree, Netlify Forms, etc.) before going live.");
    }
  });
}
