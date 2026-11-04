/* Service worker — généré par scripts/build_sw.py, ne pas éditer à la main */
const VERSION = "163f3f454f";
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
  "/img/lieux/bel-ombre.webp",
  "/img/lieux/belle-mare.webp",
  "/img/lieux/blue-bay.webp",
  "/img/lieux/ferney.webp",
  "/img/lieux/gris-gris.webp",
  "/img/lieux/jacotet.webp",
  "/img/lieux/la-cambuse.webp",
  "/img/lieux/la-prairie.webp",
  "/img/lieux/lion-mountain.webp",
  "/img/lieux/macchabee.webp",
  "/img/lieux/mont-choisy.webp",
  "/img/lieux/morne-brabant.webp",
  "/img/lieux/nicoliere.webp",
  "/img/lieux/palmar.webp",
  "/img/lieux/parakeet.webp",
  "/img/lieux/pereybere.webp",
  "/img/lieux/pieter-both.webp",
  "/img/lieux/piton-riviere-noire.webp",
  "/img/lieux/pointe-d-esny.webp",
  "/img/lieux/pomponette.webp",
  "/img/lieux/poudre-d-or.webp",
  "/img/lieux/riambel.webp",
  "/img/lieux/saint-felix.webp",
  "/img/lieux/sept-cascades.webp",
  "/img/lieux/tourelle-tamarin.webp",
  "/img/lieux/trois-mamelles.webp",
  "/img/lieux/trou-aux-biches.webp",
  "/img/logement1-s.webp",
  "/img/logement1.webp",
  "/img/logement2-s.webp",
  "/img/logement2.webp",
  "/img/plats/f-alouda.webp",
  "/img/plats/f-biscuits-manioc.webp",
  "/img/plats/f-bol-renverse.webp",
  "/img/plats/f-boulettes.webp",
  "/img/plats/f-briani.webp",
  "/img/plats/f-cari-ourite.webp",
  "/img/plats/f-dholl-puri.webp",
  "/img/plats/f-fangourin.webp",
  "/img/plats/f-gateau-piment.webp",
  "/img/plats/f-gato-patate.webp",
  "/img/plats/f-gato-sucre.webp",
  "/img/plats/f-mine-frit.webp",
  "/img/plats/f-napolitaine.webp",
  "/img/plats/f-phoenix.webp",
  "/img/plats/f-rhum-arrange.webp",
  "/img/plats/f-roti-farata.webp",
  "/img/plats/f-rougaille.webp",
  "/img/plats/f-salade-palmiste.webp",
  "/img/plats/f-samoussa.webp",
  "/img/plats/f-the-vanille.webp",
  "/img/plats/f-vindaye-poisson.webp",
  "/img/plats/m-chop-suey-legumes.webp",
  "/img/plats/m-chop-suey-poulet.webp",
  "/img/plats/m-chouchou.webp",
  "/img/plats/m-curry-classique.webp",
  "/img/plats/m-curry-coco.webp",
  "/img/plats/m-currys-choix.webp",
  "/img/plats/m-gratin-legumes.webp",
  "/img/plats/m-mijote-legumes.webp",
  "/img/plats/m-moofan.webp",
  "/img/plats/m-pilau.webp",
  "/img/plats/m-rougail-saucisse.webp",
  "/img/plats/m-salade-exotique.webp",
  "/img/plats/m-salade-patisson.webp",
  "/img/plats/m-salade-russe.webp",
  "/img/plats/m-vindaye.webp",
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
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch {
      if (req.mode === "navigate") return cache.match("/index.html");
      throw new Error("offline");
    }
  })());
});
