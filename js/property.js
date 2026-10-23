document.addEventListener("DOMContentLoaded", () => {
  Lumina.mount({ active: "listings" });
  const root = document.getElementById("property-root");
  const params = new URLSearchParams(location.search);
  const property = Lumina.getProperty(params.get("id"));

  if (!property) {
    root.innerHTML = `<div class="empty page-miss">
      <h1>That home is not on the desk.</h1>
      <p>It may have been a sample listing that moved. The current homes are one click away.</p>
      <a class="btn btn-primary" href="listings.html">Browse homes</a>
    </div>`;
    return;
  }

  Lumina.remember(property.id);
  document.title = `${property.title} · Lumina Living`;
  const agent = Lumina.getAgent(property.agentId);
  let photoIndex = 0;

  const similar = LUMINA_DATA.properties
    .filter((item) => item.id !== property.id)
    .map((item) => ({
      item,
      score: (item.mood === property.mood ? 2 : 0) + (item.city === property.city ? 2 : 0) + (item.type === property.type ? 1 : 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  const finance = property.status === "rent"
    ? `<div class="pay-box">
        <span>A year of rent</span>
        <strong>${Lumina.esc(Lumina.money(property.price * 12, "sale"))}</strong>
        <small>Many Kenyan lets ask for one or two months as deposit. Confirm it with ${Lumina.esc(agent.name.split(" ")[0])}.</small>
      </div>`
    : `<form id="loan-calc" class="calc-card" novalidate>
        <p class="kicker">Sample mortgage</p>
        <input data-calc="price" type="hidden" value="${property.price}">
        <label>Deposit <strong data-calc="down-label"></strong>
          <input data-calc="down" type="range" min="10" max="60" step="5" value="20">
        </label>
        <label>Sample rate <strong data-calc="rate-label"></strong>
          <input data-calc="rate" type="range" min="8" max="20" step="0.5" value="14.5">
        </label>
        <label>Term <strong data-calc="years-label"></strong>
          <input data-calc="years" type="range" min="5" max="25" step="1" value="20">
        </label>
        <div class="pay-box">
          <span>Estimated monthly</span>
          <strong data-calc="out">—</strong>
          <small data-calc="sub"></small>
        </div>
        <p class="fine-note">A teaching sum, not a bank offer. Stamp duty and legal fees sit outside this figure.</p>
      </form>`;

  root.innerHTML = `<article class="property">
    <p class="crumbs"><a href="index.html">Home</a> / <a href="listings.html">Homes</a> / ${Lumina.esc(property.title)}</p>
    <div class="property-top">
      <div>
        <p class="kicker">${Lumina.esc(Lumina.moodName(property.mood))}</p>
        <h1>${Lumina.esc(property.title)}</h1>
        <p class="lede">${Lumina.esc(property.tagline)}</p>
        <p class="loc">${Lumina.esc(property.address)}</p>
      </div>
      <div class="price-stack">
        <p class="price">${Lumina.esc(Lumina.money(property.price, property.status))}</p>
        <p class="status-pill status-${property.status}">${property.status === "sale" ? "For sale" : "For rent"}</p>
      </div>
    </div>
    <div class="gallery">
      <div class="gallery-main">
        <button type="button" class="gallery-open" data-open-lightbox aria-label="Open photo larger">
          <img id="main-photo" src="${Lumina.attr(property.images[0])}" alt="${Lumina.attr(property.title)}">
        </button>
        <button type="button" class="card-arrow prev" data-gallery-dir="-1" aria-label="Previous photo">‹</button>
        <button type="button" class="card-arrow next" data-gallery-dir="1" aria-label="Next photo">›</button>
        <span class="photo-count" id="gallery-count">1 / ${property.images.length}</span>
      </div>
      <div class="thumbs" id="thumbs">
        ${property.images.map((url, index) => `<button type="button" class="thumb${index === 0 ? " is-active" : ""}" data-thumb="${index}"><img src="${Lumina.attr(url)}" alt=""></button>`).join("")}
      </div>
    </div>
    <div class="property-grid">
      <div>
        <ul class="spec-list">
          <li>${property.beds} bedrooms</li>
          <li>${property.baths} bathrooms</li>
          <li>${property.sqm} m² indoors</li>
          <li>${property.parking} parking</li>
          <li>${Lumina.esc(property.tenure)}</li>
          <li>Built ${property.year}</li>
          <li>${Lumina.esc(property.furnishing)}</li>
          ${property.land ? `<li>${Lumina.esc(property.land)}</li>` : ""}
        </ul>
        <h2>The house</h2>
        <p>${Lumina.esc(property.description)}</p>
        <p class="loc">Listed ${Lumina.esc(Lumina.prettyDate(property.listed))}</p>
        <h2>In the home</h2>
        <div class="amenity-grid">${property.amenities.map((item) => `<span class="amenity">${Lumina.esc(item)}</span>`).join("")}</div>
        <h2>On the map</h2>
        <iframe class="map-frame" title="Map of ${Lumina.attr(property.location)}" loading="lazy" src="${Lumina.attr(Lumina.mapSrc(property.lat, property.lng))}"></iframe>
        <p><a href="${Lumina.attr(Lumina.mapLink(property.lat, property.lng))}" target="_blank" rel="noopener noreferrer">Open this pin in OpenStreetMap</a></p>
      </div>
      <aside class="side-stack">
        <section class="side-card">
          <div class="agent-inline">
            <img src="${Lumina.attr(agent.photo)}" alt="">
            <div>
              <p class="kicker">Your guide</p>
              <h2>${Lumina.esc(agent.name)}</h2>
              <p class="loc">${Lumina.esc(agent.role)}</p>
            </div>
          </div>
          <p>${Lumina.esc(agent.bio)}</p>
          <a class="text-link" href="agents.html#${Lumina.attr(agent.id)}">More about ${Lumina.esc(agent.name.split(" ")[0])}</a>
          <form id="viewing-form" class="stack-form" novalidate>
            <h3>Ask for a viewing</h3>
            <div class="field"><label for="v-name">Name</label><input id="v-name" autocomplete="name"><small class="error" id="v-name-err"></small></div>
            <div class="field"><label for="v-email">Email</label><input id="v-email" type="email" autocomplete="email"><small class="error" id="v-email-err"></small></div>
            <div class="field"><label for="v-phone">Phone</label><input id="v-phone" type="tel" autocomplete="tel"><small class="error" id="v-phone-err"></small></div>
            <div class="field"><label for="v-date">Preferred day</label><input id="v-date" type="date"><small class="error" id="v-date-err"></small></div>
            <div class="field"><label for="v-message">Note</label><textarea id="v-message" placeholder="Morning works better, or we are buying from abroad."></textarea><small class="error" id="v-message-err"></small></div>
            <button class="btn btn-primary" type="submit">Send the request</button>
          </form>
        </section>
        <section class="side-card">${finance}</section>
      </aside>
    </div>
    <section class="similar">
      <div class="section-head"><div><p class="kicker">Close in spirit</p><h2>Other homes to hold beside this one</h2></div></div>
      <div class="card-grid">${similar.map((item) => Lumina.card(item)).join("")}</div>
    </section>
  </article>`;

  const script = document.getElementById("listing-jsonld");
  if (script) {
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.title,
      description: property.description,
      datePosted: property.listed,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: property.location,
        addressRegion: property.city,
        addressCountry: "KE"
      },
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "KES"
      }
    });
  }

  function showPhoto(index) {
    photoIndex = (index + property.images.length) % property.images.length;
    const image = document.getElementById("main-photo");
    image.src = property.images[photoIndex];
    document.getElementById("gallery-count").textContent = `${photoIndex + 1} / ${property.images.length}`;
    document.querySelectorAll(".thumb").forEach((thumb) => {
      thumb.classList.toggle("is-active", Number(thumb.dataset.thumb) === photoIndex);
    });
  }

  root.querySelector(".gallery").addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-thumb]");
    if (thumb) {
      showPhoto(Number(thumb.dataset.thumb));
      return;
    }
    const direction = event.target.closest("[data-gallery-dir]");
    if (direction) {
      showPhoto(photoIndex + Number(direction.dataset.galleryDir));
      return;
    }
    if (event.target.closest("[data-open-lightbox]")) {
      Lumina.openLightbox(property.images, photoIndex, property.title);
    }
  });

  const gallery = root.querySelector(".gallery-main");
  let touchX = null;
  gallery.addEventListener("touchstart", (event) => {
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });
  gallery.addEventListener("touchend", (event) => {
    if (touchX == null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 40) showPhoto(photoIndex + (delta < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  const dateInput = document.getElementById("v-date");
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  dateInput.min = iso;
  dateInput.value = iso;

  function setError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-err`);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message || "";
    return !message;
  }

  document.getElementById("viewing-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("v-name").value.trim();
    const email = document.getElementById("v-email").value.trim();
    const phone = document.getElementById("v-phone").value.trim();
    const date = document.getElementById("v-date").value;
    const message = document.getElementById("v-message").value.trim();
    const digits = phone.replace(/\D/g, "");
    const ok = [
      setError("v-name", name.length >= 2 ? "" : "Tell us the name to put on the gate list."),
      setError("v-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter an email like name@domain.com."),
      setError("v-phone", digits.length >= 9 && digits.length <= 15 ? "" : "Enter a phone number with at least 9 digits."),
      setError("v-date", date && date >= iso ? "" : "Choose today or a later day.")
    ].every(Boolean);
    if (!ok) return;

    Lumina.saveInquiry({
      kind: "viewing",
      propertyId: property.id,
      propertyTitle: property.title,
      agentId: agent.id,
      name,
      email,
      phone,
      date,
      message,
      created: new Date().toISOString()
    });

    document.getElementById("viewing-form").innerHTML = `<div class="success-note">
      <h3>Request noted for ${Lumina.esc(property.title)}.</h3>
      <p>${Lumina.esc(name)}, a live desk would send this to ${Lumina.esc(agent.name)} for ${Lumina.esc(date)}. This showcase keeps it in your browser only.</p>
    </div>`;
    Lumina.toast("Viewing request saved on this browser.");
  });

  const loan = document.getElementById("loan-calc");
  if (loan) Lumina.bindMortgage(loan);
  Lumina.paintSaved();
});
