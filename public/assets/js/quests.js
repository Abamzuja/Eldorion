/* Diário de missões: dados compartilhados pelo site, interface local. */
(() => {
  const campaignQuests = [
    {
      id: "missao-001",
      title: "Título da missão",
      type: "principal",
      status: "ativa",
      summary: "Resumo completo da missão",
      lastSession: "Sessão X · 01/01/2030",
      contact: "Nome do contato",
      location: "Aurora Magna",
      objectives: [
        { text: "Um objetivo já resolvido", done: true },
        { text: "O próximo objetivo", done: false },
      ],
      reward: "Recompensa conhecida",
    },

    {
      id: "missao-002",
      title: "Título da missão",
      type: "secundaria",
      status: "ativa",
      summary: "Resumo completo da missão",
      lastSession: "Sessão X · 01/01/2030",
      contact: "Nome do contato",
      location: "Sylvanthal",
      objectives: [
        { text: "Um objetivo já resolvido", done: true },
        { text: "O próximo objetivo", done: false },
      ],
      reward: "Recompensa conhecida",
    },
  ];
  const tracker = document.querySelector("#quest-sidebar");
  const toggle = document.querySelector("#quest-toggle");
  const rail = document.querySelector("#quest-rail");
  const close = document.querySelector("#quest-collapse");
  const backdrop = document.querySelector("#quest-backdrop");
  const list = document.querySelector("#quest-list");
  const tabs = [...document.querySelectorAll("[data-quest-filter]")];
  const drawer = matchMedia("(max-width: 1100px)");
  const leftSidebar = document.querySelector("#atlas-sidebar");
  const menuToggle = document.querySelector("#menu-toggle");
  const controls = document.querySelector(".controls");
  let section = "mapa",
    leftOpen = false,
    drawerOpen = false,
    filter = "ativa";
  let collapsed = false;
  try {
    collapsed = localStorage.getItem("eldorion-quests") === "collapsed";
  } catch {}
  const quests = Array.isArray(campaignQuests) ? campaignQuests : [];
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  function sync() {
    const enabled = section === "mapa";
    const opened = enabled && (drawer.matches ? drawerOpen : !collapsed);
    document.body.classList.toggle("quests-collapsed", collapsed);
    document.body.classList.toggle(
      "quests-drawer-open",
      drawer.matches && opened,
    );
    tracker.hidden = !enabled || (drawer.matches && !opened);
    toggle.hidden = !enabled;
    rail.hidden = !enabled || drawer.matches || !collapsed;
    document.querySelector("#quest-content").hidden = !opened;
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute(
      "aria-label",
      opened ? "Recolher missões" : "Abrir missões",
    );
    backdrop.hidden = !(drawer.matches && opened);
    const modal = drawer.matches && opened;
    tracker.setAttribute("role", modal ? "dialog" : "complementary");
    if (modal) tracker.setAttribute("aria-modal", "true");
    else tracker.removeAttribute("aria-modal");
    viewport.inert = modal || leftOpen || !enabled;
    controls.inert = modal || leftOpen;
    panel.inert = modal || leftOpen;
    leftSidebar.inert = modal;
    menuToggle.inert = modal;
  }
  function setOpen(open, restoreFocus = false) {
    if (drawer.matches) {
      drawerOpen = open;
      if (open && !panel.hidden) closePanel();
    } else {
      collapsed = !open;
      try {
        localStorage.setItem(
          "eldorion-quests",
          collapsed ? "collapsed" : "expanded",
        );
      } catch {}
    }
    sync();
    if (open && drawer.matches) close.focus();
    else if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener("click", () => {
    if (leftOpen) menuToggle.click();
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  rail.addEventListener("click", () => setOpen(true));
  close.addEventListener("click", () => setOpen(false, true));
  backdrop.addEventListener("click", () => setOpen(false, true));
  drawer.addEventListener("change", () => {
    drawerOpen = false;
    if (tracker.contains(document.activeElement)) toggle.focus();
    sync();
  });
  document.addEventListener("atlas:navigation", (event) => {
    section = event.detail.section;
    leftOpen = event.detail.menuOpen;
    if (section !== "mapa" || leftOpen) drawerOpen = false;
    sync();
  });
  document.addEventListener("keydown", (event) => {
    if (!drawer.matches || !drawerOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    }
    if (event.key === "Tab") {
      const buttons = [
        toggle,
        ...tracker.querySelectorAll("button, summary"),
      ].filter((n) => !n.hidden && n.getClientRects().length);
      const index = buttons.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        buttons.at(-1).focus();
      } else if (
        !event.shiftKey &&
        (index === buttons.length - 1 || index < 0)
      ) {
        event.preventDefault();
        buttons[0].focus();
      }
    }
  });
  const groupState = new Map();
  function makeQuestCard(q) {
    const card = el("article", "", "quest-card");
    card.append(
      el(
        "p",
        q.type === "principal" ? "Missão principal" : "Missão secundária",
        "quest-kind",
      ),
      el("h3", q.title || "Missão sem título"),
    );
    if (q.summary) card.append(el("p", q.summary, "quest-summary"));
    const objectives = Array.isArray(q.objectives) ? q.objectives : [];
    if (objectives.length) {
      const progress = el(
        "p",
        `${objectives.filter((o) => o.done).length}/${objectives.length} objetivos`,
        "quest-progress",
      );
      const ul = el("ul", "", "quest-objectives");
      objectives.forEach((o) => {
        const li = el("li", "", o.done ? "objective-done" : "");
        const mark = el("span", o.done ? "✓" : "◇");
        mark.setAttribute("aria-hidden", "true");
        const status = el(
          "span",
          o.done ? "Concluído: " : "Pendente: ",
          "quest-sr-only",
        );
        const text = el("span");
        text.append(status, document.createTextNode(o.text || ""));
        li.append(mark, text);
        ul.append(li);
      });
      card.append(progress, ul);
    }
    if (q.lastSession) card.append(el("p", q.lastSession, "quest-session"));
    // Campos opcionais: null, texto vazio ou ausência não criam linhas.
    const contact = typeof q.contact === "string" ? q.contact.trim() : "";
    const reward = typeof q.reward === "string" ? q.reward.trim() : "";
    if (contact || reward) {
      const info = el("dl", "", "quest-info");
      for (const [label, value] of [
        ["Contato", contact],
        ["Recompensa", reward],
      ]) {
        if (!value) continue;
        const row = el("div", "", "quest-info-row");
        row.append(el("dt", label), el("dd", value));
        info.append(row);
      }
      card.append(info);
    }
    const place = places.find((p) => p[0] === q.location);
    if (place) {
      const button = el("button", `⌖ ${q.location}`, "quest-location");
      button.type = "button";
      button.setAttribute("aria-label", `Ver ${q.location} no mapa`);
      button.addEventListener("click", () => {
        if (drawer.matches) setOpen(false);
        document.dispatchEvent(
          new CustomEvent("atlas:request-navigation", {
            detail: { section: "mapa" },
          }),
        );
        const marker = [...document.querySelectorAll(".marker")].find(
          (m) => m.dataset.place === place[0],
        );
        if (marker) show(place, marker);
      });
      card.append(button);
    } else if (q.location)
      card.append(el("p", `Local: ${q.location}`, "quest-session"));
    return card;
  }
  function renderGroups(target, status, scope) {
    target.replaceChildren();
    const visible = quests.filter((q) =>
      status === "concluida"
        ? q.status === "concluida"
        : q.status !== "concluida",
    );
    if (!visible.length) {
      const empty = el("div", "", "quest-empty");
      const icon = el("span", "◇", "quest-empty-icon");
      icon.setAttribute("aria-hidden", "true");
      empty.append(
        icon,
        el(
          "h3",
          status === "ativa"
            ? "O próximo capítulo espera"
            : "Uma história em construção",
        ),
        el(
          "p",
          status === "ativa"
            ? "As missões recebidas pelo grupo aparecerão aqui, com seus objetivos e seu resumo."
            : "As missões concluídas ficarão guardadas aqui para consulta.",
        ),
      );
      target.append(empty);
      return;
    }
    // Agrupamento explícito: principais sempre antes das secundárias.
    for (const [type, label] of [
      ["principal", "Principais"],
      ["secundaria", "Secundárias"],
    ]) {
      const items = visible.filter(
        (q) => (q.type === "principal" ? "principal" : "secundaria") === type,
      );
      if (!items.length) continue;
      const key = `${scope}:${status}:${type}`;
      const group = el("details", "", "quest-group");
      group.dataset.questType = type;
      group.open = groupState.get(key) !== false;
      const summary = el("summary", "", "quest-group-heading");
      const arrow = el("span", "›", "quest-group-arrow");
      arrow.setAttribute("aria-hidden", "true");
      summary.append(
        arrow,
        el("span", label),
        el("span", String(items.length), "quest-group-count"),
      );
      const cards = el("div", "", "quest-group-cards");
      items.forEach((q) => cards.append(makeQuestCard(q)));
      group.append(summary, cards);
      group.addEventListener("toggle", () => groupState.set(key, group.open));
      target.append(group);
    }
  }
  function totals() {
    const active = quests.filter((q) => q.status !== "concluida").length;
    return { active, done: quests.length - active };
  }
  function renderQuests() {
    const { active, done } = totals();
    document.querySelector("#quest-count").textContent = String(active);
    document.querySelector("#quest-total").textContent =
      `${active} em andamento · ${done} concluída${done === 1 ? "" : "s"}`;
    tabs.forEach((tab) =>
      tab.setAttribute(
        "aria-pressed",
        String(tab.dataset.questFilter === filter),
      ),
    );
    renderGroups(list, filter, "sidebar");
  }
  // A página e o painel usam os mesmos dados e o mesmo componente de cartão.
  window.renderQuestPage = (container) => {
    let pageFilter = "ativa";
    const page = el("div", "", "quest-page");
    const { active, done } = totals();
    const stats = el(
      "p",
      `${active} em andamento · ${done} concluída${done === 1 ? "" : "s"}`,
      "quest-page-stats",
    );
    const filters = el("div", "", "quest-filters");
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Filtrar missões");
    const groups = el("div", "", "quest-page-groups");
    const buttons = [];
    for (const [value, label] of [
      ["ativa", "Em andamento"],
      ["concluida", "Concluídas"],
    ]) {
      const button = el("button", label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(value === pageFilter));
      button.addEventListener("click", () => {
        pageFilter = value;
        buttons.forEach(([b, v]) =>
          b.setAttribute("aria-pressed", String(v === pageFilter)),
        );
        renderGroups(groups, pageFilter, "page");
      });
      buttons.push([button, value]);
      filters.append(button);
    }
    renderGroups(groups, pageFilter, "page");
    page.append(stats, filters, groups);
    container.append(page);
  };
  document.querySelector("#quest-full-page").addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent("atlas:request-navigation", {
        detail: { section: "missoes" },
      }),
    );
  });
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      filter = tab.dataset.questFilter;
      renderQuests();
    }),
  );
  renderQuests();
  sync();
})();
