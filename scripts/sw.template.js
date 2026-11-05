/* Service worker — généré par scripts/build_sw.py, ne pas éditer à la main */
const VERSION = "__VERSION__";
const CACHE = "maurice-" + VERSION;
const FILES = [
  __FILES__
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
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Le programme partagé (plan.json) vient toujours du réseau, jamais du cache
  if (url.pathname === "/plan.json") return;
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
      // Hors précache (dessins des personnages) : on revalide auprès du serveur, sinon le cache HTTP du navigateur
      // (max-age d'une semaine sur /img) resservirait l'ancienne image après une mise à jour
      const res = await fetch(req.mode === "navigate" ? req : new Request(req, { cache: "no-cache" }));
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      if (req.mode === "navigate") return cache.match("/index.html");
      throw new Error("offline");
    }
  })());
});
