document.addEventListener("DOMContentLoaded", () => {
  Lumina.mount({ active: "contact" });
  const params = new URLSearchParams(location.search);
  const property = Lumina.getProperty(params.get("property"));

  document.getElementById("offices").innerHTML = LUMINA_DATA.offices.map((office) => `<article class="office">
    <h2>${Lumina.esc(office.name)}</h2>
    <p>${Lumina.esc(office.line)}</p>
    <p class="loc">${Lumina.esc(office.hours)}</p>
    <iframe class="map-frame" title="Map of ${Lumina.attr(office.name)}" loading="lazy" src="${Lumina.attr(Lumina.mapSrc(office.lat, office.lng))}"></iframe>
  </article>`).join("");

  const agentSelect = document.getElementById("c-agent");
  agentSelect.innerHTML = `<option value="">Any guide</option>${LUMINA_DATA.agents.map((agent) =>
    `<option value="${Lumina.attr(agent.id)}">${Lumina.esc(agent.name)} · ${Lumina.esc(agent.areas[0])}</option>`
  ).join("")}`;

  const agentId = params.get("agent");
  if (agentId && LUMINA_DATA.agents.some((agent) => agent.id === agentId)) agentSelect.value = agentId;
  const topic = params.get("topic");
  if (topic && [...document.getElementById("c-topic").options].some((option) => option.value === topic)) {
    document.getElementById("c-topic").value = topic;
  }
  if (property) {
    document.getElementById("c-message").value = `I would like to talk about ${property.title} in ${property.location}.`;
  }

  function setError(id, message) {
    document.getElementById(id).setAttribute("aria-invalid", message ? "true" : "false");
    document.getElementById(`${id}-err`).textContent = message || "";
    return !message;
  }

  document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const phone = document.getElementById("c-phone").value.trim();
    const topicValue = document.getElementById("c-topic").value;
    const agent = document.getElementById("c-agent").value;
    const message = document.getElementById("c-message").value.trim();
    const digits = phone.replace(/\D/g, "");
    const ok = [
      setError("c-name", name.length >= 2 ? "" : "Add the name we should use."),
      setError("c-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter an email like name@domain.com."),
      setError("c-phone", digits.length >= 9 && digits.length <= 15 ? "" : "Enter a phone number with at least 9 digits."),
      setError("c-message", message.length >= 10 ? "" : "Write at least a short note, 10 characters or more.")
    ].every(Boolean);
    if (!ok) return;

    Lumina.saveInquiry({
      kind: "contact",
      name,
      email,
      phone,
      topic: topicValue,
      agentId: agent,
      propertyId: property ? property.id : "",
      message,
      created: new Date().toISOString()
    });

    document.getElementById("contact-form").innerHTML = `<div class="success-note">
      <h3>Noted, ${Lumina.esc(name)}.</h3>
      <p>A live Lumina desk would answer this. This showcase stores the note in your browser and does not email anyone.</p>
      <a class="btn btn-primary" href="listings.html">Keep looking at homes</a>
    </div>`;
    Lumina.toast("Message saved on this browser.");
  });
});
