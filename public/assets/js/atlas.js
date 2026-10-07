/* Public atlas sections. Location data stays in data/locations.js. */
(() => {
  const sidebar = document.querySelector("#atlas-sidebar");
  const toggle = document.querySelector("#menu-toggle");
  const backdrop = document.querySelector("#menu-backdrop");
  const content = document.querySelector("#atlas-content");
  const title = document.querySelector("#section-title");
  const body = document.querySelector("#section-body");
  const controls = document.querySelector(".controls");
  const nav = [...sidebar.querySelectorAll("[data-section]")];
  const sections = {
    mapa: ["Mapa", "Arraste para explorar · Selecione um local"],
    historia: [
      "História",
      "Da Confluência Arcana à Época de Ouro: conheça o passado e o presente do Mundo Entrelaçado.",
    ],
    guildas: [
      "Guildas e Facções",
      "Descubra as organizações que fazem parte da vida de Eldorion.",
      "Novos registros em breve",
      "Aqui você poderá conhecer as guildas, suas atividades, lideranças e sedes.",
    ],
    pessoas: [
      "Pessoas importantes",
      "Conheça os nomes e rostos presentes nas histórias de Eldorion.",
      "Novos registros em breve",
      "Esta seção reunirá as figuras importantes do mundo e suas ligações com os lugares e organizações.",
    ],
    locais: [
      "Locais",
      "Explore as cidades e regiões de Eldorion e encontre cada lugar no mapa.",
    ],
  };
  let current = "mapa";
  let collapsed = false;
  try {
    collapsed = localStorage.getItem("eldorion-sidebar") === "collapsed";
  } catch {
    /* Storage is optional. */
  }
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  function updateMenu(open = false) {
    document.body.classList.toggle("mobile-menu-open", mobile.matches && open);
    const expanded = mobile.matches ? open : !collapsed;
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute(
      "aria-label",
      expanded
        ? mobile.matches
          ? "Fechar menu"
          : "Recolher menu"
        : "Expandir menu",
    );
    backdrop.hidden = !(mobile.matches && open);
    const blocked = mobile.matches && open;
    viewport.inert = blocked || current !== "mapa";
    content.inert = blocked;
    controls.inert = blocked;
    panel.inert = blocked;
  }
  toggle.addEventListener("click", () => {
    if (mobile.matches)
      updateMenu(!document.body.classList.contains("mobile-menu-open"));
    else {
      collapsed = !collapsed;
      document.body.classList.toggle("sidebar-collapsed", collapsed);
      try {
        localStorage.setItem(
          "eldorion-sidebar",
          collapsed ? "collapsed" : "expanded",
        );
      } catch {}
      updateMenu();
    }
  });
  backdrop.addEventListener("click", () => {
    updateMenu();
    toggle.focus();
  });
  mobile.addEventListener("change", () => {
    updateMenu();
    if (sidebar.contains(document.activeElement)) toggle.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (
      !mobile.matches ||
      !document.body.classList.contains("mobile-menu-open")
    )
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      updateMenu();
      toggle.focus();
    }
    if (event.key === "Tab") {
      const targets = [toggle, ...nav];
      const index = targets.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        targets.at(-1).focus();
      } else if (
        !event.shiftKey &&
        (index === targets.length - 1 || index < 0)
      ) {
        event.preventDefault();
        toggle.focus();
      }
    }
  });
  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function renderLocations() {
    const label = element(
      "label",
      "Buscar por nome ou região",
      "location-search",
    );
    const search = element("input");
    search.type = "search";
    search.placeholder = "Ex.: Aurora Magna";
    label.append(search);
    const count = element("p");
    count.id = "location-count";
    count.setAttribute("role", "status");
    const grid = element("div", "", "location-grid");
    const normalize = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR");
    const markers = [...document.querySelectorAll(".marker")];
    const cards = [...places]
      .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
      .map((p) => {
        const card = element("article", "", "location-card");
        const button = element("button", "Ver no mapa →");
        button.setAttribute("aria-label", `Ver ${p[0]} no mapa`);
        button.addEventListener("click", () => {
          selectSection("mapa", false);
          show(
            p,
            markers.find((m) => m.dataset.place === p[0]),
          );
        });
        card.append(
          element("p", p[1], "eyebrow"),
          element("h3", p[0]),
          element("p", p[4], "description"),
          button,
        );
        grid.append(card);
        return { card, keywords: normalize(`${p[0]} ${p[1]}`) };
      });
    function filter() {
      const query = normalize(search.value.trim());
      let visible = 0;
      cards.forEach(({ card, keywords }) => {
        card.hidden = !keywords.includes(query);
        if (!card.hidden) visible++;
      });
      count.textContent = visible
        ? `${visible} ${visible === 1 ? "local encontrado" : "locais encontrados"}`
        : "Nenhum local encontrado. Tente outro nome ou região.";
    }
    search.addEventListener("input", filter);
    filter();
    body.append(label, count, grid);
  }
  function selectSection(key, focus = true) {
    if (!sections[key]) return;
    stopAnimation();
    if (!panel.hidden) closePanel();
    current = key;
    const isMap = key === "mapa";
    document.body.classList.toggle("atlas-reading", !isMap);
    viewport.setAttribute("aria-hidden", String(!isMap));
    content.hidden = isMap;
    controls.hidden = !isMap;
    nav.forEach((button) => {
      if (button.dataset.section === key)
        button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    updateMenu();
    document.querySelector("#header-hint").textContent = isMap
      ? sections.mapa[1]
      : "Histórias, lugares e pessoas de Eldorion";
    document.title = `${sections[key][0]} · Atlas de Eldorion`;
    if (isMap) {
      if (focus) viewport.focus({ preventScroll: true });
      return;
    }
    title.textContent = sections[key][0];
    document.querySelector("#section-intro").textContent = sections[key][1];
    body.replaceChildren();
    if (key === "historia") renderHistory(body);
    else if (key === "locais") renderLocations();
    else {
      const empty = element("div", "", "atlas-empty");
      empty.append(
        element("h3", sections[key][2]),
        element("p", sections[key][3]),
      );
      body.append(empty);
    }
    content.scrollTop = 0;
    if (focus) title.focus({ preventScroll: true });
  }
  nav.forEach((button) =>
    button.addEventListener("click", () =>
      selectSection(button.dataset.section),
    ),
  );
  // Observe the map's available space when the desktop sidebar changes width.
  new ResizeObserver(resize).observe(viewport);
  updateMenu();
  resize();
  fit();
})();
