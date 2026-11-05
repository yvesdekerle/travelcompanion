# Maurice — carnet de voyage (6-21 novembre 2026)

Version web du guide `tmp/guide_maurice.pdf`, pour mobile et desktop, installable sur l'écran d'accueil et utilisable **hors ligne** (PWA).

## Structure

```
site/                 ← le site statique (c'est ce dossier qui est déployé)
  index.html          ← coquille de l'application
  css/style.css       ← identité du guide (crème, marine, lagon ; Allura, Lora, Inter)
  js/data.js          ← tout le contenu du guide (jours, logements, résas, infos, annexes)
  js/geo.js           ← contour de l'île, coordonnées des lieux et tracés routiers (généré, ne pas éditer)
  js/app.js           ← rendu, routeur, liens Google Maps, carte du jour, to-do, notes, installation, édition partagée
  plan.json           ← ordre des étapes modifié par le groupe (écrit par l'application via l'API GitHub, voir plus bas)
  sw.js               ← service worker (généré, ne pas éditer)
  manifest.webmanifest, robots.txt, img/, fonts/, icons/
scripts/
  serve.py            ← serveur local avec les URL propres
  build_sw.py         ← régénère site/sw.js
  build_geo.mjs       ← régénère site/js/geo.js (Nominatim + OSRM, réponses gardées dans geo-cache.json)
  cutout_cast.py      ← détoure et réduit les dessins des personnages (tmp/personnage_v2 → site/img/p ; un PNG déjà transparent est seulement recadré et réduit)
  sw.template.js
vercel.json           ← Vercel sert site/ tel quel (aucun build) et renvoie index.html pour toutes les pages
```

HTML, CSS et JavaScript natifs : pas de framework, pas de dépendance, pas de build.

## Les pages (une URL par page, partageable)

| URL | Contenu |
| --- | --- |
| `/` | Voyage (l'itinéraire), ouvert sur le jour en cours (J1 avant le voyage, J16 après) |
| `/jour/3` | Un jour : photo, programme horaire, lieux avec « Y aller », carte du parcours, notes du jour |
| `/reservations` | Activités déjà réservées, contacts, points de rendez-vous |
| `/logements` | Les deux adresses ; codes, téléphone et wifi à noter sur place |
| `/todo`, `/todo/checklist`, `/todo/voiture`, `/todo/a-reserver`, `/todo/a-verifier` | Tout ce qui se coche |
| `/plages` | Les 17 plages notées, chacune avec sa photo et son « coup d'œil » (affluence, baignade, clarté de l'eau, sable), triables par note, par temps de route depuis chaque logement ou par zone ; lien vers la fiche Mauritius Beach Life |
| `/randos` | Les randonnées du programme (lien vers le jour) et d'autres idées, avec photo et « coup d'œil » (distance, dénivelé, durée, note de la fiche AllTrails, Wikiloc ou Visorando), mêmes tris |
| `/menu` | Le Menu Morisyen de Catering Sheila (plats, prix en roupies et en euros, une couleur et un picto par section comme sur la carte imprimée), commande sur WhatsApp ; en dessous, la liste « À goûter à Maurice » à cocher |
| `/edition` | Édition partagée : prénom, jeton GitHub, jours dont l'ordre a été modifié |
| `/infos`, `/convertisseur`, `/bons-plans`, `/annexes`, `/notes`, `/bienvenue`, `/installer`, `/plus` | Le reste du guide |

La liste « À goûter à Maurice » (entrées, plats, desserts, boissons) a une case par plat, cochée sur l'appareil, avec
un compteur par catégorie ; elle est sous le menu de Sheila (`/menu#a-gouter`), plus dans les annexes.

Tout en bas du menu, « Choix » (`/menu#choix`) : une ligne par personnage du groupe (ordre alphabétique, dessin et
prénom), deux colonnes « Demain » et « Après-demain », chacune avec un plat de la carte de Sheila (une entrée par
variante : « Porc ou poulet » en fait deux), l'accompagnement (riz blanc, pain, les deux) et un curseur de piment de
0 à 5. Les choix sont enregistrés sur l'appareil (clés `choix:<personnage>:<colonne>`), pas partagés.

Clin d'œil : trois touchers rapides n'importe où (appuis brefs, pas un défilement) font surgir un personnage du
groupe (dessins dans `site/img/p/`, liste `cast` dans data.js) avec une animation tirée au sort parmi seize (CSS
`cam-*` dans style.css) : quinze pour un personnage seul, la seizième fait arriver tout le groupe de tous les bords
pour une photo en quinconce (cinq derrière, quatre devant, toutes les têtes visibles). Le calque ne capte pas les
touchers, l'animation va jusqu'au bout. Ces images ne sont pas dans le cache initial du service worker : elles sont demandées en tâche de
fond une fois le carnet prêt, et gardées en cache à ce moment-là.

Dans la bande des jours, une étoile jaune marque les jours où quelque chose est réservé à horaire fixe.
Tous les numéros de téléphone du carnet sont cliquables : un mobile mauricien (+230 5…) s'affiche en bloc vert
WhatsApp, logo en tête, qui ouvre la conversation, avec un petit bouton d'appel à côté ; un fixe se compose d'un
toucher ; une adresse e-mail (logo Gmail) ouvre un nouveau message dans Gmail. Dans les étapes et les fiches
Réservations, les contacts sont des lignes (`contact` dans data.js) : une par numéro ou adresse.
Chaque lieu d'une étape a deux boutons, « Carte » (recherche Google Maps, ou un lien Maps précis donné en
troisième position dans `places`) et « Y aller » (itinéraire depuis le lieu précédent).
Chaque randonnée a sa trace en ligne : AllTrails quand la fiche existe, sinon Wikiloc (Gris-Gris, Pieter Both) ou
Visorando (Tourelle du Tamarin) ; le bouton « Trace … » de la page Randos nomme le site.

Les photos des plages viennent de Wikimedia Commons (licences CC BY, CC BY-SA ou domaine public), celles des
randonnées de leur fiche AllTrails (photo principale) ; Gris-Gris, Pieter Both et la Tourelle du Tamarin, qui
sont sur Wikiloc ou Visorando, gardent une photo Commons : une image par fiche dans
`site/img/lieux/` (champ `pic` dans data.js ; WebP 800 × 400, recadrée au centre en 2:1 comme la vignette de la
fiche ; environ 1,5 Mo pour les 29), mise en cache comme le reste du carnet. Le
champ `credit` (auteur, licence, nom du fichier Commons ; ou site, mention, URL de la fiche) alimente le bloc
« Crédits des photos » replié en bas des pages Plages et Randos, comme l'exigent les licences Commons.
Sur chaque rando, le bloc « Distance · Dénivelé · Durée · Note » (champ `glance` : quatre textes, `null` quand la
fiche ne donne pas la valeur) reprend la fiche de la trace ; le bouton « Trace … » y mène. Les deux photos du guide (Le Morne, Flic-en-Flac) gardent le
champ `img` à deux tailles. Six plages sans photo libre (La Cambuse, Riambel, Palmar, Pomponette, Baie du Jacotet, Saint-Félix)
ont une photo fournie à la main (originaux dans `tmp/plage/`, jamais commités ; même format WebP, pas de `credit`).
Les plats de la page Menu ont aussi une photo Commons (`site/img/plats/`, WebP 960 px sur le grand côté, sans
recadrage) : sous le descriptif de chaque plat de Sheila (recadrée en 3:2 par le CSS, 5:2 sur grand écran), en
vignette carrée de 84 px au début de chaque ligne « À goûter » ; un toucher ouvre la photo entière dans une
visionneuse (`.lightbox`, nom du plat et crédit en légende, fermeture au toucher ou avec Échap). Champ `pic` +
`credit` sur chaque plat de Sheila, et pour la liste « À goûter » une ligne `[nom, description, photo, crédit]` ;
le bloc « Crédits des photos » est en bas de la page. Quand Commons n'a rien d'approchant, la ligne reste
sans photo (Gato sucre) ; quelques vignettes montrent un plat voisin (chop suey réunionnais, civet de zourite pour
le cari ourite, falooda pour l'alouda, l'usine Rault pour les biscuits manioc).

Sur chaque plage, le bloc « Affluence · Baignade · Clarté de l'eau · Qualité du sable » (champ `glance` :
`["low" | "medium" | "high", baignade/5, clarté/5, sable/5]`) et le bouton « Fiche » (champ `bl`, slug de
`mauritiusbeachlife.com/fr/beach/…`) reprennent les relevés de Mauritius Beach Life (53 plages) ; deux plages n'y ont
pas de fiche (Baie du Jacotet, Poudre d'Or). Le bloc « Pour aller plus loin » en bas de la page (`beachesLinks`) renvoie
au classement des Droners et à Mauritius Beach Life.

Sur mobile : glisser à gauche ou à droite pour changer de jour. Sur clavier : flèches ← →.

Le menu (barre du haut sur ordinateur, barre du bas sur mobile) change à l'atterrissage : avant, la To-do est en
4e position ; une fois sur place, elle passe en dernier.

Sur chaque jour, les étapes réservées (bateaux, plongée, pêche, hélico, Vanill'Art) portent le badge
« Réservé · horaire fixe » et sont rappelées en tête de page : elles ne se déplacent pas dans le planning.
Après une randonnée, le programme repasse par le logement pour la douche quand c'est à côté (Piton, Le Morne,
Pieter Both) ; quand la rando et la suite de la journée sont loin du logement (Gris-Gris) ou qu'il n'y a
plus de logement (Ferney, jour du départ), on enchaîne sans revenir. Le bouton « Itinéraire du jour dans Maps » enchaîne tous les lieux du jour, retour au
logement compris, et la carte « Le parcours du jour » (SVG hors ligne) reprend le même parcours.

## Changer l'ordre des étapes depuis le téléphone (édition partagée)

Avec un jeton enregistré (voir plus bas), un crayon apparaît sur chaque journée à côté du programme. Il fait
apparaître sur chaque étape : des flèches (monter, descendre), une heure,
un sélecteur de jour et une croix pour la retirer (les étapes retirées restent listées sous le programme, avec
« Remettre »). Choisir une heure replace l'étape à sa place horaire. Depuis `/plages` et `/randos`, « Ajouter à un
jour » (avec un jeton aussi) ouvre une feuille avec l'heure et la liste des jours : la plage ou la rando devient une étape du programme, avec
son lieu, sa fiche et sa note. Les étapes réservées ne bougent pas. Les trajets sont recalculés (les liaisons connues
du guide gardent leur durée, les autres sont estimées à vol d'oiseau × 1,3 à 38 km/h ; les plages et les départs de
rando ont leurs coordonnées dans `geo.js`), la carte relie les lieux dans le nouvel ordre en pointillé, les horaires
non choisis restent ceux du guide (en italique quand ils ne sont plus dans l'ordre).

Les changements sont d'abord enregistrés sur l'appareil. Pour les publier à tout le groupe, la page `/edition`
(Plus → Édition partagée) demande un prénom et un **jeton GitHub fine-grained** limité à ce dépôt, avec la seule
permission *Contents : Read and write* (github.com → Settings → Developer settings → Personal access tokens →
Fine-grained tokens). Le jeton reste dans le `localStorage` du téléphone, jamais dans le code. À chaque changement,
l'application écrit `site/plan.json` dans le dépôt via l'API GitHub (un commit « Programme partagé : jour 4
réordonné par Yves »), Vercel redéploie, et les autres téléphones lisent `plan.json` (toujours depuis le réseau, jamais
depuis le cache) à l'ouverture, au retour au premier plan ou au retour du réseau. La fusion se fait jour par jour : pour
chaque jour, la version la plus récente gagne. Sans jeton, on voit les changements des autres sans rien configurer.

`plan.json` référence les étapes par `jour:index` (ou `hike:k` / `beach:k` pour une rando ou une plage ajoutée), par
titre et par heure choisie : si une étape d'un jour est insérée, supprimée ou renommée dans `data.js`, l'ordre partagé
de ce jour retombe sur celui du guide pour cette étape. Avant de pousser une
modification de contenu, faire un `git pull` : les commits de l'application arrivent sur `main` entre-temps.

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
