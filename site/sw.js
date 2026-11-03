/* Service worker — généré par scripts/build_sw.py, ne pas éditer à la main */
const VERSION = "594f110264";
const CACHE = "maurice-" + VERSION;
const FILES = [
  "/css/style.css",
  "/fonts/allura-normal.woff2",
  "/fonts/inter-normal.woff2",
  "/fonts/lora-italic.woff2",
  "/fonts/lora-normal.woff2",
  "/fonts/poppins-normal-600.woff2",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/img/flicenflac-s.webp",
  "/img/flicenflac.webp",
  "/img/hero-s.webp",
  "/img/hero.webp",
  "/img/j01-s.webp",
  "/img/j01.webp",
  "/img/j02-s.webp",
  "/img/j02.webp",
  "/img/j03-s.webp",
  "/img/j03.webp",
  "/img/j04-s.webp",
  "/img/j04.webp",
  "/img/j05-s.webp",
  "/img/j05.webp",
  "/img/j06-s.webp",
  "/img/j06.webp",
  "/img/j07-s.webp",
  "/img/j07.webp",
  "/img/j08-s.webp",
  "/img/j08.webp",
  "/img/j09-s.webp",
  "/img/j09.webp",
  "/img/j10-s.webp",
  "/img/j10.webp",
  "/img/j11-s.webp",
  "/img/j11.webp",
  "/img/j12-s.webp",
  "/img/j12.webp",
  "/img/j13-s.webp",
  "/img/j13.webp",
  "/img/j14-s.webp",
  "/img/j14.webp",
  "/img/j15-s.webp",
  "/img/j15.webp",
  "/img/j16-s.webp",
  "/img/j16.webp",
  "/img/lemorne-s.webp",
  "/img/lemorne.webp",
  "/img/logement1-s.webp",
  "/img/logement1.webp",
  "/img/logement2-s.webp",
  "/img/logement2.webp",
  "/index.html",
  "/js/app.js",
  "/js/data.js",
  "/js/geo.js",
  "/manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    const had = keys.some((k) => k.startsWith("maurice-") && k !== CACHE);
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
    if (had) (await self.clients.matchAll()).forEach((c) => c.postMessage("updated"));
  })());
});

// Cache d'abord (le carnet marche sans réseau), réseau en secours
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Toutes les pages (/jour/3, /logements…) sont servies par index.html
    if (req.mode === "navigate") {
      const shell = await cache.match("/index.html");
      if (shell) return shell;
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      if (req.mode === "navigate") return cache.match("/index.html");
      throw new Error("offline");
    }
  })());
});
