const grid = document.getElementById("agent-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
let agentCardsRevealed = false;

function renderAgents(filter = "all") {
  if (!grid || !window.AGENT_ROSTER) return;

  const agents = window.AGENT_ROSTER.filter(
    (agent) => filter === "all" || agent.specialtyKey === filter
  );

  grid.innerHTML = agents
    .map(
      (agent) => `
    <article class="agent-card" data-specialty="${agent.specialtyKey}">
      <a href="${window.getAgentProfileUrl(agent.slug)}" class="agent-card-link">
        ${window.renderAgentAvatar(agent)}
        <div class="agent-card-body">
          <h2>${agent.name}</h2>
          <p class="agent-card-title">${agent.title}</p>
          <p class="agent-tag">${agent.specialty}</p>
          <p class="agent-markets">${agent.markets}</p>
          <p class="agent-card-summary">${agent.summary}</p>
          <span class="agent-card-cta">View profile</span>
        </div>
      </a>
    </article>`
    )
    .join("");

  if (!agentCardsRevealed && window.AshlarReveal) {
    window.AshlarReveal.refreshCards(grid);
    agentCardsRevealed = true;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderAgents(button.dataset.filter);
  });
});

renderAgents();
