const map = document.querySelector("#map"),
  viewport = document.querySelector("#viewport"),
  dialog = document.querySelector("#detail"),
  gallery = document.querySelector("#gallery");
let zoom = 1,
  lastMarker;
function crop(p) {
  gallery.replaceChildren();
  const img = new Image();
  img.src = "./assets/images/maps/eldorion.webp";
  img.alt = "Visão ampliada de " + p[0];
  img.className = "crop";
  const w = gallery.clientWidth,
    h = gallery.clientHeight,
    s = Math.max(w / 440, h / 300);
  img.style.width = 1536 * s + "px";
  img.style.height = 1024 * s + "px";
  img.style.left = w / 2 - (p[2] / 100) * 1536 * s + "px";
  img.style.top = h / 2 - ((p[3] - 3) / 100) * 1024 * s + "px";
  gallery.append(img);
}
function show(p, b) {
  lastMarker = b;
  document.querySelector("#place-title").textContent = p[0];
  document.querySelector("#place-region").textContent = p[1];
  document.querySelector("#place-description").textContent = p[4];
  const thumbs = document.querySelector("#thumbs");
  thumbs.replaceChildren();
  dialog.showModal();
  crop(p);
  if (p[0] === "Aurora Magna") {
    [["", "No mapa"], ...aurora].forEach(([src, title], i) => {
      let bt = document.createElement("button");
      bt.textContent = title;
      bt.setAttribute("aria-pressed", String(i === 0));
      bt.onclick = () => {
        thumbs
          .querySelectorAll("button")
          .forEach((t) => t.setAttribute("aria-pressed", String(t === bt)));
        if (!src) crop(p);
        else {
          let im = new Image();
          im.src = src;
          im.alt = title;
          gallery.replaceChildren(im);
        }
      };
      thumbs.append(bt);
    });
  }
}
places.forEach((p) => {
  let b = document.createElement("button");
  b.className = "marker" + (p[5] ? " region" : "");
  b.style.left = p[2] + "%";
  b.style.top = p[3] + "%";
  b.textContent = p[0];
  b.onclick = () => show(p, b);
  document.querySelector("#markers").append(b);
});
function resize() {
  const min = window.innerWidth < 700 ? 1200 : 0;
  map.style.width = Math.max(window.innerWidth, min) * zoom + "px";
}
function change(next) {
  const old = zoom,
    cx = viewport.scrollLeft + viewport.clientWidth / 2,
    cy = viewport.scrollTop + viewport.clientHeight / 2;
  zoom = Math.min(3, Math.max(1, next));
  resize();
  viewport.scrollLeft = (cx * zoom) / old - viewport.clientWidth / 2;
  viewport.scrollTop = (cy * zoom) / old - viewport.clientHeight / 2;
}
document.querySelector("#in").onclick = () => change(zoom + 0.4);
document.querySelector("#out").onclick = () => change(zoom - 0.4);
document.querySelector("#fit").onclick = () => {
  zoom = 1;
  map.style.width = window.innerWidth + "px";
  viewport.scrollTo(0, 0);
};
document.querySelector(".close").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () =>
  lastMarker?.focus({ preventScroll: true }),
);
window.addEventListener("resize", resize);
resize();
