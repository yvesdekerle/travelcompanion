/* Carnet Maurice — application (HTML/CSS/JS natif, hors ligne via service worker)
   Une URL par page :
   /  (aujourd'hui)   /jour/3   /reservations   /logements   /todo   /todo/checklist   /todo/voiture
   /todo/a-reserver   /todo/a-verifier   /infos   /convertisseur   /plages   /randos   /bons-plans
   /annexes   /notes   /bienvenue   /installer   /plus   /menu   /edition */
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
  // Cases « À réserver » : clé = titre de l'entrée, stable quand la liste change. Migration des anciennes clés par
  // index (nov. 2026) : la coupe de canne, ancien index 1, est passée dans les réservations
  const toBookKey = (b) => "tobook:" + b.title;
  if (!store.get("tobook:v", 0)) { for (let i = 0; i <= G.toBook.length; i++) { const b = i === 1 ? null : G.toBook[i > 1 ? i - 1 : i]; if (b && store.get("tobook:" + i, false)) store.set(toBookKey(b), true); } store.set("tobook:v", 1); }

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
    mail: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7.5l9 6 9-6"/>'),
    // Logo Gmail (le « M » bleu, rouge, jaune, vert)
    gmail: '<svg viewBox="0 0 128 96" aria-hidden="true"><path fill="#4285F4" d="M0 26l29 20v50H9.5A9.5 9.5 0 0 1 0 86.5z"/><path fill="#34A853" d="M128 26L99 46v50h19.5a9.5 9.5 0 0 0 9.5-9.5z"/><path fill="#FBBC04" d="M128 26V19a9.5 9.5 0 0 0-9.5-9.5H99V46z"/><path fill="#C5221F" d="M0 26V19a9.5 9.5 0 0 1 9.5-9.5H29V46z"/><path fill="#EA4335" d="M29 9.5l35 25 35-25V46L64 72.5 29 46z"/></svg>',
    walk: sv('<circle cx="13" cy="4" r="1.2"/><path d="M7 21l3-4"/><path d="M16 21l-2-4-3-3 1-6"/><path d="M6 12l2-3 4-1 3 3 3 1"/>'),
    chili: sv('<path d="M16 4.5c-1 8-5.6 13.3-12.5 14.8 2.9 1.9 7.6 1.4 11-1.5 4-3.4 5.6-8.9 4.3-13.3"/><path d="M16 4.5c.5-1.6 1.8-2.4 3.8-2.5"/>'),
    wa: sv('<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>'),
    ext: sv('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    share: sv('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>'),
    list: sv('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
    sos: sv('<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>'),
    wifi: sv('<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>'),
    dl: sv('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    wave: sv('<path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="17" cy="5" r="2"/>'),
    food: sv('<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.5 1.5-4 4-4 8h4"/>'),
    // Les trois pictos du Menu Morisyen : astérisque (viande), hibiscus (végétarien), feuille (salades)
    spark: sv('<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>', 'stroke-width="2.2"'),
    flower: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c1.6 0 2.9 1.6 2.9 3.6 0 .5-.1.9-.2 1.3 1.2-.8 2.7-1 3.9-.3 1.4.8 1.8 2.8 1 4.2-.3.4-.6.8-1 1 1.2.3 2.2 1.3 2.5 2.6.4 1.6-.6 3.3-2.2 3.6-.5.1-1 .1-1.4 0 .5 1.1.4 2.5-.4 3.5-1 1.3-2.9 1.5-4.1.5-.4-.3-.7-.7-1-1.1-.3.4-.6.8-1 1.1-1.2 1-3.1.8-4.1-.5-.8-1-.9-2.4-.4-3.5-.4.1-.9.1-1.4 0-1.6-.3-2.6-2-2.2-3.6.3-1.3 1.3-2.3 2.5-2.6-.4-.2-.7-.6-1-1-.8-1.4-.4-3.4 1-4.2 1.2-.7 2.7-.5 3.9.3-.1-.4-.2-.8-.2-1.3 0-2 1.3-3.6 2.9-3.6zm0 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>',
    leaf: sv('<path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 10-6 10-16z"/><path d="M4 20c3-5 7-8 11-10"/>'),
    lex: sv('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),
    cash: sv('<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>'),
    conv: sv('<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>'),
    install: sv('<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 7v7M9 11l3 3 3-3M10.5 18.5h3"/>'),
    chev: sv('<path d="m9.5 5 7 7-7 7"/>'),
    back: sv('<path d="m14.5 5-7 7 7 7"/>'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    beach: sv('<path d="M3 12.5a9 9 0 0 1 18 0z"/><path d="M12 3.5c-2.6 0-4.6 4-4.6 9M12 3.5c2.6 0 4.6 4 4.6 9M12 12.5V21M9 21h6"/>'),
    lock: sv('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    sort: sv('<path d="M4 7h16M7 12h10M10 17h4"/>'),
    up: sv('<path d="M12 19V5M5 12l7-7 7 7"/>'),
    x: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
    plus: sv('<path d="M12 5v14M5 12h14"/>'),
    photo: sv('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.2"/>'),
    people: sv('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19v-1.2a4.5 4.5 0 0 1 4.5-4.5h2a4.5 4.5 0 0 1 4.5 4.5V19"/><path d="M15.5 4.6a3.2 3.2 0 0 1 0 6.4"/><path d="M17.3 13.4a4.5 4.5 0 0 1 3.2 4.3V19"/>'),
    drop: sv('<path d="M12 3.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>'),
    clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    down: sv('<path d="M12 5v14M19 12l-7 7-7-7"/>'),
    undo: sv('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
    key: sv('<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M15 7l3 3M12 10l3 3"/>'),
    cloud: sv('<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5 3.5 3.5 0 0 1 17.5 18z"/>'),
    brain: sv('<path d="M12 5.2a3 3 0 0 0-5.7 1.1 3.3 3.3 0 0 0-2.1 5.1 3.3 3.3 0 0 0 .9 5.5A3.2 3.2 0 0 0 12 19.2"/><path d="M12 5.2a3 3 0 0 1 5.7 1.1 3.3 3.3 0 0 1 2.1 5.1 3.3 3.3 0 0 1-.9 5.5A3.2 3.2 0 0 1 12 19.2"/><path d="M12 5.2v14M9.2 9.6c.9.5 1.5 1.3 1.7 2.4M14.8 9.6c-.9.5-1.5 1.3-1.7 2.4M6.4 12.6c.9-.2 1.7 0 2.3.6M17.6 12.6c-.9-.2-1.7 0-2.3.6M8.2 16.4c.8-.1 1.5.1 2 .6M15.8 16.4c-.8-.1-1.5.1-2 .6"/>')
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
      else if (!out.dist && /^[\d,.]+\s*k?m$/i.test(x)) out.dist = x;
      else out.rest.push(x);
    });
    return out;
  }
  const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`);
  // L'étape « en ce moment », dans l'ordre effectif du jour (un horaire qui recule dans un ordre modifié ne compte pas)
  function currentStepIndex(day, eff = effectiveSteps(day)) {
    if (!day || day.date !== nowMU().date) return -1;
    const now = nowMU().min; let idx = -1, top = -1;
    eff.forEach((x, k) => { if (x.s.t !== "drive") { let m = timeOf(x.s.when).min; if (m === null) return; m = Math.max(m, top); top = m; if (m <= now) idx = k; } });
    return idx;
  }

  /* ───────── Compteurs To-do ───────── */
  const todoCounts = {
    checklist() { let t = 0, d = 0; G.checklist.forEach(([, items], g) => items.forEach((_, i) => [0, 1].forEach((p) => { t++; if (store.get(`cl:${g}:${i}:${p}`, false)) d++; }))); return [d, t]; },
    voiture() { let d = 0; G.info.carOut.forEach((_, i) => { if (store.get(`car:out:${i}`, false)) d++; }); G.info.carBack.forEach((_, i) => { if (store.get(`car:back:${i}`, false)) d++; }); return [d, G.info.carOut.length + G.info.carBack.length]; },
    reserver() { return [G.toBook.filter((b) => store.get(toBookKey(b), false)).length, G.toBook.length]; },
    verifier() { return [G.toCheck.filter((_, i) => store.get("check:" + i, false)).length, G.toCheck.length]; }
  };

  /* ───────── Briques de rendu ───────── */
  const img = (name, alt = "", eager = false, sizes = "(min-width: 1024px) 400px, 100vw") =>
    `<img src="/img/${name}-s.webp" srcset="/img/${name}-s.webp 720w, /img/${name}.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  const pill = ([type, text]) => `<span class="pill ${type}"><span>${linkify(text)}</span></span>`;
  const tags = (arr) => (arr && arr.length ? `<div class="tags">${arr.map(pill).join("")}</div>` : "");
  const dow = (d) => d.label.split(" ")[0].slice(0, 3);
  const ext = (url) => `href="${url}" target="_blank" rel="noopener"`;
  /* Téléphones et e-mails cliquables dans n'importe quel texte :
     +230 5xxx xxxx (mobile, 8 chiffres) → appel + WhatsApp ; +230 xxx xxxx (fixe) → appel ; e-mail → mailto */
  const PHONE = /\+230(?:[ \u00a0]?\d){7,8}/g, MAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
  const digits = (s) => String(s).replace(/\D/g, "");
  const isMobile = (num) => num.length === 11 && num[3] === "5";
  const waUrl = (num) => "https://wa.me/" + String(num).replace(/^\+/, "");
  // Un mobile s'affiche en bloc vert WhatsApp, logo en tête (ouvre la conversation), suivi d'un petit bouton d'appel
  const waNum = (num, label) => `<a class="wa-num" ${ext(waUrl(num))} aria-label="WhatsApp ${esc(label)}" title="WhatsApp"><i>${I.wa}</i>${esc(label)}</a>`;
  const callIcon = (num, label) => `<a class="tl-call" href="tel:+${num}" aria-label="Appeler ${esc(label)}" title="Appeler">${I.phone}</a>`;
  // Sur du HTML (échappé ou de confiance) : on ne touche pas à l'intérieur des balises
  const linkifyHtml = (html) => String(html).split(/(<[^>]*>)/).map((part, k) => (k % 2 ? part : part
    .replace(MAIL, (m) => `<a class="tl" href="mailto:${m}">${m}</a>`)
    .replace(PHONE, (m) => { const num = digits(m); return isMobile(num) ? `<span class="mob">${waNum(num, m)}${callIcon(num, m)}</span>` : `<a class="tl" href="tel:+${num}">${m}</a>`; }))).join("");
  const linkify = (s) => linkifyHtml(esc(s));
  const telBtn = (num, label = "Appeler") => `<a class="btn sm" href="tel:${num}">${I.phone}${esc(label)}</a>`;
  const waBtn = (num) => `<a class="btn sm wa" ${ext(waUrl(num))}>${I.wa}WhatsApp</a>`;
  // Contacts d'une fiche : une ligne par moyen — mobile → WhatsApp (+ appel), fixe → appel, e-mail → messagerie.
  // Chaque entrée est "valeur" ou [libellé, valeur]
  const contactRows = (list) => `<div class="contact">${list.map((e) => {
    const [label, v] = Array.isArray(e) ? e : ["", e], num = digits(v), sub = label ? `<small>${esc(label)}</small>` : "";
    if (v.includes("@")) return `<a class="c em" ${ext("https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(v))} aria-label="Écrire à ${esc(v)} dans Gmail"><i>${I.gmail}</i><span>${esc(v)}${sub}</span></a>`;
    if (isMobile(num)) return `<div class="c wa"><a class="lnk" ${ext(waUrl(num))} aria-label="WhatsApp ${esc(v)}"><i>${I.wa}</i><span>${esc(v)}${sub}</span></a><a class="call" href="tel:+${num}" aria-label="Appeler ${esc(v)}" title="Appeler">${I.phone}</a></div>`;
    return `<a class="c ph" href="tel:+${num}"><i>${I.phone}</i><span>${esc(v)}${sub}</span></a>`;
  }).join("")}</div>`;
  // Site qui héberge la trace d'une rando, d'après l'adresse
  const traceSite = (url) => /alltrails/i.test(url) ? "AllTrails" : /wikiloc/i.test(url) ? "Wikiloc" : /visorando/i.test(url) ? "Visorando" : /komoot/i.test(url) ? "Komoot" : "en ligne";
  // Boutons d'une fiche : appel, WhatsApp (mobile), page interne (ex. le menu)
  const contactBtns = (b) => { const tel = b.tel || (b.wa ? "+" + b.wa : ""); return (tel ? telBtn(tel) : "") + (b.wa || (tel && isMobile(digits(tel))) ? waBtn(b.wa || tel) : "") + (b.page ? `<a class="btn sm" href="${b.page[0]}">${I.food}${esc(b.page[1])}</a>` : ""); };
  // Un lieu : « Carte » (recherche Google Maps, ou un lien Maps précis s'il est donné) et « Y aller » (itinéraire)
  const placeRow = ([label, q, mapUrl], origin) => `
    <div class="place two"><span class="pin">${I.pin}</span><span class="name">${esc(label)}</span>
      <span class="acts"><a class="see" ${ext(mapUrl || searchUrl(q))} aria-label="Voir ${esc(label)} sur la carte">${I.map}Carte</a><a class="go" ${ext(dirUrl(q, origin))}>${I.nav}Y aller</a></span></div>`;
  const linkRow = ([label, url, kind]) => kind === "map"
    ? `<div class="place two"><span class="pin">${I.pin}</span><span class="name">${esc(label)}</span><span class="acts"><a class="see" ${ext(url)}>${I.map}Carte</a><a class="go" ${ext(dirUrl(label))}>${I.nav}Y aller</a></span></div>`
    : kind === "page"
    ? `<a class="place page" href="${url}"><span class="pin">${url === "/menu" ? I.food : I.book}</span><span class="name">${esc(label)}</span><span class="chev">${I.chev}</span></a>`
    : `<div class="place trail"><span class="pin">${I.boot}</span><span class="name">${esc(label)}</span><a class="see" ${ext(url)} aria-label="Ouvrir la trace">${I.ext}</a></div>`;
  const pageHead = (num, title, sub, back) => `<header class="page-head enter">${back ? `<a href="${back[0]}" class="back">${I.back}${back[1]}</a>` : ""}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</header>`;
  const section = (id, eyebrow, title, lede, body) => `<section class="section" id="${id}"><h2>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ""}${body}</section>`;
  const checkRows = (list, keyFn) => `<div class="cl single">${list.map((x, i) => { const k = keyFn(i), c = store.get(k, false); return `<div class="lbl ${c ? "checked" : ""}">${esc(x)}</div><div class="bx"><input class="chk" type="checkbox" data-store-check="${k}" ${c ? "checked" : ""} aria-label="${esc(x)}"></div>`; }).join("")}</div>`;

  /* ───────── Navigation ───────── */
  const NAV_ITEMS = {
    route: { href: "/", t: "Voyage", i: "route", match: (p) => p === "/" || p.startsWith("/jour/") },
    maps: { t: "Cartes", i: "map", sheet: "maps" },
    conv: { href: "/convertisseur", t: "Convertir", tl: "Convertisseur", i: "conv" },
    booked: { href: "/reservations", t: "Résas", tl: "Réservations", i: "ticket" },
    beaches: { href: "/plages", t: "Plages", i: "beach" },
    hikes: { href: "/randos", t: "Randos", i: "boot" },
    menu: { href: "/menu", t: "Menu", i: "food" },
    stays: { href: "/logements", t: "Logements", i: "bed" },
    todo: { href: "/todo", t: "To-do", i: "todo", match: (p) => p.startsWith("/todo") },
    info: { href: "/infos", t: "Infos", i: "info" },
    annex: { href: "/annexes", t: "Annexes", i: "book" },
    more: { href: "/plus", t: "Plus", i: "more", match: (p) => ["/plus", "/bons-plans", "/notes", "/bienvenue", "/installer", "/edition"].includes(p) }
  };
  // Avant l'atterrissage, la to-do est en 5e position ; une fois sur place, elle passe en dernier.
  // Le menu de Sheila reste dans la partie visible de la barre du bas (4e avant l'arrivée, 5e ensuite).
  const NAV_ORDER = () => (nowMs() < ARRIVAL
    ? ["route", "maps", "conv", "menu", "todo", "beaches", "hikes", "booked", "stays", "info", "annex", "more"]
    : ["route", "maps", "conv", "booked", "menu", "beaches", "hikes", "stays", "info", "annex", "more", "todo"]).map((k) => NAV_ITEMS[k]);
  const bar = $("#tabbar");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let barKey = "";
  // Barre du haut (ordinateur) : quand la fenêtre est trop étroite pour les douze entrées, elle glisse.
  // Fondu du côté où il reste des entrées ; la molette la fait défiler ; à la souris, on peut aussi la tirer.
  const topnav = $("#topnav");
  const topnavFade = () => {
    topnav.classList.toggle("more-l", topnav.scrollLeft > 4);
    topnav.classList.toggle("more-r", topnav.scrollLeft + topnav.clientWidth < topnav.scrollWidth - 4);
  };
  topnav.addEventListener("scroll", topnavFade, { passive: true });
  addEventListener("resize", topnavFade);
  topnav.addEventListener("wheel", (e) => {
    if (topnav.scrollWidth <= topnav.clientWidth || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
    topnav.scrollLeft += e.deltaY; e.preventDefault();
  }, { passive: false });
  let navDrag = null, navDragged = 0;
  topnav.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse" && topnav.scrollWidth > topnav.clientWidth) navDrag = { x: e.clientX, left: topnav.scrollLeft, moved: false }; });
  topnav.addEventListener("pointermove", (e) => { if (!navDrag) return; const dx = e.clientX - navDrag.x; if (navDrag.moved || Math.abs(dx) > 4) { navDrag.moved = true; topnav.scrollLeft = navDrag.left - dx; } });
  const navDragEnd = () => { if (navDrag && navDrag.moved) navDragged = Date.now(); navDrag = null; };
  ["pointerup", "pointercancel", "pointerleave"].forEach((t) => topnav.addEventListener(t, navDragEnd));
  topnav.addEventListener("dragstart", (e) => e.preventDefault());
  topnav.addEventListener("click", (e) => { if (Date.now() - navDragged < 300) { e.preventDefault(); e.stopPropagation(); } }, true);
  function renderNav(path) {
    const NAV = NAV_ORDER();
    // Libellés courts (Convertir, Résas) : les douze entrées tiennent alors sur une ligne dans le conteneur de 1 200 px
    const lbl = (n) => `<span title="${esc(n.tl || n.t)}">${n.t}</span>`;
    $("#topnav").innerHTML = NAV.map((n) => { const on = n.match ? n.match(path) : path === n.href; return n.sheet ? `<button type="button" data-sheet="${n.sheet}">${lbl(n)}</button>` : `<a href="${n.href}" class="${on ? "active" : ""}">${lbl(n)}</a>`; }).join("");
    $$("#topnav [data-sheet]").forEach((b) => (b.onclick = openMapsSheet));
    const tn = $("#topnav"), ta = $("a.active", tn);
    if (ta) { // entrée active ramenée dans la partie visible quand la barre déborde
      const l = ta.getBoundingClientRect().left - tn.getBoundingClientRect().left, r = l + ta.offsetWidth;
      if (l < 44 || r > tn.clientWidth - 44) tn.scrollLeft += l - 44;
    }
    topnavFade();
    // La barre du bas n'est construite qu'une fois (puis quand l'ordre change, à l'atterrissage) :
    // elle garde sa position de défilement d'une page à l'autre au lieu de sauter.
    const key = NAV.map((n) => n.t).join(), fresh = key !== barKey;
    if (fresh) {
      barKey = key;
      const inner = (n) => `<span class="in"><span class="ic">${I[n.i]}</span><span>${n.t}</span></span>`;
      bar.innerHTML = NAV.map((n) => n.sheet
        ? `<button class="tab" type="button" data-sheet="${n.sheet}">${inner(n)}</button>`
        : `<a class="tab" href="${n.href}">${inner(n)}</a>`).join("");
      $$("[data-sheet]", bar).forEach((b) => (b.onclick = openMapsSheet));
    }
    $$(".tab", bar).forEach((el, i) => {
      const n = NAV[i], on = !n.sheet && (n.match ? n.match(path) : path === n.href);
      el.classList.toggle("active", on);
      if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
    });
    const act = $(".tab.active", bar);
    if (act) {
      const l = act.offsetLeft - bar.scrollLeft, r = l + act.offsetWidth, hidden = l < 12 || r > bar.clientWidth - 12;
      // Au chargement : l'onglet actif en 3e position d'emblée ; ensuite on ne bouge que s'il dépasse, en glissant.
      // La cible tombe sur un point d'aimantage (début d'onglet), donc aucun recalage après le glissement.
      const to = Math.max(0, Math.min(act.offsetLeft - 12 - 2 * act.offsetWidth, bar.scrollWidth - bar.clientWidth));
      if (fresh) bar.scrollLeft = to; else if (hidden) bar.scrollTo({ left: to, behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
  }

  /* ───────── Itinéraire : un jour ───────── */
  const hasFixed = (d) => d.steps.some((s) => s.fixed);
  const fixedStar = (d) => (hasFixed(d) ? `<i class="fx" aria-hidden="true" title="Réservation à horaire fixe">${I.starf}</i>` : "");
  function strip(n) {
    const td = todayDay();
    return `<div class="strip-wrap" id="stripWrap"><nav class="strip" aria-label="Jours du voyage">${G.days.map((d) =>
      `${d.n === 11 ? '<span class="sep" aria-hidden="true"></span>' : ""}<a href="/jour/${d.n}" class="${d.n === n ? "active" : ""} ${td && td.n === d.n ? "today" : ""} ${isPast(d) && d.n !== n ? "past" : ""}" aria-label="Jour ${d.n}, ${esc(d.label)}${hasFixed(d) ? ", réservation à horaire fixe" : ""}" ${d.n === n ? 'aria-current="page"' : ""}>${fixedStar(d)}${dow(d)}<b>${+d.date.slice(8)}</b><small>J${d.n}</small></a>`).join("")}</nav></div>`;
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
    const todo = [d ? `Checklist ${d}/${t}` : "", left ? `${left} chose${left > 1 ? "s" : ""} encore à réserver` : ""].filter(Boolean).join(", ");
    return `<a class="banner count" href="/todo" id="countdown">
      <span class="cd">${cd.map(([n, l], i) => `<span><b data-cd="${i}">${n}</b><i data-cdl="${i}">${l}</i></span>`).join("")}</span>
      <span class="cd-text"><b>avant l'atterrissage à Maurice</b><small>Vendredi 6 novembre, 06h35 heure de Maurice (03h35 à Paris)</small>${todo ? `<small>${todo}</small>` : ""}</span>
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


  /* ───────── Programme modifiable, partagé avec le groupe via le dépôt GitHub ─────────
     plan.days[n] = { order: [[id, titre, heure], …] | null, removed: [[id, titre], …], at: ISO, by: prénom }
     id = "jour:index" pour une étape du guide, "hike:k" ou "beach:k" pour une rando ou une plage ajoutée ;
     heure = "HHhMM" quand elle a été choisie (vide : celle du guide). order null = ordre du guide (trace d'une
     remise à zéro, pour la fusion jour par jour : le plus récent gagne). Les trajets d'un jour modifié sont recalculés. */
  const PLAN_EMPTY = () => ({ v: 1, days: {} });
  let plan = store.get("plan", null);
  if (!plan || typeof plan !== "object" || !plan.days) plan = PLAN_EMPTY();
  let editing = false;
  // Sans jeton, on consulte seulement : pas de crayon, pas d'ajout, pas de remise à zéro
  const canEdit = () => !!store.get("gh:token", "");
  const allHikes = [...G.hikes, ...G.hikesMore];
  const entryOf = (n) => plan.days[n] || {};
  const removedIds = (n) => (entryOf(n).removed || []).map(([id]) => id);
  const ownActs = (d) => d.steps.map((s, i) => ({ n: d.n, i, s, id: `${d.n}:${i}` })).filter((x) => x.s.t !== "drive");
  function resolveRef(id, title) {
    const [n, i] = String(id).split(":").map(Number), d = G.days[n - 1], s = d && d.steps[i];
    return s && s.t !== "drive" && s.title === title ? { n, i, s, id: `${n}:${i}` } : null;
  }
  // Une plage ou une rando ajoutée au programme : une étape synthétique, avec son lieu, sa fiche et sa note
  function customAct(id, title, when, n) {
    const [kind, k] = String(id).split(":"), it = (kind === "hike" ? allHikes : kind === "beach" ? G.beaches : [])[+k];
    if (!it || it.name !== title) return null;
    const text = esc(it.see) + (it.warn ? ` <b>${esc(it.warn)}</b>` : "");
    const s = kind === "hike"
      ? { when: when || "", where: `Randonnée · ${it.zone}`, title: it.name, text, places: [[it.name, it.q || it.name + ", Mauritius"]], links: it.url ? [[`${traceSite(it.url)} · ${it.name}`, it.url, "trail"]] : [], tags: [["info", [it.diff, it.prog].filter(Boolean).join(" · ")], ...(it.note && it.note !== "—" ? [["info", `Note ${it.note}/20`]] : [])] }
      : { when: when || "", where: `Plage · ${it.zone}`, title: it.name, text, places: [[it.name, it.q]], tags: [["info", `Note ${it.note}/20 · Google ${it.g}`]] };
    return { n, i: -1, id, s, custom: kind, when: when || "" };
  }
  function resolveEntry([id, title, when], n) {
    if (/^(hike|beach):/.test(id)) return customAct(id, title, when, n);
    const r = resolveRef(id, title);
    if (r && when) { r.when = when; r.s = { ...r.s, when }; }
    return r;
  }
  const placedElsewhere = (x, n) => Object.entries(plan.days).some(([k, p]) => +k !== n && p && p.order && p.order.some(([id]) => id === x.id));
  const isModified = (d) => { const p = entryOf(d.n); return !!(p.order || (p.removed && p.removed.length)) || ownActs(d).some((x) => placedElsewhere(x, d.n)); };
  // Les activités du jour (hors trajets) dans l'ordre choisi ; à défaut, celui du guide
  function dayActs(d) {
    const own = ownActs(d), p = entryOf(d.n), rm = removedIds(d.n);
    const keep = (x) => !placedElsewhere(x, d.n) && !rm.includes(x.id);
    if (!p.order) return own.filter(keep);
    const out = [];
    p.order.forEach((e) => { const r = resolveEntry(e, d.n); if (r && !out.some((o) => o.id === r.id)) out.push(r); });
    // Une étape du guide absente du plan (contenu mis à jour depuis) reprend sa place, après sa voisine d'origine
    own.forEach((x, k) => {
      if (out.some((o) => o.id === x.id) || !keep(x)) return;
      let at = 0;
      for (let j = k - 1; j >= 0; j--) { const pos = out.findIndex((o) => o.id === own[j].id); if (pos >= 0) { at = pos + 1; break; } }
      out.splice(at, 0, x);
    });
    return out;
  }
  // Insère une étape à sa place horaire (avant la première étape plus tardive), sinon à la fin
  function insertByTime(acts, x) {
    const m = timeOf(x.s.when).min;
    const at = m === null ? -1 : acts.findIndex((o) => { const mm = timeOf(o.s.when).min; return mm !== null && mm > m; });
    acts.splice(at < 0 ? acts.length : at, 0, x);
  }
  // Trajets du guide, par liaison « d'où | où » ; ceux sans lieu connu (avion, étape sans adresse) restent collés à l'étape qui suit
  function origLegs(d) {
    const legs = {}, pre = {}; let here = dayStart(d.n);
    d.steps.forEach((s, i) => {
      if (s.t === "drive") {
        let nx = null;
        for (let j = i + 1; j < d.steps.length; j++) if (d.steps[j].t !== "drive") { nx = { s: d.steps[j], i: j }; break; }
        const to = nx && nx.s.places && nx.s.places[0] ? nx.s.places[0][1] : null;
        if (to && !s.icon) legs[here + "|" + to] = s; else if (nx) pre[`${d.n}:${nx.i}`] = s;
      } else if (s.places && s.places.length) here = s.places[s.places.length - 1][1];
    });
    return { legs, pre };
  }
  // Liaison absente du guide : distance à vol d'oiseau × 1,3, à 38 km/h de moyenne
  function estimate(from, to) {
    const a = window.GEO && window.GEO.places[from], b = window.GEO && window.GEO.places[to];
    if (!a || !b) return "Trajet à estimer";
    const dLa = (b[0] - a[0]) * 111.32, dLo = (b[1] - a[1]) * 111.32 * Math.cos((-20.2 * Math.PI) / 180);
    const km = Math.hypot(dLa, dLo) * 1.3, min = Math.max(5, Math.round(((km / 38) * 60) / 5) * 5);
    return `${fmtMin(min)} · ${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} km · estimation`;
  }
  // Toutes les lignes du jour, trajets compris, dans l'ordre effectif : [{ s, n, i, id, est?, custom?, when? }]
  function effectiveSteps(d) {
    if (!isModified(d)) return d.steps.map((s, i) => ({ s, n: d.n, i, id: `${d.n}:${i}` }));
    const acts = dayActs(d), { legs, pre } = origLegs(d), out = []; let here = dayStart(d.n);
    acts.forEach((x) => {
      const to = x.s.places && x.s.places[0] ? x.s.places[0][1] : null;
      if (to && to !== here) { const o = legs[here + "|" + to]; out.push(o ? { s: o, n: d.n, i: -1 } : { s: { t: "drive", d: estimate(here, to) }, n: d.n, i: -1, est: true }); }
      else if (!to && x.n === d.n && pre[x.id]) out.push({ s: pre[x.id], n: d.n, i: -1 });
      out.push(x);
      if (x.s.places && x.s.places.length) here = x.s.places[x.s.places.length - 1][1];
    });
    return out;
  }
  const fmtAt = (iso) => { const t = new Date(iso || ""); return Number.isNaN(+t) ? "" : `le ${t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} à ${String(t.getHours()).padStart(2, "0")}h${String(t.getMinutes()).padStart(2, "0")}`; };
  const newest = (p) => Object.entries(p.days || {}).sort((a, b) => ((b[1].at || "") > (a[1].at || "") ? 1 : -1))[0];
  const stamp = () => ({ at: new Date().toISOString(), by: store.get("edit:name", "") });
  function savePlan() { store.set("plan", plan); store.set("plan:dirty", true); scheduleSync(); }
  function setOrder(n, acts) {
    const own = ownActs(G.days[n - 1]), e = entryOf(n);
    const same = acts.length === own.length && acts.every((x, k) => !x.custom && !x.when && x.id === own[k].id);
    plan.days[n] = { order: same ? null : acts.map((x) => [x.id, x.s.title, x.when || ""]), removed: e.removed || [], ...stamp() };
  }
  const actOf = (d, id) => { const acts = dayActs(d), k = acts.findIndex((x) => x.id === id); return k < 0 || acts[k].s.fixed ? null : { acts, k, x: acts[k] }; };
  function moveStep(d, id, dir) {
    const f = actOf(d, id); if (!f) return;
    const j = dir === "up" ? f.k - 1 : f.k + 1;
    if (j < 0 || j >= f.acts.length) return;
    [f.acts[f.k], f.acts[j]] = [f.acts[j], f.acts[f.k]];
    setOrder(d.n, f.acts); savePlan();
  }
  function moveToDay(d, id, m) {
    const f = actOf(d, id), td = G.days[m - 1]; if (!f || !td || m === d.n) return;
    const [x] = f.acts.splice(f.k, 1);
    setOrder(d.n, f.acts);
    // Si l'étape revient dans son jour d'origine sans heure choisie, dayActs l'a déjà remise à sa place
    let ta = dayActs(td);
    if (ta.some((o) => o.id === id)) { if (x.when) { ta = ta.filter((o) => o.id !== id); insertByTime(ta, x); } }
    else insertByTime(ta, x);
    setOrder(m, ta); savePlan();
    toast(`Déplacé au jour ${m} — voir`, () => go("/jour/" + m));
  }
  function setTime(d, id, when) {
    const f = actOf(d, id); if (!f) return;
    const x = f.x, base = x.custom ? x.s : G.days[x.n - 1].steps[x.i];
    x.when = when; x.s = { ...base, when: when || base.when };
    f.acts.splice(f.k, 1);
    if (when) insertByTime(f.acts, x); else f.acts.splice(f.k, 0, x);
    setOrder(d.n, f.acts); savePlan();
  }
  function removeStep(d, id) {
    const f = actOf(d, id); if (!f) return;
    const [x] = f.acts.splice(f.k, 1);
    if (!x.custom) { const e = entryOf(x.n); plan.days[x.n] = { order: e.order || null, removed: [...(e.removed || []).filter(([i]) => i !== id), [id, x.s.title]], ...stamp() }; }
    setOrder(d.n, f.acts); savePlan();
  }
  function restoreStep(n, id) {
    const e = entryOf(n); if (!e.removed) return;
    plan.days[n] = { ...e, removed: e.removed.filter(([i]) => i !== id), ...stamp() };
    setOrder(n, dayActs(G.days[n - 1])); savePlan();
  }
  function addToDay(id, n, when) {
    const d = G.days[n - 1], acts = dayActs(d);
    if (acts.some((o) => o.id === id)) return toast(`Déjà dans le jour ${n}`);
    const [kind, k] = id.split(":"), it = (kind === "hike" ? allHikes : G.beaches)[+k];
    const x = it && customAct(id, it.name, when, n); if (!x) return;
    insertByTime(acts, x); setOrder(n, acts); savePlan();
    toast(`Ajouté au jour ${n} — voir`, () => go("/jour/" + n));
  }
  function resetDay(n) {
    const st = stamp();
    plan.days[n] = { order: null, removed: [], ...st };
    Object.entries(plan.days).forEach(([k, p]) => {
      if (+k === n || !p.order) return;
      const o = p.order.filter(([id]) => !id.startsWith(n + ":"));
      if (o.length !== p.order.length) plan.days[k] = { ...p, order: o.length ? o : null, ...st };
    });
    savePlan();
  }
  const hhmm = (when) => { const t = timeOf(when); return t.min === null || t.word ? "" : `${String(Math.floor(t.min / 60)).padStart(2, "0")}:${String(t.min % 60).padStart(2, "0")}`; };
  // Barre d'édition d'une étape : monter, descendre, heure, jour, retirer
  function editBar(d, x, acts) {
    if (x.s.fixed) return `<div class="edit-bar locked">${I.lock}<span>Réservé : cette étape ne bouge pas</span></div>`;
    const k = acts.indexOf(x), id = x.id;
    const b = (dir, inner, label, ok, cls = "") => `<button type="button" class="eb ${cls}" data-mv="${dir}" data-ref="${id}" aria-label="${label}" title="${label}" ${ok ? "" : "disabled"}>${inner}</button>`;
    const days = G.days.map((o) => `<option value="${o.n}" ${o.n === d.n ? "selected" : ""}>J${o.n} · ${dow(o)} ${+o.date.slice(8)}</option>`).join("");
    return `<div class="edit-bar">${b("up", I.up, "Monter", k > 0)}${b("down", I.down, "Descendre", k < acts.length - 1)}
      <label class="eb-time" title="Heure">${I.clock}<input type="time" data-time="${id}" value="${hhmm(x.s.when)}" aria-label="Heure"></label>
      <select class="eb-day" data-to-day="${id}" aria-label="Jour">${days}</select>
      <span class="sp"></span>${b("remove", I.x, "Retirer du programme", true, "rm")}</div>`;
  }
  // Ajouter une plage ou une rando à un jour : feuille avec l'heure et la liste des jours
  function openAddSheet(id) {
    const [kind, k] = id.split(":"), it = (kind === "hike" ? allHikes : G.beaches)[+k]; if (!it) return;
    const td = todayDay();
    $("#sheetBody").innerHTML = `<h4>Ajouter au programme</h4>
      <div class="add-head"><b>${esc(it.name)}</b><label>${I.clock}<input type="time" id="addTime" value="${kind === "hike" ? "07:00" : "14:00"}" aria-label="Heure"></label></div>
      <h4>Quel jour ?</h4>${G.days.map((d) => `<button type="button" class="dl" data-add-day="${d.n}"><span class="n">${dow(d)}<b>${+d.date.slice(8)}</b></span><span class="t">${esc(d.title)}<small>${esc(d.sub)}</small></span>${td && td.n === d.n ? '<span class="today-tag">Aujourd\'hui</span>' : ""}</button>`).join("")}`;
    const sh = showSheet();
    $$("[data-add-day]", sh).forEach((b) => (b.onclick = () => { const t = $("#addTime").value; addToDay(id, +b.dataset.addDay, t ? t.replace(":", "h") : ""); closeSheet(); }));
    sh.onclick = (e) => { if (e.target.closest("[data-close]")) closeSheet(); };
  }

  /* Partage : le fichier site/plan.json du dépôt, écrit par l'API GitHub avec un jeton gardé sur l'appareil ;
     lu par tout le monde à l'ouverture (réseau direct, hors cache). Fusion jour par jour, le plus récent gagne. */
  const GH = { repo: "yvesdekerle/travelcompanion", path: "site/plan.json", branch: "main" };
  const ghUrl = `https://api.github.com/repos/${GH.repo}/contents/${GH.path}`;
  const ghHeaders = (tok, json) => ({ Authorization: `Bearer ${tok}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(json ? { "Content-Type": "application/json" } : {}) });
  const b64 = (s) => { let b = ""; new TextEncoder().encode(s).forEach((c) => (b += String.fromCharCode(c))); return btoa(b); };
  const unb64 = (s) => new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  function mergePlan(a, b) {
    const out = PLAN_EMPTY();
    new Set([...Object.keys(a.days || {}), ...Object.keys(b.days || {})]).forEach((k) => {
      const x = a.days && a.days[k], y = b.days && b.days[k];
      out.days[k] = !x ? y : !y ? x : (y.at || "") > (x.at || "") ? y : x;
    });
    return out;
  }
  function shareState(long) {
    const tok = store.get("gh:token", ""), dirty = store.get("plan:dirty", false), shared = store.get("plan:shared", "");
    if (!tok) return dirty
      ? (long ? "Des changements n'existent que sur cet appareil : ajoute un jeton pour les publier." : `Sur cet appareil seulement · <a href="/edition">publier pour le groupe</a>.`)
      : (long ? "Rien à publier pour l'instant." : "Partagé avec le groupe.");
    if (dirty) return navigator.onLine ? "Publication en cours…" : "Sera publié dès qu'il y aura du réseau.";
    return long ? `Tout est publié${shared ? `, dernier envoi ${fmtAt(shared)}` : ""}.` : "Partagé avec le groupe.";
  }
  function refreshShare() {
    $$("[data-share-state]").forEach((el) => (el.innerHTML = shareState(el.dataset.shareState === "long")));
    const sn = $("#syncNow"); if (sn) sn.disabled = !(store.get("gh:token", "") && store.get("plan:dirty", false));
  }
  let syncT = 0, syncing = false;
  function scheduleSync() { clearTimeout(syncT); syncT = setTimeout(syncPlan, 1500); }
  async function syncPlan() {
    const tok = store.get("gh:token", "");
    if (!tok || !store.get("plan:dirty", false) || !navigator.onLine || syncing) return;
    syncing = true; refreshShare();
    try {
      const r = await fetch(`${ghUrl}?ref=${GH.branch}`, { headers: ghHeaders(tok), cache: "no-store" });
      let sha;
      if (r.ok) { const j = await r.json(); sha = j.sha; try { plan = mergePlan(JSON.parse(unb64(j.content)), plan); } catch {} }
      else if (r.status !== 404) throw new Error(r.status);
      const nw = newest(plan);
      const message = nw ? `Programme partagé : jour ${nw[0]} ${nw[1].order ? "réordonné" : "rétabli"}${nw[1].by ? ` par ${nw[1].by}` : ""}` : "Programme partagé";
      const body = { message, content: b64(JSON.stringify(plan, null, 1) + "\n"), branch: GH.branch };
      if (sha) body.sha = sha;
      const put = await fetch(ghUrl, { method: "PUT", headers: ghHeaders(tok, true), body: JSON.stringify(body) });
      if (!put.ok) throw new Error(put.status);
      store.set("plan", plan); store.set("plan:dirty", false); store.set("plan:shared", new Date().toISOString());
      toast("✓ Programme publié : en ligne pour tout le monde dans une minute");
    } catch (e) {
      const code = String(e && e.message);
      toast(code === "401" ? "Jeton GitHub refusé : à vérifier dans Édition partagée" : code === "403" || code === "404" ? "Le jeton n'a pas accès en écriture au dépôt" : "Publication impossible pour l'instant, nouvel essai plus tard");
    } finally { syncing = false; refreshShare(); }
  }
  async function testToken() {
    const tok = store.get("gh:token", "");
    if (!tok) return toast("Colle d'abord un jeton");
    if (!navigator.onLine) return toast("Pas de réseau pour l'instant");
    try {
      const r = await fetch(`${ghUrl}?ref=${GH.branch}`, { headers: ghHeaders(tok), cache: "no-store" });
      toast(r.ok ? "✓ Jeton accepté, le dépôt est accessible (l'écriture se vérifie au premier envoi)" : r.status === 401 ? "Jeton refusé par GitHub" : `GitHub répond ${r.status} : vérifier l'accès au dépôt`);
    } catch { toast("Impossible de joindre GitHub"); }
  }
  // Un autre onglet du même téléphone a modifié le programme : on le reprend
  window.addEventListener("storage", (e) => { if (e.key === KEY + "plan") { plan = store.get("plan", null) || PLAN_EMPTY(); if (!plan.days) plan = PLAN_EMPTY(); if (main.dataset.day && !document.activeElement.matches("input, textarea, select")) render(); } });
  // Au démarrage, au retour au premier plan et au retour du réseau : le programme publié, sans passer par le cache
  let lastLoad = 0;
  async function loadSharedPlan() {
    if (!navigator.onLine || Date.now() - lastLoad < 30000) return;
    lastLoad = Date.now();
    try {
      const r = await fetch("/plan.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) return;
      const remote = await r.json();
      if (!remote || !remote.days) return;
      const merged = mergePlan(plan, remote);
      const changed = Object.keys(merged.days).filter((k) => JSON.stringify(merged.days[k]) !== JSON.stringify(plan.days[k]));
      if (!changed.length) return;
      // Ce qui change visiblement : un jour réordonné, ou un jour remis à l'ordre du guide alors qu'on l'avait modifié
      const visible = changed.filter((k) => { const m = merged.days[k], o = plan.days[k]; return (m.order || (m.removed && m.removed.length)) || (o && (o.order || (o.removed && o.removed.length))); });
      plan = merged; store.set("plan", plan);
      if (!visible.length) return;
      const by = [...new Set(visible.map((k) => remote.days[k] && remote.days[k].by).filter(Boolean))];
      toast(`Programme mis à jour${by.length ? ` par ${by.join(" et ")}` : ""} : jour${visible.length > 1 ? "s" : ""} ${visible.sort((a, b) => a - b).join(", ")}`);
      if (main.dataset.day && !document.activeElement.matches("input, textarea")) render();
    } catch {}
  }

  /* ───────── Carte du jour (SVG dessiné hors ligne à partir de geo.js) ───────── */
  const GEO = window.GEO;
  const NAVY = "#1A2B3D", LAGOON = "#1E7C99";
  // Les arrêts du jour dans l'ordre : départ, lieux de chaque étape (et spots en mer), arrivée — même logique que scripts/build_geo.mjs
  function dayStops(d, eff = effectiveSteps(d)) {
    const kindOf = (q) => (q === AIRPORT ? "plane" : q === VILLA || q === SERGE ? "home" : "stop");
    const start = dayStart(d.n), end = dayEnd(d.n), out = [{ q: start, kind: kindOf(start), i: -1 }];
    const last = () => out[out.length - 1];
    eff.forEach((x, i) => {
      const s = x.s; if (s.t === "drive") return;
      (s.places || []).forEach(([label, q]) => { if (last().q !== q) out.push({ q, label, kind: kindOf(q), i, where: (s.where || "").split(" · ")[0] }); });
      const port = [...out].reverse().find((o) => o.kind !== "sea").q;
      (s.sea || []).forEach((q) => out.push({ q, label: q, kind: "sea", i, from: port }));
    });
    if (last().q !== end) out.push({ q: end, kind: kindOf(end), i: -1 });
    return out;
  }
  // Nom court pour l'étiquette sur la carte
  const shortName = (l) => l.replace(/^Départ du sentier( du| de la| de|,)?\s*/i, "").split(",")[0].replace(/\s+Public Beach$/i, "").replace(/\s*\(.*$/, "").trim();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  function dayMap(d, cur, stops, mapsUrl, mod) {
    const route = !mod && GEO && GEO.routes[d.n];
    if (!GEO || (!route && !mod)) return "";
    const pts = stops.filter((s) => GEO.places[s.q]);
    if (pts.length < 2) return "";
    const all = [...pts.map((s) => GEO.places[s.q]), ...(route || [])];
    const cos = Math.cos((-20.2 * Math.PI) / 180), W = 320;
    const las = all.map((p) => p[0]), los = all.map((p) => p[1]);
    const la0 = Math.min(...las), la1 = Math.max(...las), lo0 = Math.min(...los), lo1 = Math.max(...los);
    // Cadre carré autour de la journée : un tiers d'air, au moins ~15 km de côté
    const span = Math.max(Math.max(la1 - la0, (lo1 - lo0) * cos) * 1.35 + 0.02, 0.14);
    const cla = (la0 + la1) / 2, clo = (lo0 + lo1) / 2, k = W / span;
    const P = ([la, lo]) => [+((lo - clo) * cos * k + W / 2).toFixed(1), +((cla - la) * k + W / 2).toFixed(1)];
    const path = (arr, close) => "M" + arr.map((p) => P(p).join(" ")).join("L") + (close ? "Z" : "");

    // Marqueurs : les arrêts très proches sont regroupés (« 2–4 »), les logements ne sont pas numérotés
    const marks = []; let num = 0;
    pts.forEach((s) => {
      const [x, y] = P(GEO.places[s.q]);
      if (s.kind === "sea") { marks.push({ x, y, kind: "sea", labels: [s.label] }); return; }
      const near = marks.find((m) => m.kind === s.kind && Math.hypot(m.x - x, m.y - y) < 13);
      if (s.kind !== "stop") { if (!near) marks.push({ x, y, kind: s.kind, q: s.q, labels: [cap(PLACE_NAME[s.q] || s.q)] }); return; }
      num++;
      if (near) { near.nums.push(num); near.labels.push(s.label); near.wheres.push(s.where); near.now = near.now || s.i === cur; }
      else marks.push({ x, y, kind: "stop", nums: [num], labels: [s.label], wheres: [s.where], now: s.i === cur });
    });
    // Lignes en mer : du port vers chaque spot, puis retour
    const seaPaths = [];
    pts.forEach((s, j) => { if (s.kind === "sea" && (j === 0 || pts[j - 1].kind !== "sea" || pts[j - 1].i !== s.i)) {
      const run = []; for (let m = j; m < pts.length && pts[m].kind === "sea" && pts[m].i === s.i; m++) run.push(GEO.places[pts[m].q]);
      seaPaths.push(path([GEO.places[s.from], ...run, GEO.places[s.from]]));
    } });

    // Vignette de l'île (en haut à droite) si le cadre ne couvre pas déjà l'île : ses dimensions servent aussi à placer les étiquettes
    const cl = GEO.coast.map((p) => p[0]), co = GEO.coast.map((p) => p[1]);
    const ila0 = Math.min(...cl), ila1 = Math.max(...cl), ilo0 = Math.min(...co), ilo1 = Math.max(...co);
    const iw = 54, ki = iw / ((ilo1 - ilo0) * cos), ih = (ila1 - ila0) * ki, insetOn = span < 0.45;
    // Étiquettes : à droite du marqueur si la place est libre, sinon à gauche, dessous, dessus
    const boxes = marks.map((m) => ({ x0: m.x - 9, y0: m.y - 9, x1: m.x + 9, y1: m.y + 9 }));
    if (insetOn) boxes.push({ x0: W - iw - 17, y0: 3, x1: W - 7, y1: ih + 13 });
    const hit = (b) => b.x0 < 2 || b.x1 > W - 2 || b.y0 < 2 || b.y1 > W - 2 || boxes.some((o) => b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
    const labelOf = (m) => {
      if (m.kind !== "stop") return m.labels[0];
      if (m.nums.length > 1 && m.wheres.every((w) => w && w === m.wheres[0])) return m.wheres[0];
      return shortName(m.labels[0]) + (m.nums.length > 1 ? ` +${m.nums.length - 1}` : "");
    };
    const texts = marks.map((m) => {
      // Un logement collé à un arrêt numéroté n'a pas besoin d'étiquette (la légende le dit)
      if (m.kind !== "stop" && m.kind !== "sea" && marks.some((o) => o.kind === "stop" && Math.hypot(o.x - m.x, o.y - m.y) < 16)) return "";
      const t = labelOf(m), w = t.length * 4.4 + 2, h = 10, r = m.kind === "stop" ? 9 : 8;
      const cands = [
        { x: m.x + r + 2, y: m.y + 3, a: "start", b: { x0: m.x + r + 1, x1: m.x + r + 1 + w, y0: m.y - 5, y1: m.y + 5 } },
        { x: m.x - r - 2, y: m.y + 3, a: "end", b: { x0: m.x - r - 1 - w, x1: m.x - r - 1, y0: m.y - 5, y1: m.y + 5 } },
        { x: m.x, y: m.y + r + 10, a: "middle", b: { x0: m.x - w / 2, x1: m.x + w / 2, y0: m.y + r + 1, y1: m.y + r + 1 + h } },
        { x: m.x, y: m.y - r - 4, a: "middle", b: { x0: m.x - w / 2, x1: m.x + w / 2, y0: m.y - r - 1 - h, y1: m.y - r - 1 } }
      ];
      const c = cands.find((o) => !hit(o.b)) || cands[0];
      boxes.push(c.b);
      return `<text x="${c.x.toFixed(1)}" y="${c.y.toFixed(1)}" text-anchor="${c.a}" class="lbl ${m.kind}">${esc(t)}</text>`;
    });

    const numLabel = (nums) => nums.length === 1 ? String(nums[0]) : nums.every((v, j) => !j || v === nums[j - 1] + 1) ? `${nums[0]}–${nums[nums.length - 1]}` : nums.join(",");
    const marker = (m) => {
      if (m.kind === "sea") return `<circle cx="${m.x}" cy="${m.y}" r="4.5" fill="#fff" stroke="${LAGOON}" stroke-width="1.8"/>`;
      if (m.kind !== "stop") {
        return `<g transform="translate(${m.x} ${m.y})"><circle r="9" fill="#fff" stroke="${NAVY}" stroke-width="1.6"/><g transform="translate(-5.5 -5.5)" class="glyph ${m.kind}">${ico(m.kind === "plane" ? "plane" : "home", 11)}</g></g>`;
      }
      const t = numLabel(m.nums), w = Math.max(17, t.length * 5.6 + 7);
      return `<g transform="translate(${m.x} ${m.y})"><rect x="${-w / 2}" y="-8.5" width="${w}" height="17" rx="8.5" fill="${m.now ? "#E85D4F" : NAVY}" stroke="#fff" stroke-width="1.6"/><text y="3.1" text-anchor="middle" class="num">${t}</text></g>`;
    };

    // Échelle (2, 5, 10 ou 20 km) et vignette de l'île avec le cadre, si le cadre ne couvre pas déjà l'île
    const km = [2, 5, 10, 20].find((v) => (v / 111.32) * k >= 40) || 20, len = ((km / 111.32) * k).toFixed(1);
    const scale = `<g class="scale" transform="translate(10 ${W - 12})"><path d="M0 -4v4h${len}v-4"/><text x="${len / 2}" y="-7" text-anchor="middle">${km} km</text></g>`;
    let inset = "";
    if (insetOn) {
      const Pi = ([la, lo]) => `${((lo - ilo0) * cos * ki).toFixed(1)} ${((ila1 - la) * ki).toFixed(1)}`;
      const fx0 = Math.max(0, (clo - span / 2 / cos - ilo0) * cos * ki), fx1 = Math.min(iw, (clo + span / 2 / cos - ilo0) * cos * ki);
      const fy0 = Math.max(0, (ila1 - cla - span / 2) * ki), fy1 = Math.min(ih, (ila1 - cla + span / 2) * ki);
      inset = `<g class="inset" transform="translate(${W - iw - 12} 8)"><rect x="-5" y="-5" width="${iw + 10}" height="${(ih + 10).toFixed(1)}" rx="7"/>
        <path class="isle" d="M${GEO.coast.map(Pi).join("L")}Z"/><rect class="frame" x="${fx0.toFixed(1)}" y="${fy0.toFixed(1)}" width="${(fx1 - fx0).toFixed(1)}" height="${(fy1 - fy0).toFixed(1)}" rx="1.5"/></g>`;
    }

    const legend = marks.map((m) => m.kind === "stop" ? `<li class="${m.now ? "now" : ""}"><b>${numLabel(m.nums)}</b><span>${m.labels.map(esc).join(", ")}</span></li>`
      : m.kind === "sea" ? `<li class="sea"><i></i><span>${esc(m.labels[0])}</span></li>`
      : `<li class="home">${m.kind === "plane" ? I.plane : I.home}<span>${esc(m.labels[0])}</span></li>`).join("");
    return `<section class="daymap" aria-labelledby="mapTitle"><h2 id="mapTitle">Le parcours du jour</h2>
      <div class="wrap">
        <div class="map"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="Carte du parcours du jour ${d.n}">
          <rect width="${W}" height="${W}" class="sea"/>
          <path class="land" d="${path(GEO.coast, true)}"/>
          ${route ? `<path class="route casing" d="${path(route)}"/><path class="route" d="${path(route)}"/>` : `<path class="route est" d="${path(pts.filter((s) => s.kind !== "sea").map((s) => GEO.places[s.q]))}"/>`}
          ${seaPaths.map((p) => `<path class="boat" d="${p}"/>`).join("")}
          ${[...marks].sort((a, b) => (a.kind === "stop") - (b.kind === "stop")).map(marker).join("")}${texts.join("")}
          ${scale}${inset}
        </svg></div>
        <div class="side">
          <ol class="legend">${legend}</ol>
          <div class="card-actions"><a class="btn sm" ${ext(mapsUrl)}>${I.route}Ouvrir dans Google Maps</a></div>
          <small class="credit">Fond de carte © OpenStreetMap · ${route ? "tracé routier indicatif" : "ordre modifié : liaisons à vol d'oiseau"}</small>
        </div>
      </div></section>`;
  }

  function pageDay(n, home) {
    const d = G.days.find((x) => x.n === n) || G.days[0];
    n = d.n;
    if (!canEdit()) editing = false;
    const eff = effectiveSteps(d), mod = isModified(d), acts = eff.filter((x) => x.s.t !== "drive");
    const cur = currentStepIndex(d, eff), start = dayStart(n), end = dayEnd(n);
    const isToday = todayDay() && todayDay().n === n;

    // Tous les lieux du jour, dans l'ordre (retour au logement compris), pour l'itinéraire Google Maps : 9 étapes au plus
    const stops = dayStops(d, eff), land = stops.filter((s) => s.kind !== "sea");
    const wps = land.slice(1, -1).map((s) => s.q).slice(0, 9);
    const mapsUrl = routeUrl(start, end, wps);
    // Ordre modifié : un horaire du guide qui n'est plus dans l'ordre est affiché en retrait
    const mins = acts.map((x) => timeOf(x.s.when).min);
    const doubt = (a) => mod && mins[a] !== null && mins.some((m, j) => m !== null && ((j < a && m > mins[a]) || (j > a && m < mins[a])));

    let here = start;
    const items = eff.map((x, k) => {
      const s = x.s;
      if (s.t === "drive") {
        let to = null;
        for (let j = k + 1; j < eff.length; j++) { const nx = eff[j].s; if (nx.t !== "drive" && nx.places && nx.places[0]) { to = nx.places[0][1]; break; } }
        if (!to) to = end;
        const leg = to !== here ? `<a class="leg" ${ext(routeUrl(here, to))}>${I.nav}Trajet</a>` : "";
        const dp = driveParts(s.d);
        const main = dp.dur
          ? `${dp.dep && !mod ? `<span class="dep">départ ${esc(dp.dep)}</span>` : ""}<b>${esc(dp.dur)}</b>${dp.dist ? `<span>${esc(dp.dist)}</span>` : ""}`
          : `<span class="plain">${esc(s.d)}</span>`;
        const sub = dp.dur && dp.rest.length ? `<div class="drive-sub">${esc(dp.rest.join(" · "))}</div>` : "";
        return `<div class="tl-item tl-drive ${x.est ? "est" : ""}"><div class="tl-time"><span class="car">${s.icon === "plane" ? I.plane : s.icon === "walk" ? I.walk : I.car}</span></div>
          <div class="drive"><div class="drive-body"><div class="drive-main">${main}</div>${sub}</div>${leg}</div></div>`;
      }
      const origin = here;
      if (s.places && s.places.length) here = s.places[s.places.length - 1][1];
      const a = acts.indexOf(x), t = timeOf(s.when), dz = doubt(a), dtitle = dz ? ' title="Horaire du guide : l’ordre a changé"' : "";
      const placesHtml = (s.places || []).map((p, j) => placeRow(p, j === 0 ? (origin === p[1] ? null : origin) : s.places[j - 1][1])).join("") + (s.links || []).map(linkRow).join("");
      const gutter = t.word ? `<span class="t-word ${dz ? "doubt" : ""}"${dtitle}>${esc(t.label)}</span>` : `<span class="t-h ${dz ? "doubt" : ""}"${dtitle}>${esc(t.label)}</span>${t.end ? `<span class="t-end ${dz ? "doubt" : ""}">${esc(t.end)}</span>` : ""}`;
      return `<div class="tl-item ${s.star ? "star" : ""} ${s.home ? "home" : ""} ${k === cur ? "now" : ""}" id="etape-${k}">
        <div class="tl-time">${gutter}<i class="dot">${s.home ? I.home : ""}</i></div>
        <article class="card-step">
          ${editing ? editBar(d, x, acts) : ""}
          ${k === cur ? '<span class="now-pill">En ce moment</span>' : ""}${s.fixed ? `<span class="fixed-pill">${I.lock}Réservé · horaire fixe</span>` : ""}${x.custom ? `<span class="from-pill">${I.plus}Ajouté au programme</span>` : x.n !== n ? `<span class="from-pill">${I.route}Venu du jour ${x.n}</span>` : ""}
          ${s.where ? `<div class="where">${esc(s.where)}</div>` : ""}
          <h3>${esc(s.title)}${s.star ? `<span class="star-mark" title="Temps fort">${I.starf}</span>` : ""}</h3>
          <div class="text"><p>${linkifyHtml(s.text)}</p></div>
          ${s.rdv ? `<div class="rdv"><b>Rendez-vous</b><span>${linkify(s.rdv)}</span></div>` : ""}
          ${tags(s.tags)}
          ${s.contact ? contactRows(s.contact) : ""}
          ${s.note ? `<div class="callout ${s.note[2] || ""}"><span class="k">${esc(s.note[0])}</span><span>${linkify(s.note[1])}</span></div>` : ""}
          ${placesHtml ? `<div class="places">${placesHtml}</div>` : ""}
        </article></div>`;
    }).join("");

    // Une ligne utile : heure du premier départ en voiture et total de route du jour (recalculé si l'ordre a changé)
    const firstDrive = eff.find((x) => x.s.t === "drive" && !x.s.icon);
    const dep = firstDrive && !mod ? driveParts(firstDrive.s.d).dep : "";
    const tot = eff.filter((x) => x.s.t === "drive" && !x.s.icon).reduce((o, x) => { const dp = driveParts(x.s.d); o.min += dp.dur ? toMin(dp.dur) : 0; o.km += parseFloat((dp.dist || "0").replace(",", ".")) || 0; return o; }, { min: 0, km: 0 });
    const driveTxt = mod ? `≈ ${fmtMin(tot.min)} de route · ${Math.round(tot.km)} km · ordre modifié` : d.drive;
    // Ce qui est réservé ne bouge pas : rappel en tête de page, avec l'heure
    const shortTitle = (t) => { const m = /^Embarquement — (.+)$/.exec(t); return cap(m ? m[1] : t.split(" — ")[0].split(", puis")[0]); };
    const fixed = acts.filter((x) => x.s.fixed).map((x) => x.s);
    const facts = `<p class="meta">${I.car}<span>${dep ? `Départ ${dep} · ` : ""}${esc(driveTxt)}</span></p>` +
      (fixed.length ? `<p class="meta lock">${I.lock}<span>Réservé, horaire fixe : ${fixed.map((s) => `<b>${esc(timeOf(s.when).label)}</b> ${esc(shortTitle(s.title))}`).join(" · ")}</span></p>` : "");
    const actions = `<div class="actions">
        <a class="btn primary" ${ext(mapsUrl)}>${I.route}Itinéraire du jour dans Maps</a>
        <a class="btn" ${ext(dirUrl(end))}>${I.home}${end === AIRPORT ? "Vers l'aéroport" : `Retour à ${PLACE_NAME[end]}`}</a>
      </div>`;
    // Le programme : bouton d'édition, rappel quand l'ordre a été modifié (par qui, quand, partagé ou non)
    const p = plan.days[n] || {}, who = [p.by ? `par ${esc(p.by)}` : "", fmtAt(p.at)].filter(Boolean).join(", ");
    const planBox = mod ? `<div class="callout plan"><span class="k">${I.pen}Ordre modifié</span><span>${who ? cap(who) + ". " : ""}<span data-share-state>${shareState()}</span>${canEdit() ? ` <button type="button" class="link" id="resetDay">Rétablir l'ordre du guide</button>` : ""}</span></div>` : "";
    const editBtn = canEdit() ? `<button type="button" class="icon-btn edit ${editing ? "on" : ""}" id="editPlan" aria-label="${editing ? "Terminer les modifications" : "Modifier le programme"}" title="${editing ? "Terminer" : "Modifier le programme"}">${editing ? I.check : I.pen}</button>` : "";
    const tlHead = `<div class="tl-head"><h2 class="tl-title">Le programme</h2>${editBtn}</div>
      ${editing ? `<p class="hint">Sur chaque étape : les flèches changent l'ordre, l'heure et le jour se choisissent directement, la croix la retire. Depuis Plages et Randos, « Ajouter à un jour » place une activité dans le programme. Les étapes réservées ne bougent pas ; les trajets sont recalculés.</p>` : ""}${planBox}`;
    const removed = editing ? (entryOf(n).removed || []).map(([id, title]) => resolveRef(id, title)).filter(Boolean) : [];
    const removedBox = removed.length ? `<div class="removed"><h3>Retirées du programme</h3>${removed.map((r) => `<div class="rm-row"><span><b>${esc(timeOf(r.s.when).label)}</b> ${esc(r.s.title)}</span><button type="button" class="btn sm" data-restore="${r.id}">${I.undo}Remettre</button></div>`).join("")}</div>` : "";
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
            ${tlHead}
            <div class="timeline ${editing ? "editing" : ""}">${items}</div>
            ${removedBox}
            ${dayMap(d, cur, stops, mapsUrl, mod)}
            ${notesBox}
            ${d.credit ? credits([{ name: d.caption, credit: d.credit }]) : ""}
            <nav class="pager">
              ${prev ? `<a href="/jour/${prev.n}"><small>Jour ${prev.n}</small><b>${esc(prev.title)}</b></a>` : ""}
              ${next ? `<a class="next" href="/jour/${next.n}"><small>Jour ${next.n}</small><b>${esc(next.title)}</b></a>` : ""}
            </nav>
          </div>
        </div>
      </div>`;
  }

  // Feuille du bas : la page derrière est figée tant qu'elle est ouverte (sinon, sur mobile, c'est elle qui défile)
  let lockY = 0;
  function showSheet() {
    const sh = $("#sheet");
    if (sh.hidden) { lockY = window.scrollY; document.body.style.top = -lockY + "px"; document.body.classList.add("sheet-open"); }
    sh.hidden = false; return sh;
  }
  function closeSheet() {
    const sh = $("#sheet"); if (sh.hidden) return; sh.hidden = true;
    document.body.classList.remove("sheet-open"); document.body.style.top = ""; window.scrollTo(0, lockY);
    const b = $("#allDays"); if (b) b.focus({ preventScroll: true });
  }
  function openDaysSheet(current) {
    const td = todayDay();
    const row = (d) => `<a class="dl ${d.n === current ? "active" : ""}" href="/jour/${d.n}"><span class="n">${dow(d)}<b>${+d.date.slice(8)}</b></span><span class="t">${esc(d.title)}${fixedStar(d)}<small>${esc(d.drive.replace("≈ ", ""))}</small></span>${td && td.n === d.n ? '<span class="today-tag">Aujourd\'hui</span>' : ""}</a>`;
    $("#sheetBody").innerHTML = `<h4>À neuf, Rivière Noire</h4>${G.days.filter((d) => d.phase === "neuf").map(row).join("")}<h4>À deux, Trou aux Biches</h4>${G.days.filter((d) => d.phase === "deux").map(row).join("")}`;
    const sh = showSheet();
    const act = $(".dl.active", sh); if (act) { act.scrollIntoView({ block: "center" }); act.focus({ preventScroll: true }); }
    sh.onclick = (e) => { if (e.target.closest("[data-close]") || e.target.closest("a")) closeSheet(); };
  }

  // Nos cartes Google My Maps, depuis la barre du haut
  function openMapsSheet() {
    $("#sheetBody").innerHTML = `<h4>Nos cartes Google My Maps</h4>${G.trip.maps.map((m) =>
      `<a class="dl" ${ext(m.url)}><span class="n">${I.map}</span><span class="t">${esc(m.title)}<small>${esc(m.sub)}</small></span><span class="out">${I.ext}</span></a>`).join("")}`;
    const sh = showSheet();
    $(".dl", sh).focus({ preventScroll: true });
    sh.onclick = (e) => { if (e.target.closest("[data-close]") || e.target.closest("a")) closeSheet(); };
  }

  /* ───────── Réservations (déjà réservé) ───────── */
  function pageBooked() {
    const left = G.toBook.length - todoCounts.reserver()[0];
    return `<div class="container">${pageHead("", "Réservations", "Bateaux, plongée, pêche, hélico : tout ce qui est réservé, payé ou à payer sur place, avec les contacts, les points de rendez-vous et ce qu'il faut emporter.")}
      <div class="card-actions"><a class="btn sm" href="/todo/a-reserver">${I.todo}Encore à réserver · ${left}</a><a class="btn sm" href="/annexes#cash">${I.cash}Cash à prévoir</a></div>
      <div class="grid c2" style="margin-top:18px">${G.booked.map((b) => `
        <article class="card">
          <div class="top"><span class="eyebrow">${esc(b.when)}</span>${pill(b.status)}</div>
          <h3>${esc(b.title)}</h3><p class="text it">${linkify(b.desc)}</p>
          <dl class="kv">${b.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${Array.isArray(v) ? contactRows(v) : linkify(v)}</dd>`).join("")}</dl>
          ${b.note ? `<div class="callout warn"><span class="k">Attention</span><span>${linkify(b.note)}</span></div>` : ""}
          <div class="card-actions">${contactBtns(b)}<a class="btn sm" href="/jour/${b.day}">${I.route}Jour ${b.day}</a></div>
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
              ${s.host ? `<dt>Hôte</dt><dd>${linkify(s.host)}</dd>` : ""}
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
    return `<div class="container">${pageHead("", "À réserver", "Ce qui reste à caler — contacts et prix relevés le 28 octobre 2026, à confirmer en réservant. Coche quand c'est fait.", ["/todo", "To-do"])}
      <div class="grid c2">${G.toBook.map((b, i) => [b, i]).sort((x, y) => x[0].day - y[0].day).map(([b, i]) => { const done = store.get(toBookKey(b), false); return `
        <article class="card ${done ? "done" : ""}">
          <div class="top"><span class="eyebrow">${esc(b.when)}</span><label class="check-pill"><input class="chk" type="checkbox" data-tobook="${i}" ${done ? "checked" : ""}>${done ? "Réservé" : "À réserver"}</label></div>
          <h3>${esc(b.title)}</h3>
          <dl class="kv"><dt>Détails</dt><dd>${linkify(b.details)}</dd>${b.contact ? `<dt>Contact</dt><dd>${linkify(b.contact)}</dd>` : ""}${b.place ? `<dt>Lieu</dt><dd>${esc(b.place)}</dd>` : ""}</dl>
          <div class="card-actions">${contactBtns(b)}${b.place ? `<a class="btn sm" ${ext(searchUrl(b.place))}>${I.map}Carte</a>` : ""}<a class="btn sm" href="/jour/${b.day}">${I.route}Jour ${b.day}</a></div>
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
        ${inf.cards.map((c) => `<div class="card"><div class="eyebrow">${esc(c.k)}</div><h3>${esc(c.title)}</h3><div class="text">${linkifyHtml(c.html)}</div></div>`).join("")}</div>`)}
      ${section("meteo", "Section 04", "Météo de novembre", "", `<div class="table stack"><table><thead><tr><th>Région</th><th>Temp. jour</th><th>Pluie</th><th>Particularité</th></tr></thead><tbody>
        ${inf.weather.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td data-l="Jour">${esc(r[1])}</td><td data-l="Pluie">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}</tbody></table></div>`)}
      ${section("route", "Section 04", "Sur la route", "", `<div class="table stack"><table><thead><tr><th>Règle</th><th>Valeur</th><th>Note</th></tr></thead><tbody>
        ${inf.driving.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td data-l="Valeur">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>
        <div class="card-actions"><a class="btn sm" href="/todo/voiture">${I.car}Checklist voiture</a></div>`)}
      ${section("temps", "Mesurés sur Google Maps, hors trafic", "Temps de route", "Touche une destination pour ouvrir le trajet depuis le logement.", `<div class="grid c2">${routeCard(inf.routes.a, VILLA)}${routeCard(inf.routes.b, SERGE)}</div><div class="callout warn"><span class="k">Trafic</span><span>${esc(inf.routes.note)}</span></div>`)}
    </div>`;
  }

  /* ───────── Convertisseur ───────── */
  // Montant courant (en roupies) et sens d'affichage : euros à gauche quand cv.eur est vrai.
  const cv = { rs: 1000, eur: store.get("conv:eur", false) };
  function pageConverter() {
    const r = G.rate, f = (v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
    const rsField = `<label><span>Roupies</span><input id="cvRs" inputmode="decimal" value="${f(cv.rs)}" aria-label="Montant en roupies"></label>`;
    const eurField = `<label><span>Euros</span><input id="cvEur" inputmode="decimal" aria-label="Montant en euros"></label>`;
    const quick = cv.eur
      ? [5, 10, 20, 50, 100, 200, 500, 1000].map((v) => `<button type="button" data-eur="${v}">${f(v)} €</button>`)
      : [100, 500, 1000, 1500, 3500, 5000, 10000, 14000, 33000].map((v) => `<button type="button" data-rs="${v}">${f(v)} Rs</button>`);
    return `<div class="container">${pageHead("", "Convertisseur", `1 € ≈ ${String(r).replace(".", ",")} Rs. Fonctionne sans réseau.`)}
      <div class="narrow">
        <div class="card">
          <div class="conv">${cv.eur ? eurField : rsField}<button type="button" class="sw" id="cvSwap" aria-label="Inverser le sens de conversion" title="Inverser">${I.conv}</button>${cv.eur ? rsField : eurField}</div>
          <div class="quick">${quick.join("")}</div>
        </div>
        <div class="card mental"><span class="brain">${I.brain}</span><div>
          <h3>De tête</h3>
          <p class="text">Enlever deux zéros, puis multiplier par 2. Un peu au-dessus du vrai taux : parfait pour ne pas se tromper dans le mauvais sens.</p>
          <div class="ex">${[[1000, 10, 20], [2500, 25, 50], [3500, 35, 70], [33000, 330, 660]].map(([a, b, c]) => `<span>${f(a)} Rs <i>→</i> ${b} <i>→</i> <b>${c} €</b></span>`).join("")}</div>
        </div></div>
      </div></div>`;
  }

  /* ───────── Bons plans ───────── */
  const pageTips = () => `<div class="container">${pageHead("", "Bons plans", "Street food, marchés, snorkeling, couchers de soleil, apps : pour mieux dépenser, mieux manger, mieux dormir.")}
    <div class="grid c2">${G.tips.map((c) => `<div class="card"><div class="eyebrow">${esc(c.k)}</div><h3>${esc(c.title)}</h3><div class="text">${linkifyHtml(c.html)}</div></div>`).join("")}</div></div>`;

  /* ───────── Plages & randonnées ───────── */
  // Le logement d'où l'on trie est mis en avant
  const fromStays = (f, hl) => `<div class="from"><span class="pill ${hl === "villa" ? "hl" : ""}">${ico("home", 12)} Villa ${esc(f[0])}</span><span class="pill ${hl === "serge" ? "hl" : ""}">${ico("home", 12)} Trou aux Biches ${esc(f[1])}</span></div>`;
  // Tri : par note, par temps de route depuis l'un ou l'autre logement, ou par zone (dans le sens des aiguilles d'une montre depuis le nord)
  const toMin = (s) => { if (/sur place/i.test(s)) return 0; const h = /(\d+)\s*h\s*(\d*)/.exec(s); if (h) return +h[1] * 60 + (+h[2] || 0); const m = /(\d+)\s*min/.exec(s); return m ? +m[1] : 999; };
  const noteNum = (n) => parseFloat(String(n).replace(",", ".")) || 0;
  const ZONES = ["Nord", "Nord-est", "Est", "Sud-est", "Sud", "Sud-ouest", "Gorges", "Ouest", "Nord-ouest"];
  const SORTS = { note: "Par note", villa: "Près de la villa", serge: "Près de Trou aux Biches", zone: "Par zone" };
  const byNote = (a, b) => noteNum(b.note) - noteNum(a.note);
  function sorted(list, by) {
    const l = [...list];
    if (by === "villa") l.sort((a, b) => toMin(a.from[0]) - toMin(b.from[0]) || byNote(a, b));
    else if (by === "serge") l.sort((a, b) => toMin(a.from[1]) - toMin(b.from[1]) || byNote(a, b));
    else if (by === "zone") l.sort((a, b) => ZONES.indexOf(a.zone) - ZONES.indexOf(b.zone) || byNote(a, b));
    else l.sort(byNote);
    return l;
  }
  const sortBar = (key, cur, extra = {}) => `<nav class="chips sort" aria-label="Trier">${Object.entries({ ...extra, ...SORTS }).map(([k, v]) => `<button type="button" data-sort="${key}:${k}" aria-pressed="${k === cur}">${v}</button>`).join("")}</nav>`;
  const grouped = (list, card) => ZONES.filter((z) => list.some((x) => x.zone === z)).map((z) => `<h3 class="group">${z}</h3><div class="grid c3">${list.filter((x) => x.zone === z).map(card).join("")}</div>`).join("");
  // "Sam 7" → le jour du programme correspondant
  const hikeDay = (h) => h.day ? G.days.find((d) => dow(d) === h.day.slice(0, 3) && +d.date.slice(8) === +h.day.split(" ")[1]) : null;
  // Photo de la fiche : `pic` = une image unique dans img/lieux (photos Wikimedia Commons, crédit dans `credit`),
  // `img` = les deux tailles du guide (img/nom-s.webp et img/nom.webp)
  const cover = (x) => x.pic ? `<div class="lc-cover"><img src="/img/lieux/${x.pic}.webp" alt="${esc(x.name)}" loading="lazy" decoding="async"></div>`
    : x.img ? `<div class="lc-cover">${img(x.img, x.name, false, "(min-width: 720px) 33vw, 100vw")}</div>` : "";
  // Crédits des photos de la page : Commons (auteur, licence, nom du fichier) ou site de la fiche (site, mention, URL)
  const credits = (list) => { const l = list.filter((x) => x.credit); return l.length ? `<details class="credits"><summary>Crédits des photos</summary><ul>${l.map((x) => { const [a, lic, ref] = x.credit, web = /^https?:/.test(ref); return `<li>${esc(x.name)} : <a ${ext(web ? ref : "https://commons.wikimedia.org/wiki/" + encodeURIComponent(ref).replace(/%3A/g, ":"))}>${esc(a)}</a>, ${esc(lic)}${web ? "" : ", Wikimedia Commons"}</li>`; }).join("")}</ul></details>` : ""; };
  // « En un coup d'œil » des randos : distance, dénivelé, durée et note relevés sur la fiche (AllTrails, Wikiloc ou Visorando), champ `glance`
  const hglance = (h) => h.glance ? `<dl class="glance">${[[I.walk, "Distance", h.glance[0]], [I.up, "Dénivelé", h.glance[1]], [I.clock, "Durée", h.glance[2]], [I.star, "Note " + traceSite(h.url), h.glance[3]]].filter((r) => r[2]).map((r) => `<div><dt>${r[0]}${esc(r[1])}</dt><dd>${esc(r[2])}</dd></div>`).join("")}</dl>` : "";
  const hikeCard = (h, by) => { const d = hikeDay(h); return `<div class="card lc">
    ${cover(h)}
    <div class="head"><div><div class="eyebrow">${esc(h.day || h.zone)}</div><h4>${esc(h.name)}</h4></div><div class="score">${esc(h.note)}<small>/20</small></div></div>
    <div class="meta"><span>${esc(h.diff)}</span><span>${esc(h.prog)}</span>${h.src ? `<span>${esc(h.src)}</span>` : ""}</div><div class="see">${esc(h.see)}</div>${hglance(h)}
    ${h.warn ? `<div class="warn">⚠ ${esc(h.warn)}</div>` : ""}${fromStays(h.from, by)}
    <div class="card-actions"><a class="btn sm" ${ext(h.url)}>${I.boot}Trace ${traceSite(h.url)}</a>${d ? `<a class="btn sm" href="/jour/${d.n}">${I.route}Jour ${d.n}</a>` : ""}${canEdit() ? `<button type="button" class="btn sm" data-add="hike:${allHikes.indexOf(h)}">${I.plus}Ajouter à un jour</button>` : ""}</div></div>`; };
  // « En un coup d'œil » : affluence, baignade, clarté de l'eau et sable relevés sur Mauritius Beach Life (champ `glance`)
  const CROWD = { low: "Faible", medium: "Moyenne", high: "Forte" };
  const glance = (b) => b.glance ? `<dl class="glance">
      <div><dt>${I.people}Affluence</dt><dd>${esc(CROWD[b.glance[0]] || b.glance[0])}</dd></div>
      <div><dt>${I.wave}Baignade</dt><dd>${b.glance[1]}<small>/5</small></dd></div>
      <div><dt>${I.drop}Clarté de l'eau</dt><dd>${b.glance[2]}<small>/5</small></dd></div>
      <div><dt>${I.spark}Qualité du sable</dt><dd>${b.glance[3]}<small>/5</small></dd></div></dl>` : "";
  const beachCard = (b, by) => `<div class="card lc">
    ${cover(b)}
    <div class="head"><div><div class="eyebrow">${esc(b.zone)}</div><h4>${esc(b.name)}</h4></div><div class="score">${esc(b.note)}<small>/20</small></div></div>
    <div class="meta"><span>Google ${esc(b.g)}</span></div><div class="see">${esc(b.see)}</div>${glance(b)}
    ${b.warn ? `<div class="warn">⚠ ${esc(b.warn)}</div>` : ""}${fromStays(b.from, by)}
    <div class="card-actions cols"><a class="btn sm primary" ${ext(dirUrl(b.q))}>${I.nav}Y aller</a><a class="btn sm" ${ext(searchUrl(b.q))}>${I.map}Carte</a><a class="btn sm" ${ext("https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(b.q + " Mauritius"))}>${I.photo}Photos</a>${b.bl ? `<a class="btn sm" ${ext("https://mauritiusbeachlife.com/fr/beach/" + b.bl)}>${I.info}Fiche</a>` : ""}${canEdit() ? `<button type="button" class="btn sm" data-add="beach:${G.beaches.indexOf(b)}">${I.plus}Ajouter à un jour</button>` : ""}</div></div>`;
  function pageBeaches() {
    const by = store.get("sort:plages", "note"), list = sorted(G.beaches, by), card = (b) => beachCard(b, by);
    return `<div class="container">${pageHead("", "Les plages", `Les ${G.beaches.length} plages notées 15/20 ou plus, toutes publiques et gratuites. Note Google relevée le 28 octobre 2026 ; temps de route depuis chaque logement.`)}
      ${sortBar("plages", by)}
      ${by === "zone" ? grouped(list, card) : `<div class="grid c3">${list.map(card).join("")}</div>`}
      <div class="callout"><span class="k">Pour choisir</span><span>${esc(G.beachesNote)}</span></div>
      <div class="callout"><span class="k">Pour aller plus loin</span><span>${G.beachesLinks.map((l) => `<a class="link" ${ext(l.url)}>${esc(l.t)}</a> (${esc(l.d)})`).join(" ; ")}.</span></div>
      ${credits(G.beaches)}
    </div>`;
  }
  function pageHikes() {
    const by = store.get("sort:randos", "prog"), all = [...G.hikes, ...G.hikesMore], card = (h) => hikeCard(h, by);
    const body = by === "prog"
      ? section("programme", "", "Au programme", "Distances, dénivelés et durées du programme ; note AllTrails convertie sur 20 (note /5 × 4).", `<div class="grid c3">${G.hikes.map(card).join("")}</div>`) +
        section("autres", "", "Autres randonnées possibles", "Les sommets et sentiers notés 15/20 ou plus.", `<div class="grid c3">${G.hikesMore.map(card).join("")}</div>`)
      : `<div class="sorted">${by === "zone" ? grouped(sorted(all, by), card) : `<div class="grid c3">${sorted(all, by).map(card).join("")}</div>`}</div>`;
    return `<div class="container">${pageHead("", "Les randonnées", "Celles du programme, puis d'autres sommets et sentiers pour improviser une journée. Temps de route depuis chaque logement.")}
      ${sortBar("randos", by, { prog: "Au programme" })}
      ${body}
      <div class="callout"><span class="k">Pour choisir</span><span>${esc(G.hikesNote)}</span></div>
      ${credits(all)}
    </div>`;
  }

  /* ───────── Annexes ───────── */
  const tels = (list, sos = 0) => list.map((e, i) => `<div class="tel ${i < sos ? "sos" : ""}"><span class="t">${esc(e[0])}${e[3] ? `<small>${linkify(e[3])}</small>` : ""}</span>${isMobile(digits(e[2]))
    ? `<a class="n wa-num" ${ext(waUrl(e[2]))} aria-label="WhatsApp ${esc(e[0])}" title="WhatsApp"><i>${I.wa}</i>${esc(e[1])}</a><a class="call" href="tel:${e[2]}" aria-label="Appeler ${esc(e[0])}" title="Appeler">${I.phone}</a>`
    : `<a class="n" href="tel:${e[2]}" aria-label="Appeler ${esc(e[0])}">${I.phone}${esc(e[1])}</a>`}</div>`).join("");
  function pageAnnex() {
    const total = G.cash.reduce((a, r) => a + r[3], 0);
    return `<div class="container">${pageHead("", "Annexes", "Numéros d'urgence, lexique créole, plats à goûter et cash à prévoir.")}
      <nav class="chips"><a href="/annexes#urgences">Urgences</a><a href="/annexes#contacts">Contacts</a><a href="/annexes#lexique">Lexique</a><a href="/menu#a-gouter">Plats</a><a href="/annexes#cash">Cash</a><a href="/annexes#outils">Outils</a><a href="/plages">Plages</a><a href="/randos">Randonnées</a></nav>
      ${section("urgences", "Annexes", "Urgences", "", `<div class="tels">${tels(G.emergency, 3)}</div><div class="callout warn"><span class="k">À recontrôler</span><span>${esc(G.emergencyNote)}</span></div>`)}
      ${section("contacts", "Annexes", "Numéros des activités", "Les prestataires réservés : un appel ou un WhatsApp le matin même si besoin.", `<div class="tels">${tels(G.contacts)}</div>`)}
      ${section("lexique", "Annexes", "Mini-lexique créole", esc(G.lexiconNote), `<div class="lex">${G.lexicon.map(([fr, kr]) => `<div><small>${esc(fr)}</small><b>${esc(kr)}</b></div>`).join("")}</div>`)}
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
          <div class="menu-group"><span class="eyebrow">Cartes</span><div class="menu-list">
            ${G.trip.maps.map((m) => item(m.url, "map", m.title, m.sub)).join("")}
          </div></div>
          <div class="menu-group"><span class="eyebrow">Outils</span><div class="menu-list">
            ${item("/convertisseur", "conv", "Convertisseur", "Roupies ⇄ euros, sans réseau")}
            ${item("/installer", "install", "Installer", "Sur l'écran d'accueil, et hors ligne")}
            ${item("/edition", "pen", "Édition partagée", "Changer l'ordre des étapes, publier pour le groupe")}
            ${item("/annexes#urgences", "sos", "Urgences", "Police 999, SAMU 114, pompiers 115", "sos")}
          </div></div>
          <div class="menu-group"><span class="eyebrow">Le guide</span><div class="menu-list">
            ${item("/bienvenue", "sun", "Bienvenue", "La couverture du carnet")}
            ${item("/infos", "info", "Infos pratiques", "Monnaie, météo, conduite, santé")}
            ${item("/bons-plans", "star", "Bons plans", "Street food, marchés, snorkeling")}
            ${item("/annexes", "book", "Annexes", "Urgences, lexique, plats, cash")}
            ${item("/notes", "pen", "Notes", "Ton carnet de route")}
          </div></div>
        </div>
        <div class="menu-group"><span class="eyebrow">Accès rapide</span><div class="menu-list">
          ${item("/plages", "beach", "Les plages", `${G.beaches.length} plages notées, avec « Y aller »`)}
          ${item("/randos", "boot", "Les randonnées", "Fiches, traces et temps de route")}
          ${item("/annexes#cash", "cash", "Cash à prévoir", G.cashTotals.group + " pour le groupe")}
          ${item("/annexes#lexique", "lex", "Lexique créole", "Bonzour, mersi boukou…")}
          ${item("/menu#a-gouter", "food", "Plats à goûter", "Dholl puri, alouda, rougaille…")}
          ${item("/menu", "food", "Menu Morisyen", "La carte de Sheila, commande sur WhatsApp")}
        </div></div>
      </div></div>`;
  }

  /* ───────── Menu Morisyen (Catering Sheila) ───────── */
  // Plats à goûter sur place : une carte par catégorie, cases enregistrées sous les clés food:g:i
  const foodCards = () => `<div class="grid c2">${G.food.map(([t, rows], g) => {
    const keys = rows.map((_, i) => `food:${g}:${i}`), done = keys.filter((k) => store.get(k, false)).length;
    // Ligne = [nom, description, photo (img/plats), crédit] ; la cellule photo précède le libellé pour que le
    // basculement « goûté » (frère précédent de la case) continue de viser le libellé
    return `<div class="card food" data-food="${g}"><div class="eyebrow">${esc(t)}<span class="cnt" data-food-count>${done} / ${rows.length}</span></div><div class="cl single pics">${rows.map(([n, d, pic, credit], i) => { const c = store.get(keys[i], false); return `<div class="ph">${pic ? plate(pic, n, credit) : ""}</div><div class="lbl ${c ? "checked" : ""}"><b>${esc(n)}</b><div class="muted">${esc(d)}</div></div><div class="bx"><input class="chk" type="checkbox" data-store-check="${keys[i]}" ${c ? "checked" : ""} aria-label="${esc(n)} goûté"></div>`; }).join("")}</div></div>`; }).join("")}</div><div class="callout"><span class="k">Où</span><span>${esc(G.foodNote)}</span></div>`;
  // Photo d'un plat (Wikimedia Commons dans img/plats, crédits en bas de la page Menu) ; un toucher l'ouvre en grand
  const plate = (pic, name, credit) => `<img class="ph" src="/img/plats/${pic}.webp" alt="" loading="lazy" decoding="async" data-name="${esc(name || "")}" data-credit="${credit ? esc(`${credit[0]}, ${credit[1]} · Wikimedia Commons`) : ""}">`;
  const lightbox = (el) => {
    const box = document.createElement("div"); box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", el.dataset.name || "Photo");
    box.innerHTML = `<figure><img src="${el.src}" alt=""><figcaption><b>${esc(el.dataset.name || "")}</b>${el.dataset.credit ? `<small>${esc(el.dataset.credit)}</small>` : ""}</figcaption></figure><button class="x" type="button" aria-label="Fermer">${I.x}</button>`;
    const onKey = (e) => { if (e.key === "Escape") close(); }, close = () => { box.remove(); document.removeEventListener("keydown", onKey); };
    box.addEventListener("click", close); document.addEventListener("keydown", onKey);
    document.body.appendChild(box); box.querySelector(".x").focus();
  };

  // Récapitulatif des choix (message pour le groupe WhatsApp) : pour chaque jour où quelqu'un a choisi, « commande
  // pour x personnes », le total par plat et par accompagnement, puis la ligne de chacun ; ceux qui ne prennent rien
  // n'apparaissent pas. Chaîne vide si personne n'a rien choisi
  const choicesText = () => {
    const t0 = nowMs(), dayLabel = (n) => new Date(t0 + n * 864e5).toLocaleDateString("fr-FR", { timeZone: "Indian/Mauritius", weekday: "long", day: "numeric", month: "long" });
    const cast = [...G.cast].sort((a, b) => a[1].localeCompare(b[1], "fr"));
    const blocks = [["Demain", 1], ["Après-demain", 2]].map(([label, col]) => {
      const rows = cast.map(([f, name]) => [name, store.get(`choix:${f}:${col}`, {})]).filter(([, c]) => c.d);
      if (!rows.length) return "";
      const count = (key, lower) => { const m = new Map(); rows.forEach(([, c]) => { if (c[key]) { const k = lower ? c[key].toLowerCase() : c[key]; m.set(k, (m.get(k) || 0) + 1); } }); return [...m].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} × ${k}`).join(", "); };
      const sides = count("s", true);
      return [`*${label}, ${dayLabel(col)} — commande pour ${rows.length} personne${rows.length > 1 ? "s" : ""}*`, `Total : ${count("d")}`, sides ? `Accompagnements : ${sides}` : "",
        ...rows.map(([name, c]) => `– ${name} : ${c.d}${c.s ? ", " + c.s.toLowerCase() : ""}, ${+c.p ? `piment ${+c.p}/5` : "sans piment"}`)].filter(Boolean).join("\n");
    }).filter(Boolean);
    return blocks.length ? `Bonjour, voici notre commande pour les prochains dîners.\n\n${blocks.join("\n\n")}\n\nMerci !` : "";
  };

  function pageMenu() {
    const m = G.menu, eur = (rs) => (rs / G.rate).toLocaleString("fr-FR", { maximumFractionDigits: 1 });
    // Chaque section garde la couleur et le picto de la carte imprimée (astérisque bleu, hibiscus rouge, feuille verte)
    const dish = (it, ic) => `<div class="dish"><i class="pic">${ic}</i><div class="dish-top"><div><h4>${esc(it.name)}</h4>${it.opt ? `<div class="opt">${esc(it.opt)}</div>` : ""}</div>
      <div class="price"><b>${it.rs.toLocaleString("fr-FR")} Rs</b><small>≈ ${eur(it.rs)} €${it.per ? " · par pers." : ""}</small></div></div><p>${esc(it.text)}</p>${it.pic ? plate(it.pic, it.name, it.credit) : ""}</div>`;
    // Choix des deux prochains dîners : une ligne par personnage (ordre alphabétique), colonnes Demain / Après-demain,
    // chacune avec un plat de la carte (une entrée par variante : « Porc ou poulet » en fait deux), l'accompagnement et
    // le piment de 0 à 5. Enregistré sur l'appareil (clé choix:<personnage>:<colonne>)
    const dishOptions = m.sections.map((sec) => [sec.title, sec.items.flatMap((it) => {
      const o = it.opt || "";
      if (/sur demande/.test(o)) return [it.name, `${it.name} · végétarienne`];
      const v = / ou /.test(o) ? o.split(/,\s*| ou /).map((x) => x.trim().toLowerCase()) : [];
      return v.length ? v.map((x) => `${it.name} · ${x}`) : [it.name];
    })]);
    const sel = (cls, cur, label, groups) => `<select class="${cls} ${cur ? "" : "empty"}" aria-label="${label}"><option value="">${label}…</option>${groups.map(([g, opts]) => `<optgroup label="${esc(g)}">${opts.map((o) => `<option value="${esc(o)}" ${o === cur ? "selected" : ""}>${esc(o)}</option>`).join("")}</optgroup>`).join("")}</select>`;
    const pick = (file, col) => { const c = store.get(`choix:${file}:${col}`, {}), p = +c.p || 0; return `<div class="pick" data-key="${file}:${col}">
      ${sel("dish-sel", c.d || "", "Plat", dishOptions)}
      ${sel("side-sel", c.s || "", "Accompagnement", [["Avec", ["Riz blanc", "Pain", "Riz blanc et pain"]]])}
      <div class="chili" role="group" aria-label="Piment de 0 à 5"><span>Piment <b>${p}</b>/5</span><div class="dots">${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="dot ${n <= p ? "on" : ""}" data-p="${n}" aria-label="Piment ${n} sur 5" aria-pressed="${n <= p}">${I.chili}</button>`).join("")}</div></div></div>`; };
    const choices = `<div class="choices">
      <div class="choice-head"><span></span><span>Demain</span><span>Après-demain</span></div>
      <div class="choice-rows">${[...G.cast].sort((a, b) => a[1].localeCompare(b[1], "fr")).map(([file, name]) => `<div class="choice-row"><div class="who"><img src="/img/p/${file}.png" alt="" loading="lazy" decoding="async"><b>${esc(name)}</b></div>${pick(file, 1)}${pick(file, 2)}</div>`).join("")}</div>
      <div class="card-actions"><button class="btn wa" type="button" id="sendChoices">${I.wa}Envoyer la commande au groupe</button></div>
      <p class="hint">Le message est copié, puis le groupe WhatsApp s'ouvre : il reste à le coller. <a href="#" id="showChoices">Voir le message</a></p><pre class="recap" id="choicesRecap" hidden></pre></div>`;
    // Crédits des photos : plats de Sheila (champ credit) et lignes « À goûter » ([nom, desc, photo, crédit])
    const photoCredits = credits([...m.sections.flatMap((s) => s.items), ...G.food.flatMap(([, rows]) => rows.filter((r) => r[3]).map(([name, , , credit]) => ({ name, credit })))]);
    return `<div class="container">${pageHead("", esc(m.title), `${esc(m.by)}. ${esc(m.intro)}`)}
      <div class="menu-page">
        <div class="strokes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="card order"><div><h3>Commander</h3><p class="text">${linkify(m.order)}</p></div>
          <div class="card-actions"><a class="btn wa" ${ext(waUrl(m.wa))}>${I.wa}Commander sur WhatsApp</a><a class="btn" href="tel:${m.tel}">${I.phone}Appeler Sheila</a></div></div>
        ${m.sections.map((sec, k) => `<section class="section menu-sec ${sec.tone}" id="menu-${k + 1}"><h2><i>${I[sec.icon]}</i>${esc(sec.title)}</h2>${sec.note ? `<p class="lede">${esc(sec.note)}</p>` : ""}<div class="dishes">${sec.items.map((it) => dish(it, I[sec.icon])).join("")}</div></section>`).join("")}
        <p class="hint">Carte de novembre 2026 ; conversion au taux du carnet, 1 € ≈ ${String(G.rate).replace(".", ",")} Rs.</p>
        <hr class="rule">
        ${section("a-gouter", "", "À goûter à Maurice", esc(G.foodIntro), foodCards())}
        <hr class="rule">
        ${section("choix", "", "Choix", "Ce que chacun commande à Sheila pour les deux prochains dîners : le plat, l'accompagnement et la force du piment. Enregistré sur ce téléphone ; le bouton du bas prépare la commande pour le groupe WhatsApp, le total puis le détail par personne.", choices)}
        ${photoCredits}
      </div></div>`;
  }

  /* ───────── Édition partagée : prénom, jeton GitHub, jours modifiés ───────── */
  function pageEdit() {
    const name = store.get("edit:name", ""), tok = store.get("gh:token", ""), dirty = store.get("plan:dirty", false);
    const days = Object.entries(plan.days).filter(([, p]) => p && (p.order || (p.removed && p.removed.length))).sort((a, b) => a[0] - b[0]).map(([k, p]) => { const d = G.days[k - 1]; return d
      ? `<a class="dl" href="/jour/${d.n}"><span class="n">${dow(d)}<b>${+d.date.slice(8)}</b></span><span class="t">${esc(d.title)}<small>${[p.by ? esc(p.by) : "", fmtAt(p.at)].filter(Boolean).join(", ")}</small></span><span class="out">${I.chev}</span></a>` : ""; }).join("");
    return `<div class="container">${pageHead("", "Édition partagée", "Avec un jeton GitHub, on peut changer le programme depuis son téléphone : ordre, heures, jours, plages et randos ajoutées. Les changements sont publiés pour tout le groupe ; sans jeton, on les voit sans rien configurer.", ["/plus", "Plus"])}
      <div class="grid c2 top-align">
        <div>
          <div class="card">
            <h3>Comment ça marche</h3>
            <ol class="steps-ol">
              <li>Avec un jeton enregistré ci-contre, un crayon apparaît sur chaque journée, à côté du programme. Touche-le : chaque étape reçoit des flèches pour l'ordre, une heure, un jour et une croix pour la retirer. Depuis <b>Plages</b> et <b>Randos</b>, « Ajouter à un jour » place une activité dans le programme, à l'heure voulue. Les étapes réservées ne bougent pas.</li>
              <li>Les trajets sont recalculés (durée estimée quand la liaison n'est pas dans le guide), la carte relie les lieux dans le nouvel ordre. Les horaires affichés restent ceux du guide.</li>
              <li>Avec un jeton ci-contre, chaque changement est enregistré dans le dépôt du carnet (fichier <b>site/plan.json</b>) et apparaît chez tout le monde à l'ouverture suivante, une minute plus tard environ.</li>
            </ol>
          </div>
          <div class="card" style="margin-top:12px">
            <div class="top"><h3>Jours modifiés</h3>${days && tok ? `<button class="btn sm" id="resetAll" type="button">${I.undo}Tout rétablir</button>` : ""}</div>
            ${days ? `<div class="dlist">${days}</div>` : `<p class="text">Aucun : le programme est celui du guide.</p>`}
          </div>
        </div>
        <div>
          <div class="card">
            <h3>Publier pour le groupe</h3>
            <p class="text">Le prénom signe les changements. Le jeton ne quitte pas ce téléphone : il sert seulement à écrire <b>site/plan.json</b> dans le dépôt GitHub.</p>
            <div class="fields one">
              <div class="field"><label for="edName">Prénom</label><input id="edName" value="${esc(name)}" autocomplete="given-name" placeholder="Qui modifie"></div>
              <div class="field"><label for="edTok">Jeton GitHub</label><input id="edTok" type="password" value="${esc(tok)}" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></div>
            </div>
            <p class="status" data-share-state="long">${shareState(true)}</p>
            <div class="card-actions"><button class="btn sm" id="testTok" type="button">${I.key}Tester le jeton</button><button class="btn sm primary" id="syncNow" type="button" ${dirty && tok ? "" : "disabled"}>${I.cloud}Publier maintenant</button></div>
          </div>
          <div class="card" style="margin-top:12px">
            <h3>Créer le jeton</h3>
            <ol class="steps-ol">
              <li>Sur github.com, avec le compte propriétaire du dépôt : <b>Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token</b>.</li>
              <li><b>Repository access</b> : Only select repositories → <b>travelcompanion</b>.</li>
              <li><b>Permissions → Repository permissions → Contents : Read and write</b>. Rien d'autre.</li>
              <li>Expiration : la fin du voyage suffit. Copie le jeton (il ne sera plus affiché) et colle-le ci-dessus.</li>
            </ol>
            <div class="callout warn"><span class="k">Prudence</span><span>Ce jeton permet d'écrire dans le dépôt : ne l'envoie pas par message. Pour qu'un autre téléphone publie aussi, saisis-le directement dessus. Sans jeton, on voit les changements des autres sans rien configurer.</span></div>
          </div>
        </div>
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
    // Choix des dîners (page menu) : chaque changement est enregistré aussitôt, le chiffre du piment suit le curseur
    $$(".choices .pick", main).forEach((p) => {
      const save = (fn) => { const v = store.get("choix:" + p.dataset.key, {}); fn(v); store.set("choix:" + p.dataset.key, v); };
      p.addEventListener("input", (e) => { const t = e.target; if (t.tagName !== "SELECT") return; t.classList.toggle("empty", !t.value); save((v) => { v[t.matches(".dish-sel") ? "d" : "s"] = t.value; }); });
      // Piments : toucher le n-ième met le niveau à n ; toucher à nouveau le dernier allumé remet à zéro
      p.addEventListener("click", (e) => {
        const b = e.target.closest(".dot"); if (!b) return;
        const cur = $$(".dot.on", p).length, n = +b.dataset.p === cur ? 0 : +b.dataset.p;
        $$(".dot", p).forEach((d) => { const on = +d.dataset.p <= n; d.classList.toggle("on", on); d.setAttribute("aria-pressed", on); });
        $(".chili b", p).textContent = n; save((v) => { v.p = n; });
      });
    });
    // Commande pour le groupe WhatsApp : un lien de groupe n'accepte pas de texte prérempli, on copie le message et on
    // ouvre le groupe (les deux dans le geste du toucher) ; le message reste visible sous le bouton
    const sc = $("#sendChoices", main); if (sc) sc.addEventListener("click", () => {
      const text = choicesText(); if (!text) { toast("Aucun plat choisi pour l'instant"); return; }
      const pre = $("#choicesRecap", main); pre.textContent = text; pre.hidden = false;
      const copy = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : Promise.reject();
      window.open(G.menu.group, "_blank", "noopener");
      copy.then(() => toast("Message copié : colle-le dans le groupe"), () => toast("Copie impossible ici : sélectionne le message ci-dessous"));
    });
    const sh = $("#showChoices", main); if (sh) sh.addEventListener("click", (e) => { e.preventDefault(); const pre = $("#choicesRecap", main); pre.textContent = choicesText() || "Aucun plat choisi pour l'instant."; pre.hidden = !pre.hidden; });
    $$("img.ph", main).forEach((el) => el.addEventListener("click", () => lightbox(el))); // photos des plats en grand
    $$("[data-store-check]", main).forEach((el) => el.addEventListener("change", () => {
      store.set(el.dataset.storeCheck, el.checked); el.parentElement.previousElementSibling.classList.toggle("checked", el.checked);
      const card = el.closest(".card.food"); // compteur « goûtés » de la catégorie
      if (card) { const cs = $$("[data-store-check]", card); $("[data-food-count]", card).textContent = `${cs.filter((c) => c.checked).length} / ${cs.length}`; }
    }));
    $$("[data-tobook]", main).forEach((el) => el.addEventListener("change", () => { store.set(toBookKey(G.toBook[+el.dataset.tobook]), el.checked); render(); }));
    const all = $("#allDays"); if (all) all.onclick = () => openDaysSheet(+main.dataset.day);
    $$("[data-sort]", main).forEach((b) => (b.onclick = () => { const [k, v] = b.dataset.sort.split(":"); store.set("sort:" + k, v); render(); }));

    // Mode édition du programme
    const confirmBtn = (el, label, fn) => () => { if (!el.dataset.armed) { el.dataset.armed = "1"; el.textContent = "Confirmer ?"; setTimeout(() => { delete el.dataset.armed; el.innerHTML = label; }, 3000); return; } delete el.dataset.armed; fn(); };
    const ep = $("#editPlan"); if (ep) ep.onclick = () => { editing = !editing; render(); };
    const curDay = () => G.days[+main.dataset.day - 1];
    $$("[data-mv]", main).forEach((b) => (b.onclick = () => { const d = curDay(); if (b.dataset.mv === "remove") removeStep(d, b.dataset.ref); else moveStep(d, b.dataset.ref, b.dataset.mv); render(); }));
    $$("[data-to-day]", main).forEach((s) => (s.onchange = () => { moveToDay(curDay(), s.dataset.toDay, +s.value); render(); }));
    $$("[data-time]", main).forEach((t) => (t.onchange = () => { setTime(curDay(), t.dataset.time, t.value ? t.value.replace(":", "h") : ""); render(); }));
    $$("[data-restore]", main).forEach((b) => (b.onclick = () => { restoreStep(curDay().n, b.dataset.restore); render(); }));
    $$("[data-add]", main).forEach((b) => (b.onclick = () => openAddSheet(b.dataset.add)));
    const rd = $("#resetDay"); if (rd) rd.onclick = () => { resetDay(+main.dataset.day); render(); };
    const ra = $("#resetAll"); if (ra) ra.onclick = confirmBtn(ra, `${I.undo}Tout rétablir`, () => { Object.entries(plan.days).filter(([, p]) => p && p.order).forEach(([k]) => resetDay(+k)); render(); });
    const en = $("#edName"); if (en) en.addEventListener("input", () => store.set("edit:name", en.value.trim()));
    const et = $("#edTok"); if (et) et.addEventListener("input", () => { store.set("gh:token", et.value.trim()); refreshShare(); if (et.value.trim()) scheduleSync(); });
    const tt = $("#testTok"); if (tt) tt.onclick = testToken;
    const sn = $("#syncNow"); if (sn) sn.onclick = () => syncPlan();

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
      const fromRs = () => { cv.rs = num(rs.value); eur.value = fmt(cv.rs / G.rate, 2); };
      const fromEur = () => { cv.rs = num(eur.value) * G.rate; rs.value = fmt(cv.rs, 0); };
      rs.addEventListener("input", fromRs);
      eur.addEventListener("input", fromEur);
      // Toucher une case la vide pour saisir ; si on repart sans rien taper, l'ancien montant revient
      [rs, eur].forEach((el) => {
        el.addEventListener("focus", () => { el.dataset.prev = el.value; el.value = ""; });
        el.addEventListener("blur", () => { if (el.value.trim() === "") { el.value = el.dataset.prev || "0"; (el === rs ? fromRs : fromEur)(); } });
      });
      $$("[data-rs]", main).forEach((b) => (b.onclick = () => { rs.value = b.dataset.rs; fromRs(); }));
      $$("[data-eur]", main).forEach((b) => (b.onclick = () => { eur.value = b.dataset.eur; fromEur(); }));
      $("#cvSwap").onclick = () => { cv.eur = !cv.eur; store.set("conv:eur", cv.eur); render(); };
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
    "/plages": [pageBeaches, "Plages"], "/randos": [pageHikes, "Randonnées"],
    "/annexes": [pageAnnex, "Annexes"], "/notes": [pageNotes, "Notes"], "/bienvenue": [pageWelcome, "Bienvenue"],
    "/installer": [pageInstall, "Installer"], "/plus": [pagePlus, "Plus"],
    "/menu": [pageMenu, "Menu Morisyen"], "/edition": [pageEdit, "Édition partagée"]
  };
  const ALIAS = { "/checklist": "/todo/checklist", "/aujourdhui": "/", "/itineraire": "/", "/plage": "/plages", "/rando": "/randos", "/randonnees": "/randos" };
  // Anciens liens vers les sections d'annexes devenues des pages
  const MOVED = { "/annexes#randos": "/randos", "/annexes#autres-randos": "/randos#autres", "/annexes#plages": "/plages" };
  let lastPath = null;
  function render(restoreY) {
    if (typeof restoreY !== "number") restoreY = undefined;
    let path = location.pathname.replace(/\/+$/, "") || "/";
    if (ALIAS[path]) { path = ALIAS[path]; history.replaceState(null, "", path + location.hash); }
    if (MOVED[path + location.hash]) { const to = MOVED[path + location.hash]; history.replaceState(null, "", to); path = to.split("#")[0]; }
    let html, title, day = "";
    const m = /^\/jour\/(\d+)$/.exec(path);
    if (m && G.days.some((d) => d.n === +m[1])) { day = +m[1]; html = pageDay(day, false); title = `Jour ${day} · ${G.days[day - 1].title}`; }
    else if (PAGES[path]) { html = PAGES[path][0](); title = PAGES[path][1]; }
    else { path = "/"; day = defaultDay().n; html = pageDay(day, true); title = "Voyage"; if (location.pathname !== "/") history.replaceState(null, "", "/"); }
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

  // Clin d'œil : trois touchers rapides n'importe où font surgir un personnage du groupe, avec une animation au hasard
  // 15 animations pour un personnage seul, la 16e rassemble tout le groupe
  const CAMEO_ANIMS = 16, GROUP = 15; let taps = [], lastCast = -1, lastAnim = -1;
  const pick = (n, last) => { let i; do { i = Math.floor(Math.random() * n); } while (n > 1 && i === last); return i; };
  const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  function cameo() {
    if ($(".cameo")) return;
    const a = pick(CAMEO_ANIMS, lastAnim); lastAnim = a;
    const el = document.createElement("div"); el.setAttribute("role", "img");
    if (a === GROUP) {
      // Photo de groupe : cinq derrière (un peu plus petits, surélevés), quatre devant en quinconce, les têtes ne se
      // recouvrent jamais ; chacun arrive d'un bord ou d'un coin différent, à quelques dixièmes de seconde d'écart
      const s = Math.min(120, Math.max(58, innerWidth * 0.17)), H = Math.min(330, Math.max(180, innerHeight * 0.34));
      const slots = [[-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [-1.5, 0], [-0.5, 0], [0.5, 0], [1.5, 0]]; // [colonne, rangée]
      const from = shuffle([["-120vw", "0px"], ["120vw", "0px"], ["0px", "-120vh"], ["0px", "120vh"], ["-90vw", "-90vh"], ["90vw", "-90vh"], ["-90vw", "90vh"], ["90vw", "90vh"], ["0px", "-120vh"]]);
      const who = shuffle(G.cast.map((_, i) => i)), delays = shuffle(slots.map((_, i) => i));
      el.className = "cameo group"; el.setAttribute("aria-label", "Tout le groupe");
      el.innerHTML = `<div class="stage" style="--gh:${H}px">${slots.map(([c, r], i) => { const [file, name] = G.cast[who[i]];
        return `<div class="fig" style="--x:${Math.round(c * s)}px;--y:${r ? Math.round(-0.3 * H) : 0}px;--fx:${from[i][0]};--fy:${from[i][1]};--d:${(delays[i] * 0.09).toFixed(2)}s;--k:${r ? 0.94 : 1};z-index:${r ? 10 - Math.abs(c) : 20 - Math.abs(c) * 2}"><img src="/img/p/${file}.png" alt="${esc(name)}"></div>`; }).join("")}</div>`;
    } else {
      const c = pick(G.cast.length, lastCast); lastCast = c;
      const [file, name] = G.cast[c];
      el.className = `cameo a${a + 1}`; el.setAttribute("aria-label", name);
      el.innerHTML = `<div class="fig"><img src="/img/p/${file}.png" alt=""><span class="who">${esc(name)}</span></div>`;
    }
    const bye = () => { if (!el.isConnected) return; el.classList.add("out"); setTimeout(() => el.remove(), 260); };
    const figs = $$(".fig", el); let left = figs.length;
    el.addEventListener("animationend", (e) => { if (e.target.classList.contains("fig") && --left <= 0) bye(); }); // pas celle du prénom, qui remonte aussi
    // L'animation ne démarre qu'une fois les images décodées (au plus 1,5 s d'attente), sinon le personnage arrive en cours de route
    figs.forEach((f) => { f.style.animationPlayState = "paused"; });
    Promise.race([Promise.all($$("img", el).map((img) => img.decode().catch(() => {}))), new Promise((r) => setTimeout(r, 1500))]).then(() => { figs.forEach((f) => { f.style.animationPlayState = "running"; }); });
    document.body.appendChild(el); // le calque ne capte rien : on peut continuer à toucher, l'animation va jusqu'au bout
    setTimeout(bye, a === GROUP ? 9500 : 7000); // au cas où l'animation ne se termine pas (image absente, onglet en arrière-plan)
  }
  // Un toucher = appui bref sans glisser (un défilement au doigt ne compte pas) ; trois en moins d'une seconde
  let tapStart = null;
  document.addEventListener("pointerdown", (e) => { tapStart = e.target.closest("input, textarea, select") ? null : { x: e.clientX, y: e.clientY, t: Date.now() }; });
  document.addEventListener("pointerup", (e) => {
    if (!tapStart) return;
    const now = Date.now(), moved = Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > 12 || now - tapStart.t > 350; tapStart = null;
    if (moved) { taps = []; return; }
    taps = taps.filter((t) => now - t < 1000); taps.push(now);
    if (taps.length >= 3) { taps = []; cameo(); }
  });
  // Les images des personnages ne sont pas dans le cache initial : on les demande une fois le carnet prêt, à un moment calme
  const prefetchCast = () => G.cast.forEach(([f]) => fetch(`/img/p/${f}.png`, { priority: "low" }).catch(() => {}));
  if ("serviceWorker" in navigator && !devHost) navigator.serviceWorker.ready.then(() => (window.requestIdleCallback || ((fn) => setTimeout(fn, 4000)))(prefetchCast, { timeout: 15000 }));

  render();
  netState();
  // Programme partagé : on le lit au démarrage, au retour au premier plan et au retour du réseau ; on publie ce qui attend
  loadSharedPlan();
  if (store.get("plan:dirty", false)) scheduleSync();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { loadSharedPlan(); syncPlan(); } });
  window.addEventListener("online", () => { loadSharedPlan(); syncPlan(); });
  setInterval(() => { if (todayDay() && main.dataset.day && !document.activeElement.matches("input, textarea")) render(); }, 5 * 60 * 1000);
})();
