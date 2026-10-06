const viewport = document.querySelector("#viewport");
const map = document.querySelector("#map");
const world = document.querySelector(".world");
let mapWidth = Number(world.getAttribute("width")) || 3344;
let mapHeight = Number(world.getAttribute("height")) || 1882;
const panel = document.querySelector("#detail");
const gallery = document.querySelector("#gallery");
const loader = document.querySelector("#loader");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const mobile = matchMedia("(max-width: 700px)");
const locationImages = {
  'Aurora Magna': './assets/images/locations/aurora-magna/aurora-magna.png',
  'Floresta dos Sonhos': './assets/images/locations/floresta-sonho.png',
  'Vila Hikuru': './assets/images/locations/vila-hikuru.png',
  'Pastoralia': './assets/images/locations/pastoralia.png',
  'Tormenitas': './assets/images/locations/tormenitas.png',
  'Garramorte': './assets/images/locations/garramorte.png',
  'Costa Esmeralda': './assets/images/locations/costa-esmeralda.png',
  'Farol Afogado': './assets/images/locations/farol-afogado.png',
  'Coralinas': './assets/images/locations/coralinas.png',
  'Terras Perdidas de Lysara': './assets/images/locations/terras-lysara.png',
  'Ruínas Anorathius': './assets/images/locations/anorathius.png',
  'Grutas Sombris': './assets/images/locations/grutas-sombris.png',
  'Sylvanthal': './assets/images/locations/sylvanthal.png',
  'Cordilheiras Ordraco': './assets/images/locations/cordilheiras-ordraco.png',
  'Ferrova': './assets/images/locations/ferrova.png',
  'Engenópolis': './assets/images/locations/engenopolis.png',
  'Escadaria dos Titãs': './assets/images/locations/escada-gigantes.png',
  'Nerália': './assets/images/locations/neralia.png',
  'Telora': './assets/images/locations/telora.png',
  'Deserto dos Espelhos': './assets/images/locations/deserto-espelhos.png',
  'Azharat': './assets/images/locations/azharat.png',
  'Luzenar': './assets/images/locations/luzenar.png',
  'Porto de Oghma': './assets/images/locations/oghma.png',
  'Aeral': './assets/images/locations/aeral.png',
  'Tempodora': './assets/images/locations/tempodora.png',
  'Alto Trovão': './assets/images/locations/alto-trovao.png',
  'Ilhas Draca’el': './assets/images/locations/dracael.png',
  'Bastião Umbral': './assets/images/locations/bastiao-umbral.png',
  'Caldra': './assets/images/locations/caldra.png',
  'Forja Silenciosa': './assets/images/locations/forja-silenciosa.png',
  'Glacialis': './assets/images/locations/glacialis.png',
};
let scale = 1,
  fitScale = 1,
  x = 0,
  y = 0;
let selected = null,
  lastMarker = null,
  gallerySource = "";
let animation = 0,
  moved = false,
  suppressClickUntil = 0;
const pointers = new Map();
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function area() {
  return { w: viewport.clientWidth, h: viewport.clientHeight };
}
function constrain() {
  let { w, h } = area();
  if (!panel.hidden) {
    if (mobile.matches) h -= panel.offsetHeight;
    else w -= panel.offsetWidth;
  }
  const mw = mapWidth * scale,
    mh = mapHeight * scale;
  x = mw <= w ? (w - mw) / 2 : clamp(x, w - mw, 0);
  y = mh <= h ? (h - mh) / 2 : clamp(y, h - mh, 0);
}
function render() {
  constrain();
  map.style.width = `${mapWidth * scale}px`;
  map.style.height = `${mapHeight * scale}px`;
  map.style.transform = `translate(${x}px, ${y}px)`;
  document.querySelector("#out").disabled = scale <= fitScale + 0.001;
  document.querySelector("#in").disabled = scale >= fitScale * 5 - 0.001;
  updateMapLabels();
}
function stopAnimation() {
  cancelAnimationFrame(animation);
}
function go(nextScale, nextX, nextY, smooth = false) {
  stopAnimation();
  nextScale = clamp(nextScale, fitScale, fitScale * 5);
  if (!smooth || reducedMotion.matches) {
    scale = nextScale;
    x = nextX;
    y = nextY;
    render();
    return;
  }
  const from = { scale, x, y },
    start = performance.now();
  const frame = (now) => {
    const t = Math.min(1, (now - start) / 380),
      ease = 1 - (1 - t) ** 3;
    scale = from.scale + (nextScale - from.scale) * ease;
    x = from.x + (nextX - from.x) * ease;
    y = from.y + (nextY - from.y) * ease;
    render();
    if (t < 1) animation = requestAnimationFrame(frame);
  };
  animation = requestAnimationFrame(frame);
}
function zoomAt(factor, px, py, smooth = false) {
  const next = clamp(scale * factor, fitScale, fitScale * 5);
  go(
    next,
    px - ((px - x) * next) / scale,
    py - ((py - y) * next) / scale,
    smooth,
  );
}
function fit(smooth = false) {
  const { w, h } = area();
  go(
    fitScale,
    (w - mapWidth * fitScale) / 2,
    (h - mapHeight * fitScale) / 2,
    smooth,
  );
}
function crop(p) {
  const w = gallery.clientWidth,
    h = gallery.clientHeight;
  const s = Math.max(w / (mapWidth * 0.23), h / (mapHeight * 0.3));
  const img = new Image();
  img.draggable = false;
  img.src = world.getAttribute("src");
  img.alt = `Visão ampliada de ${p[0]}`;
  img.className = "crop";
  img.style.width = `${mapWidth * s}px`;
  img.style.height = `${mapHeight * s}px`;
  img.style.left = `${clamp(w / 2 - (p[2] / 100) * mapWidth * s, w - mapWidth * s, 0)}px`;
  img.style.top = `${clamp(h / 2 - (p[3] / 100) * mapHeight * s, h - mapHeight * s, 0)}px`;
  gallery.replaceChildren(img);
}
function setPicture(src, caption) {
  gallerySource = src;
  if (!src) {
    crop(selected);
    return;
  }
  const img = new Image();
  img.draggable = false;
  img.alt = caption;
  img.onerror = () => {
    const message = document.createElement("p");
    message.className = "image-error";
    message.textContent = "Não foi possível carregar esta imagem.";
    gallery.replaceChildren(message);
  };
  img.src = src;
  gallery.replaceChildren(img);
}
function show(p, button) {
  selected = p;
  lastMarker?.setAttribute("aria-expanded", "false");
  lastMarker?.classList.remove("selected");
  lastMarker = button;
  button.classList.add("selected");
  button.setAttribute("aria-expanded", "true");
  document.querySelector("#place-title").textContent = p[0];
  document.querySelector("#place-region").textContent = p[1];
  document.querySelector("#place-description").textContent = p[4];
  panel.hidden = false;
  document.body.classList.add("panel-open");
  panel.scrollTop = 0;
  setPicture(locationImages[p[0]] || "", `Vista de ${p[0]}`);
  const thumbs = document.querySelector("#thumbs");
  thumbs.replaceChildren();
  const { w, h } = area();
  const next = Math.max(scale, fitScale * 1.7);
  const cx = mobile.matches ? w / 2 : (w - panel.offsetWidth) / 2;
  const cy = mobile.matches ? (h - panel.offsetHeight) / 2 : h / 2;
  go(
    next,
    cx - (p[2] / 100) * mapWidth * next,
    cy - (p[3] / 100) * mapHeight * next,
    true,
  );
  document.querySelector(".close").focus({ preventScroll: true });
}
function closePanel() {
  panel.hidden = true;
  document.body.classList.remove("panel-open");
  lastMarker?.classList.remove("selected");
  lastMarker?.setAttribute("aria-expanded", "false");
  lastMarker?.focus({ preventScroll: true });
  selected = null;
  render();
}
// Zoom relativo ao enquadramento do mapa inteiro.
const REGION_ZOOM = 1.45;
const worldPlaces = new Set(['Glacialis', 'Alto Trovão', 'Coralinas']);
const mapAreas = [
  { name: 'Verdantia', places: places.filter(p => p[1].startsWith('Verdantia')) },
  { name: 'Aniloria', places: places.filter(p => p[1].startsWith('Aniloria')) },
  { name: 'Serpenat', places: places.filter(p => p[1].startsWith('Serpenat') || p[0] === 'Tempodora') },
  { name: 'Ilhas Draca’el', places: places.filter(p => p[1] === 'Ilhas Draca’el' || p[0] === 'Ilhas Draca’el') },
];
const areaButtons = [];
const placeButtons = [];

// Limites de navegação estimados pelos locais, sem modificar suas coordenadas.
function getAreaBounds(items) {
  const xs = items.map(p => p[2]);
  const ys = items.map(p => p[3]);
  const left = Math.min(...xs), right = Math.max(...xs);
  const top = Math.min(...ys), bottom = Math.max(...ys);
  return {
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
    width: Math.max(16, right - left + 12),
    height: Math.max(20, bottom - top + 14),
  };
}
function focusMapArea(items) {
  if (!items.length) return;
  if (!panel.hidden) closePanel();
  const bounds = getAreaBounds(items);
  const { w, h } = area();
  const targetScale = Math.min(
    w * 0.9 / (mapWidth * bounds.width / 100),
    h * 0.9 / (mapHeight * bounds.height / 100)
  );
  const next = clamp(Math.max(targetScale, fitScale * 1.5), fitScale, fitScale * 5);
  viewport.focus({ preventScroll: true });
  go(next,
    w / 2 - bounds.centerX / 100 * mapWidth * next,
    h / 2 - bounds.centerY / 100 * mapHeight * next,
    true
  );
}
function setMapLabelVisible(button, visible) {
  if (!visible && document.activeElement === button) {
    viewport.focus({ preventScroll: true });
  }
  button.classList.toggle('label-hidden', !visible);
  button.inert = !visible;
  button.tabIndex = visible ? 0 : -1;
  button.setAttribute('aria-hidden', String(!visible));
}
function updateMapLabels() {
  const zoom = scale / fitScale;
  const overview = zoom + 1e-6 < REGION_ZOOM;
  map.classList.toggle('world-overview', overview);
  areaButtons.forEach(button => setMapLabelVisible(button, overview));
  placeButtons.forEach(({ button, place }) => {
    // Todos os locais surgem juntos ao sair da visão geral.
    const visible = selected === place || worldPlaces.has(place[0]) || !overview;
    setMapLabelVisible(button, visible);
  });
}
mapAreas.forEach(group => {
  if (!group.places.length) return;
  const bounds = getAreaBounds(group.places);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'area-label';
  button.textContent = group.name;
  button.style.left = `${bounds.centerX}%`;
  button.style.top = `${bounds.centerY}%`;
  button.setAttribute('aria-label', `Explorar ${group.name}`);
  button.onclick = () => {
    if (performance.now() < suppressClickUntil) return;
    focusMapArea(group.places);
  };
  document.querySelector('#markers').append(button);
  areaButtons.push(button);
});

places.forEach((p) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `marker${p[5] ? " region" : ""}`;
  if (worldPlaces.has(p[0])) button.classList.add("world-place");
  button.style.left = `${p[2]}%`;
  button.style.top = `${p[3]}%`;
  button.title = p[0];
  button.setAttribute("data-place", p[0]);
  button.textContent = p[0];
  button.setAttribute("aria-controls", "detail");
  button.setAttribute("aria-expanded", "false");
  button.onclick = () => {
    if (performance.now() < suppressClickUntil) return;
    if (worldPlaces.has(p[0]) && scale / fitScale < REGION_ZOOM) {
      focusMapArea([p]);
      return;
    }
    show(p, button);
  };
  document.querySelector("#markers").append(button);
  placeButtons.push({ button, place: p });
});

// Prevent the browser's native drag/selection from interrupting map panning.
world.draggable = false;
viewport.addEventListener("dragstart", (event) => event.preventDefault(), true);
viewport.addEventListener(
  "selectstart",
  (event) => event.preventDefault(),
  true,
);
viewport.addEventListener(
  "mousedown",
  (event) => {
    if (event.button === 0) event.preventDefault();
  },
  true,
);

// Pointer Events: mouse dragging, single-finger panning and two-finger pinch.
viewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  // Suppress native image/text dragging before it can trigger pointercancel.
  if (event.pointerType !== "touch") event.preventDefault();
  const marker = event.target.closest(".marker, .area-label");
  (marker || viewport).focus({ preventScroll: true });
  stopAnimation();
  if (!pointers.size) moved = false;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  // Capture on the pressed element to preserve ordinary marker clicks.
  event.target.setPointerCapture(event.pointerId);
});
viewport.addEventListener("pointermove", (event) => {
  if (!pointers.has(event.pointerId)) return;
  if (event.cancelable) event.preventDefault();
  const before = [...pointers.values()];
  const previous = pointers.get(event.pointerId);
  const dx = event.clientX - previous.x,
    dy = event.clientY - previous.y;
  if (!moved && Math.hypot(dx, dy) < 4 && pointers.size === 1) return;
  moved = true;
  viewport.classList.add("dragging");
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const after = [...pointers.values()];
    const dist = (a) => Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
    const center = (a) => ({
      x: (a[0].x + a[1].x) / 2,
      y: (a[0].y + a[1].y) / 2,
    });
    const a = center(before),
      b = center(after),
      rect = viewport.getBoundingClientRect();
    const next = clamp(
      (scale * dist(after)) / Math.max(1, dist(before)),
      fitScale,
      fitScale * 5,
    );
    x = b.x - rect.left - ((a.x - rect.left - x) * next) / scale;
    y = b.y - rect.top - ((a.y - rect.top - y) * next) / scale;
    scale = next;
  } else {
    x += dx;
    y += dy;
  }
  render();
});
function endPointer(event) {
  if (!pointers.has(event.pointerId)) return;
  pointers.delete(event.pointerId);
  if (moved) suppressClickUntil = performance.now() + 300;
  if (!pointers.size) viewport.classList.remove("dragging");
}
["pointerup", "pointercancel", "lostpointercapture"].forEach((type) =>
  viewport.addEventListener(type, endPointer),
);
window.addEventListener("blur", () => {
  if (moved) suppressClickUntil = performance.now() + 300;
  pointers.clear();
  moved = false;
  viewport.classList.remove("dragging");
});
viewport.addEventListener(
  "wheel",
  (event) => {
    // Preserve browser accessibility zoom when Ctrl/Command is held.
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const r = viewport.getBoundingClientRect();
    const delta =
      event.deltaY *
      (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? r.height : 1);
    zoomAt(
      Math.exp(-clamp(delta, -300, 300) * 0.002),
      event.clientX - r.left,
      event.clientY - r.top,
    );
  },
  { passive: false },
);
viewport.addEventListener("keydown", (event) => {
  const moves = {
    ArrowLeft: [70, 0],
    ArrowRight: [-70, 0],
    ArrowUp: [0, 70],
    ArrowDown: [0, -70],
  };
  if (moves[event.key]) {
    event.preventDefault();
    stopAnimation();
    x += moves[event.key][0];
    y += moves[event.key][1];
    render();
  } else if (["+", "=", "-"].includes(event.key)) {
    event.preventDefault();
    const { w, h } = area();
    zoomAt(event.key === "-" ? 1 / 1.3 : 1.3, w / 2, h / 2, true);
  }
});
document.querySelector("#in").onclick = () => {
  const { w, h } = area();
  zoomAt(1.3, w / 2, h / 2, true);
};
document.querySelector("#out").onclick = () => {
  const { w, h } = area();
  zoomAt(1 / 1.3, w / 2, h / 2, true);
};
document.querySelector("#fit").onclick = () => {
  if (!panel.hidden) closePanel();
  fit(true);
};
document.querySelector(".close").onclick = closePanel;
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panel.hidden) closePanel();
});
function resize() {
  stopAnimation();
  const { w, h } = area();
  fitScale = Math.min(w / mapWidth, h / mapHeight);
  scale = clamp(scale, fitScale, fitScale * 5);
  render();
  if (selected && !gallerySource) crop(selected);
}
window.addEventListener("resize", resize);
new ResizeObserver(() => {
  if (selected && !gallerySource) crop(selected);
}).observe(gallery);
resize();
fit();

// Real image loading state, including cached images and retry on failure.
loader.hidden = false;
let loadAttempt = 0;
async function ready() {
  const attempt = ++loadAttempt;
  try {
    await world.decode();
  } catch {
    /* naturalWidth distinguishes usable images */
  }
  if (attempt !== loadAttempt) return;
  if (!world.naturalWidth) {
    failed();
    return;
  }
  mapWidth = world.naturalWidth;
  mapHeight = world.naturalHeight;
  resize();
  if (!selected) fit();
  loader.classList.add("finished");
  if (reducedMotion.matches) loader.hidden = true;
  else
    setTimeout(() => {
      loader.hidden = true;
    }, 260);
}
function failed() {
  loader.classList.remove("finished");
  loader.hidden = false;
  loader.classList.add("failed");
  document.querySelector("#load-message").textContent =
    "Não foi possível abrir o mapa.";
  document.querySelector("#retry").hidden = false;
}
world.addEventListener("load", ready);
world.addEventListener("error", failed);
document.querySelector("#retry").onclick = () => {
  loader.classList.remove("failed");
  document.querySelector("#retry").hidden = true;
  document.querySelector("#load-message").textContent = "Preparando o mapa…";
  const path = world.getAttribute("src").split("?")[0];
  world.src = `${path}?retry=${Date.now()}`;
};
if (world.complete) world.naturalWidth ? ready() : failed();
