# Maurice — carnet de voyage (6-21 novembre 2026)

Version web du guide `tmp/guide_maurice.pdf`, pour mobile et desktop, installable sur l'écran d'accueil et utilisable **hors ligne** (PWA).

## Structure

```
site/                 ← le site statique (c'est ce dossier qui est déployé)
  index.html          ← coquille de l'application
  css/style.css       ← identité du guide (crème, marine, lagon ; Allura, Lora, Inter)
  js/data.js          ← tout le contenu du guide (jours, logements, résas, infos, annexes)
  js/geo.js           ← contour de l'île, coordonnées des lieux et tracés routiers (généré, ne pas éditer)
  js/app.js           ← rendu, routeur, liens Google Maps, carte du jour, to-do, notes, installation
  sw.js               ← service worker (généré, ne pas éditer)
  manifest.webmanifest, robots.txt, img/, fonts/, icons/
scripts/
  serve.py            ← serveur local avec les URL propres
  build_sw.py         ← régénère site/sw.js
  build_geo.mjs       ← régénère site/js/geo.js (Nominatim + OSRM, réponses gardées dans geo-cache.json)
  sw.template.js
vercel.json           ← Vercel sert site/ tel quel (aucun build) et renvoie index.html pour toutes les pages
```

HTML, CSS et JavaScript natifs : pas de framework, pas de dépendance, pas de build.

## Les pages (une URL par page, partageable)

| URL | Contenu |
| --- | --- |
| `/` | Itinéraire, ouvert sur le jour en cours (J1 avant le voyage, J16 après) |
| `/jour/3` | Un jour : photo, programme horaire, lieux avec « Y aller », carte du parcours, notes du jour |
| `/reservations` | Activités déjà réservées, contacts, points de rendez-vous |
| `/logements` | Les deux adresses ; codes, téléphone et wifi à noter sur place |
| `/todo`, `/todo/checklist`, `/todo/voiture`, `/todo/a-reserver`, `/todo/a-verifier` | Tout ce qui se coche |
| `/plages` | Les 17 plages notées, triables par note, par temps de route depuis chaque logement ou par zone |
| `/randos` | Les randonnées du programme (lien vers le jour) et d'autres idées, mêmes tris |
| `/infos`, `/convertisseur`, `/bons-plans`, `/annexes`, `/notes`, `/bienvenue`, `/installer`, `/plus` | Le reste du guide |

Sur mobile : glisser à gauche ou à droite pour changer de jour. Sur clavier : flèches ← →.

Le menu (barre du haut sur ordinateur, barre du bas sur mobile) change à l'atterrissage : avant, la To-do est en
4e position ; une fois sur place, elle passe en dernier.

Sur chaque jour, les étapes réservées (bateaux, plongée, pêche, hélico, Vanill'Art) portent le badge
« Réservé · horaire fixe » et sont rappelées en tête de page : elles ne se déplacent pas dans le planning.
Après une randonnée, le programme repasse par le logement pour la douche quand c'est à côté (Piton, Le Morne,
Pieter Both) ; quand la rando et la suite de la journée sont loin du logement (Gris-Gris, 7 cascades) ou qu'il n'y a
plus de logement (Ferney, jour du départ), on enchaîne sans revenir. Le bouton « Itinéraire du jour dans Maps » enchaîne tous les lieux du jour, retour au
logement compris, et la carte « Le parcours du jour » (SVG hors ligne) reprend le même parcours.

## Modifier le contenu

1. Éditer `site/js/data.js` (ou tout autre fichier de `site/`).
2. Si des lieux d'une journée ont changé (`places`, `sea`) : `node scripts/build_geo.mjs` régénère `site/js/geo.js`
   (coordonnées via Nominatim, tracés via OSRM ; réseau nécessaire, ~1 s par lieu nouveau). Un lieu introuvable
   s'ajoute à la main dans `FIX`, en haut du script.
3. **Toujours relancer** `python3 scripts/build_sw.py` avant de déployer : cela met à jour la liste des fichiers
   mis en cache et la version, pour que les téléphones récupèrent la nouvelle version (un message
   « Nouvelle version, toucher pour recharger » apparaît alors dans l'application).

## Tester en local

```
python3 scripts/serve.py          # http://localhost:8765
```

- Simuler une date et une heure (heure de Maurice) : `http://localhost:8765/?now=2026-11-08T13:00`.
  L'étape « En ce moment » est surlignée ; le réglage reste actif dans l'onglet et l'horloge simulée continue
  d'avancer (pratique pour voir le compte à rebours avant l'atterrissage : `?now=2026-11-06T06:34`).
  `?now=` (vide) revient à l'heure réelle.
- En local, le service worker n'est pas enregistré (pour ne pas masquer les modifications).
  Pour le tester : `http://localhost:8765/?sw`.

## Hors ligne et installation

À la première ouverture avec réseau, tout le site est mis en cache (environ 5 Mo). Ensuite, il s'ouvre et
fonctionne sans connexion, y compris les URL profondes comme `/jour/3`.

- iPhone : Safari → Partager → « Sur l'écran d'accueil ».
- Android : Chrome → menu ⋮ → « Installer l'application » (ou le bouton de la page `/installer`).

Les notes, les coches et les codes des logements sont enregistrés sur l'appareil (`localStorage`, préfixe `mu26:`).

Les liens « Y aller » ouvrent Google Maps : ils ont besoin de réseau, sauf si la carte de Maurice a été
téléchargée hors ligne dans l'app Google Maps avant de partir.

## Déployer sur Vercel

Importer le dépôt tel quel : `vercel.json` indique que le dossier `site/` est servi sans build.
Le site contient des données personnelles (noms, téléphones, lien Tricount) : il est en `noindex`, et il est
conseillé d'activer la protection par mot de passe du projet dans Vercel (Settings → Deployment Protection).
