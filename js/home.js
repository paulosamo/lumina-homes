document.addEventListener("DOMContentLoaded", () => {
  Lumina.mount({ active: "home" });
  const data = LUMINA_DATA;

  const homes = document.getElementById("stat-homes");
  const cities = document.getElementById("stat-cities");
  if (homes) homes.textContent = String(data.properties.length);
  if (cities) cities.textContent = String(new Set(data.properties.map((property) => property.city)).size);

  document.getElementById("mood-grid").innerHTML = data.moods.map((mood) => {
    const count = data.properties.filter((property) => property.mood === mood.id).length;
    const noun = count === 1 ? "home" : "homes";
    return `<a class="mood mood-${mood.id}" href="listings.html?mood=${mood.id}">
      <span class="mood-kicker">${count} ${noun}</span>
      <strong>${Lumina.esc(mood.name)}</strong>
      <span>${Lumina.esc(mood.blurb)}</span>
    </a>`;
  }).join("");

  const featured = data.properties.filter((property) => property.featured).slice(0, 5);
  document.getElementById("featured-grid").innerHTML = featured.map((property) => Lumina.card(property)).join("");

  document.getElementById("hood-scroll").innerHTML = data.neighbourhoods.map((hood) => {
    const count = data.properties.filter((property) => property.location === hood.name).length;
    return `<a class="hood" href="listings.html?q=${encodeURIComponent(hood.name)}">
      <img src="${Lumina.attr(hood.image)}" alt="">
      <span>
        <strong>${Lumina.esc(hood.name)}</strong>
        <small>${Lumina.esc(hood.city)} · ${count} on the desk</small>
        <em>${Lumina.esc(hood.blurb)}</em>
      </span>
    </a>`;
  }).join("");

  document.getElementById("agent-preview").innerHTML = data.agents.slice(0, 3)
    .map((agent) => Lumina.agentCard(agent, { compact: true }))
    .join("");

  document.getElementById("quotes").innerHTML = data.testimonials.map((item) => `<figure class="quote">
    <blockquote>“${Lumina.esc(item.quote)}”</blockquote>
    <figcaption><strong>${Lumina.esc(item.name)}</strong><span>${Lumina.esc(item.detail)}</span></figcaption>
  </figure>`).join("");

  const recent = Lumina.readList(Lumina.KEYS.viewed).map((id) => Lumina.getProperty(id)).filter(Boolean);
  if (recent.length) {
    const section = document.getElementById("recent");
    section.hidden = false;
    document.getElementById("recent-grid").innerHTML = recent.slice(0, 3).map((property) => Lumina.card(property)).join("");
  }

  Lumina.bindMortgage(document.getElementById("home-calc"));
  Lumina.paintSaved();
});
