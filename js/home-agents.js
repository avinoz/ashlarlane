const previewGrid = document.getElementById("home-agent-grid");
const PREVIEW_CARD_COUNT = 8;

function renderAgentCard(agent) {
  return `
    <article class="agent-card">
      <a href="team/${agent.slug}.html" class="agent-card-link">
        <div class="agent-avatar" aria-hidden="true">${agent.initials}</div>
        <div class="agent-card-body">
          <h2>${agent.name}</h2>
          <p class="agent-tag">${agent.specialty}</p>
          <p class="agent-markets">${agent.markets}</p>
          <span class="agent-card-cta">View profile</span>
        </div>
      </a>
    </article>`;
}

if (previewGrid && window.AGENT_ROSTER?.length) {
  const roster = window.AGENT_ROSTER;
  const previewAgents = Array.from({ length: PREVIEW_CARD_COUNT }, (_, i) => roster[i % roster.length]);
  const cardsHtml = previewAgents.map(renderAgentCard).join("");

  previewGrid.innerHTML = `
    <div class="agent-marquee__group">${cardsHtml}</div>
    <div class="agent-marquee__group" aria-hidden="true">${cardsHtml}</div>`;
}
