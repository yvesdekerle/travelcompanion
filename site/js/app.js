/* Carnet Maurice — application (HTML/CSS/JS natif, hors ligne via service worker)
   Une URL par page :
   /  (aujourd'hui)   /jour/3   /reservations   /logements   /todo   /todo/checklist   /todo/voiture
   /todo/a-reserver   /todo/a-verifier   /infos   /convertisseur   /bons-plans   /annexes   /notes
   /bienvenue   /installer   /plus */
(function () {
  "use strict";
  const G = window.GUIDE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ───────── Stockage local ───────── */
  const KEY = "mu26:";
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch {} }
  };

  /* ───────── Icônes ───────── */
  const sv = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const I = {
    route: sv('<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.8"/>'),
    ticket: sv('<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2.5"/>'),
    bed: sv('<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>'),
    info: sv('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
    more: sv('<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>'),
    check: sv('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m8 12 3 3 5-6"/>'),
    todo: sv('<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>'),
    starf: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    star: sv('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
    book: sv('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>'),
    pen: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
    sun: sv('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    pin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    nav: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3 3 10.5l7.5 3 3 7.5z"/></svg>',
    map: sv('<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    car: '<svg viewBox="0 0 32 21" fill="currentColor"><path fill-rule="evenodd" d="M3 16Q.8 16 .8 13.8V11.6Q.8 10.1 2.3 9.8L8.4 8.9 11.2 4.2Q11.8 3.2 13 3.2H20.4Q21.6 3.2 22.3 4.2L25.6 8.9 29.6 9.8Q31.2 10.1 31.2 11.6V13.8Q31.2 16 29 16ZM12.2 4.8 10.4 8.4H15.2V4.8ZM16.8 4.8V8.4H23.5L21.2 4.8ZM5 16A4 4 0 1 0 13 16 4 4 0 1 0 5 16ZM19 16A4 4 0 1 0 27 16 4 4 0 1 0 19 16ZM1.9 11.4H4.1V13H1.9Z"/><circle cx="9" cy="16" r="2.9" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="16" r="1.1"/><circle cx="23" cy="16" r="2.9" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="23" cy="16" r="1.1"/></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5.5z"/></svg>',
    home: sv('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
    boot: sv('<path d="m3 20 7-14 4 6 2-3 5 11z"/>'),
    phone: sv('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
    wa: sv('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" fill="currentColor" stroke="none"/>'),
    ext: sv('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    share: sv('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
    list: sv('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
    sos: sv('<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>'),
    wifi: sv('<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>'),
    dl: sv('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    wave: sv('<path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="17" cy="5" r="2"/>'),
    food: sv('<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.5 1.5-4 4-4 8h4"/>'),
    lex: sv('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),
    cash: sv('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>'),
    conv: sv('<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>'),
    install: sv('<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3"/>'),
    chev: sv('<path d="m9.5 5 7 7-7 7"/>'),
    back: sv('<path d="m14.5 5-7 7 7 7"/>'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')
  };
  const ico = (name, size) => (size ? I[name].replace("<svg", `<svg width="${size}" height="${size}"`) : I[name]);

  /* ───────── Google Maps ───────── */
  const withMU = (q) => (/mauritius/i.test(q) ? q : q + ", Mauritius");
  const searchUrl = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(withMU(q));
  const dirUrl = (dest, origin) =>
    "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" + encodeURIComponent(withMU(dest)) +
    (origin ? "&origin=" + encodeURIComponent(withMU(origin)) : "");
  const routeUrl = (origin, dest, wps = []) =>
    "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + encodeURIComponent(withMU(origin)) +
    "&destination=" + encodeURIComponent(withMU(dest)) +
    (wps.length ? "&waypoints=" + encodeURIComponent(wps.map(withMU).join("|")) : "");

  const VILLA = G.stays[0].mapsQ, SERGE = G.stays[1].mapsQ, AIRPORT = "SSR International Airport, Plaine Magnien, Mauritius";
  const PLACE_NAME = { [VILLA]: "la villa", [SERGE]: "l'appartement", [AIRPORT]: "l'aéroport" };
  const dayStart = (n) => (n === 1 ? AIRPORT : n <= 11 ? VILLA : SERGE);
  const dayEnd = (n) => (n <= 10 ? VILLA : n <= 15 ? SERGE : AIRPORT);

  /* ───────── Date & heure à Maurice ───────── */
  // Horloge. Test : ?now=2026-11-08T10:00 (heure de Maurice) — l'horloge simulée continue ensuite d'avancer.
  // ?now= (vide) revient à l'heure réelle. Stocké « instant simulé|heure réelle de départ ».
  function nowMs() {
    const q = new URLSearchParams(location.search).get("now");
    if (q === "") sessionStorage.removeItem("mu26:now");
    else if (q && q !== (sessionStorage.getItem("mu26:now") || "").split("|")[0]) sessionStorage.setItem("mu26:now", `${q}|${Date.now()}`);
    const over = sessionStorage.getItem("mu26:now");
    if (!over) return Date.now();
    let [at, t0] = over.split("|");
    if (!t0) { t0 = Date.now(); sessionStorage.setItem("mu26:now", `${at}|${t0}`); } // ancien format : on repart de maintenant
    const [d, t = "09:00"] = at.split("T");
    const ms = Date.parse(`${d}T${t}${t.length === 5 ? ":00" : ""}+04:00`);
    if (Number.isNaN(ms)) { sessionStorage.removeItem("mu26:now"); return Date.now(); }
    return ms + (Date.now() - +t0);
  }
  const muFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Indian/Mauritius", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  function nowMU() {
    const p = muFmt.formatToParts(new Date(nowMs())).reduce((a, x) => ((a[x.type] = x.value), a), {});
    return { date: `${p.year}-${p.month}-${p.day}`, min: (+p.hour % 24) * 60 + +p.minute };
  }
  const ARRIVAL = Date.parse(G.trip.arrival + ":00+04:00");
  const todayDay = () => G.days.find((d) => d.date === nowMU().date) || null;
  const daysUntil = () => Math.round((Date.parse(G.trip.start) - Date.parse(nowMU().date)) / 864e5);
  const defaultDay = () => todayDay() || (daysUntil() > 0 ? G.days[0] : G.days[G.days.length - 1]);
  const isPast = (d) => Date.parse(d.date) < Date.parse(nowMU().date);

  function timeOf(when) {
    const all = [...(when || "").matchAll(/(\d{1,2})h(\d{2})/gi)];
    const w = (when || "").toLowerCase();
    const part = w.startsWith("matin") ? "matin" : w.startsWith("mi-journée") ? "midi" : w.startsWith("après-midi") ? "après-midi" : w.startsWith("soir") ? "soir" : "";
    if (all.length) { const m = all[0], e = all[1]; return { label: `${m[1].padStart(2, "0")}h${m[2]}`, end: e ? `${e[1].padStart(2, "0")}h${e[2]}` : "", part, min: +m[1] * 60 + +m[2] }; }
    if (w.startsWith("matin")) return { label: "Matin", word: true, min: 8 * 60 };
    if (w.startsWith("mi-journée")) return { label: "Midi", word: true, min: 12 * 60 };
    if (w.startsWith("après-midi")) return { label: "Aprèm", word: true, min: 14 * 60 + 30 };
    if (w.startsWith("soir")) return { label: "Soir", word: true, min: 18 * 60 };
    return { label: "", word: true, min: null };
  }
  // "départ 06h45 · 41 min · 37 km · par la A3" → { dep, dur, dist, rest[] }
  function driveParts(d) {
    const out = { dep: "", dur: "", dist: "", rest: [] };
    d.split(" · ").map((x) => x.trim()).forEach((x) => {
      if (!out.dep && !out.dur && /^(départ\s+)?\d{1,2}h\d{2}$/i.test(x)) out.dep = x.replace(/^départ\s+/i, "");
      else if (!out.dur && /^\d+\s*(min|h)(\s*\d{2})?$/i.test(x)) out.dur = x;
      else if (!out.dist && /^[\d,.]+\s*km$/i.test(x)) out.dist = x;
      else out.rest.push(x);
    });
    return out;
  }
  function currentStepIndex(day) {
    if (!day || day.date !== nowMU().date) return -1;
    const now = nowMU().min; let idx = -1;
    day.steps.forEach((s, i) => { if (s.t !== "drive") { const m = timeOf(s.when).min; if (m !== null && m <= now) idx = i; } });
    return idx;
  }

  /* ───────── Compteurs To-do ───────── */
  const todoCounts = {
    checklist() { let t = 0, d = 0; G.checklist.forEach(([, items], g) => items.forEach((_, i) => [0, 1].forEach((p) => { t++; if (store.get(`cl:${g}:${i}:${p}`, false)) d++; }))); return [d, t]; },
    voiture() { let d = 0; G.info.carOut.forEach((_, i) => { if (store.get(`car:out:${i}`, false)) d++; }); G.info.carBack.forEach((_, i) => { if (store.get(`car:back:${i}`, false)) d++; }); return [d, G.info.carOut.length + G.info.carBack.length]; },
    reserver() { return [G.toBook.filter((_, i) => store.get("tobook:" + i, false)).length, G.toBook.length]; },
    verifier() { return [G.toCheck.filter((_, i) => store.get("check:" + i, false)).length, G.toCheck.length]; }
  };

  /* ───────── Briques de rendu ───────── */
  const img = (name, alt = "", eager = false, sizes = "(min-width: 1024px) 400px, 100vw") =>
    `<img src="/img/${name}-s.webp" srcset="/img/${name}-s.webp 720w, /img/${name}.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const pill = ([type, text]) => `<span class="pill ${type}">${esc(text)}</span>`;
  const tags = (arr) => (arr && arr.length ? `<div class="tags">${arr.map(pill).join("")}</div>` : "");
  const dow = (d) => d.label.split(" ")[0].slice(0, 3);
  const ext = (url) => `href="${url}" target="_blank" rel="noopener"`;
  const telBtn = (num, label = "Appeler") => `<a class="btn sm" href="tel:${num}">${I.phone}${esc(label)}</a>`;
  const waBtn = (num) => `<a class="btn sm" ${ext("https://wa.me/" + num)}>${I.wa}WhatsApp</a>`;
  const placeRow = ([label, q], origin) => `
    <div class="place"><span class="pin">${I.pin}</span><span class="name">${esc(label)}</span>
      <a class="see" ${ext(searchUrl(q))} aria-label="Voir ${esc(label)} sur la carte">${I.map}</a>
      <a class="go" ${ext(dirUrl(q, origin))}>${I.nav}Y aller</a></div>`;
  const linkRow = ([label, url, kind]) => kind === "map"
    ? `<div class="place"><span class="pin">${I.pin}</span><span class="name">${esc(label)}</span><a class="go" ${ext(url)}>${I.nav}Y aller</a></div>`
    : `<div class="place trail"><span class="pin">${I.boot}</span><span class="name">${esc(label)}</span><a class="see" ${ext(url)} aria-label="Ouvrir la trace">${I.ext}</a></div>`;
  const pageHead = (num, title, sub, back) => `<header class="page-head enter">${back ? `<a href="${back[0]}" class="back">${I.back}${back[1]}</a>` : ""}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</header>`;
  const section = (id, eyebrow, title, lede, body) => `<section class="section" id="${id}"><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ""}${body}</section>`;
  const checkRows = (list, keyFn) => `<div class="cl single">${list.map((x, i) => { const k = keyFn(i), c = store.get(k, false); return `<div class="lbl ${c ? "checked" : ""}">${esc(x)}</div><div class="bx"><input class="chk" type="checkbox" data-store-check="${k}" ${c ? "checked" : ""} aria-label="${esc(x)}"></div>`; }).join("")}</div>`;

  /* ───────── Navigation ───────── */
  const NAV = [
    { href: "/", t: "Itinéraire", i: "route", match: (p) => p === "/" || p.startsWith("/jour/") },
    { href: "/reservations", t: "Résas", tl: "Réservations", i: "ticket" },
    { href: "/logements", t: "Logements", i: "bed" },
    { href: "/todo", t: "To-do", i: "todo", match: (p) => p.startsWith("/todo") },
    { href: "/infos", t: "Infos", i: "info", deskOnly: true },
    { href: "/convertisseur", t: "Convertisseur", i: "conv", deskOnly: true },
    { href: "/annexes", t: "Annexes", i: "book", deskOnly: true },
    { href: G.trip.map.url, t: "Carte", i: "map", deskOnly: true, ext: true },
    { href: "/plus", t: "Plus", i: "more", match: (p) => ["/plus", "/infos", "/convertisseur", "/bons-plans", "/annexes", "/notes", "/bienvenue", "/installer"].includes(p), deskMatch: (p) => ["/plus", "/bons-plans", "/notes", "/bienvenue", "/installer"].includes(p) }
  ];
  function renderNav(path) {
    $("#topnav").innerHTML = NAV.map((n) => { const on = n.deskMatch ? n.deskMatch(path) : n.match ? n.match(path) : path === n.href; return n.ext ? `<a ${ext(n.href)}>${n.t}${I.ext}</a>` : `<a href="${n.href}" class="${on ? "active" : ""}">${n.tl || n.t}</a>`; }).join("");
    $("#tabbar").innerHTML = NAV.filter((n) => !n.deskOnly).map((n) => `<a class="tab ${(n.match ? n.match(path) : path === n.href) ? "active" : ""}" href="${n.href}" ${(n.match ? n.match(path) : path === n.href) ? 'aria-current="page"' : ""}><span class="ic">${I[n.i]}</span><span>${n.t}</span></a>`).join("");
  }

  /* ───────── Itinéraire : un jour ───────── */
  function strip(n) {
    const td = todayDay();
    return `<div class="strip-wrap" id="stripWrap"><nav class="strip" aria-label="Jours du voyage">${G.days.map((d) =>
      `${d.n === 11 ? '<span class="sep" aria-hidden="true"></span>' : ""}<a href="/jour/${d.n}" class="${d.n === n ? "active" : ""} ${td && td.n === d.n ? "today" : ""} ${isPast(d) && d.n !== n ? "past" : ""}" aria-label="Jour ${d.n}, ${esc(d.label)}" ${d.n === n ? 'aria-current="page"' : ""}>${dow(d)}<b>${+d.date.slice(8)}</b><small>J${d.n}</small></a>`).join("")}</nav></div>`;
  }

  function countdown() {
    const diff = ARRIVAL - nowMs();
    if (diff <= 0) return null;
    const dd = Math.floor(diff / 864e5), hh = Math.floor((diff % 864e5) / 36e5), mm = Math.floor((diff % 36e5) / 6e4), ss = Math.floor((diff % 6e4) / 1e3);
    const h = [hh, hh > 1 ? "heures" : "heure"], m = [mm, "min"];
    // Dernières 24 h : les secondes remplacent les jours
    return dd > 0 ? [[dd, dd > 1 ? "jours" : "jour"], h, m] : [h, m, [ss, "sec"]];
  }
  function banner() {
    const cd = countdown();
    if (!cd) return "";
    const [d, t] = todoCounts.checklist(), left = G.toBook.length - todoCounts.reserver()[0];
    return `<a class="banner count" href="/todo" id="countdown">
      <span class="cd">${cd.map(([n, l], i) => `<span><b data-cd="${i}">${n}</b><i data-cdl="${i}">${l}</i></span>`).join("")}</span>
      <span class="cd-text"><b>avant l'atterrissage à Maurice</b><small>Vendredi 6 novembre, 06h35 heure de Maurice (03h35 à Paris)</small><small>Checklist ${d}/${t}, ${left} chose${left > 1 ? "s" : ""} encore à réserver</small></span>
      <span class="arrow">›</span></a>`;
  }
  function tickCountdown() {
    const el = $("#countdown"); if (!el) return;
    const cd = countdown();
    if (!cd) { render(); return; }
    cd.forEach(([n, l], i) => {
      const b = $(`[data-cd="${i}"]`, el), s = $(`[data-cdl="${i}"]`, el);
      if (b.textContent != n) b.textContent = n;
      if (s.textContent !== l) s.textContent = l;
    });
  }
  setInterval(tickCountdown, 1000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tickCountdown(); });

  function pageDay(n, home) {
    const d = G.days.find((x) => x.n === n) || G.days[0];
    n = d.n;
    const cur = currentStepIndex(d), start = dayStart(n), end = dayEnd(n);
    const stay = n <= 10 ? G.stays[0] : G.stays[1];
    const isToday = todayDay() && todayDay().n === n;

    const wps = [];
    d.steps.forEach((s) => { if (s.places && s.places[0]) { const q = s.places[0][1]; if (q !== start && q !== end && !wps.includes(q)) wps.push(q); } });

    let here = start;
    const items = d.steps.map((s, i) => {
      if (s.t === "drive") {
        let to = null;
        for (let j = i + 1; j < d.steps.length; j++) { const nx = d.steps[j]; if (nx.t !== "drive" && nx.places && nx.places[0]) { to = nx.places[0][1]; break; } }
        if (!to) to = end;
        const leg = to !== here ? `<a class="leg" ${ext(routeUrl(here, to))}>${I.nav}Trajet</a>` : "";
        const dp = driveParts(s.d);
        const main = dp.dur
          ? `${dp.dep ? `<span class="dep">départ ${esc(dp.dep)}</span>` : ""}<b>${esc(dp.dur)}</b>${dp.dist ? `<span>${esc(dp.dist)}</span>` : ""}`
          : `<span class="plain">${esc(s.d)}</span>`;
        const sub = dp.dur && dp.rest.length ? `<div class="drive-sub">${esc(dp.rest.join(" · "))}</div>` : "";
        return `<div class="tl-item tl-drive"><div class="tl-time"><span class="car">${s.icon === "plane" ? I.plane : I.car}</span></div>
          <div class="drive"><div class="drive-body"><div class="drive-main">${main}</div>${sub}</div>${leg}</div></div>`;
      }
      const origin = here;
      if (s.places && s.places.length) here = s.places[s.places.length - 1][1];
      const t = timeOf(s.when);
      const placesHtml = (s.places || []).map((p, k) => placeRow(p, k === 0 ? (origin === p[1] ? null : origin) : s.places[k - 1][1])).join("") + (s.links || []).map(linkRow).join("");
      const gutter = t.word ? `<span class="t-word">${esc(t.label)}</span>` : `<span class="t-h">${esc(t.label)}</span>${t.end ? `<span class="t-end">${esc(t.end)}</span>` : ""}`;
      return `<div class="tl-item ${s.star ? "star" : ""} ${i === cur ? "now" : ""}" id="etape-${i}">
        <div class="tl-time">${gutter}<i class="dot"></i></div>
        <article class="card-step">
          ${i === cur ? '<span class="now-pill">En ce moment</span>' : ""}
          ${s.where ? `<div class="where">${esc(s.where)}</div>` : ""}
          <h3>${esc(s.title)}${s.star ? `<span class="star-mark" title="Temps fort">${I.starf}</span>` : ""}</h3>
          <div class="text"><p>${s.text}</p></div>
          ${s.rdv ? `<div class="rdv"><b>Rendez-vous</b>${esc(s.rdv)}</div>` : ""}
          ${tags(s.tags)}
          ${s.note ? `<div class="callout ${s.note[2] || ""}"><span class="k">${esc(s.note[0])}</span><span>${esc(s.note[1])}</span></div>` : ""}
          ${placesHtml ? `<div class="places">${placesHtml}</div>` : ""}
        </article></div>`;
    }).join("");

    // Une ligne utile : heure du premier départ en voiture et total de route du jour
    const firstDrive = d.steps.find((s) => s.t === "drive" && !s.icon);
    const dep = firstDrive ? driveParts(firstDrive.d).dep : "";
    const facts = `<p class="meta">${I.car}<span>${dep ? `Départ ${dep} · ` : ""}${esc(d.drive)}</span></p>`;
    const actions = `<div class="actions">
        <a class="btn primary" ${ext(routeUrl(start, end, wps.slice(0, 9)))}>${I.route}Itinéraire du jour dans Maps</a>
        <a class="btn" ${ext(dirUrl(end))}>${I.home}${end === AIRPORT ? "Vers l'aéroport" : `Retour à ${PLACE_NAME[end]}`}</a>
      </div>`;
    const notes = store.get("note:" + n, "");
    const notesBox = `<details class="notes" ${notes ? "open" : ""}><summary>${I.pen}Notes du jour<span class="count"><span class="saved" id="saved">Enregistré</span></span></summary><textarea id="dayNote" placeholder="Souvenirs, adresses, noms à retenir…">${esc(notes)}</textarea></details>`;
    const prev = G.days.find((x) => x.n === n - 1), next = G.days.find((x) => x.n === n + 1);

    return `${strip(n)}
      <div class="day enter">
        <header class="day-cover">
          <figure class="day-photo">${img(d.img, d.caption, true, "(min-width: 1248px) 1200px, 100vw")}<figcaption>${esc(d.caption)}</figcaption></figure>
          <div class="container"><div class="day-head">
            <div class="day-top"><span class="dnum">Jour ${n}</span><span class="ddate">${isToday ? '<b class="today-tag">Aujourd\'hui</b>' : ""}${esc(d.label)}</span><button class="all" type="button" id="allDays" aria-label="Tous les jours">${I.list}<span>Tous les jours</span></button></div>
            <h1>${esc(d.title)}</h1>
            <p class="sub">${esc(d.sub)}</p>
            ${facts}
            ${actions}
          </div></div>
        </header>
        <div class="container day-grid">
          <div class="day-main">
            ${home ? banner() : ""}
            ${d.alert ? `<div class="callout party"><span>${d.alert}</span></div>` : ""}
            ${d.intro ? `<p class="intro">${esc(d.intro)}</p>` : ""}
            <h2 class="tl-title">Le programme</h2>
            <div class="timeline">${items}</div>
            ${notesBox}
            <nav class="pager">
              ${prev ? `<a href="/jour/${prev.n}"><small>Jour ${prev.n}</small><b>${esc(prev.title)}</b></a>` : ""}
              ${next ? `<a class="next" href="/jour/${next.n}"><small>Jour ${next.n}</small><b>${esc(next.title)}</b></a>` : ""}
            </nav>
          </div>
        </div>
      </div>`;
  }

  function closeSheet() { const sh = $("#sheet"); if (sh.hidden) return; sh.hidden = true; const b = $("#allDays"); if (b) b.focus({ preventScroll: true }); }
  function openDaysSheet(current) {
    const td = todayDay();
    const row = (d) => `<a class="dl ${d.n === current ? "active" : ""}" href="/jour/${d.n}"><span class="n">${dow(d)}<b>${+d.date.slice(8)}</b></span><span class="t">${esc(d.title)}<small>${esc(d.drive.replace("≈ ", ""))}</small></span>${td && td.n === d.n ? '<span class="today-tag">Aujourd\'hui</span>' : ""}</a>`;
    $("#sheetBody").innerHTML = `<h4>À neuf, Rivière Noire</h4>${G.days.filter((d) => d.phase === "neuf").map(row).join("")}<h4>À deux, Trou aux Biches</h4>${G.days.filter((d) => d.phase === "deux").map(row).join("")}`;
    const sh = $("#sheet"); sh.hidden = false;
    const act = $(".dl.active", sh); if (act) { act.scrollIntoView({ block: "center" }); act.focus({ preventScroll: true }); }
    sh.onclick = (e) => { if (e.target.closest("[data-close]") || e.target.closest("a")) closeSheet(); };
  }

  /* ───────── Réservations (déjà réservé) ───────── */
  function pageBooked() {
    const btns = (b) => (b.tel ? telBtn(b.tel) : "") + (b.wa ? waBtn(b.wa) : "");
    const left = G.toBook.length - todoCounts.reserver()[0];
    return `<div class="container">${pageHead("", "Réservations", "Bateaux, plongée, pêche, hélico : tout ce qui est réservé, payé ou à payer sur place, avec les contacts, les points de rendez-vous et ce qu'il faut emporter.")}
      <div class="card-actions"><a class="btn sm" href="/todo/a-reserver">${I.todo}Encore à réserver · ${left}</a><a class="btn sm" href="/annexes#cash">${I.cash}Cash à prévoir</a></div>
      <div class="grid c2" style="margin-top:18px">${G.booked.map((b) => `
        <article class="card">
          <div class="top"><span class="eyebrow">${esc(b.when)}</span>${pill(b.status)}</div>
          <h3>${esc(b.title)}</h3><p class="text it">${esc(b.desc)}</p>
          <dl class="kv">${b.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
          ${b.note ? `<div class="callout warn"><span class="k">Attention</span><span>${esc(b.note)}</span></div>` : ""}
          <div class="card-actions">${btns(b)}<a class="btn sm" href="/jour/${b.day}">${I.route}Jour ${b.day}</a></div>
        </article>`).join("")}</div>
    </div>`;
  }

  /* ───────── Logements ───────── */
  function pageStays() {
    return `<div class="container">${pageHead("", "Logements", "Deux adresses pour quinze nuits. Note ici sur place les codes, le téléphone de l'hôte et le wifi : ils restent enregistrés sur ton téléphone.")}
      <div class="grid c2" style="margin-top:18px">${G.stays.map((s) => `
        <article class="card stay" id="${s.id}">
          ${img(s.img, s.name, false, "(min-width: 720px) 50vw, 100vw")}
          <div class="in">
            <div class="eyebrow">${esc(s.range)}</div>
            <h3>${esc(s.name)}</h3>
            <div class="stay-place">${esc(s.place)}</div>
            <div class="stay-dates">${esc(s.dates)}</div>
            <p class="text">${esc(s.desc)}</p>
            <div class="card-actions"><a class="btn primary" ${ext(dirUrl(s.mapsQ))}>${I.nav}Y aller</a><a class="btn" ${ext(searchUrl(s.mapsQ))}>${I.map}Carte</a></div>
            <div class="fields">${s.fields.map((f, i) => `<div class="field"><label for="f-${s.id}-${i}">${esc(f)}</label><input id="f-${s.id}-${i}" data-store="stay:${s.id}:${i}" value="${esc(store.get(`stay:${s.id}:${i}`, ""))}" placeholder="à noter sur place" autocomplete="off"></div>`).join("")}</div>
            <dl class="kv">
              <dt>Adresse</dt><dd>${esc(s.address)}</dd>
              ${s.host ? `<dt>Hôte</dt><dd>${esc(s.host)}</dd>` : ""}
              <dt>Arrivée</dt><dd>${esc(s.checkin)}</dd>
              <dt>Départ</dt><dd>${esc(s.checkout)}</dd>
              <dt>Autour</dt><dd>${s.around.map(esc).join("<br>")}</dd>
            </dl>
            <div class="callout warn"><span class="k">${esc(s.note[0])}</span><span>${esc(s.note[1])}</span></div>
          </div>
        </article>`).join("")}</div></div>`;
  }

  /* ───────── To-do ───────── */
  const TODO = [
    { slug: "checklist", t: "Checklist avant départ", s: "Papiers, garde-robe, pharmacie, électronique — une colonne par personne", i: "check", c: "checklist" },
    { slug: "voiture", t: "Voiture", s: "À la prise le 6 et à la restitution le 16 et le 21", i: "car", c: "voiture" },
    { slug: "a-reserver", t: "À réserver", s: "Ce qui n'est pas encore réservé, avec les contacts", i: "ticket", c: "reserver" },
    { slug: "a-verifier", t: "Points à vérifier", s: "Horaires, doublons, détails à confirmer", i: "search", c: "verifier" }
  ];
  function pageTodo() {
    return `<div class="container">${pageHead("", "To-do", "Tout ce qui se coche : avant de partir, à l'aéroport, et ce qui reste à caler. Les coches sont enregistrées sur ton téléphone.")}
      <div class="todo-list">${TODO.map((x) => { const [d, t] = todoCounts[x.c](); const done = d === t; return `
        <a class="todo-row ${done ? "done" : ""}" href="/todo/${x.slug}">
          <span class="mi">${done ? I.check : I[x.i]}</span>
          <span class="tr-body"><b>${x.t}</b><small>${x.s}</small><span class="progress"><i style="width:${(d / t) * 100}%"></i></span></span>
          <span class="tr-count"><b>${d}</b>/${t}${done ? "<em>Terminé</em>" : `<em>${t - d} restant${t - d > 1 ? "s" : ""}</em>`}</span>
          <span class="chev">${I.chev}</span>
        </a>`; }).join("")}</div></div>`;
  }

  function pageChecklist() {
    const names = store.get("cl:names", ["Moi", "Toi"]);
    const [done, total] = todoCounts.checklist();
    return `<div class="container">${pageHead("", "Checklist avant départ", "Tout cocher avant de fermer les sacs. Une colonne par personne. Système « lagon + sommets » : léger le jour, couvert le soir et dans les temples, accroché en montagne.", ["/todo", "To-do"])}
      <div class="grid c2">
        <div class="card"><div class="eyebrow">Progression</div><div class="bignum" id="clCount">${done} / ${total}</div><div class="progress"><i id="clBar" style="width:${(done / total) * 100}%"></i></div>
          <div class="eyebrow" style="margin-top:14px">Prénoms des deux colonnes</div><div class="names">${names.map((n, i) => `<input data-name="${i}" value="${esc(n)}" aria-label="Prénom colonne ${i + 1}">`).join("")}</div></div>
        <div class="callout warn" style="margin:0"><span class="k">L'oubli</span><span>${esc(G.checklistIntro)}</span></div>
      </div>
      <div class="grid c3">${G.checklist.map(([title, items], g) => `
        <div class="card"><h3>${esc(title)}</h3>
          <div class="cl"><span></span><span class="h" data-colname="0">${esc(names[0])}</span><span class="h" data-colname="1">${esc(names[1])}</span>
          ${items.map((it, i) => { const a = store.get(`cl:${g}:${i}:0`, false), b = store.get(`cl:${g}:${i}:1`, false);
            return `<div class="lbl ${a && b ? "checked" : ""}" data-lbl="${g}:${i}">${esc(it)}</div><div class="bx"><input class="chk" type="checkbox" data-cl="${g}:${i}:0" ${a ? "checked" : ""} aria-label="${esc(it)} — ${esc(names[0])}"></div><div class="bx"><input class="chk" type="checkbox" data-cl="${g}:${i}:1" ${b ? "checked" : ""} aria-label="${esc(it)} — ${esc(names[1])}"></div>`; }).join("")}
          </div></div>`).join("")}</div>
      <p class="center"><button class="btn sm" id="clReset" type="button">Tout décocher</button></p>
    </div>`;
  }

  function pageCar() {
    const inf = G.info;
    return `<div class="container">${pageHead("", "Voiture", "Pingouin Car Rental, à l'aéroport. Trois voitures à la prise, à rendre le 16 (groupe) et le 21 (à deux).", ["/todo", "To-do"])}
      <div class="grid c2">
        <div class="card"><div class="eyebrow">Vendredi 6, à l'aéroport</div><h3>À la prise</h3>${checkRows(inf.carOut, (i) => `car:out:${i}`)}</div>
        <div class="card"><div class="eyebrow">Lundi 16 et samedi 21</div><h3>À la restitution</h3>${checkRows(inf.carBack, (i) => `car:back:${i}`)}</div>
      </div>
      <div class="card-actions"><a class="btn sm" ${ext("https://maps.app.goo.gl/QLT9fqSzSdNo3yi27")}>${I.nav}Pingouin Car Rental</a><a class="btn sm" href="/infos#route">${I.info}Conduire à Maurice</a></div>
    </div>`;
  }

  function pageToBook() {
    const btns = (b) => (b.tel ? telBtn(b.tel) : "") + (b.wa ? waBtn(b.wa) : "");
    return `<div class="container">${pageHead("", "À réserver", "Ce qui reste à caler — contacts et prix relevés le 28 octobre 2026, à confirmer en réservant. Coche quand c'est fait.", ["/todo", "To-do"])}
      <div class="grid c2">${G.toBook.map((b, i) => { const done = store.get("tobook:" + i, false); return `
        <article class="card ${done ? "done" : ""}">
          <div class="top"><span class="eyebrow">${esc(b.when)}</span><label class="check-pill"><input class="chk" type="checkbox" data-tobook="${i}" ${done ? "checked" : ""}>${done ? "Réservé" : "À réserver"}</label></div>
          <h3>${esc(b.title)}</h3>
          <dl class="kv"><dt>Détails</dt><dd>${esc(b.details)}</dd>${b.contact ? `<dt>Contact</dt><dd>${esc(b.contact)}</dd>` : ""}${b.place ? `<dt>Lieu</dt><dd>${esc(b.place)}</dd>` : ""}</dl>
          <div class="card-actions">${btns(b)}${b.place ? `<a class="btn sm" ${ext(searchUrl(b.place))}>${I.map}Carte</a>` : ""}<a class="btn sm" href="/jour/${b.day}">${I.route}Jour ${b.day}</a></div>
        </article>`; }).join("")}</div></div>`;
  }

  const pageToCheck = () => `<div class="container">${pageHead("", "Points à vérifier", "Les détails à confirmer avant ou pendant le voyage.", ["/todo", "To-do"])}
      <div class="card">${checkRows(G.toCheck, (i) => "check:" + i)}</div></div>`;

  /* ───────── Infos pratiques ───────── */
  function pageInfo() {
    const inf = G.info;
    const routeCard = ([title, rows], origin) => `<div class="card"><div class="eyebrow">Temps de route</div><h3>${esc(title)}</h3><div class="rows">${rows.map(([p, t]) => `<a class="row" ${ext(routeUrl(origin, p))}><span>${esc(p)}</span><span>${esc(t)}${ico("ext", 14)}</span></a>`).join("")}</div></div>`;
    return `<div class="container">${pageHead("", "Infos pratiques", "Monnaie, fuseau, météo de novembre, conduite à gauche, santé. Le lagon est calme ; le reste s'anticipe.")}
      <nav class="chips"><a href="/infos#argent">Argent & vie locale</a><a href="/infos#meteo">Météo</a><a href="/infos#route">Conduire</a><a href="/infos#temps">Temps de route</a><a href="/convertisseur">Convertisseur</a></nav>
      ${section("argent", "Section 04", "Fuseau, monnaie & change", "", `<div class="grid c3">
        <div class="card"><div class="eyebrow">Fuseau horaire</div><h3>UTC+4, trois heures d'avance</h3><p class="text">${esc(inf.timezone)}</p></div>
        ${inf.cards.map((c) => `<div class="card"><div class="eyebrow">${esc(c.k)}</div><h3>${esc(c.title)}</h3><div class="text">${c.html}</div></div>`).join("")}</div>`)}
      ${section("meteo", "Section 04", "Météo de novembre", "", `<div class="table stack"><table><thead><tr><th>Région</th><th>Temp. jour</th><th>Pluie</th><th>Particularité</th></tr></thead><tbody>
        ${inf.weather.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td data-l="Jour">${esc(r[1])}</td><td data-l="Pluie">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</tbody></table></div>`)}
      ${section("route", "Section 04", "Sur la route", "", `<div class="table stack"><table><thead><tr><th>Règle</th><th>Valeur</th><th>Note</th></tr></thead><tbody>
        ${inf.driving.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td data-l="Valeur">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>
        <div class="card-actions"><a class="btn sm" href="/todo/voiture">${I.car}Checklist voiture</a></div>`)}
      ${section("temps", "Mesurés sur Google Maps, hors trafic", "Temps de route", "Touche une destination pour ouvrir le trajet depuis le logement.", `<div class="grid c2">${routeCard(inf.routes.a, VILLA)}${routeCard(inf.routes.b, SERGE)}</div><div class="callout warn"><span class="k">Trafic</span><span>${esc(inf.routes.note)}</span></div>`)}
    </div>`;
  }

  /* ───────── Convertisseur ───────── */
  function pageConverter() {
    const r = G.rate, f = (v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
    return `<div class="container">${pageHead("", "Convertisseur", `1 € ≈ ${String(r).replace(".", ",")} Rs. Fonctionne sans réseau.`)}
      <div class="grid c2 top-align">
        <div class="card">
          <div class="conv"><label><span>Roupies</span><input id="cvRs" inputmode="decimal" value="1000" aria-label="Montant en roupies"></label><span class="sw">⇄</span><label><span>Euros</span><input id="cvEur" inputmode="decimal" aria-label="Montant en euros"></label></div>
          <div class="quick">${[100, 500, 1000, 1500, 3500, 14000, 33000].map((v) => `<button type="button" data-rs="${v}">${f(v)} Rs</button>`).join("")}</div>
          <div class="callout"><span class="k">De tête</span><span>Enlever deux zéros, puis multiplier par 2 : 2 500 Rs → 25 → 50 €. Un peu au-dessus du vrai taux — parfait pour ne pas se tromper dans le mauvais sens.</span></div>
        </div>
        <div class="card"><div class="eyebrow">Repères</div><h3>Prix courants</h3><div class="rows">
          ${[["Dholl puri (×2)", 35], ["Repas street food", 200], ["Table d'hôte", 900], ["Entrée 7 couleurs + cascade", 600], ["Essence (1 L)", 68], ["Vanill'Art (par pers.)", 1500], ["Plongée (par pers.)", 3500], ["Speedboat Nemo", 14000], ["Catamaran Baba Cool", 33000]]
            .map(([l, v]) => `<div class="row"><span class="rl">${l}</span><span>${f(v)} Rs <em>${(v / r).toLocaleString("fr-FR", { maximumFractionDigits: v / r < 10 ? 1 : 0 })} €</em></span></div>`).join("")}
        </div></div>
      </div></div>`;
  }

  /* ───────── Bons plans ───────── */
  const pageTips = () => `<div class="container">${pageHead("", "Bons plans", "Street food, marchés, snorkeling, couchers de soleil, apps : pour mieux dépenser, mieux manger, mieux dormir.")}
    <div class="grid c2">${G.tips.map((c) => `<div class="card"><div class="eyebrow">${esc(c.k)}</div><h3>${esc(c.title)}</h3><div class="text">${c.html}</div></div>`).join("")}</div></div>`;

  /* ───────── Annexes ───────── */
  const tels = (list, sos = 0) => list.map((e, i) => `<a class="tel ${i < sos ? "sos" : ""}" href="tel:${e[2]}"><span class="t">${esc(e[0])}${e[3] ? `<small>${esc(e[3])}</small>` : ""}</span><span class="n">${esc(e[1])}</span></a>`).join("");
  function pageAnnex() {
    const from = (f) => `<div class="from"><span class="pill">${ico("home", 12)} Villa ${esc(f[0])}</span><span class="pill">${ico("home", 12)} Trou aux Biches ${esc(f[1])}</span></div>`;
    const hike = (h) => `<div class="card lc">
      <div class="head"><div><div class="eyebrow">${esc(h.day || h.zone)}</div><h4>${esc(h.name)}</h4></div><div class="score">${esc(h.note)}<small>/20</small></div></div>
      <div class="meta"><span>${esc(h.diff)}</span><span>${esc(h.prog)}</span><span>${esc(h.src)}</span></div><div class="see">${esc(h.see)}</div>
      ${h.warn ? `<div class="warn">⚠ ${esc(h.warn)}</div>` : ""}${from(h.from)}
      <div class="card-actions"><a class="btn sm" ${ext(h.url)}>${I.boot}Fiche & trace</a></div></div>`;
    const beach = (b) => `<div class="card lc">
      ${b.img ? `<div class="lc-cover">${img(b.img, b.name, false, "(min-width: 720px) 33vw, 100vw")}</div>` : ""}
      <div class="head"><div><div class="eyebrow">${esc(b.zone)}</div><h4>${esc(b.name)}</h4></div><div class="score">${esc(b.note)}<small>/20</small></div></div>
      <div class="meta"><span>Google ${esc(b.g)}</span></div><div class="see">${esc(b.see)}</div>
      ${b.warn ? `<div class="warn">⚠ ${esc(b.warn)}</div>` : ""}${from(b.from)}
      <div class="card-actions"><a class="btn sm primary" ${ext(dirUrl(b.q))}>${I.nav}Y aller</a><a class="btn sm" ${ext(searchUrl(b.q))}>${I.map}Carte</a></div></div>`;
    const total = G.cash.reduce((a, r) => a + r[3], 0);
    return `<div class="container">${pageHead("", "Annexes", "Numéros d'urgence, randonnées, plages, lexique créole, plats à goûter et cash à prévoir.")}
      <nav class="chips"><a href="/annexes#urgences">Urgences</a><a href="/annexes#contacts">Contacts</a><a href="/annexes#randos">Randonnées</a><a href="/annexes#plages">Plages</a><a href="/annexes#lexique">Lexique</a><a href="/annexes#plats">Plats</a><a href="/annexes#cash">Cash</a><a href="/annexes#outils">Outils</a></nav>
      ${section("urgences", "Annexes", "Urgences", "", `<div class="tels">${tels(G.emergency, 3)}</div><div class="callout warn"><span class="k">À recontrôler</span><span>${esc(G.emergencyNote)}</span></div>`)}
      ${section("contacts", "Annexes", "Numéros des activités", "Les prestataires réservés : un appel ou un WhatsApp le matin même si besoin.", `<div class="tels">${tels(G.contacts)}</div>`)}
      ${section("randos", "Annexes", "Les randonnées", "Celles du programme. Note AllTrails convertie sur 20 (note /5 × 4) ; distances, D+ et durées : ton programme.", `<div class="grid c3">${G.hikes.map(hike).join("")}</div>`)}
      ${section("autres-randos", "Annexes", "Autres randonnées possibles", "Les sommets et sentiers notés 15/20 ou plus, pour improviser une journée.", `<div class="grid c3">${G.hikesMore.map(hike).join("")}</div><div class="callout"><span class="k">Pour choisir</span><span>${esc(G.hikesNote)}</span></div>`)}
      ${section("plages", "Annexes", "Les plages", "Celles notées 15/20 ou plus, de la mieux notée à la moins. Note Google relevée le 28 octobre 2026.", `<div class="grid c3">${G.beaches.map(beach).join("")}</div><div class="callout"><span class="k">Pour choisir</span><span>${esc(G.beachesNote)}</span></div>`)}
      ${section("lexique", "Annexes", "Mini-lexique créole", esc(G.lexiconNote), `<div class="lex">${G.lexicon.map(([fr, kr]) => `<div><small>${esc(fr)}</small><b>${esc(kr)}</b></div>`).join("")}</div>`)}
      ${section("plats", "Annexes", "Plats à goûter", "", `<div class="grid c2">${G.food.map(([t, rows]) => `<div class="card"><div class="eyebrow">${esc(t)}</div><div class="rows">${rows.map(([n, d]) => `<div class="row block"><b>${esc(n)}</b><div class="muted">${esc(d)}</div></div>`).join("")}</div></div>`).join("")}</div><div class="callout"><span class="k">Où</span><span>${esc(G.foodNote)}</span></div>`)}
      ${section("cash", "Annexes", "Cash à prévoir", "Les prestations à régler sur place, en roupies et en espèces.", `
        <div class="grid c2 totals">
          <div class="card"><div class="eyebrow">Total groupe, en espèces</div><div class="bignum">${esc(G.cashTotals.group)}</div><p class="muted">${esc(G.cashTotals.groupEur)}</p></div>
          <div class="card"><div class="eyebrow">Part à deux, en espèces</div><div class="bignum">${esc(G.cashTotals.two)}</div><p class="muted">${esc(G.cashTotals.twoEur)}</p></div>
        </div>
        <div class="table stack"><table><thead><tr><th>Activité</th><th>Date</th><th>Calcul</th><th class="r">Total groupe</th><th class="r">Part à deux</th></tr></thead>
          <tbody>${G.cash.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td data-l="Date">${esc(r[1])}</td><td data-l="Calcul">${esc(r[2])}</td><td class="r" data-l="Groupe">${r[3].toLocaleString("fr-FR")} Rs</td><td class="r" data-l="À deux">${esc(r[4])}</td></tr>`).join("")}</tbody>
          <tfoot><tr><td><b>Total</b></td><td></td><td></td><td class="r" data-l="Groupe">${total.toLocaleString("fr-FR")} Rs</td><td class="r" data-l="À deux">${esc(G.cashTotals.two)}</td></tr></tfoot></table></div>
        <div class="callout warn"><span class="k">Avant le 13</span><span>${esc(G.cashNote)}</span></div>`)}
      ${section("outils", "Annexes", "Nos outils en ligne", "", `<div class="tels">${G.tools.map(([t, u, s]) => `<a class="tel" ${ext(u)}><span class="t">${esc(t)}<small>${esc(s)}</small></span><span class="n">${ico("ext", 18)}</span></a>`).join("")}</div>`)}
      <section class="outro"><h2>${esc(G.outro.title)}</h2><p>${esc(G.outro.text)}</p><p class="proverb">${esc(G.outro.proverb)}</p><div class="muted">${esc(G.outro.proverbTr)}</div></section>
    </div>`;
  }

  /* ───────── Notes ───────── */
  function pageNotes() {
    const dayNotes = G.days.map((d) => [d, store.get("note:" + d.n, "")]).filter(([, t]) => t.trim());
    return `<div class="container">${pageHead("", "Notes", "Pour griffonner les souvenirs, les noms qu'on oublie, les livres qu'on a envie de lire. Tout reste sur ce téléphone, même hors ligne.")}
      <div class="grid c2 top-align">
        <div><div class="top"><span class="eyebrow">Carnet libre</span><span class="saved" id="saved">Enregistré</span></div>
          <textarea class="big" id="globalNote" placeholder="Il était une fois, à Maurice…">${esc(store.get("note:global", ""))}</textarea>
          <div class="card-actions"><button class="btn" id="exportNotes" type="button">${I.share}Exporter mes notes</button></div></div>
        <div>${dayNotes.length ? `<span class="eyebrow">Notes des journées</span><div class="note-list">${dayNotes.map(([d, t]) => `<a class="card note-card" href="/jour/${d.n}"><div class="eyebrow">Jour ${d.n}, ${esc(d.label)}</div><h3>${esc(d.title)}</h3><p class="text pre">${esc(t)}</p></a>`).join("")}</div>` : `<div class="card"><h3>Notes des journées</h3><p class="text">Chaque jour de l'itinéraire a son bloc « Notes du jour ». Elles apparaîtront ici.</p></div>`}</div>
      </div></div>`;
  }

  /* ───────── Bienvenue (couverture du guide) ───────── */
  function pageWelcome() {
    const t = G.trip;
    return `<div class="container">
      <section class="cover enter">${img("hero", "Le Morne Brabant et son lagon", true, "(min-width: 1200px) 1200px, 100vw")}
        <div class="in"><div class="eyebrow">Du 6 au 21 novembre 2026</div><h1>Maurice</h1><p>${esc(t.subtitle)}</p></div></section>
      <div class="stats">${t.stats.map(([b, s]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div>
      <section class="quote"><div class="big">Bienvini</div><blockquote>${esc(t.quote)}</blockquote><cite>${esc(t.quoteBy)}</cite></section>
      <p class="lead">${esc(t.intro)}</p>
      <p class="lead script">Bon vwayaz !</p>
      <p class="center"><a class="btn primary" href="/jour/1">${I.route}Commencer par le jour 1</a></p>
    </div>`;
  }

  /* ───────── Installer ───────── */
  function pageInstall() {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (/mac/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    const ready = store.get("offlineReady", false);
    return `<div class="container">${pageHead("", "Installer", "Le carnet s'installe sur l'écran d'accueil comme une vraie appli, et fonctionne sans réseau.")}
      <div class="grid c2 top-align">
        <div class="card">
          ${standalone ? `<div class="eyebrow">C'est fait</div><h3>Application installée</h3><p class="text">Tu utilises le carnet depuis l'écran d'accueil.</p>` : ios ? `
            <div class="eyebrow">iPhone et iPad</div><h3>Ajouter à l'écran d'accueil</h3>
            <ol class="steps-ol"><li>Ouvre ce site dans <b>Safari</b></li><li>Touche <b>Partager</b> ${ico("share", 15)} en bas de l'écran</li><li>Choisis <b>« Sur l'écran d'accueil »</b>, puis <b>Ajouter</b></li><li>Ouvre l'appli une fois avec du réseau : elle se met en cache</li></ol>` : `
            <div class="eyebrow">Android et ordinateur</div><h3>Installer l'application</h3>
            <div class="card-actions" id="installWrap" ${deferredPrompt ? "" : "hidden"}><button class="btn primary" id="installBtn" type="button">${I.dl}Installer l'application</button></div>
            <ol class="steps-ol"><li>Dans Chrome, touche <b>⋮</b> puis <b>« Installer l'application »</b> (ou le bouton ci-dessus)</li><li>Ouvre-la une fois avec du réseau : elle se met en cache</li></ol>`}
        </div>
        <div class="card" id="hors-ligne">
          <div class="top"><div class="eyebrow">Hors ligne</div><span class="net ${ready ? "ready" : ""}" id="netCard"><i></i>${ready ? "Prêt" : "En cours…"}</span></div>
          <h3>Le carnet sans réseau</h3>
          <p class="text">Rien à faire : dès la première ouverture avec du réseau, tout le carnet (textes, photos, polices) est enregistré sur l'appareil. Ensuite il s'ouvre et fonctionne sans connexion. Tes notes, coches et codes restent sur le téléphone.</p>
          <div class="callout warn"><span class="k">Bon à savoir</span><span>Les boutons « Y aller » ouvrent Google Maps, qui a besoin de réseau — sauf si tu télécharges la carte de Maurice hors ligne dans l'app Google Maps avant de partir.</span></div>
          <div class="card-actions"><button class="btn sm" id="updateBtn" type="button">${I.wifi}Vérifier les mises à jour</button></div>
        </div>
      </div></div>`;
  }

  /* ───────── Plus ───────── */
  function pagePlus() {
    const item = (href, icon, t, s, cls = "") => { const out = /^https?:/.test(href); return `<a ${out ? ext(href) : `href="${href}"`}><span class="mi ${cls}">${I[icon]}</span><span>${t}${s ? `<small>${s}</small>` : ""}</span><span class="chev">${out ? I.ext : I.chev}</span></a>`; };
    return `<div class="container">${pageHead("", "Plus", "")}
      <div class="grid c2 top-align">
        <div>
          <div class="menu-group"><span class="eyebrow">Outils</span><div class="menu-list">
            ${item(G.trip.map.url, "map", G.trip.map.title, G.trip.map.sub)}
            ${item("/convertisseur", "conv", "Convertisseur", "Roupies ⇄ euros, sans réseau")}
            ${item("/installer", "install", "Installer", "Sur l'écran d'accueil, et hors ligne")}
            ${item("/annexes#urgences", "sos", "Urgences", "Police 999, SAMU 114, pompiers 115", "sos")}
          </div></div>
          <div class="menu-group"><span class="eyebrow">Le guide</span><div class="menu-list">
            ${item("/bienvenue", "sun", "Bienvenue", "La couverture du carnet")}
            ${item("/infos", "info", "Infos pratiques", "Monnaie, météo, conduite, santé")}
            ${item("/bons-plans", "star", "Bons plans", "Street food, marchés, snorkeling")}
            ${item("/annexes", "book", "Annexes", "Randonnées, plages, lexique, plats, cash")}
            ${item("/notes", "pen", "Notes", "Ton carnet de route")}
          </div></div>
        </div>
        <div class="menu-group"><span class="eyebrow">Accès rapide</span><div class="menu-list">
          ${item("/annexes#plages", "wave", "Les plages", "17 plages notées, avec « Y aller »")}
          ${item("/annexes#randos", "boot", "Randonnées", "Fiches et traces")}
          ${item("/annexes#cash", "cash", "Cash à prévoir", G.cashTotals.group + " pour le groupe")}
          ${item("/annexes#lexique", "lex", "Lexique créole", "Bonzour, mersi boukou…")}
          ${item("/annexes#plats", "food", "Plats à goûter", "Dholl puri, alouda, rougaille…")}
        </div></div>
      </div></div>`;
  }

  /* ───────── Interactions ───────── */
  function bind(path) {
    const flash = () => { const s = $("#saved"); if (s) { s.classList.add("on"); clearTimeout(flash.t); flash.t = setTimeout(() => s.classList.remove("on"), 1200); } };
    const dn = $("#dayNote");
    if (dn) { const n = main.dataset.day; dn.addEventListener("input", () => { store.set("note:" + n, dn.value); flash(); }); }
    const gn = $("#globalNote");
    if (gn) gn.addEventListener("input", () => { store.set("note:global", gn.value); flash(); });
    const ex = $("#exportNotes");
    if (ex) ex.onclick = () => {
      let txt = "MAURICE — NOTES\n\n" + store.get("note:global", "") + "\n";
      G.days.forEach((d) => { const t = store.get("note:" + d.n, ""); if (t.trim()) txt += `\n— Jour ${d.n} · ${d.label} · ${d.title}\n${t}\n`; });
      if (navigator.share) navigator.share({ title: "Notes Maurice", text: txt }).catch(() => {});
      else { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = "notes-maurice.txt"; a.click(); }
    };
    $$("[data-store]", main).forEach((el) => el.addEventListener("input", () => store.set(el.dataset.store, el.value)));
    $$("[data-store-check]", main).forEach((el) => el.addEventListener("change", () => {
      store.set(el.dataset.storeCheck, el.checked); el.parentElement.previousElementSibling.classList.toggle("checked", el.checked);
    }));
    $$("[data-tobook]", main).forEach((el) => el.addEventListener("change", () => { store.set("tobook:" + el.dataset.tobook, el.checked); render(); }));
    const all = $("#allDays"); if (all) all.onclick = () => openDaysSheet(+main.dataset.day);

    if (path === "/todo/checklist") {
      const update = () => { const cs = $$("[data-cl]", main), d = cs.filter((c) => c.checked).length; $("#clCount").textContent = `${d} / ${cs.length}`; $("#clBar").style.width = (d / cs.length) * 100 + "%"; };
      $$("[data-cl]", main).forEach((el) => el.addEventListener("change", () => {
        store.set("cl:" + el.dataset.cl, el.checked);
        const [g, i] = el.dataset.cl.split(":");
        const both = [0, 1].every((p) => $(`[data-cl="${g}:${i}:${p}"]`, main).checked);
        $(`[data-lbl="${g}:${i}"]`, main).classList.toggle("checked", both);
        update();
      }));
      $$("[data-name]", main).forEach((el) => el.addEventListener("input", () => {
        const names = store.get("cl:names", ["Moi", "Toi"]); names[+el.dataset.name] = el.value || "—"; store.set("cl:names", names);
        $$(`[data-colname="${el.dataset.name}"]`, main).forEach((h) => (h.textContent = names[+el.dataset.name]));
      }));
      $("#clReset").onclick = (e) => {
        const b = e.currentTarget;
        if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "Confirmer ?"; setTimeout(() => { delete b.dataset.armed; b.textContent = "Tout décocher"; }, 3000); return; }
        G.checklist.forEach(([, items], g) => items.forEach((_, i) => [0, 1].forEach((p) => store.set(`cl:${g}:${i}:${p}`, false)))); render();
      };
    }

    const rs = $("#cvRs"), eur = $("#cvEur");
    if (rs) {
      const num = (v) => parseFloat(String(v).replace(/\s/g, "").replace(",", ".")) || 0;
      const fmt = (v, d) => v.toLocaleString("fr-FR", { maximumFractionDigits: d });
      const fromRs = () => (eur.value = fmt(num(rs.value) / G.rate, 2));
      rs.addEventListener("input", fromRs);
      eur.addEventListener("input", () => (rs.value = fmt(num(eur.value) * G.rate, 0)));
      $$("[data-rs]", main).forEach((b) => (b.onclick = () => { rs.value = b.dataset.rs; fromRs(); }));
      fromRs();
    }

    const ib = $("#installBtn"); if (ib) ib.onclick = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("#installWrap").hidden = true; };
    const ub = $("#updateBtn"); if (ub) ub.onclick = async () => {
      if (!navigator.onLine) return toast("Pas de réseau pour l'instant");
      const reg = navigator.serviceWorker && (await navigator.serviceWorker.getRegistration());
      if (reg) { await reg.update(); toast(reg.installing || reg.waiting ? "Mise à jour en cours…" : "✓ Carnet à jour"); } else toast("✓ Carnet à jour");
    };

    const act = $(".strip a.active", main);
    if (act) { const s = act.parentElement; s.scrollLeft = act.offsetLeft - s.clientWidth / 2 + act.clientWidth / 2; }
  }

  /* ───────── Partage ───────── */
  async function share(path, title) {
    const url = location.origin + (path || location.pathname + location.hash);
    const t = title || document.title;
    if (navigator.share) { try { await navigator.share({ title: t, url }); } catch {} return; }
    try { await navigator.clipboard.writeText(url); toast("✓ Lien copié"); } catch { toast(url); }
  }
  $("#shareBtn").innerHTML = I.share;
  $("#shareBtn").onclick = () => share(location.pathname === "/" ? "/jour/" + main.dataset.day : null);

  /* ───────── Routeur (History API) ───────── */
  if (location.hash.startsWith("#/")) { // anciens liens en #/…
    const [p, a] = location.hash.slice(1).split("#");
    const map = { "/activites": "/reservations", "/planning": "/", "/checklist": "/todo/checklist" };
    history.replaceState(null, "", (map[p] || p) + (a ? "#" + a : ""));
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const PAGES = {
    "/reservations": [pageBooked, "Réservations"], "/logements": [pageStays, "Logements"],
    "/todo": [pageTodo, "To-do"], "/todo/checklist": [pageChecklist, "Checklist"], "/todo/voiture": [pageCar, "Voiture"],
    "/todo/a-reserver": [pageToBook, "À réserver"], "/todo/a-verifier": [pageToCheck, "Points à vérifier"],
    "/infos": [pageInfo, "Infos pratiques"], "/convertisseur": [pageConverter, "Convertisseur"], "/bons-plans": [pageTips, "Bons plans"],
    "/annexes": [pageAnnex, "Annexes"], "/notes": [pageNotes, "Notes"], "/bienvenue": [pageWelcome, "Bienvenue"],
    "/installer": [pageInstall, "Installer"], "/plus": [pagePlus, "Plus"]
  };
  const ALIAS = { "/checklist": "/todo/checklist", "/aujourdhui": "/", "/itineraire": "/" };
  let lastPath = null;
  function render(restoreY) {
    if (typeof restoreY !== "number") restoreY = undefined;
    let path = location.pathname.replace(/\/+$/, "") || "/";
    if (ALIAS[path]) { path = ALIAS[path]; history.replaceState(null, "", path + location.hash); }
    let html, title, day = "";
    const m = /^\/jour\/(\d+)$/.exec(path);
    if (m && G.days.some((d) => d.n === +m[1])) { day = +m[1]; html = pageDay(day, false); title = `Jour ${day} · ${G.days[day - 1].title}`; }
    else if (PAGES[path]) { html = PAGES[path][0](); title = PAGES[path][1]; }
    else { path = "/"; day = defaultDay().n; html = pageDay(day, true); title = "Itinéraire"; if (location.pathname !== "/") history.replaceState(null, "", "/"); }
    const keepY = path === lastPath ? window.scrollY : 0;
    main.dataset.day = day;
    main.innerHTML = html;
    renderNav(path);
    document.title = `${title} — Maurice · 6-21 nov. 2026`;
    bind(path);
    const anchor = decodeURIComponent(location.hash.slice(1));
    const target = anchor && document.getElementById(anchor);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    else if (restoreY !== undefined) window.scrollTo({ top: restoreY, behavior: "instant" });
    else if (path !== lastPath && day && currentStepIndex(G.days[day - 1]) >= 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => { const el = $(".tl-item.now", main); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 350);
    } else window.scrollTo({ top: keepY, behavior: "instant" });
    lastPath = path;
    checkStuck();
  }
  function go(url) { history.replaceState({ y: window.scrollY }, "", location.href); history.pushState(null, "", url); render(); }
  let scrollT = 0;
  window.addEventListener("scroll", () => { clearTimeout(scrollT); scrollT = setTimeout(() => history.replaceState({ y: window.scrollY }, "", location.href), 150); }, { passive: true });

  // Bande des jours : glisser à la souris (le tactile défile nativement), molette → défilement horizontal
  let drag = null, dragged = false;
  document.addEventListener("pointerdown", (e) => {
    dragged = false;
    const st = e.target.closest(".strip"); if (!st || e.pointerType !== "mouse" || e.button) return;
    drag = { st, x: e.clientX, left: st.scrollLeft, moved: false };
  });
  document.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true;
    drag.st.scrollLeft = drag.left - dx;
  });
  document.addEventListener("pointerup", () => { if (drag) { dragged = drag.moved; drag = null; } });
  document.addEventListener("dragstart", (e) => { if (e.target.closest(".strip")) e.preventDefault(); });
  document.addEventListener("wheel", (e) => {
    const st = e.target.closest(".strip");
    if (!st || st.scrollWidth <= st.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault(); st.scrollLeft += e.deltaY;
  }, { passive: false });

  document.addEventListener("click", (e) => {
    if (dragged) { dragged = false; e.preventDefault(); return; }
    const a = e.target.closest("a[href]");
    if (!a || a.target || a.hasAttribute("download") || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const href = a.getAttribute("href");
    if (!href.startsWith("/") || href.startsWith("//")) return;
    e.preventDefault();
    const u = new URL(href, location.origin);
    if (u.pathname === location.pathname && u.hash) {
      history.pushState(null, "", href);
      const el = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    go(href);
  });
  window.addEventListener("popstate", () => render(history.state && history.state.y));

  // Glisser à gauche / à droite pour changer de jour
  let tx = 0, ty = 0, tOk = false;
  main.addEventListener("touchstart", (e) => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; tOk = !e.target.closest(".strip, .chips, textarea, input, .table"); }, { passive: true });
  main.addEventListener("touchend", (e) => {
    if (!tOk || !main.dataset.day) return;
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 45) return;
    const n = +main.dataset.day + (dx < 0 ? 1 : -1);
    if (n >= 1 && n <= G.days.length) go("/jour/" + n);
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#sheet").hidden) { closeSheet(); return; }
    if (!(e.target instanceof Element) || e.target.closest("input, textarea, select, [contenteditable]") || !main.dataset.day || !$("#sheet").hidden) return;
    const n = +main.dataset.day + (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    if (n !== +main.dataset.day && n >= 1 && n <= G.days.length) go("/jour/" + n);
  });

  function checkStuck() { const w = $("#stripWrap"); if (w) w.classList.toggle("stuck", w.getBoundingClientRect().top <= 0 && window.scrollY > 40); }
  window.addEventListener("scroll", checkStuck, { passive: true });

  /* ───────── Hors ligne ───────── */
  function toast(msg, action) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("on"); t.classList.toggle("act", !!action); t.onclick = action || null;
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), action ? 8000 : 2600);
  }
  function netState() {
    const el = $("#net"), ready = store.get("offlineReady", false);
    if (!("serviceWorker" in navigator) || devHost) { el.hidden = true; return; }
    el.className = "net " + (!navigator.onLine ? "off" : ready ? "ready" : "");
    $("span", el).textContent = !navigator.onLine ? "Hors ligne" : ready ? "Hors ligne ✓" : "Mise en cache…";
  }
  window.addEventListener("online", netState);
  window.addEventListener("offline", netState);

  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; const w = $("#installWrap"); if (w) w.hidden = false; });

  // En local, pas de service worker (sinon le cache masque les modifications) ; ajouter ?sw pour le tester.
  const devHost = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) && !new URLSearchParams(location.search).has("sw");
  if ("serviceWorker" in navigator && devHost) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
  if ("serviceWorker" in navigator && !devHost) {
    navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(() => {
      if (!store.get("offlineReady", false)) { store.set("offlineReady", true); toast("✓ Carnet disponible hors ligne"); }
      netState(); const c = $("#netCard"); if (c) { c.className = "net ready"; c.innerHTML = "<i></i>Prêt"; }
    }).catch(() => {});
    navigator.serviceWorker.addEventListener("message", (e) => { if (e.data === "updated") toast("Nouvelle version du carnet — toucher pour recharger", () => location.reload()); });
  }

  render();
  netState();
  setInterval(() => { if (todayDay() && main.dataset.day && !document.activeElement.matches("input, textarea")) render(); }, 5 * 60 * 1000);
})();
