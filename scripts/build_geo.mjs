#!/usr/bin/env node
/* Régénère site/js/geo.js : contour de l'île, coordonnées des lieux du programme et tracé routier de chaque jour,
   pour la carte « Le parcours du jour » (dessinée hors ligne en SVG par app.js).
   Sources : Nominatim (OpenStreetMap) pour le contour et les coordonnées, serveur de démo OSRM pour les tracés.
   Les réponses sont gardées dans scripts/geo-cache.json : relancer après avoir changé les lieux d'une journée.
     node scripts/build_geo.mjs            # ne consulte le réseau que pour ce qui manque au cache
     node scripts/build_geo.mjs --routes   # recalcule aussi tous les tracés (étapes modifiées) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const w = {};
new Function("window", fs.readFileSync(path.join(root, "site/js/data.js"), "utf8"))(w);
const G = w.GUIDE;
const cachePath = path.join(root, "scripts/geo-cache.json");
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : { places: {}, routes: {}, coast: null };
const redoRoutes = process.argv.includes("--routes");
const UA = "carnet-maurice-build-geo/1.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
const save = () => fs.writeFileSync(cachePath, JSON.stringify(cache, null, 1));

/* Coordonnées fixées à la main : lieux que Nominatim ne connaît pas ou place mal (sentiers, embarcadères, spots en mer). */
const FIX = {
  "Black River Peak trailhead Plaine Champagne, Mauritius": [-20.4233, 57.4438],
  "Le Morne Brabant trail entrance, Mauritius": [-20.4448, 57.3289],
  "Le Morne Public Beach, Mauritius": [-20.4393, 57.3132],
  "La Prairie Public Beach, Mauritius": [-20.4846, 57.3600],
  "Vanill Art Chamouny, Mauritius": [-20.4813, 57.4677],
  "Cascade 500 Pieds Chamouny, Mauritius": [-20.4586, 57.4698],
  "Pointe Jerome Embarkation Point, Mahebourg, Mauritius": [-20.4196, 57.7258],
  "Exploration Sous-Marine Flic en Flac, Mauritius": [-20.2891, 57.3672],
  "Corail Helicopteres Triolet, Mauritius": [-20.0611, 57.5480],
  "Tamarind Falls Henrietta, Mauritius": [-20.3053, 57.4487],
  "Pieter Both trail La Laura, Mauritius": [-20.1776, 57.5496],
  "Lakaz Kayak, Cap Tamarin, Mauritius": [-20.3232, 57.3762],
  "La Karaye de Val Calodyne, Mauritius": [-19.9972, 57.6446],
  "Serge's Beachfront by Serenity, Trou aux Biches, Mauritius": [-20.0376, 57.5447],
  "La Jetée Road, Grande Rivière Noire, Mauritius": [-20.3663, 57.3718],
  "SSR International Airport, Plaine Magnien, Mauritius": [-20.4302, 57.6836],
  "Pont Naturel, Mauritius": [-20.5010, 57.6072],
  "Gris Gris Beach Souillac, Mauritius": [-20.5253, 57.5277],
  "Notre Dame Auxiliatrice Cap Malheureux, Mauritius": [-19.9843, 57.6140],
  "Chamarel Seven Coloured Earth Geopark, Mauritius": [-20.4426, 57.3737],
  "Eureka La Maison Creole Moka, Mauritius": [-20.2228, 57.4986],
  "Biscuiterie Rault, Mahebourg, Mauritius": [-20.4038, 57.6977],
  "La Cambuse Public Beach, Mauritius": [-20.4612, 57.6958],
  // En mer
  "Baie de Tamarin": [-20.3330, 57.3560],
  "Crystal Rock": [-20.4258, 57.3400],
  "Île aux Bénitiers": [-20.4360, 57.3470],
  "Île aux Aigrettes": [-20.4200, 57.7318],
  "Coin de Mire": [-19.9450, 57.6150],
  "Île Plate": [-19.8800, 57.6630],
  "Îlot Gabriel": [-19.8880, 57.6700],
  "Île aux Cerfs": [-20.2720, 57.8030],
  "Cascade de GRSE": [-20.2865, 57.7735]
};
const MU = { latMin: -20.56, latMax: -19.85, lonMin: 57.25, lonMax: 57.85 };
const inMU = ([la, lo]) => la > MU.latMin && la < MU.latMax && lo > MU.lonMin && lo < MU.lonMax;

/* Mêmes étapes que dans app.js (dayStops) : départ, lieux de chaque étape, arrivée. */
const VILLA = G.stays[0].mapsQ, SERGE = G.stays[1].mapsQ, AIRPORT = "SSR International Airport, Plaine Magnien, Mauritius";
const dayStart = (n) => (n === 1 ? AIRPORT : n <= 11 ? VILLA : SERGE);
const dayEnd = (n) => (n <= 10 ? VILLA : n <= 15 ? SERGE : AIRPORT);
function dayStops(d) {
  const out = [dayStart(d.n)];
  d.steps.forEach((s) => (s.places || []).forEach(([, q]) => { if (out[out.length - 1] !== q) out.push(q); }));
  if (out[out.length - 1] !== dayEnd(d.n)) out.push(dayEnd(d.n));
  return out;
}
const queries = new Set([VILLA, SERGE, AIRPORT]);
G.days.forEach((d) => d.steps.forEach((s) => { (s.places || []).forEach(([, q]) => queries.add(q)); (s.sea || []).forEach((q) => queries.add(q)); }));

/* 1. Coordonnées */
let hits = 0;
for (const q of queries) {
  if (FIX[q]) { cache.places[q] = { fix: FIX[q] }; continue; }
  if (cache.places[q] && cache.places[q].ll) continue;
  const res = await getJSON("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=mu&q=" + encodeURIComponent(q));
  hits++;
  cache.places[q] = res[0] ? { ll: [+(+res[0].lat).toFixed(5), +(+res[0].lon).toFixed(5)], name: res[0].display_name.split(",").slice(0, 2).join(",") } : { miss: true };
  console.log(res[0] ? `  ${q} → ${cache.places[q].ll} (${cache.places[q].name})` : `  ${q} → introuvable`);
  save();
  await sleep(1100);
}
const places = {};
const missing = [];
for (const q of queries) {
  const c = cache.places[q];
  const ll = c.fix || c.ll;
  if (ll && inMU(ll)) places[q] = ll; else missing.push(q);
}
if (missing.length) { console.error("Sans coordonnées (à ajouter dans FIX) :\n  " + missing.join("\n  ")); process.exit(1); }

/* 2. Contour de l'île principale */
if (!cache.coast) {
  // Relation OSM 1569926 : l'île Maurice elle-même (place=island), et non la frontière maritime du pays
  const res = await getJSON("https://nominatim.openstreetmap.org/lookup?osm_ids=R1569926&format=jsonv2&polygon_geojson=1&polygon_threshold=0.0005");
  const g = res[0] && res[0].geojson;
  if (!g) throw new Error("Contour introuvable");
  const rings = g.type === "Polygon" ? [g.coordinates[0]] : g.coordinates.map((p) => p[0]);
  const main = rings.sort((a, b) => b.length - a.length)[0];
  cache.coast = main.map(([lo, la]) => [+la.toFixed(4), +lo.toFixed(4)]);
  save();
}
/* Douglas-Peucker, en degrés */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const d2 = (p, a, b) => {
    const [x, y] = [p[1], p[0]], [x1, y1] = [a[1], a[0]], [x2, y2] = [b[1], b[0]];
    const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
    const t = l2 ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / l2)) : 0;
    const px = x1 + t * dx - x, py = y1 + t * dy - y; return px * px + py * py;
  };
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop(); let max = 0, k = -1;
    for (let m = i + 1; m < j; m++) { const dd = d2(pts[m], pts[i], pts[j]); if (dd > max) { max = dd; k = m; } }
    if (k > 0 && max > tol * tol) { keep[k] = 1; stack.push([i, k], [k, j]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const coast = simplify(cache.coast, 0.001);

/* 3. Tracés routiers de chaque journée (OSRM) */
const routes = {};
for (const d of G.days) {
  const stops = dayStops(d), key = stops.join("|");
  const c = cache.routes[d.n];
  if (!redoRoutes && c && c.key === key) { routes[d.n] = c.pts; continue; }
  const coords = stops.map((q) => places[q]).map(([la, lo]) => `${lo},${la}`).join(";");
  const res = await getJSON(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
  if (res.code !== "Ok") throw new Error(`OSRM jour ${d.n} : ${res.code}`);
  const pts = simplify(res.routes[0].geometry.coordinates.map(([lo, la]) => [la, lo]), 0.0003).map(([la, lo]) => [+la.toFixed(4), +lo.toFixed(4)]);
  const km = Math.round(res.routes[0].distance / 1000), min = Math.round(res.routes[0].duration / 60);
  console.log(`  Jour ${d.n} : ${stops.length} arrêts · OSRM ${km} km · ${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")} · ${pts.length} points`);
  cache.routes[d.n] = { key, pts, km, min };
  routes[d.n] = pts;
  save();
  await sleep(600);
}
// Le cache garde un tracé fin ; la carte n'a besoin que d'un point tous les ~130 m
Object.keys(routes).forEach((n) => (routes[n] = simplify(routes[n], 0.0012)));

/* 4. Écriture */
const fmt = (pts) => "[" + pts.map(([a, b]) => `[${a},${b}]`).join(",") + "]";
const out = `/* Généré par scripts/build_geo.mjs — ne pas éditer à la main.
   Contour : © les contributeurs d'OpenStreetMap (ODbL). Tracés : OSRM. Coordonnées : OpenStreetMap et relevés manuels. */
window.GEO = {
  coast: ${fmt(coast)},
  places: {
${Object.entries(places).map(([q, ll]) => `    ${JSON.stringify(q)}: [${ll[0]},${ll[1]}]`).join(",\n")}
  },
  routes: {
${Object.entries(routes).map(([n, pts]) => `    ${n}: ${fmt(pts)}`).join(",\n")}
  }
};
`;
fs.writeFileSync(path.join(root, "site/js/geo.js"), out);
console.log(`geo.js : ${coast.length} points de côte, ${Object.keys(places).length} lieux, ${Object.keys(routes).length} tracés, ${(out.length / 1024).toFixed(1)} Ko (${hits} requêtes Nominatim)`);
