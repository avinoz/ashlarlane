(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const observed = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  function observe(el) {
    if (!el || observed.has(el)) return;
    observed.add(el);
    observer.observe(el);
  }

  function splitWords(el) {
    if (!el || el.dataset.revealSplit) return 0;

    const text = el.textContent.trim();
    if (!text) return 0;

    el.dataset.revealSplit = "true";
    el.setAttribute("aria-label", text);
    el.textContent = "";

    const words = text.split(/\s+/);

    words.forEach((word, wordIndex) => {
      const span = document.createElement("span");
      span.className = "reveal-word";
      span.style.setProperty("--word-index", wordIndex);
      span.textContent = word;
      span.setAttribute("aria-hidden", "true");
      el.appendChild(span);

      if (wordIndex < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });

    return words.length;
  }

  function getBlurElements(block) {
    const explicit = [
      ...block.querySelectorAll(".hero-lead, .section-lead, .page-hero-lead"),
    ];
    if (explicit.length) return explicit;

    if (block.matches(".section-head")) {
      const p = block.querySelector("p:not(.eyebrow)");
      return p ? [p] : [];
    }

    if (block.matches(".agent-profile-intro")) {
      return [...block.querySelectorAll(".agent-card-title, .agent-markets")];
    }

    if (
      block.parentElement?.classList.contains("cta-band-inner") &&
      block.querySelector("h2")
    ) {
      const p = block.querySelector("p");
      return p ? [p] : [];
    }

    return [];
  }

  function setupHeadingBlock(block, { revealImmediate = false } = {}) {
    if (!block || block.dataset.revealReady) return;
    block.dataset.revealReady = "true";
    block.classList.add("reveal-heading");

    let eyebrowCount = 0;
    let headingCount = 0;

    const eyebrow = block.querySelector(".eyebrow, .agent-tag");
    const heading = block.querySelector("h1, h2");

    if (eyebrow) {
      eyebrowCount = splitWords(eyebrow);
      eyebrow.classList.add("reveal-eyebrow");
    }

    if (heading) {
      headingCount = splitWords(heading);
    }

    getBlurElements(block).forEach((el, index) => {
      el.classList.add("reveal-blur");
      el.style.setProperty("--blur-index", index);
    });

    block.style.setProperty("--eyebrow-count", eyebrowCount);
    block.style.setProperty("--heading-count", headingCount);
    observe(block);

    if (revealImmediate) {
      requestAnimationFrame(() => block.classList.add("is-revealed"));
    }
  }

  function setupCardGrid(grid) {
    if (!grid || grid.dataset.revealReady) return;
    grid.dataset.revealReady = "true";
    grid.classList.add("reveal-cards");

    grid.querySelectorAll(
      ":scope > .feature-card, :scope > .stack-card, :scope > .agent-card, :scope > article"
    ).forEach((card, index) => {
      card.classList.add("reveal-card");
      card.style.setProperty("--item-index", index);
    });

    observe(grid);
  }

  function init() {
    document
      .querySelectorAll(
        ".section-head, .hero-copy, .page-hero .container, .agent-profile-intro, .cta-band-inner > div:first-child"
      )
      .forEach((block) => {
        const revealImmediate =
          block.matches(".hero-copy") ||
          block.matches(".agent-profile-intro") ||
          Boolean(block.closest(".page-hero"));
        setupHeadingBlock(block, { revealImmediate });
      });

    document.querySelectorAll(".split-section").forEach((section) => {
      const textCol = section.querySelector(":scope > div:first-child");
      if (textCol?.querySelector("h2")) {
        setupHeadingBlock(textCol);
      }

      const cards = section.querySelector(".stack-cards, .feature-grid");
      if (cards) setupCardGrid(cards);
    });

    document.querySelectorAll(".section .feature-grid, .section .stack-cards").forEach((grid) => {
      setupCardGrid(grid);
    });

    document.querySelectorAll("#agent-grid").forEach(setupCardGrid);
  }

  window.AshlarReveal = {
    refreshCards(selector) {
      const grid = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (!grid) return;
      delete grid.dataset.revealReady;
      grid.classList.remove("reveal-cards", "is-revealed");
      grid.querySelectorAll(".reveal-card").forEach((card) => {
        card.classList.remove("reveal-card");
        card.style.removeProperty("--item-index");
      });
      setupCardGrid(grid);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
