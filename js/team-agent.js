const params = new URLSearchParams(window.location.search);
const slug = params.get("slug")?.trim();

const profileSection = document.getElementById("agent-profile");
const notFoundSection = document.getElementById("agent-not-found");

const MOBILE_MQ = window.matchMedia("(max-width: 767px)");
const TRANSACTION_ROWS_DESKTOP = 2;
const TRANSACTION_ROWS_MOBILE = 3;
const TRANSACTION_GRID_MIN_COL_PX = 260;
const TRANSACTION_GRID_GAP_PX = 16;

let transactionPaginationCleanup = null;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function renderBioParagraphs(bio) {
  const paragraphs = String(bio || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
}

function renderAddress(agent) {
  const lines = agent.address || window.BROKERAGE_ADDRESS || [];
  return lines.map((line) => `<span>${line}</span>`).join("<br>");
}

function renderTransactionCard(transaction) {
  const meta = [
    transaction.beds != null ? `${transaction.beds} Beds` : null,
    transaction.baths != null ? `${transaction.baths} Baths` : null,
    transaction.sqft != null ? `${formatNumber(transaction.sqft)} Sq.Ft.` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const statusClass =
    transaction.status === "For Sale"
      ? "agent-transaction-status--sale"
      : "agent-transaction-status--sold";

  const photoUrl = window.getTransactionPhotoUrl?.(transaction) || "";
  const photoAlt = `${transaction.street}, ${transaction.city}`;

  return `
    <article class="agent-transaction-card">
      <img class="agent-transaction-photo" src="${photoUrl}" alt="${photoAlt}" loading="lazy" width="300" height="175">
      <div class="agent-transaction-body">
        <p class="agent-transaction-status ${statusClass}">${transaction.status}</p>
        <h3 class="agent-transaction-street">${transaction.street}</h3>
        <p class="agent-transaction-city">${transaction.city}</p>
        ${meta ? `<p class="agent-transaction-meta">${meta}</p>` : ""}
        <p class="agent-transaction-price">${formatMoney(transaction.price)}</p>
      </div>
    </article>`;
}

function estimateTransactionColumns(grid) {
  const width = grid.clientWidth || grid.parentElement?.clientWidth || 0;
  if (!width) return 1;
  return Math.max(
    1,
    Math.floor((width + TRANSACTION_GRID_GAP_PX) / (TRANSACTION_GRID_MIN_COL_PX + TRANSACTION_GRID_GAP_PX))
  );
}

function getTransactionRowsPerPage() {
  return MOBILE_MQ.matches ? TRANSACTION_ROWS_MOBILE : TRANSACTION_ROWS_DESKTOP;
}

function getTransactionPageSize(grid) {
  return getTransactionRowsPerPage() * estimateTransactionColumns(grid);
}

function setupTransactionPagination(transactions, grid) {
  if (transactionPaginationCleanup) {
    transactionPaginationCleanup();
    transactionPaginationCleanup = null;
  }

  const pagination = document.getElementById("agent-transactions-pagination");
  const prevBtn = document.getElementById("agent-transactions-prev");
  const nextBtn = document.getElementById("agent-transactions-next");
  const statusEl = document.getElementById("agent-transactions-page-status");

  let currentPage = 0;
  let pageSize = 1;

  function renderPage() {
    pageSize = Math.max(1, getTransactionPageSize(grid));
    const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

    if (currentPage >= totalPages) currentPage = totalPages - 1;
    if (currentPage < 0) currentPage = 0;

    const start = currentPage * pageSize;
    grid.innerHTML = transactions
      .slice(start, start + pageSize)
      .map(renderTransactionCard)
      .join("");

    const needsPagination = transactions.length > pageSize;
    pagination.hidden = !needsPagination;

    if (needsPagination) {
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage >= totalPages - 1;
      statusEl.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    } else {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      statusEl.textContent = "";
    }
  }

  function goToPage(page) {
    currentPage = page;
    renderPage();
  }

  function onPrev() {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function onNext() {
    const totalPages = Math.ceil(transactions.length / pageSize);
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function onViewportChange() {
    currentPage = 0;
    renderPage();
  }

  let lastPageSize = 0;
  function onGridResize() {
    const nextPageSize = Math.max(1, getTransactionPageSize(grid));
    if (nextPageSize !== lastPageSize) {
      lastPageSize = nextPageSize;
      currentPage = 0;
      renderPage();
    }
  }

  prevBtn.addEventListener("click", onPrev);
  nextBtn.addEventListener("click", onNext);
  MOBILE_MQ.addEventListener("change", onViewportChange);

  const resizeObserver = new ResizeObserver(onGridResize);
  resizeObserver.observe(grid);

  renderPage();
  requestAnimationFrame(renderPage);

  transactionPaginationCleanup = () => {
    prevBtn.removeEventListener("click", onPrev);
    nextBtn.removeEventListener("click", onNext);
    MOBILE_MQ.removeEventListener("change", onViewportChange);
    resizeObserver.disconnect();
  };
}

function showNotFound() {
  if (transactionPaginationCleanup) {
    transactionPaginationCleanup();
    transactionPaginationCleanup = null;
  }
  document.title = "Agent not found | Ashlar Lane";
  profileSection.hidden = true;
  notFoundSection.hidden = false;
}

function renderAgent(agent) {
  const firstName = agent.firstName || agent.name.split(" ")[0];

  document.title = `${agent.name} | Ashlar Lane`;
  document.querySelector('meta[name="description"]').content =
    `${agent.name} — Ashlar Lane agent serving ${agent.markets}. ${agent.specialty}.`;

  document.getElementById("agent-meet-heading").textContent = `Meet ${agent.name}`;

  const avatar = document.getElementById("agent-avatar");
  avatar.src = window.getAgentPhotoUrl(agent);
  avatar.alt = agent.name;

  document.getElementById("agent-bio").innerHTML = renderBioParagraphs(agent.bio);

  const phoneLink = document.getElementById("agent-phone-link");
  phoneLink.href = `tel:${agent.phone}`;
  phoneLink.textContent = agent.phoneDisplay;

  document.getElementById("agent-license").textContent = agent.license || "—";

  const emailLink = document.getElementById("agent-email-link");
  emailLink.href = `mailto:${agent.email}`;
  emailLink.textContent = agent.email;

  document.getElementById("agent-address").innerHTML = renderAddress(agent);

  const headerPhone = document.getElementById("header-phone");
  headerPhone.href = `tel:${agent.phone}`;
  headerPhone.textContent = agent.phoneDisplay;

  const headerContact = document.getElementById("header-contact");
  headerContact.textContent = `Contact ${firstName}`;

  const footerEmail = document.getElementById("footer-email");
  footerEmail.href = `mailto:${agent.email}`;
  footerEmail.textContent = agent.email;

  const helpSection = document.getElementById("agent-help-section");
  const helpList = document.getElementById("agent-help-list");
  const helpItems = agent.helpItems || [];

  if (helpItems.length) {
    helpList.innerHTML = helpItems.map((item) => `<li>${item}</li>`).join("");
    helpSection.hidden = false;
  } else {
    helpList.innerHTML = "";
    helpSection.hidden = true;
  }

  const transactionsSection = document.getElementById("agent-transactions-section");
  const transactionsGrid = document.getElementById("agent-transactions");
  const transactions = agent.transactions || [];

  if (transactions.length) {
    transactionsSection.hidden = false;
    setupTransactionPagination(transactions, transactionsGrid);
  } else {
    if (transactionPaginationCleanup) {
      transactionPaginationCleanup();
      transactionPaginationCleanup = null;
    }
    transactionsGrid.innerHTML = "";
    document.getElementById("agent-transactions-pagination").hidden = true;
    transactionsSection.hidden = true;
  }

  profileSection.hidden = false;
  notFoundSection.hidden = true;
}

const agent = slug ? window.getAgentBySlug?.(slug) : null;

if (agent) {
  renderAgent(agent);
} else {
  showNotFound();
}
