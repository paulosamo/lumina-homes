/* Shared chrome, cards, favourites, compare, and mortgage maths. */
const Lumina = (() => {
  const KEYS = {
    saved: "lumina-saved",
    compare: "lumina-compare",
    viewed: "lumina-viewed",
    inquiries: "lumina-inquiries",
    news: "lumina-news"
  };

  const kes = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  });

  let wired = false;
  let savedOpen = false;
  let modalOpen = false;
  let lbOpen = false;
  let toastTimer = 0;
  let lb = { urls: [], index: 0, caption: "" };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function attr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function readList(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      /* Private mode can refuse storage. The page still works. */
    }
  }

  function money(amount, status) {
    const formatted = kes.format(Number(amount) || 0);
    return status === "rent" ? `${formatted} / month` : formatted;
  }

  function prettyDate(iso) {
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
  }

  function getProperty(id) {
    return LUMINA_DATA.properties.find((property) => property.id === id) || null;
  }

  function getAgent(id) {
    return LUMINA_DATA.agents.find((agent) => agent.id === id) || null;
  }

  function moodName(id) {
    const mood = LUMINA_DATA.moods.find((item) => item.id === id);
    return mood ? mood.name : id;
  }

  function mortgage({ price, downPct, annualRate, years }) {
    const loan = Math.max(0, Number(price) * (1 - Number(downPct) / 100));
    const months = Math.max(1, Number(years) * 12);
    const monthlyRate = Number(annualRate) / 100 / 12;
    const monthly = monthlyRate === 0
      ? loan / months
      : (loan * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    const total = monthly * months;
    return { loan, monthly, total, interest: Math.max(0, total - loan) };
  }

  function mapSrc(lat, lng) {
    const pad = 0.018;
    const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].join("%2C");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }

  function mapLink(lat, lng) {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
  }

  function logo(suffix) {
    return `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="lg-${suffix}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffc24b"/><stop offset="0.48" stop-color="#ff5a3c"/><stop offset="1" stop-color="#6d28d9"/>
      </linearGradient></defs>
      <rect width="40" height="40" rx="12" fill="url(#lg-${suffix})"/>
      <path d="M9 23.5 20 13l11 10.5V31H9Z" fill="#fff"/>
      <path d="M17.5 24.5h5V31h-5Z" fill="#5b21b6"/>
    </svg></span>`;
  }

  function heartIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  function headerHTML(active) {
    const links = [
      ["index.html", "home", "Home"],
      ["listings.html", "listings", "Homes"],
      ["agents.html", "agents", "Agents"],
      ["about.html", "about", "About"],
      ["contact.html", "contact", "Contact"]
    ].map(([href, id, label]) => {
      const current = id === active ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    }).join("");

    return `<div class="header-inner wrap">
      <a class="brand" href="index.html">${logo("h")}<span class="brand-text"><strong>Lumina</strong><small>Living</small></span></a>
      <nav class="nav" id="primary-nav" aria-label="Primary">${links}</nav>
      <div class="header-actions">
        <button type="button" class="icon-btn" data-action="open-saved" aria-label="Saved homes">${heartIcon()}<span class="count" id="saved-count">0</span></button>
        <a class="btn btn-primary" href="contact.html">Book a viewing</a>
        <button type="button" class="nav-toggle" id="nav-toggle" data-action="nav" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span><span class="sr">Menu</span></button>
      </div>
    </div>`;
  }

  function footerHTML() {
    return `<div class="wrap foot-grid">
      <div class="foot-brand">${logo("f")}
        <p>A Kenyan desk for homes with colour, light, and a neighbourhood you will actually live in.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <a href="listings.html">All homes</a>
        <a href="listings.html?status=sale">Buy</a>
        <a href="listings.html?status=rent">Rent</a>
        <a href="listings.html?mood=ocean">Coast</a>
        <a href="agents.html">Agents</a>
      </div>
      <div>
        <h2>Visit</h2>
        <p>Prism Court, 4th Floor<br>Westlands Road, Nairobi</p>
        <p>Mon–Fri 8:30–5:30<br>Sat 9:00–1:00</p>
      </div>
      <form id="news-form" class="news-form" novalidate>
        <h2>Notes from the desk</h2>
        <p>New homes and neighbourhood notes, kept on this browser.</p>
        <label class="sr" for="news-email">Email</label>
        <input id="news-email" type="email" placeholder="you@email.com" autocomplete="email">
        <button class="btn btn-primary" type="submit">Join the list</button>
      </form>
    </div>
    <p class="fine wrap">© <span id="year"></span> Lumina Living. Sample homes, prices, and people for this demonstration.</p>`;
  }

  function chromeHTML() {
    return `<div id="scrim" class="scrim" hidden></div>
      <aside id="saved-panel" class="saved-panel" hidden aria-labelledby="saved-title">
        <div class="saved-head">
          <h2 id="saved-title">Saved homes</h2>
          <button type="button" class="btn btn-ghost" data-action="close-saved">Close</button>
        </div>
        <div id="saved-list"></div>
      </aside>
      <div id="compare-bar" class="compare-bar" hidden>
        <div id="compare-pills" class="compare-pills"></div>
        <button type="button" class="btn btn-primary" data-action="open-compare">Compare</button>
        <button type="button" class="btn btn-light" data-action="clear-compare">Clear</button>
      </div>
      <div id="compare-modal" class="modal" hidden>
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="compare-title">
          <div class="saved-head">
            <h2 id="compare-title">Compare homes</h2>
            <button type="button" class="btn btn-ghost" data-action="close-modal">Close</button>
          </div>
          <div id="compare-table" class="compare-table"></div>
        </div>
      </div>
      <div id="lightbox" class="lightbox" hidden>
        <button type="button" class="lb-nav prev" data-action="lb-prev" aria-label="Previous photo">‹</button>
        <figure>
          <img id="lb-img" alt="">
          <figcaption id="lb-caption"></figcaption>
        </figure>
        <button type="button" class="lb-nav next" data-action="lb-next" aria-label="Next photo">›</button>
        <button type="button" class="lb-close" data-action="lb-close" aria-label="Close photos">×</button>
      </div>
      <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
      <button type="button" id="back-top" class="back-top" data-action="top" hidden aria-label="Back to top">↑</button>`;
  }

  function card(property) {
    const saved = readList(KEYS.saved).includes(property.id);
    const compared = readList(KEYS.compare).includes(property.id);
    const photos = property.images;
    const arrows = photos.length > 1
      ? `<button type="button" class="card-arrow prev" data-action="photo" data-dir="-1" aria-label="Previous photo">‹</button>
         <button type="button" class="card-arrow next" data-action="photo" data-dir="1" aria-label="Next photo">›</button>
         <span class="photo-count">${1} / ${photos.length}</span>`
      : "";
    const badge = property.badge ? `<span class="badge">${esc(property.badge)}</span>` : "";
    const statusLabel = property.status === "sale" ? "For sale" : "For rent";

    return `<article class="card">
      <div class="card-media">
        <a class="card-link" href="property.html?id=${attr(property.id)}">
          <img src="${attr(photos[0])}" alt="${attr(property.title)}" data-photos="${attr(photos.join("|"))}" data-index="0">
        </a>
        ${badge}
        <span class="status-pill status-${property.status}">${statusLabel}</span>
        <span class="mood-dot mood-${property.mood}" title="${attr(moodName(property.mood))}"></span>
        <button type="button" class="heart${saved ? " is-on" : ""}" data-action="save" data-id="${attr(property.id)}" aria-pressed="${saved}" aria-label="Save ${attr(property.title)}">${heartIcon()}</button>
        ${arrows}
      </div>
      <div class="card-body">
        <p class="price">${esc(money(property.price, property.status))}</p>
        <h3><a href="property.html?id=${attr(property.id)}">${esc(property.title)}</a></h3>
        <p class="loc">${esc(property.location)}, ${esc(property.city)}</p>
        <ul class="meta">
          <li>${property.beds} bed${property.beds === 1 ? "" : "s"}</li>
          <li>${property.baths} bath${property.baths === 1 ? "" : "s"}</li>
          <li>${property.sqm} m²</li>
        </ul>
        <div class="card-actions">
          <button type="button" class="compare-btn${compared ? " is-on" : ""}" data-action="compare" data-id="${attr(property.id)}" aria-pressed="${compared}">${compared ? "In compare" : "Compare"}</button>
          <a class="text-link" href="property.html?id=${attr(property.id)}">View home</a>
        </div>
      </div>
    </article>`;
  }

  function agentCard(agent, opts) {
    const compact = Boolean(opts && opts.compact);
    const homes = LUMINA_DATA.properties.filter((property) => property.agentId === agent.id);
    const list = compact ? "" : `<ul class="mini-list">${homes.map((property) =>
      `<li><a href="property.html?id=${attr(property.id)}">${esc(property.title)}</a><span>${esc(money(property.price, property.status))}</span></li>`
    ).join("")}</ul>`;
    const idAttr = compact ? "" : ` id="${attr(agent.id)}"`;
    return `<article class="agent-card"${idAttr}>
      <img src="${attr(agent.photo)}" alt="${attr(agent.name)}">
      <div>
        <p class="kicker">${esc(agent.role)}</p>
        <h3>${esc(agent.name)}</h3>
        <p>${esc(agent.bio)}</p>
        <p class="loc">${agent.years} years · ${esc(agent.languages.join(" & "))} · ${esc(agent.areas.join(", "))}</p>
        <p class="loc">${homes.length} ${homes.length === 1 ? "home" : "homes"} on the desk</p>
        ${list}
        <a class="btn btn-primary" href="contact.html?agent=${attr(agent.id)}">Talk to ${esc(agent.name.split(" ")[0])}</a>
      </div>
    </article>`;
  }

  function faqHTML(items) {
    return items.map((item) => `<details class="faq"><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join("");
  }

  function fillFaq() {
    document.querySelectorAll("[data-faq]").forEach((el) => {
      const count = Number(el.dataset.faq || 0);
      const items = count > 0 ? LUMINA_DATA.faqs.slice(0, count) : LUMINA_DATA.faqs;
      el.innerHTML = faqHTML(items);
    });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 3200);
  }

  function syncLock() {
    const nav = document.getElementById("primary-nav");
    const navOpen = Boolean(nav && nav.classList.contains("is-open"));
    document.body.classList.toggle("lock", navOpen || savedOpen || modalOpen || lbOpen);
    const scrim = document.getElementById("scrim");
    if (scrim) scrim.hidden = !(savedOpen || modalOpen);
  }

  function closeNav() {
    const nav = document.getElementById("primary-nav");
    const btn = document.getElementById("nav-toggle");
    if (nav) nav.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    syncLock();
  }

  function toggleNav() {
    const nav = document.getElementById("primary-nav");
    const btn = document.getElementById("nav-toggle");
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    syncLock();
  }

  function paintSaved() {
    const saved = new Set(readList(KEYS.saved));
    const compare = new Set(readList(KEYS.compare));
    document.querySelectorAll('[data-action="save"]').forEach((button) => {
      const on = saved.has(button.dataset.id);
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll('[data-action="compare"]').forEach((button) => {
      const on = compare.has(button.dataset.id);
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      button.textContent = on ? "In compare" : "Compare";
    });
    const count = document.getElementById("saved-count");
    if (count) count.textContent = String(saved.size);
    renderSavedList();
    renderCompareBar();
  }

  function renderSavedList() {
    const host = document.getElementById("saved-list");
    if (!host) return;
    const homes = readList(KEYS.saved).map(getProperty).filter(Boolean);
    if (!homes.length) {
      host.innerHTML = `<p class="saved-empty">Tap the heart on a home and it waits here, on this browser.</p>`;
      return;
    }
    host.innerHTML = homes.map((property) => `<div class="saved-item">
      <a class="saved-row" href="property.html?id=${attr(property.id)}">
        <img src="${attr(property.images[0])}" alt="">
        <span><strong>${esc(property.title)}</strong><small>${esc(property.location)} · ${esc(money(property.price, property.status))}</small></span>
      </a>
      <button type="button" data-action="remove-saved" data-id="${attr(property.id)}">Remove</button>
    </div>`).join("");
  }

  function renderCompareBar() {
    const bar = document.getElementById("compare-bar");
    const wrap = document.getElementById("compare-pills");
    if (!bar || !wrap) return;
    const homes = readList(KEYS.compare).map(getProperty).filter(Boolean);
    bar.hidden = homes.length === 0;
    document.body.classList.toggle("has-compare", homes.length > 0);
    wrap.innerHTML = homes.map((property) => `<span class="pill-home">${esc(property.title)} <button type="button" data-action="remove-compare" data-id="${attr(property.id)}" aria-label="Remove ${attr(property.title)}">×</button></span>`).join("");
  }

  function toggleSaved(id) {
    const list = readList(KEYS.saved);
    const index = list.indexOf(id);
    if (index >= 0) list.splice(index, 1);
    else list.unshift(id);
    writeList(KEYS.saved, list);
    paintSaved();
    const property = getProperty(id);
    toast(index >= 0 ? "Removed from saved homes." : `${property ? property.title : "Home"} saved on this browser.`);
  }

  function toggleCompare(id) {
    const list = readList(KEYS.compare);
    const index = list.indexOf(id);
    if (index >= 0) {
      list.splice(index, 1);
    } else if (list.length >= 3) {
      toast("Compare holds three homes. Remove one to add another.");
      return;
    } else {
      list.push(id);
      toast("Added to compare.");
    }
    writeList(KEYS.compare, list);
    paintSaved();
  }

  function clearCompare() {
    writeList(KEYS.compare, []);
    paintSaved();
    closeModal();
  }

  function compareTable(homes) {
    const rows = [
      ["Price", (home) => money(home.price, home.status)],
      ["Offer", (home) => (home.status === "sale" ? "For sale" : "For rent")],
      ["Type", (home) => home.type],
      ["Where", (home) => `${home.location}, ${home.city}`],
      ["Beds", (home) => String(home.beds)],
      ["Baths", (home) => String(home.baths)],
      ["Indoor", (home) => `${home.sqm} m²`],
      ["Land", (home) => home.land || "—"],
      ["Parking", (home) => String(home.parking)],
      ["Tenure", (home) => home.tenure],
      ["Built", (home) => String(home.year)],
      ["Mood", (home) => moodName(home.mood)]
    ];
    const head = homes.map((home) => `<th scope="col"><a href="property.html?id=${attr(home.id)}">${esc(home.title)}</a></th>`).join("");
    const photos = `<tr><th scope="row">Photo</th>${homes.map((home) => `<td><img src="${attr(home.images[0])}" alt=""></td>`).join("")}</tr>`;
    const body = rows.map(([label, read]) => `<tr><th scope="row">${label}</th>${homes.map((home) => `<td>${esc(read(home))}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr><th scope="col"></th>${head}</tr></thead><tbody>${photos}${body}</tbody></table>`;
  }

  function openSaved() {
    savedOpen = true;
    document.getElementById("saved-panel").hidden = false;
    syncLock();
  }

  function closeSaved() {
    savedOpen = false;
    const panel = document.getElementById("saved-panel");
    if (panel) panel.hidden = true;
    syncLock();
  }

  function openCompare() {
    const homes = readList(KEYS.compare).map(getProperty).filter(Boolean);
    if (homes.length < 2) {
      toast("Add at least two homes to compare.");
      return;
    }
    closeSaved();
    document.getElementById("compare-table").innerHTML = compareTable(homes);
    modalOpen = true;
    document.getElementById("compare-modal").hidden = false;
    syncLock();
  }

  function closeModal() {
    modalOpen = false;
    const modal = document.getElementById("compare-modal");
    if (modal) modal.hidden = true;
    syncLock();
  }

  function openLightbox(urls, index, caption) {
    lb = { urls: urls.slice(), index: index || 0, caption: caption || "Home photo" };
    lbOpen = true;
    document.getElementById("lightbox").hidden = false;
    paintLightbox();
    syncLock();
  }

  function paintLightbox() {
    const image = document.getElementById("lb-img");
    image.src = lb.urls[lb.index];
    image.alt = lb.caption;
    document.getElementById("lb-caption").textContent = `${lb.caption} · ${lb.index + 1} of ${lb.urls.length}`;
  }

  function shiftLightbox(direction) {
    if (!lb.urls.length) return;
    lb.index = (lb.index + direction + lb.urls.length) % lb.urls.length;
    paintLightbox();
  }

  function closeLightbox() {
    lbOpen = false;
    const box = document.getElementById("lightbox");
    if (box) box.hidden = true;
    syncLock();
  }

  function shiftPhoto(button) {
    const media = button.closest(".card-media");
    const image = media.querySelector("img");
    const urls = (image.dataset.photos || "").split("|").filter(Boolean);
    if (urls.length < 2) return;
    const direction = Number(button.dataset.dir) || 1;
    let index = Number(image.dataset.index || 0);
    index = (index + direction + urls.length) % urls.length;
    image.dataset.index = String(index);
    image.src = urls[index];
    const count = media.querySelector(".photo-count");
    if (count) count.textContent = `${index + 1} / ${urls.length}`;
  }

  function onNews(event) {
    event.preventDefault();
    const input = document.getElementById("news-email");
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter an email like name@domain.com.");
      input.focus();
      return;
    }
    const list = readList(KEYS.news);
    if (!list.includes(email)) {
      list.push(email);
      writeList(KEYS.news, list);
    }
    input.value = "";
    toast("You are on the list on this browser.");
  }

  function onScroll() {
    const header = document.getElementById("site-header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    const top = document.getElementById("back-top");
    if (top) top.hidden = window.scrollY < 520;
  }

  function onKey(event) {
    if (event.key === "Escape") {
      if (lbOpen) closeLightbox();
      else if (modalOpen) closeModal();
      else if (savedOpen) closeSaved();
      else closeNav();
    }
    if (!lbOpen) return;
    if (event.key === "ArrowRight") shiftLightbox(1);
    if (event.key === "ArrowLeft") shiftLightbox(-1);
  }

  function onClick(event) {
    if (event.target.closest("#primary-nav a")) closeNav();
    if (event.target.id === "scrim") {
      closeSaved();
      closeModal();
      return;
    }
    if (event.target.id === "compare-modal") {
      closeModal();
      return;
    }
    if (event.target.id === "lightbox") {
      closeLightbox();
      return;
    }

    const control = event.target.closest("[data-action]");
    if (!control) return;
    const action = control.dataset.action;
    const id = control.dataset.id;
    if (action === "save" || action === "remove-saved") toggleSaved(id);
    else if (action === "compare" || action === "remove-compare") toggleCompare(id);
    else if (action === "photo") shiftPhoto(control);
    else if (action === "open-saved") openSaved();
    else if (action === "close-saved") closeSaved();
    else if (action === "nav") toggleNav();
    else if (action === "open-compare") openCompare();
    else if (action === "clear-compare") clearCompare();
    else if (action === "close-modal") closeModal();
    else if (action === "lb-next") shiftLightbox(1);
    else if (action === "lb-prev") shiftLightbox(-1);
    else if (action === "lb-close") closeLightbox();
    else if (action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function remember(id) {
    const list = readList(KEYS.viewed).filter((item) => item !== id);
    list.unshift(id);
    writeList(KEYS.viewed, list.slice(0, 6));
  }

  function saveInquiry(entry) {
    const list = readList(KEYS.inquiries);
    list.unshift(entry);
    writeList(KEYS.inquiries, list.slice(0, 40));
  }

  function bindMortgage(root) {
    const price = root.querySelector('[data-calc="price"]');
    const down = root.querySelector('[data-calc="down"]');
    const rate = root.querySelector('[data-calc="rate"]');
    const years = root.querySelector('[data-calc="years"]');
    const out = root.querySelector('[data-calc="out"]');
    const sub = root.querySelector('[data-calc="sub"]');
    if (!price || !down || !rate || !years || !out) return;
    const run = () => {
      const result = mortgage({
        price: Number(price.value),
        downPct: Number(down.value),
        annualRate: Number(rate.value),
        years: Number(years.value)
      });
      const downLabel = root.querySelector('[data-calc="down-label"]');
      const rateLabel = root.querySelector('[data-calc="rate-label"]');
      const yearsLabel = root.querySelector('[data-calc="years-label"]');
      if (downLabel) downLabel.textContent = `${down.value}% down`;
      if (rateLabel) rateLabel.textContent = `${rate.value}% a year`;
      if (yearsLabel) yearsLabel.textContent = `${years.value} years`;
      out.textContent = money(Math.round(result.monthly), "sale");
      if (sub) {
        sub.textContent = `Loan ${money(Math.round(result.loan), "sale")} · interest about ${money(Math.round(result.interest), "sale")}`;
      }
    };
    root.addEventListener("input", run);
    run();
  }

  function mount(options) {
    document.getElementById("site-header").innerHTML = headerHTML(options.active || "");
    document.getElementById("site-footer").innerHTML = footerHTML();
    if (!document.getElementById("toast")) {
      document.body.insertAdjacentHTML("beforeend", chromeHTML());
    }
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
    fillFaq();
    if (!wired) {
      document.addEventListener("click", onClick);
      document.addEventListener("keydown", onKey);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 980) closeNav();
      });
      document.getElementById("news-form").addEventListener("submit", onNews);
      const lightbox = document.getElementById("lightbox");
      let touchX = null;
      lightbox.addEventListener("touchstart", (event) => {
        touchX = event.changedTouches[0].clientX;
      }, { passive: true });
      lightbox.addEventListener("touchend", (event) => {
        if (touchX == null) return;
        const delta = event.changedTouches[0].clientX - touchX;
        if (Math.abs(delta) > 40) shiftLightbox(delta < 0 ? 1 : -1);
        touchX = null;
      }, { passive: true });
      document.addEventListener("error", (event) => {
        if (event.target && event.target.tagName === "IMG") event.target.classList.add("is-broken");
      }, true);
      wired = true;
    }
    paintSaved();
    onScroll();
  }

  return {
    mount,
    esc,
    attr,
    money,
    prettyDate,
    card,
    agentCard,
    getProperty,
    getAgent,
    moodName,
    mortgage,
    bindMortgage,
    mapSrc,
    mapLink,
    toast,
    paintSaved,
    openLightbox,
    remember,
    saveInquiry,
    readList,
    KEYS
  };
})();
