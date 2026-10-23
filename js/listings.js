document.addEventListener("DOMContentLoaded", () => {
  Lumina.mount({ active: "listings" });
  const data = LUMINA_DATA;
  const form = document.getElementById("filters");

  const cities = [...new Set(data.properties.map((property) => property.city))].sort();
  document.getElementById("f-city").innerHTML = `<option value="all">All towns</option>${cities.map((city) => `<option value="${Lumina.attr(city)}">${Lumina.esc(city)}</option>`).join("")}`;

  const types = [...new Set(data.properties.map((property) => property.type))].sort();
  document.getElementById("f-type").innerHTML = `<option value="all">All types</option>${types.map((type) => `<option value="${Lumina.attr(type)}">${Lumina.esc(type)}</option>`).join("")}`;

  document.getElementById("f-mood").innerHTML = `<option value="all">All moods</option>${data.moods.map((mood) => `<option value="${mood.id}">${Lumina.esc(mood.name)}</option>`).join("")}`;

  const params = new URLSearchParams(location.search);
  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (!el || value == null || value === "") return;
    const exists = el.tagName !== "SELECT" || [...el.options].some((option) => option.value === value);
    if (exists) el.value = value;
  };

  setValue("f-q", params.get("q") || "");
  setValue("f-status", params.get("status") || "all");
  setValue("f-type", params.get("type") || "all");
  setValue("f-city", params.get("city") || "all");
  setValue("f-mood", params.get("mood") || "all");
  setValue("f-beds", params.get("beds") || "0");
  setValue("f-sort", params.get("sort") || "featured");
  tunePrice(false);
  if (params.get("priceMax")) {
    const slider = document.getElementById("f-price");
    const wanted = Number(params.get("priceMax"));
    if (!Number.isNaN(wanted)) {
      slider.value = String(Math.min(Number(slider.max), Math.max(Number(slider.min), wanted)));
    }
  }

  function tunePrice(resetToMax) {
    const status = document.getElementById("f-status").value;
    const wrap = document.getElementById("price-wrap");
    const slider = document.getElementById("f-price");
    if (status === "all") {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    if (status === "rent") {
      slider.min = "40000";
      slider.max = "500000";
      slider.step = "10000";
    } else {
      slider.min = "5000000";
      slider.max = "130000000";
      slider.step = "1000000";
    }
    const value = Number(slider.value);
    if (resetToMax || value > Number(slider.max) || value < Number(slider.min)) slider.value = slider.max;
    paintPriceLabel();
  }

  function paintPriceLabel() {
    const status = document.getElementById("f-status").value;
    const slider = document.getElementById("f-price");
    const label = document.getElementById("price-label");
    const atMax = Number(slider.value) >= Number(slider.max);
    label.textContent = atMax
      ? "Any price"
      : `Up to ${Lumina.money(Number(slider.value), status === "rent" ? "rent" : "sale")}`;
  }

  function currentFilters() {
    const slider = document.getElementById("f-price");
    return {
      q: document.getElementById("f-q").value.trim(),
      status: document.getElementById("f-status").value,
      type: document.getElementById("f-type").value,
      city: document.getElementById("f-city").value,
      mood: document.getElementById("f-mood").value,
      beds: document.getElementById("f-beds").value,
      sort: document.getElementById("f-sort").value,
      price: Number(slider.value),
      priceMax: Number(slider.max)
    };
  }

  function renderChips(filters) {
    const chips = [];
    if (filters.q) chips.push(["q", filters.q]);
    if (filters.status !== "all") chips.push(["status", filters.status === "sale" ? "For sale" : "For rent"]);
    if (filters.type !== "all") chips.push(["type", filters.type]);
    if (filters.city !== "all") chips.push(["city", filters.city]);
    if (filters.mood !== "all") chips.push(["mood", Lumina.moodName(filters.mood)]);
    if (Number(filters.beds) > 0) chips.push(["beds", `${filters.beds}+ beds`]);
    if (filters.status !== "all" && filters.price < filters.priceMax) chips.push(["price", document.getElementById("price-label").textContent]);
    document.getElementById("active-filters").innerHTML = chips.map(([key, label]) =>
      `<button type="button" class="chip" data-clear="${Lumina.attr(key)}">${Lumina.esc(label)} <span aria-hidden="true">×</span></button>`
    ).join("");
  }

  function apply() {
    const filters = currentFilters();
    let list = data.properties.filter((property) => {
      if (filters.status !== "all" && property.status !== filters.status) return false;
      if (filters.type !== "all" && property.type !== filters.type) return false;
      if (filters.city !== "all" && property.city !== filters.city) return false;
      if (filters.mood !== "all" && property.mood !== filters.mood) return false;
      if (Number(filters.beds) > 0 && property.beds < Number(filters.beds)) return false;
      if (filters.status !== "all" && filters.price < filters.priceMax && property.price > filters.price) return false;
      if (filters.q) {
        const haystack = [
          property.title,
          property.tagline,
          property.location,
          property.city,
          property.type,
          property.amenities.join(" ")
        ].join(" ").toLowerCase();
        if (!haystack.includes(filters.q.toLowerCase())) return false;
      }
      return true;
    });

    const sorters = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      newest: (a, b) => b.listed.localeCompare(a.listed)
    };
    list.sort(sorters[filters.sort] || sorters.featured);

    const grid = document.getElementById("results");
    document.getElementById("result-count").textContent = list.length === 1 ? "1 home" : `${list.length} homes`;
    if (!list.length) {
      grid.innerHTML = `<div class="empty">
        <h2>No home matches that mix.</h2>
        <p>Clear a filter, or try another mood. The desk is small on purpose.</p>
        <button type="button" class="btn btn-primary" id="empty-clear">Clear filters</button>
      </div>`;
    } else {
      grid.innerHTML = list.map((property) => Lumina.card(property)).join("");
    }
    renderChips(filters);
    Lumina.paintSaved();

    const url = new URLSearchParams();
    if (filters.q) url.set("q", filters.q);
    if (filters.status !== "all") url.set("status", filters.status);
    if (filters.type !== "all") url.set("type", filters.type);
    if (filters.city !== "all") url.set("city", filters.city);
    if (filters.mood !== "all") url.set("mood", filters.mood);
    if (Number(filters.beds) > 0) url.set("beds", filters.beds);
    if (filters.sort !== "featured") url.set("sort", filters.sort);
    if (filters.status !== "all" && filters.price < filters.priceMax) url.set("priceMax", String(filters.price));
    const query = url.toString();
    history.replaceState(null, "", query ? `${location.pathname}?${query}` : location.pathname);
  }

  function clearAll() {
    form.reset();
    tunePrice(true);
    apply();
  }

  form.addEventListener("input", (event) => {
    if (event.target.id === "f-status") tunePrice(true);
    if (event.target.id === "f-price") paintPriceLabel();
    apply();
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  document.getElementById("clear-filters").addEventListener("click", clearAll);
  document.getElementById("active-filters").addEventListener("click", (event) => {
    const chip = event.target.closest("[data-clear]");
    if (!chip) return;
    const key = chip.dataset.clear;
    if (key === "price") {
      const slider = document.getElementById("f-price");
      slider.value = slider.max;
      paintPriceLabel();
    } else if (key === "q") {
      document.getElementById("f-q").value = "";
    } else if (key === "beds") {
      document.getElementById("f-beds").value = "0";
    } else {
      const ids = { status: "f-status", type: "f-type", city: "f-city", mood: "f-mood" };
      document.getElementById(ids[key]).value = "all";
      if (key === "status") tunePrice(true);
    }
    apply();
  });
  document.getElementById("results").addEventListener("click", (event) => {
    if (event.target.closest("#empty-clear")) clearAll();
  });

  const heading = document.getElementById("list-heading");
  const mood = params.get("mood");
  if (mood && heading) {
    heading.textContent = Lumina.moodName(mood);
  }

  apply();
});
