document.addEventListener("DOMContentLoaded", () => {
  Lumina.mount({ active: "agents" });
  document.getElementById("agent-grid").innerHTML = LUMINA_DATA.agents
    .map((agent) => Lumina.agentCard(agent))
    .join("");
});
