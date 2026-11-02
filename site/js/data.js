/* Carnet de voyage — Maurice, 6-21 novembre 2026
   Contenu transcrit depuis guide_maurice.pdf
   Conventions :
   - places : [libellé affiché, requête Google Maps]
   - tags   : [type, texte]  type = ok | cash | todo | info
   - step "drive" : ligne de trajet en voiture
*/
window.GUIDE = {
  trip: {
    title: "Maurice",
    subtitle: "Seize jours entre lagon et sommets — à neuf sur la côte ouest, puis à deux dans le nord",
    start: "2026-11-06", arrival: "2026-11-06T06:35",
    end: "2026-11-21",
    maps: [
      { title: "Notre carte My Maps", url: "https://www.google.com/maps/d/viewer?mid=1RhQ4FVlUXNC8P6KobCM-dG9PTquyISs&ll=-20.1986872370166%2C57.55840500000003&z=10", sub: "Les lieux du voyage, dans Google Maps" },
      { title: "Full map activités", url: "https://www.google.com/maps/d/viewer?mid=1Y5YQjjZWqRUFBGjXIc7WNzUTbYlt1k8&ll=-20.20193122200105%2C57.55964340000002&z=10", sub: "Toutes les activités repérées sur l'île" }
    ],
    quote: "« Maurice a été créée en premier, puis le paradis — et le paradis fut copié sur Maurice. »",
    quoteBy: "Mark Twain · Following the Equator · 1897",
    intro: "Ce carnet a été pensé pour seize jours de lagon et de sommets : dauphins à l'aube, cascades dans la forêt, marchés qui sentent le cari et couchers de soleil qu'on ne se lasse pas d'attendre. Dix jours à neuf depuis Rivière Noire, puis six jours à deux depuis Trou aux Biches. Tu y trouveras tout ce qui est utile — et ce qui ne l'est pas, mais qui rendra le voyage meilleur.",
    stats: [
      ["15", "nuits"], ["2", "logements"], ["9→2", "voyageurs"], ["5", "jours en mer"], ["27 °C", "eau du lagon"]
    ]
  },

  days: [
    /* ───────────── JOUR 1 ───────────── */
    {
      n: 1, date: "2026-11-06", label: "Vendredi 6 novembre", phase: "neuf",
      title: "Atterrir sous les tropiques",
      sub: "Arrivée à l'aube · installation à Rivière Noire · première plage",
      drive: "≈ 1 h 17 de route · 73 km",
      img: "j01", caption: "Flic-en-Flac vue du ciel · la plage du premier jour",
      intro: "Nuit d'avion, atterrissage au lever du jour : il fait déjà 25 °C et le soleil est levé depuis 5h30. Aujourd'hui, on ne prévoit rien — on s'installe, on fait les courses, on va voir la mer.",
      steps: [
        { t: "drive", icon: "plane", d: "Vol · atterrissage SSR Plaisance 6h35" },
        { when: "Matin · 06h35", where: "Aéroport SSR · Plaisance", title: "Arrivée à l'aube",
          text: "Immigration, bagages, premiers gestes : retirer des roupies au distributeur du hall, activer la SIM prise en ligne, régler les montres à +3 h. Distributeurs dans le hall : <b>MCB</b> et <b>SBM</b> (les deux grands réseaux de l'île, frais raisonnables, plafonds corrects) — Absa en dépannage." },
        { when: "Matin · 07h30", where: "Aéroport · Pingouin Car Rental", title: "Retirer les trois voitures — Pingouin Car Rental",
          text: "Checklist voiture dans les infos pratiques. Volant à droite, on roule à gauche.",
          links: [["Pingouin Car Rental", "https://maps.app.goo.gl/QLT9fqSzSdNo3yi27", "map"]] },
        { t: "drive", d: "53 min · 55 km · M2 puis Phoenix → Rivière Noire · +10 min en heure de pointe" },
        { when: "Mi-journée", where: "Rivière Noire · La Jetée Road", title: "Récupérer le logement, cocktail et piscine",
          text: "Clés, valises posées, puis courses au Super U de Tamarin (10 min) ou au Winner's de Cascavelle (15 min) : eau, fruits, petit-déjeuner, rhum et citrons verts. Premier cocktail au bord de la piscine, les montagnes en face — le voyage commence là.",
          places: [["La Jetée Road, Grande Rivière Noire", "La Jetée Road, Grande Rivière Noire, Mauritius"]],
          tags: [["info", "Courses Super U Tamarin · 10 min"], ["info", "Cascavelle Winner's · 15 min"]] },
        { t: "drive", d: "24 min · 18 km · A3 vers Flic-en-Flac" },
        { when: "Après-midi", where: "Flic-en-Flac", title: "Première plage — Flic-en-Flac",
          text: "La grande plage publique de la côte ouest : des kilomètres de sable blanc sous les filaos, un lagon calme et peu profond, parfait pour une première baignade sans effort. Ananas découpés chez les vendeurs.",
          places: [["Flic en Flac Public Beach", "Flic en Flac Public Beach, Mauritius"]] },
        { when: "Soir · 18h15", where: "La Preneuse · à 5 min de la villa", title: "Coucher de soleil à La Preneuse",
          text: "La plage publique de La Preneuse, juste au sud de la villa, face à l'ouest : la tour Martello d'un côté, le Morne au loin de l'autre, et le soleil qui tombe dans la mer vers 18h15. Le soir, en général : dîner livré par Catering Sheila, ou un restaurant quand l'envie vient. Coucher tôt : demain, rando à 6h30.",
          places: [["La Preneuse Public Beach, Rivière Noire", "La Preneuse Public Beach, Mauritius"]] }
      ]
    },

    /* ───────────── JOUR 2 ───────────── */
    {
      n: 2, date: "2026-11-07", label: "Samedi 7 novembre", phase: "neuf",
      title: "Piton et plateau central",
      sub: "Le toit de l'île à l'aube · lac sacré · dégustation de thé · plage de Tamarin",
      drive: "≈ 1 h 31 de route · 70 km",
      img: "j02", caption: "La côte ouest vue du ciel · Le Morne",
      steps: [
        { t: "drive", d: "départ 05h50 · 27 min · 16,5 km · B9 puis route de Plaine Champagne" },
        { when: "Matin · 06h30 — 09h30", where: "Plaine Champagne · Parc national des Gorges de Rivière Noire", title: "Piton de la Petite Rivière Noire — le point culminant",
          text: "Le sommet de l'île (828 m) au départ de Plaine Champagne : forêt, puis crête avec vue plongeante sur les gorges, la côte ouest et le Morne. Boucle de 6,3 km, +215 m, 2h30 à 3h, rando modérée ; dernier passage raide avec cordes. Au retour, arrêt au belvédère des Gorges de Rivière Noire.",
          places: [["Départ du sentier, Plaine Champagne", "Black River Peak trailhead Plaine Champagne, Mauritius"]],
          links: [["AllTrails · Little Black River Peak", "https://www.alltrails.com/fr/trail/mauritius/savanne/piton-mauritius-trail", "trail"]],
          tags: [["info", "Rando 6,3 km · +215 m · 2h30-3h"], ["info", "Eau 1,5 L par personne"]] },
        { t: "drive", d: "16 min · 12 km" },
        { when: "Mi-journée · 10h00", where: "Grand Bassin · Ganga Talao", title: "Le lac sacré hindou",
          text: "Lac de cratère tenu pour un bras du Gange, temples au bord de l'eau, Shiva de 33 m à l'entrée. Arrêt de 30 min. Épaules et genoux couverts, chaussures retirées dans les temples.",
          places: [["Grand Bassin (Ganga Talao)", "Ganga Talao Grand Bassin, Mauritius"]] },
        { t: "drive", d: "7 min · 5 km" },
        { when: "Mi-journée · 11h00", where: "Bois Chéri", title: "Usine de thé, dégustation et déjeuner panoramique",
          text: "La plus ancienne plantation de thé de l'île (1892) : usine, petit musée, dégustation sous la véranda (vanille, coco, bergamote), puis déjeuner au restaurant panoramique face au lac et au sud. Vérifier les horaires du samedi.",
          places: [["Bois Chéri Tea Factory", "Bois Cheri Tea Factory, Mauritius"]],
          tags: [["info", "Visite usine + dégustation ≈ 1 h"], ["info", "Déjeuner restaurant panoramique"]] },
        { t: "drive", d: "41 min · 37 km · par la A3" },
        { when: "Après-midi", where: "Tamarin", title: "Plage de Tamarin, puis coucher de soleil",
          text: "Baie de sable doré face à la Tourelle, vagues à l'embouchure pour les surfeurs, lagon calme à gauche. Coucher de soleil à Tamarin ou à Flic-en-Flac. Quentin et July atterrissent à 17h10 et rejoignent la villa avec leur propre voiture : le soir, le groupe est au complet. Demain, dauphins à 7h — réveil 6h.",
          places: [["Tamarin Public Beach", "Tamarin Public Beach, Mauritius"]],
          tags: [["info", "Arrivée 17h10 · Quentin et July"]] }
      ]
    },

    /* ───────────── JOUR 3 ───────────── */
    {
      n: 3, date: "2026-11-08", label: "Dimanche 8 novembre", phase: "neuf",
      title: "Dauphins, Chamarel et Divali",
      sub: "Dauphins à l'aube · Terre des 7 couleurs · rhumerie · fête des lumières",
      drive: "≈ 1 h 23 de route · 51 km",
      img: "j03", caption: "Cascade de Chamarel · 100 m de chute",
      alert: "<b>Divali aujourd'hui</b> — la fête des lumières, jour férié : certains sites et commerces peuvent fermer plus tôt, vérifier les horaires de la rhumerie. Ce soir, les villages s'illuminent.",
      steps: [
        { t: "drive", d: "départ 06h45 · 4 min · 1,4 km · Rivière Noire → La Balise Marina" },
        { when: "Matin · 07h00 — 09h30", where: "La Balise Marina · Black River", title: "Sortie dauphins avec JPH", star: true,
          text: "Les dauphins long-becs se reposent dans la baie de Tamarin tôt le matin, souvent avec quelques grands dauphins. Sortie en bateau, mise à l'eau avec masque et tuba au passage des groupes — on observe, on ne poursuit pas. Déjà payé.",
          rdv: "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River · fin de matinée libre au logement ensuite",
          places: [["La Balise Marina", "La Balise Marina, Black River, Mauritius"]],
          tags: [["ok", "Payé JPH · réservé"], ["info", "Contact +230 5729 0901 · resa@jph.mu"]],
          note: ["À prévoir", "Maillot sous les vêtements, masque et tuba, lycra, serviette."] },
        { t: "drive", d: "29 min · 16 km · route de Chamarel, virages et points de vue" },
        { when: "Mi-journée · 12h30 — 17h00", where: "Chamarel · village et géoparc", title: "Déjeuner, terrasse, Terre des 7 couleurs, cascade, rhumerie",
          text: "Déjeuner rapide dans un petit restaurant du village, puis un verre sur la terrasse panoramique du Chamarel face à la côte. Puis les dunes de sable volcanique aux sept couleurs, l'enclos des tortues géantes et le belvédère de la cascade de Chamarel (100 m, la plus haute de l'île) sur le même billet. Puis la Rhumerie de Chamarel : distillerie et dégustation des rhums agricoles et arrangés.",
          places: [["Le Chamarel (terrasse)", "Le Chamarel Restaurant, Mauritius"], ["Terre des 7 Couleurs", "Chamarel Seven Coloured Earth Geopark, Mauritius"], ["Rhumerie de Chamarel", "Rhumerie de Chamarel, Mauritius"]],
          tags: [["info", "Entrée 7 couleurs + cascade ≈ 500-700 Rs"], ["info", "Rhumerie visite + dégustation ≈ 500 Rs"]] },
        { t: "drive", d: "29 min · 17 km · par Baie du Cap · retour 21 min · 17 km" },
        { when: "Soir · 18h00", where: "La Prairie · puis retour", title: "Coucher de soleil à La Prairie, villages illuminés",
          text: "Plage sauvage entre Le Morne et Baie du Cap, face à l'ouest : la mieux placée de l'île pour le coucher du soleil, la montagne dans le dos. Sur la route du retour, maisons et temples brillent de milliers de lampes pour Divali — ralentir, baisser les vitres.",
          places: [["La Prairie Public Beach", "La Prairie Public Beach, Mauritius"]],
          tags: [["info", "Coucher ≈ 18h15 · arriver 30 min avant"]] }
      ]
    },

    /* ───────────── JOUR 4 ───────────── */
    {
      n: 4, date: "2026-11-09", label: "Lundi 9 novembre", phase: "neuf",
      title: "Catamaran privatisé — côte ouest",
      sub: "Crystal Rock · Île aux Bénitiers · BBQ à bord · coucher de soleil en mer",
      drive: "≈ 8 min de route · 3 km",
      img: "j04", caption: "Crystal Rock · face au Morne",
      intro: "Journée entière sur l'eau avec JPH, catamaran rien que pour nous : on longe la côte ouest jusqu'au Morne, on nage, on mange à bord, on rentre avec le soleil.",
      steps: [
        { t: "drive", d: "4 min · 1,4 km · Rivière Noire → La Balise Marina · horaire de départ à confirmer · retour 4 min · 1,4 km" },
        { when: "Matin", where: "La Balise Marina · Black River", title: "Embarquement — catamaran JPH", star: true,
          text: "Catamaran privatisé pour la journée, déjà payé. Cap au sud le long de la côte ouest : dauphins au passage de la baie de Tamarin, puis le lagon du Morne.",
          rdv: "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River",
          places: [["La Balise Marina", "La Balise Marina, Black River, Mauritius"]],
          tags: [["ok", "Payé JPH · catamaran privatisé"], ["info", "Contact +230 5729 0901 · resa@jph.mu"]],
          note: ["À régler avec JPH", "La sortie d'hier incluait déjà les dauphins : demander à remplacer cette partie par plus de snorkeling, ou un départ plus tardif. Horaires à confirmer.", "warn"] },
        { when: "Mi-journée", where: "Crystal Rock · Île aux Bénitiers", title: "Snorkeling et BBQ à bord",
          text: "Crystal Rock, rocher de corail posé seul au milieu du lagon face au Morne — poissons-perroquets, demoiselles, parfois une tortue. Puis mouillage à l'Île aux Bénitiers, deux kilomètres de sable et de filaos ; baignade, BBQ à bord (poisson grillé, salades, punch).",
          tags: [["info", "À prévoir : lycra anti-UV · masque · chapeau · crème minérale"]] },
        { when: "Après-midi", where: "Lagon du Morne", title: "Farniente et retour tranquille",
          text: "Sieste sur le filet du catamaran, dernier bain, remontée vers Rivière Noire sans se presser." },
        { when: "Soir · 18h00", where: "En mer · puis Tamarin", title: "Coucher de soleil en mer",
          text: "Le soleil tombe dans l'océan Indien derrière le bateau, retour au port à la nuit tombante." }
      ]
    },

    /* ───────────── JOUR 5 ───────────── */
    {
      n: 5, date: "2026-11-10", label: "Mardi 10 novembre", phase: "neuf",
      title: "Vanille, cascade et Île aux Aigrettes",
      sub: "Sud sauvage · plantation bio · cascade 500 Pieds · réserve naturelle",
      drive: "≈ 2 h 35 de route · 138 km",
      img: "j05", caption: "Le lagon vu du ciel · Sud-Est",
      intro: "Matinée tranquille au logement — grasse matinée, piscine, petit-déjeuner long, douche sans se presser. Départ à 10h30 vers le sud sauvage, puis le lagon de Mahébourg.",
      steps: [
        { t: "drive", d: "départ 10h30 · 45 min · 36 km · route côtière par Le Morne et Baie du Cap" },
        { when: "Mi-journée · 11h15 — 12h15", where: "Chamouny", title: "Vanill'Art — plantation familiale de vanille bio",
          text: "Visite d'une heure, réservée pour 9 personnes : la liane de vanille, la pollinisation à la main, le séchage, les produits de la ferme à la sortie. 1 500 Rs par personne à payer sur place — mode de paiement non précisé, prévoir du cash.",
          places: [["Vanill'Art, Mont Blanc (Chamouny)", "Vanill Art Chamouny, Mauritius"]],
          tags: [["ok", "Réservé 9 personnes · 11h15"], ["todo", "À décaler avec Vanill'Art"], ["cash", "Cash 1 500 Rs / pers. · sur place"]] },
        { when: "Mi-journée · 12h30", where: "Chamouny · Cascade 500 Pieds", title: "Cascade 500 Pieds, puis déjeuner rapide",
          text: "Juste à côté : une chute qui plonge dans une gorge boisée, belvédère à quelques minutes de marche. Déjeuner rapide dans le coin — Chamouny, ou le domaine de Saint Aubin (maison coloniale, rhum et vanille) à 15 min.",
          places: [["Cascade 500 Pieds (à confirmer sur place)", "Cascade 500 Pieds Chamouny, Mauritius"]],
          tags: [["info", "Déjeuner 13h15 · Chamouny ou Saint Aubin"]] },
        { t: "drive", d: "50 min · 42 km · Chamouny → Pointe Jérôme (Mahébourg)" },
        { when: "Après-midi · 14h30 — 16h30", where: "Île aux Aigrettes · réserve MWF", title: "Visite guidée de la réserve",
          text: "Îlot de corail à cinq minutes de bateau de Pointe Jérôme, sauvé par la Mauritian Wildlife Foundation : tortues géantes d'Aldabra, pigeons des mares, geckos verts, et la dernière forêt d'ébènes de l'île. Environ 2 h avec le guide. À réserver auprès de la MWF (créneau 14h30).",
          places: [["Pointe Jérôme, embarcadère MWF", "Pointe Jerome Embarkation Point, Mahebourg, Mauritius"]],
          tags: [["todo", "À réserver MWF · créneau 14h30"], ["info", "Durée ≈ 2 h · bateau inclus"]] },
        { t: "drive", d: "1 h · 60 km · retour à Rivière Noire par la M2 · +10 min en heure de pointe" },
        { when: "Soir", where: "Rivière Noire", title: "Retour avant la nuit", text: "Soirée libre à la villa." }
      ]
    },

    /* ───────────── JOUR 6 ───────────── */
    {
      n: 6, date: "2026-11-11", label: "Mercredi 11 novembre", phase: "neuf",
      title: "Plongée, sucre et Pamplemousses",
      sub: "Baptême de plongée · musée du sucre · jardin botanique · coucher de soleil au nord",
      drive: "≈ 1 h 19 de route · 67 km",
      img: "j06", caption: "Sous la surface · Flic-en-Flac",
      steps: [
        { t: "drive", d: "départ 07h30 · 23 min · 17 km · Rivière Noire → Flic-en-Flac" },
        { when: "Matin · 08h00 — 11h00", where: "Flic-en-Flac · Exploration Sous-Marine", title: "Baptême de plongée, puis déjeuner à Flic-en-Flac", star: true,
          text: "Pour Adé, Yves, Alex, Mathieu et Audrey : briefing, mise à l'eau depuis le bateau, et 50 min à 1 h sous l'eau selon la consommation de la bouteille, sur les tombants de Flic-en-Flac. 3 500 Rs par personne, en cash sur place. 5 places confirmées ; 6e place en attente de réponse du centre (selon la condition physique). Déjeuner au bord de la plage ensuite.",
          places: [["Exploration Sous-Marine, Villas Caroline Road", "Exploration Sous-Marine Flic en Flac, Mauritius"]],
          tags: [["ok", "Confirmé 5 places · 8h"], ["cash", "Cash 3 500 Rs / pers."], ["info", "Contact +230 5728 9127"]],
          note: ["Pendant ce temps", "Plage et baignade à Flic-en-Flac pour Amly, Chloé, Quentin et July — la plage publique est à deux pas du centre de plongée."] },
        { t: "drive", d: "40 min · 38 km · Flic-en-Flac → Beau Plan (Pamplemousses)" },
        { when: "Après-midi · 13h30 — 15h15", where: "Beau Plan · L'Aventure du Sucre", title: "L'Aventure du Sucre — coupe de canne et dégustation",
          text: "L'ancienne sucrerie de Beau Plan transformée en musée : machines, histoire de l'île racontée par la canne, et dégustation des sucres spéciaux et des rhums en fin de parcours. Coupe de canne à réserver. Vérifier l'ouverture le mercredi après-midi.",
          places: [["L'Aventure du Sucre, Beau Plan", "L'Aventure du Sucre Beau Plan, Mauritius"]],
          tags: [["info", "Entrée ≈ 500 Rs · musée + dégustation"], ["todo", "Coupe de canne à réserver"]] },
        { when: "Après-midi · 15h30 — 17h00", where: "Pamplemousses · Jardin botanique SSR · à 3 min", title: "Jardin de Pamplemousses",
          text: "Le plus vieux jardin botanique de l'hémisphère sud : le bassin des nénuphars géants Victoria amazonica, les palmiers talipot, l'allée des épices, les tortues. Une heure de promenade à l'ombre.",
          places: [["Jardin botanique SSR, Pamplemousses", "SSR Botanical Garden Pamplemousses, Mauritius"]],
          tags: [["info", "Entrée ≈ 300 Rs"], ["info", "Guide facultatif · à l'entrée"]] },
        { t: "drive", d: "16 min · 12 km" },
        { when: "Soir · 18h00", where: "Trou aux Biches · puis retour", title: "Coucher de soleil à Trou aux Biches",
          text: "Repérage du quartier de la deuxième semaine : plage de Trou aux Biches au coucher du soleil, puis retour à Rivière Noire (58 min · 49 km, prudence de nuit).",
          places: [["Trou aux Biches Public Beach", "Trou aux Biches Public Beach, Mauritius"]] }
      ]
    },

    /* ───────────── JOUR 7 ───────────── */
    {
      n: 7, date: "2026-11-12", label: "Jeudi 12 novembre", phase: "neuf",
      title: "Pêche au gros et Port-Louis",
      sub: "Marlin au large · massages pour les autres · street food et marché de la capitale",
      drive: "≈ 1 h 30 de route · 67 km",
      img: "j07", caption: "Pêche au gros · au large du Morne",
      steps: [
        { t: "drive", d: "départ 06h50 · 4 min · 1,4 km · Rivière Noire → La Balise Marina" },
        { when: "Matin · 07h00 — 12h00", where: "La Balise Marina · Black River", title: "Pêche au gros avec JPH — Alex, Yves et Quentin", star: true,
          text: "Cinq heures au large de la côte ouest : marlin bleu, thon, dorade coryphène, wahoo — novembre ouvre la bonne saison. Acompte de 208 € déjà payé ; reste 64 € par personne (≈ 3 370 Rs), en cash sur place.",
          rdv: "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River",
          places: [["La Balise Marina", "La Balise Marina, Black River, Mauritius"]],
          tags: [["ok", "Réservé 3 pêcheurs"], ["cash", "Cash ≈ 3 370 Rs / pers. · solde"], ["info", "Contact +230 5729 0901"]],
          note: ["Pour les autres", "Matinée massage et détente : spa d'hôtel ou masseur à domicile, à réserver."] },
        { t: "drive", d: "12h30 · 43 min · 33 km · tous ensemble vers Port-Louis · +10 min en journée" },
        { when: "Mi-journée · 13h15", where: "Port-Louis · Marché central", title: "Déjeuner street food au marché",
          text: "Au premier étage du marché : <b>dholl puri</b> (galette de pois cassés roulée avec cari gros pois et chatini), gâteaux piments, samoussas, et un alouda glacé pour finir. Cash uniquement, on mange debout.",
          places: [["Marché central de Port-Louis", "Central Market Port Louis, Mauritius"]],
          tags: [["info", "Budget ≈ 150-250 Rs / pers."], ["cash", "Cash uniquement"]] },
        { when: "Après-midi · 14h00 — 17h30", where: "Port-Louis · centre", title: "Marché, Aapravasi Ghat, Chinatown, Citadelle, Caudan",
          text: "Le marché central (fruits, épices, vanille, paniers), puis l'Aapravasi Ghat — le dépôt où débarquèrent les travailleurs engagés indiens, classé UNESCO. Chinatown et ses temples, montée à la Citadelle pour la vue sur la rade et les Montagnes de Moka, descente au Caudan Waterfront pour une glace sous la rue des parapluies.",
          places: [["Aapravasi Ghat", "Aapravasi Ghat, Mauritius"], ["Citadelle (Fort Adelaide)", "Fort Adelaide Port Louis, Mauritius"], ["Caudan Waterfront", "Caudan Waterfront, Mauritius"]],
          tags: [["info", "Parking : coupons en station-service · ou parking Caudan"], ["ok", "Marché ouvert lun-sam 5h-18h · vérifié"]],
          note: ["Bouchons", "Port-Louis se bloque de 16h à 18h30 : repartir avant 16h, ou dîner sur place et rentrer après.", "warn"] },
        { t: "drive", d: "43 min · 33 km · retour à Rivière Noire · +10 min en heure de pointe" },
        { when: "Soir", where: "Rivière Noire · au logement", title: "Soirée à la villa", text: "Récit de pêche obligatoire." }
      ]
    },

    /* ───────────── JOUR 8 ───────────── */
    {
      n: 8, date: "2026-11-13", label: "Vendredi 13 novembre", phase: "neuf",
      title: "Baba Cool — les îles du Nord",
      sub: "Coin de Mire · Île Plate · îlot Gabriel · église de Cap Malheureux · Grand Baie",
      drive: "≈ 1 h 21 de route · 72 km",
      img: "j08", caption: "Retour en catamaran · Grand Baie",
      steps: [
        { t: "drive", d: "départ 06h20 · 1 h 07 · 61 km · Rivière Noire → Pereybère par la M2 · +10 min en heure de pointe" },
        { when: "Matin · 07h45", where: "Pereybère · plage", title: "Embarquement — catamaran Baba Cool privatisé", star: true,
          text: "Contact Baba Cool, Sophie : +230 5723 4134. 33 000 Rs pour le bateau, à payer sur place, en cash uniquement — retraits répartis sur plusieurs jours et plusieurs cartes.",
          rdv: "Plage de Pereybère, tout à droite face à la mer",
          places: [["Pereybère Public Beach", "Pereybere Public Beach, Mauritius"]],
          tags: [["ok", "Réservé catamaran privatisé · 7h45"], ["cash", "Cash 33 000 Rs · bateau · sur place"], ["info", "Sophie +230 5723 4134"]] },
        { when: "Mi-journée", where: "Coin de Mire · Île Plate · Îlot Gabriel", title: "Snorkeling et BBQ à bord",
          text: "Cap au nord vers le Coin de Mire, la montagne-île dressée face à Cap Malheureux, puis mouillage entre l'Île Plate et l'îlot Gabriel : eau transparente, patates de corail, poissons-papillons, parfois des tortues. BBQ à bord, sieste sur le filet, dernier bain.",
          tags: [["info", "À prévoir : lycra · masque et tuba · crème minérale · mal de mer"]] },
        { t: "drive", d: "5 min · 4 km" },
        { when: "Après-midi · 16h00", where: "Cap Malheureux", title: "L'église au toit rouge",
          text: "Notre-Dame Auxiliatrice, la petite église au toit rouge face au Coin de Mire — la carte postale du nord. Cinq minutes, une photo, un bain de pieds sur la plage des pêcheurs.",
          places: [["Église Notre-Dame Auxiliatrice", "Notre Dame Auxiliatrice Cap Malheureux, Mauritius"]] },
        { t: "drive", d: "9 min · 7 km" },
        { when: "Soir · 17h00", where: "Grand Baie · retour des pêcheurs", title: "Les raies au retour des pêcheurs, apéro et coucher de soleil",
          text: "Vers 17h, quand les pêcheurs rentrent et vident leurs prises, les raies pastenagues viennent au bord, à fleur d'eau, chercher les restes. On s'installe là avec l'apéro, on les regarde passer, et on attend le soleil qui tombe vers 18h15 face à la baie. Retour à Rivière Noire ensuite (59 min · 57 km) — route de nuit peu éclairée, piétons et chiens : prudence. Demain, Le Morne à 6h.",
          places: [["Grand Baie, front de mer", "Grand Baie Public Beach, Mauritius"]],
          tags: [["info", "17h retour des pêcheurs · raies"], ["info", "18h15 coucher de soleil"]] }
      ]
    },

    /* ───────────── JOUR 9 ───────────── */
    {
      n: 9, date: "2026-11-14", label: "Samedi 14 novembre", phase: "neuf",
      title: "Le Morne Brabant",
      sub: "Ascension à l'aube · plage du Morne · coucher de soleil à La Prairie",
      drive: "≈ 52 min de route · 40 km",
      img: "j09", caption: "Depuis le sommet du Morne · 556 m · UNESCO",
      intro: "La montagne-refuge des esclaves marrons, classée à l'UNESCO en 2008. On part de nuit pour arriver au sommet avant la chaleur, avec Adrien, l'ami d'Yves, qui connaît la montagne — pas de guide professionnel.",
      steps: [
        { t: "drive", d: "départ 05h30 · 21 min · 17 km · Rivière Noire → Le Morne, entrée du sentier" },
        { when: "Matin · 06h00 — 10h30", where: "Le Morne · sentier du Brabant", title: "Ascension du Morne Brabant", star: true,
          text: "7 km aller-retour, +540 m, 3 à 5 h. Chemin large en forêt sèche jusqu'au plateau, puis crête de plus en plus aérienne et final en escalade avec cordes jusqu'à la croix du sommet (556 m) : tout le lagon, la cascade sous-marine qui se devine, l'Île aux Bénitiers et la côte sud. Adrien vient avec nous ; pas de guide professionnel.",
          places: [["Départ du sentier du Morne Brabant", "Le Morne Brabant trail entrance, Mauritius"]],
          links: [["AllTrails · Le Morne Brabant Peak", "https://www.alltrails.com/fr/trail/mauritius/riviere-noire/le-morne-brabant-peak", "trail"]],
          tags: [["info", "Rando 7 km A/R · +540 m · 3-5 h · soutenue"], ["ok", "Avec Adrien"]],
          note: ["Partie finale", "Exposée et glissante si mouillée : pas de vertige, chaussures accrochées, 2 L d'eau par personne, départ avant 6h30 pour éviter la fournaise de la crête.", "warn"] },
        { t: "drive", d: "5 min · 3 km" },
        { when: "Mi-journée · 11h30", where: "Retour vers Rivière Noire · puis plage du Morne", title: "Déjeuner côté villa, après-midi sur la plage du Morne",
          text: "Retour déjeuner vers Rivière Noire / Tamarin (21 min), douche, puis retour à la plus belle plage publique de l'île : sable blanc, lagon turquoise et la montagne qui tombe dans l'eau. Kitesurfeurs au loin sur le spot du One Eye. Baignade, lecture, rien.",
          places: [["Plage publique du Morne", "Le Morne Public Beach, Mauritius"]],
          tags: [["info", "Plage publique · gratuite · parking à l'ombre"]] },
        { t: "drive", d: "5 min · 3 km · retour Rivière Noire 21 min · 17 km" },
        { when: "Soir · 18h00", where: "La Prairie", title: "Coucher de soleil à La Prairie",
          text: "Retour sur la plage de dimanche dernier pour le coucher du soleil, cette fois avec le sommet gravi dans le dos. Jambes lourdes, sourire large.",
          places: [["La Prairie Public Beach", "La Prairie Public Beach, Mauritius"]] }
      ]
    },

    /* ───────────── JOUR 10 ───────────── */
    {
      n: 10, date: "2026-11-15", label: "Dimanche 15 novembre", phase: "neuf",
      title: "Sud sauvage et Sud-Est",
      sub: "Gris-Gris · La Roche qui Pleure · Pont Naturel · Mahébourg · Blue Bay · dernière soirée ensemble",
      drive: "≈ 3 h 09 de route · 148 km",
      img: "j10", caption: "Blue Bay · parc marin",
      steps: [
        { t: "drive", d: "départ 07h00 · 50 min · 41 km · route côtière par Le Morne, Baie du Cap, Souillac" },
        { when: "Matin · 08h00 — 09h30", where: "Souillac · Gris-Gris", title: "Sentier côtier Gris-Gris → La Roche qui Pleure, puis Pont Naturel",
          text: "Ici, pas de lagon : l'océan frappe directement les falaises de basalte. Balade sur la crête jusqu'à La Roche qui Pleure, le profil de rocher qui pleure à chaque vague — environ 4 km aller-retour, quasi plat, 1h30. Puis, par les pistes de canne, le Pont Naturel, arche de lave au-dessus des vagues.",
          places: [["Gris-Gris, Souillac", "Gris Gris Beach Souillac, Mauritius"], ["Pont Naturel", "Pont Naturel, Mauritius"]],
          links: [["Wikiloc · Gris-Gris / Roche qui Pleure", "https://www.wikiloc.com/hiking-trails/gris-gris-103050287", "trail"]],
          tags: [["info", "Balade 4 km A/R · plat · 1h30"], ["todo", "Baignade interdite à Gris-Gris · courants"]] },
        { t: "drive", d: "Gris-Gris → Pont Naturel 40 min · 25 km · puis Pont Naturel → Mahébourg 29 min · 16 km" },
        { when: "Mi-journée · 12h00", where: "Mahébourg · front de mer", title: "Déjeuner sur le front de mer",
          text: "La vieille ville du sud-est, face à l'Île aux Aigrettes et à la montagne du Lion. Le marché couvert ferme en général vers midi le dimanche : viser un restaurant du waterfront.",
          places: [["Mahébourg Waterfront", "Mahébourg Waterfront, Mauritius"]] },
        { t: "drive", d: "11 min · 6 km" },
        { when: "Après-midi", where: "Blue Bay · Pointe d'Esny", title: "Snorkeling à Blue Bay",
          text: "Deux façons de voir le parc marin de Blue Bay : depuis la plage (gratuit — palmes, masque, tuba ; le corail commence à quelques brasses, à gauche de la plage publique), ou en bateau (≈ 20-30 min, bateau à fond de verre ou à moteur depuis la plage, ≈ 400-600 Rs/pers. à négocier sur place) pour les patates de corail du large, plus profondes et plus riches. Autres options : Anse aux Aigrettes depuis Pointe d'Esny (plus confidentiel), ou l'Île des Deux Cocos (bateau, excursion payante).",
          places: [["Blue Bay Public Beach", "Blue Bay Public Beach, Mauritius"]],
          tags: [["info", "Snorkeling : masque · tuba · chaussures d'eau"], ["todo", "Parc marin : ne pas toucher le corail"]] },
        { t: "drive", d: "59 min · 60 km · retour vers la côte ouest par la M2" },
        { when: "Soir · 18h00", where: "Flic-en-Flac", title: "Dernière soirée à neuf — apéro au coucher du soleil",
          text: "Apéro sur la plage de Flic-en-Flac au coucher du soleil, dernière soirée tous ensemble. Bagages bouclés ce soir : demain, check-out à 6h30.",
          tags: [["todo", "Ce soir bagages bouclés · check-out 6h30 demain"]] }
      ]
    },

    /* ───────────── JOUR 11 ───────────── */
    {
      n: 11, date: "2026-11-16", label: "Lundi 16 novembre", phase: "deux",
      title: "Hélicoptère, départs et foire de Mahébourg",
      sub: "Check-out à Rivière Noire · vol au-dessus de la cascade sous-marine · foire du lundi · Trou aux Biches",
      drive: "≈ 3 h 00 de route · 180 km",
      img: "j11", caption: "La cascade sous-marine · vue d'hélicoptère",
      steps: [
        { when: "Matin · 06h30", where: "Rivière Noire · La Jetée Road", title: "Check-out",
          text: "Bagages bouclés la veille, check-out à 6h30, route vers Triolet." },
        { t: "drive", d: "54 min · 46 km · Rivière Noire → Triolet · +10 min en heure de pointe" },
        { when: "Matin · 07h55 — 08h40", where: "Triolet · Corail Hélicoptères", title: "Vol en hélicoptère — 45 min pour Yves", star: true,
          text: "Arriver 15 min avant, soit 7h40. Déjà payé. Décollage de Triolet, cap sur la côte ouest : Le Morne, la cascade sous-marine — l'illusion d'une chute d'eau au bord du plateau corallien —, Chamarel et les Gorges, retour par le lagon. Puis passage au logement de Trou aux Biches (6 min) pour déposer les bagages, si l'hôte l'accepte (check-in officiel 15h–18h, clés dans un coffre).",
          places: [["Corail Hélicoptères, Bon Air Road, Triolet", "Corail Helicopteres Triolet, Mauritius"]],
          tags: [["ok", "Payé Corail Hélicoptères · 7h55"], ["info", "Arrivée 7h40 · pièce d'identité"]],
          note: ["Pendant le vol", "Adé visite le Shivala de Triolet (Maheswarnath Mandir), le plus grand temple hindou de l'île, à 5 min — épaules et genoux couverts."] },
        { t: "drive", d: "1 h 01 · 65 km · Trou aux Biches → Mahébourg · +15 min en heure de pointe" },
        { when: "Mi-journée · 10h30", where: "Mahébourg · foire du lundi", title: "La grande foire de Mahébourg, puis déjeuner",
          text: "C'est bien le lundi, le jour de la grande foire : le plus vivant des marchés hebdomadaires : fruits, épices, textiles, et de quoi grignoter — gato sucre, fangourin (jus de canne pressé). Déjeuner à Mahébourg, puis l'après-midi à la plage de Pointe d'Esny et snorkeling à Anse aux Aigrettes. Départ vers 16h pour remonter au nord avant la nuit.",
          places: [["Foire de Mahébourg (marché)", "Mahebourg Market, Mauritius"], ["Pointe d'Esny Public Beach", "Pointe d'Esny Public Beach, Mauritius"]],
          tags: [["cash", "Cash petites coupures"], ["info", "Après-midi Pointe d'Esny · snorkeling"]] },
        { t: "drive", d: "16h00 · 1 h 05 · 69 km · retour à Trou aux Biches · +15 min en heure de pointe" },
        { when: "Soir · 18h00", where: "Trou aux Biches", title: "Installation et coucher de soleil",
          text: "Installation dans l'appartement, les pieds dans le lagon. Coucher de soleil sur la plage juste devant.",
          places: [["Serge's Beachfront by Serenity", "Serge's Beachfront by Serenity, Trou aux Biches, Mauritius"]] }
      ]
    },

    /* ───────────── JOUR 12 ───────────── */
    {
      n: 12, date: "2026-11-17", label: "Mardi 17 novembre", phase: "deux",
      title: "Nord tranquille",
      sub: "Tortues devant le logement · Turtle Bay · Mont Choisy · Pereybère · raies de Grand Baie · table d'hôte",
      drive: "≈ 1 h 13 de route · 52 km",
      img: "j12", caption: "Trou aux Biches · le lagon devant le logement",
      steps: [
        { when: "Matin", where: "Trou aux Biches · devant le logement", title: "Snorkeling avec les tortues",
          text: "Masque, tuba, et droit devant : les tortues vertes broutent les herbiers du lagon de Trou aux Biches tôt le matin, à quelques dizaines de mètres de la plage. On les regarde, on ne les touche pas.",
          tags: [["info", "Snorkeling tôt le matin · eau calme"]] },
        { t: "drive", d: "15 min · 9 km" },
        { when: "Mi-journée", where: "Balaclava · Turtle Bay", title: "Baie aux Tortues",
          text: "Parc marin de Balaclava : corail, poissons, encore des tortues. Déjeuner léger ou pique-nique.",
          places: [["Turtle Bay (Baie aux Tortues)", "Turtle Bay Balaclava, Mauritius"]] },
        { t: "drive", d: "17 min · 12 km" },
        { when: "Après-midi", where: "Mont Choisy · puis Pereybère", title: "Baignade à Mont Choisy, puis Pereybère",
          text: "Mont Choisy : la plus longue plage du nord, sable sous les filaos, lagon calme. Puis Pereybère (11 min), petite crique à l'eau la plus claire du nord.",
          places: [["Mont Choisy Public Beach", "Mont Choisy Public Beach, Mauritius"], ["Pereybère Public Beach", "Pereybere Public Beach, Mauritius"]] },
        { t: "drive", d: "5 min · 3 km · Pereybère → Grand Baie" },
        { when: "Soir · 17h00", where: "Grand Baie · retour des pêcheurs", title: "Les raies au retour des pêcheurs, apéro face à la baie",
          text: "Deuxième chance de voir les raies venir au bord quand les pêcheurs vident leurs prises, vers 17h. Apéro, coucher de soleil à 18h15, puis route vers Calodyne.",
          places: [["Grand Baie, front de mer", "Grand Baie Public Beach, Mauritius"]],
          tags: [["info", "17h retour des pêcheurs · raies"]] },
        { t: "drive", d: "18 min · 15 km · Grand Baie → Calodyne · retour Trou aux Biches 18 min · 13 km" },
        { when: "Soir · 19h00", where: "Calodyne · chez La Karay", title: "Table d'hôte Chez La Karay",
          text: "Table d'hôte créole à Calodyne : cari, rougaille, achards, rhum arrangé maison. À réserver.",
          places: [["La Karaye de Val, Chemin du Sourire", "La Karaye de Val Calodyne, Mauritius"]],
          tags: [["todo", "À réserver · +230 5855 8288"]] }
      ]
    },

    /* ───────────── JOUR 13 ───────────── */
    {
      n: 13, date: "2026-11-18", label: "Mercredi 18 novembre", phase: "deux",
      title: "Speedboat — le lagon du Sud-Est",
      sub: "Île aux Cerfs · Île aux Aigrettes · cascade de GRSE · snorkeling · à deux",
      drive: "≈ 2 h 07 de route · 135 km",
      img: "j13", caption: "Escale sur le sable · lagon Sud-Est",
      intro: "Bateau privatisé avec Nemo Speed Boat pour une journée à deux dans le lagon le plus vaste de l'île. Consigne donnée : éviter les spots bondés, juste un arrêt rapide à l'Île aux Cerfs.",
      steps: [
        { t: "drive", d: "départ 07h30 · 1 h 02 · 66 km · Trou aux Biches → Pointe Jérôme · +15 min en heure de pointe" },
        { when: "Matin · 09h00", where: "Pointe Jérôme · Pointe d'Esny Road", title: "Embarquement — bateau « NEMO »", star: true,
          text: "À l'arrivée, appeler Kenza : +230 5753 9671 · contact de réservation, Jérôme : +230 5771 7917. 14 000 Rs pour le bateau, à payer sur place, en cash uniquement.",
          rdv: "Pointe Jérôme, Mahébourg (Pointe d'Esny Road) · bateau « NEMO »",
          places: [["Pointe Jérôme", "Pointe Jerome Embarkation Point, Mahebourg, Mauritius"]],
          tags: [["ok", "Réservé Nemo Speed Boat · 9h"], ["cash", "Cash 14 000 Rs · bateau"], ["info", "Kenza +230 5753 9671"]] },
        { when: "Mi-journée", where: "Île aux Cerfs · GRSE · Île aux Aigrettes", title: "Les îles, la cascade, le corail",
          text: "Remontée du lagon vers l'Île aux Cerfs (arrêt rapide, le temps d'un bain sur une plage à l'écart), puis l'embouchure de la Grande Rivière Sud-Est et sa cascade qui tombe dans la mer — on s'en approche en bateau, les singes regardent depuis les arbres. Snorkeling sur les patates de corail, passage devant l'Île aux Aigrettes et les îlots de la passe. Retour en milieu d'après-midi, dernier bain à Pointe d'Esny.",
          tags: [["info", "À prévoir : sac étanche · lycra · masque · eau · pique-nique"]] },
        { t: "drive", d: "1 h 05 · 69 km · retour à Trou aux Biches avant la nuit · +15 min en heure de pointe" },
        { when: "Soir", where: "Trou aux Biches", title: "Soirée astronomique",
          text: "Pas de prestataire trouvé au nord : on la fait nous-mêmes. Lune à 64 % ce soir-là (premier quartier le 17) : elle se couche vers minuit, donc le meilleur ciel est après 0h30 — ou viser plutôt une nuit la semaine d'avant, autour de la nouvelle lune du 8. S'éloigner des lumières de Grand Baie (plage de Mont Choisy ou pointe de Cap Malheureux), lampe rouge, plaid, et l'app Stellarium ou Sky Guide pour repérer la Croix du Sud, les Nuages de Magellan et le centre de la Voie lactée. Coucher tôt quand même : demain, départ à 5h.",
          tags: [["info", "Lune 64 % · couchée vers minuit"], ["info", "App Stellarium · Sky Guide"]] }
      ]
    },

    /* ───────────── JOUR 14 ───────────── */
    {
      n: 14, date: "2026-11-19", label: "Jeudi 19 novembre", phase: "deux",
      title: "Les 7 cascades et Tamarin",
      sub: "Canyon de Tamarind Falls · baignades · kayak au coucher du soleil",
      drive: "≈ 2 h 00 de route · 109 km",
      img: "j14", caption: "Cascade dans la forêt · plateau central",
      steps: [
        { t: "drive", d: "départ 05h10 · 46 min · 43 km · Trou aux Biches → Chutes de Tamarin (Henrietta)" },
        { when: "Matin · 06h00 — 10h00", where: "Henrietta · Tamarind Falls", title: "Les 7 cascades de Tamarin", star: true,
          text: "La rivière Tamarin dégringole le rebord du plateau central en sept chutes successives, au fond d'une gorge verte. Sans guide, avec la trace AllTrails : 2 à 6 km selon le parcours, +120 à +270 m, 3 à 4 h avec les baignades dans les bassins. Terrain glissant, passages dans la rivière — ne pas y aller après une grosse pluie.",
          places: [["Chutes de Tamarin, Henrietta Branch Road", "Tamarind Falls Henrietta, Mauritius"]],
          links: [["AllTrails · Seven Cascades Short Loop", "https://www.alltrails.com/fr/trail/mauritius/plaines-wilhems/seven-cascades-short-loop", "trail"]],
          tags: [["info", "Canyon 2-6 km · +120 à +270 m · 3-4 h"], ["todo", "Trace AllTrails hors-ligne"]],
          note: ["À prévoir", "Chaussures qui accrochent et qui peuvent aller dans l'eau, maillot sous le short, sac étanche, serviette, en-cas. Annulation possible en cas de forte pluie."] },
        { t: "drive", d: "22 min · 20 km · Henrietta → Tamarin" },
        { when: "Mi-journée · 12h00", where: "Tamarin", title: "Déjeuner et plage de Tamarin",
          text: "Retour sur la baie de la première semaine : déjeuner au village, après-midi sur la plage, sieste sous les filaos.",
          places: [["Tamarin Public Beach", "Tamarin Public Beach, Mauritius"]] },
        { when: "Après-midi · 16h30", where: "Rivière Tamarin", title: "Kayak ou paddle au coucher du soleil",
          text: "Remontée de la rivière Tamarin en kayak ou en paddle, entre mangroves et montagnes, avec le soleil qui tombe dans la baie au retour. Avec Yanature ou Lakaz Kayak, à réserver.",
          places: [["Lakaz Kayak, Cap Tamarin", "Lakaz Kayak, Cap Tamarin, Mauritius"]],
          tags: [["todo", "À réserver Yanature ou Lakaz Kayak · 16h30"]] },
        { t: "drive", d: "52 min · 46 km · retour à Trou aux Biches, de nuit" },
        { when: "Soir", where: "Trou aux Biches", title: "Retour au nord",
          text: "Demain, le plus technique des sommets : coucher tôt, matériel prêt." }
      ]
    },

    /* ───────────── JOUR 15 ───────────── */
    {
      n: 15, date: "2026-11-20", label: "Vendredi 20 novembre", phase: "deux",
      title: "Pieter Both et Moka",
      sub: "Ascension équipée de la « tête » · déjeuner créole · maison coloniale Eureka · séga",
      drive: "≈ 1 h 13 de route · 61 km",
      img: "j15", caption: "Pieter Both · 820 m · la tête",
      intro: "La montagne au rocher en équilibre, deuxième sommet de l'île : une marche raide jusqu'à l'épaule, puis une escalade équipée jusqu'à la tête. Avec un guide, pour deux.",
      steps: [
        { t: "drive", d: "départ 05h55 · 29 min · 22 km · Trou aux Biches → La Laura / Crève Cœur" },
        { when: "Matin · 06h30 — 12h00", where: "La Laura · Crève Cœur", title: "Ascension de Pieter Both avec un guide", star: true,
          text: "Environ 1 km aller-retour depuis La Laura jusqu'à l'épaule, +330 m très raides, avec des passages où l'on s'aide des mains, puis escalade équipée de la « tête » — baudrier, corde, barreaux scellés — jusqu'au sommet (820 m) : Port-Louis, les Montagnes de Moka et tout le nord à vos pieds. 4 à 7 h au total selon le guide. Guide conseillé : Trekking Mauritius (Yanature), +230 5251 4050 (WhatsApp) · alternative : Vertical World.",
          places: [["Pieter Both, départ La Laura / Crève Cœur", "Pieter Both trail La Laura, Mauritius"]],
          links: [["Wikiloc · Pieter Both", "https://www.wikiloc.com/mountaineering-trails/pieter-both-mountain-track-371337", "trail"]],
          tags: [["info", "Escalade 1 km A/R · +330 m · 4-7 h"], ["todo", "Guide Trekking Mauritius · à réserver"], ["info", "WhatsApp +230 5251 4050"]],
          note: ["Conditions", "Annulé si la roche est mouillée ou s'il y a du vent ; déconseillé en cas de vertige. Gants légers utiles pour les barreaux, 2 L d'eau, départ avant 7h.", "warn"] },
        { t: "drive", d: "14 min · 9 km · Crève Cœur → Moka" },
        { when: "Mi-journée · 13h30 — 16h30", where: "Moka · Escale Créole · puis Eureka à 4 min", title: "Déjeuner à Escale Créole, puis la maison Eureka",
          text: "Table d'hôte créole dans un jardin de Moka, cuisine de famille : caris, rougailles, achards, gato patate. Uniquement le midi — réserver sur WhatsApp en prévenant d'une arrivée tardive. Juste à côté ensuite, la maison coloniale Eureka : demeure créole de 1830 aux 109 portes au pied des Montagnes de Moka, mobilier d'époque, véranda, et un jardin qui descend vers des cascades où l'on peut tremper les pieds.",
          places: [["Escale Créole, Bois Chéri Road, Moka", "Escale Creole Moka, Mauritius"], ["Eureka, la maison créole", "Eureka La Maison Creole Moka, Mauritius"]],
          tags: [["todo", "À réserver WhatsApp · prévenir arrivée tardive"], ["info", "Eureka ≈ 400 Rs · jardin et cascades inclus"]] },
        { t: "drive", d: "30 min · 30 km · Moka → Trou aux Biches par la M2 · +15 min en heure de pointe" },
        { when: "Soir", where: "Trou aux Biches", title: "Soirée séga « tipik »",
          text: "Le séga des origines : ravanne, maravanne, triangle, voix — la musique née dans les camps d'esclaves, inscrite à l'UNESCO. Soirée à organiser (hôtels du nord ou restaurant du village).",
          tags: [["todo", "À organiser · soirée séga tipik"]] }
      ]
    },

    /* ───────────── JOUR 16 ───────────── */
    {
      n: 16, date: "2026-11-21", label: "Samedi 21 novembre", phase: "deux",
      title: "Vallée de Ferney et départ",
      sub: "Forêt indigène · Mahébourg · dernière baignade à dix minutes de l'aéroport",
      drive: "≈ 1 h 43 de route · 95 km",
      img: "j16", caption: "Dernière baignade · côte Sud-Est",
      intro: "Check-out à 7h30 (fenêtre officielle 8h–12h, clés à remettre dans le coffre — prévenir l'hôte). Bagages dans la voiture, une tenue de rechange accessible pour ce soir — on se baigne avant l'avion.",
      steps: [
        { t: "drive", d: "départ 07h30 · 1 h 02 · 68 km · Trou aux Biches → Vieux Grand Port · +15 min en heure de pointe" },
        { when: "Matin · 09h30 — 11h30", where: "Vallée de Ferney", title: "Balade guidée en forêt indigène",
          text: "Une des dernières forêts d'origine de l'île, dans une vallée fermée au-dessus de Vieux Grand Port : ébènes, bois de natte, crécerelles de Maurice réintroduites. Environ 3 à 4 km, faible dénivelé, 2 h, à réserver.",
          places: [["La Vallée de Ferney, Vieux Grand Port", "La Vallée de Ferney, Mauritius"]],
          links: [["AllTrails · Ferney Blue Route (5,3 km)", "https://www.alltrails.com/fr/randonnee/mauritius/grand-port/la-vallee-de-ferney-blue-route", "trail"]],
          tags: [["info", "Balade 3-4 km · facile · 2 h"], ["todo", "À réserver Vallée de Ferney"]] },
        { t: "drive", d: "13 min · 7 km" },
        { when: "Mi-journée · 12h30", where: "Mahébourg", title: "Déjeuner à Mahébourg, Biscuiterie Rault en option",
          text: "Dernier déjeuner sur le front de mer. En option, la Biscuiterie Rault — biscuits de manioc cuits au feu de bois depuis 1870, visite et dégustation (vérifier l'ouverture le samedi).",
          places: [["Biscuiterie Rault", "Biscuiterie Rault, Mahebourg, Mauritius"]] },
        { t: "drive", d: "19 min · 14 km · Mahébourg → La Cambuse" },
        { when: "Après-midi", where: "Pointe d'Esny · La Cambuse", title: "Dernière baignade",
          text: "Pointe d'Esny, ou la plage sauvage de La Cambuse, à 10 min de l'aéroport : filaos, sable blanc, personne. Coucher de soleil sur la plage avant de partir, douche de fortune et tenue de rechange.",
          places: [["La Cambuse Public Beach", "La Cambuse Public Beach, Mauritius"]],
          tags: [["info", "La Cambuse · 10 min de l'aéroport"]] },
        { t: "drive", d: "19h00 · 9 min · 6 km · La Cambuse → aéroport · restitution de la voiture" },
        { when: "Soir · 19h30", where: "Aéroport SSR", title: "Enregistrement, vol à 22h35",
          text: "Restitution de la voiture, enregistrement, dernier dholl puri si le hall en propose. Décollage à 22h35.",
          tags: [["todo", "Vol 22h35 · à l'aéroport pour 19h30"]] }
      ]
    }
  ],

  /* ───────────── LOGEMENTS ───────────── */
  stays: [
    {
      id: "riverhaven", range: "J1 → J11", dates: "5 → 16 nov · 11 nuits · à neuf · Airbnb",
      name: "River Haven", place: "Rivière Noire (Black River)", img: "logement1",
      address: "La Jetée Road, Rivière Noire, Rivière Noire District 90605",
      mapsQ: "La Jetée Road, Grande Rivière Noire, Mauritius",
      host: "Amelie (Airbnb)",
      checkin: "Arrivée jeu. 5 nov. dès 15h — la nuit du 5 est réservée : on peut entrer dès l'arrivée le 6 au matin",
      checkout: "Départ lun. 16 nov. avant 10h",
      around: ["La Balise Marina (JPH) · 4 min", "Super U Tamarin · 10 min", "Winner's Cascavelle · 15 min"],
      desc: "Villa avec piscine et jardin à Rivière Noire, à quatre minutes de la marina de La Balise d'où partent dauphins, catamaran et pêche au gros : les montagnes dans le dos, la baie devant, et le soleil qui se couche en face tous les soirs vers 18h15. Base de la première semaine, à neuf.",
      fields: ["Code d'entrée / clés", "Téléphone de l'hôte", "Wifi"],
      note: ["Check-out", "Lundi 16 novembre : on part à 6h30, bien avant la limite de 10h — bagages bouclés la veille au soir."]
    },
    {
      id: "serge", range: "J11 → J16", dates: "16 → 21 nov · 5 nuits · à deux · Booking",
      name: "Serge's Beachfront by Serenity", place: "Trou aux Biches", img: "logement2",
      address: "Coastal Road, Trou-aux-Biches · Appartement ★★★★ · 2 adultes · clés dans un coffre sécurisé sur place",
      mapsQ: "Serge's Beachfront by Serenity, Trou aux Biches, Mauritius",
      checkin: "Arrivée lun. 16 nov. 15h – 18h",
      checkout: "Départ sam. 21 nov. 8h – 12h",
      around: ["Super U La Croisette · 8 min", "Store 2000 Grand Baie · prix bas", "Intermart Calodyne · 18 min"],
      desc: "Appartement les pieds dans le lagon : les tortues broutent les herbiers juste devant, le coucher de soleil se regarde depuis la fenêtre. Base de la deuxième semaine, à deux.",
      fields: ["Code du coffre à clés", "Téléphone de l'hôte", "Wifi"],
      note: ["À convenir avec l'hôte", "Le check-in officiel est 15h–18h : demander si on peut déposer les bagages vers 9h le lundi 16 (entre l'hélicoptère et Mahébourg). Et prévenir qu'on quitte l'appartement samedi 21 vers 7h30, avant la fenêtre 8h–12h : clés dans le coffre."]
    }
  ],

  /* ───────────── ACTIVITÉS RÉSERVÉES ───────────── */
  booked: [
    { day: 3, when: "Dim. 8 · 7h — 9h30", status: ["ok", "Payé"], title: "Sortie dauphins · JPH",
      desc: "Les dauphins long-becs de la baie de Tamarin, à l'aube, avec mise à l'eau.",
      rows: [["RDV", "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River"], ["Contact", "JPH · +230 5729 0901 / +230 5727 6188 · resa@jph.mu · bureau +230 483 50 60"], ["Prix", "Déjà payé"], ["À prévoir", "maillot sous les vêtements, masque et tuba, lycra, serviette, mal de mer"]],
      tel: "+23057290901" },
    { day: 4, when: "Lun. 9 · journée", status: ["ok", "Payé"], title: "Catamaran privatisé · JPH",
      desc: "Côte ouest : dauphins, Crystal Rock, Île aux Bénitiers, BBQ à bord, coucher de soleil en mer.",
      rows: [["RDV", "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River · horaires à confirmer"], ["Contact", "JPH · +230 5729 0901 / +230 5727 6188 · resa@jph.mu · bureau +230 483 50 60"], ["Prix", "Déjà payé"], ["À prévoir", "lycra, masque et tuba, chapeau, crème minérale, enceinte"]],
      note: "Doublon dauphins : demander à JPH de remplacer la partie dauphins par plus de snorkeling, ou un départ plus tardif.",
      tel: "+23057290901" },
    { day: 5, when: "Mar. 10 · 11h", status: ["cash", "À payer sur place · cash"], title: "Vanill'Art · Chamouny",
      desc: "Visite d'une heure de la plantation familiale de vanille bio, réservée pour 9 personnes.",
      rows: [["RDV", "Vanill'Art, Chamouny · 45 min de Rivière Noire"], ["Prix", "1 500 Rs par personne, à payer sur place — prévoir du cash"], ["Durée", "≈ 1 h"]] },
    { day: 6, when: "Mer. 11 · 8h", status: ["cash", "À payer sur place · cash"], title: "Baptême de plongée · Exploration Sous-Marine",
      desc: "Flic-en-Flac · pour Adé, Yves, Alex, Mathieu et Audrey — 5 places confirmées, 6ᵉ en attente.",
      rows: [["RDV", "Exploration Sous-Marine, Villas Caroline Road, Flic-en-Flac · 8h"], ["Contact", "+230 5728 9127"], ["Prix", "3 500 Rs par personne, en cash sur place"], ["Durée", "50 min à 1 h sous l'eau, selon la consommation"], ["À prévoir", "maillot, serviette, questionnaire médical ; pas d'avion dans les 24 h (ok : vols le 16)"]],
      tel: "+23057289127" },
    { day: 7, when: "Jeu. 12 · 7h — 12h", status: ["cash", "À payer sur place · cash"], title: "Pêche au gros · JPH",
      desc: "Pour Alex, Yves et Quentin.",
      rows: [["RDV", "L'Estuaire, Shop 32 & 33, La Balise Marina, Black River"], ["Contact", "JPH · +230 5729 0901 / +230 5727 6188 · resa@jph.mu · bureau +230 483 50 60"], ["Prix", "Acompte de 208 € déjà payé · reste 64 € par personne (≈ 3 370 Rs), en cash sur place"], ["À prévoir", "casquette, lunettes, crème, mal de mer, petit-déjeuner léger"]],
      tel: "+23057290901" },
    { day: 8, when: "Ven. 13 · 7h45", status: ["cash", "À payer sur place · cash"], title: "Catamaran Baba Cool · îles du Nord",
      desc: "Coin de Mire, Île Plate, îlot Gabriel, snorkeling, BBQ à bord — bateau privatisé pour le groupe.",
      rows: [["RDV", "Plage de Pereybère, tout à droite face à la mer"], ["Contact", "Sophie · +230 5723 4134"], ["Prix", "33 000 Rs pour le bateau, à payer sur place, en cash uniquement"], ["À prévoir", "lycra, masque et tuba, crème minérale, mal de mer, cash retiré à l'avance"]],
      tel: "+23057234134" },
    { day: 11, when: "Lun. 16 · 7h55", status: ["ok", "Payé"], title: "Hélicoptère · Corail Hélicoptères",
      desc: "Vol de 45 min pour Yves au départ de Triolet : Le Morne, la cascade sous-marine, Chamarel.",
      rows: [["RDV", "Corail Hélicoptères, Bon Air Road, Triolet · arriver 15 min avant, soit 7h40"], ["Prix", "Déjà payé"], ["Durée", "45 min"], ["À prévoir", "pièce d'identité, appareil photo chargé, pull léger (tôt le matin)"]] },
    { day: 13, when: "Mer. 18 · 9h", status: ["cash", "À payer sur place · cash"], title: "Speedboat · Nemo Speed Boat",
      desc: "Journée à deux dans le lagon sud-est : Île aux Cerfs, Île aux Aigrettes, cascade de GRSE, snorkeling.",
      rows: [["RDV", "Pointe Jérôme, Mahébourg (Pointe d'Esny Road) · bateau « NEMO »"], ["Contact", "À l'arrivée, Kenza : +230 5753 9671 · réservation, Jérôme : +230 5771 7917"], ["Prix", "14 000 Rs pour le bateau, à payer sur place, en cash uniquement"], ["À prévoir", "sac étanche, lycra, masque et tuba, eau, pique-nique, crème minérale"]],
      tel: "+23057539671" },
    { day: 1, when: "Ven. 6 et sam. 7 · soir", status: ["ok", "Payé"], title: "Dîners livrés · Catering Sheila Mauritius",
      desc: "Dîner livré au logement les deux premiers soirs, pour tout le groupe.",
      rows: [["Quand", "Vendredi 6 et samedi 7 novembre, le soir"], ["Statut", "Réservé"]] }
  ],

  toBook: [
    { day: 5, when: "Mar. 10", title: "Réserve de l'Île aux Aigrettes — MWF",
      details: "Créneau 14h30 · visite guidée ≈ 1h30-2h, bateau 10 min depuis Pointe Jérôme · prix ≈ 800-1 000 Rs/pers. (à confirmer) · réservation obligatoire, par téléphone ou e-mail",
      contact: "+230 697 6097 (siège MWF, Vacoas) · mauritian-wildlife.org", tel: "+2306976097", place: "Pointe Jérôme, embarcadère MWF" },
    { day: 6, when: "Mer. 11", title: "Coupe de canne — L'Aventure du Sucre",
      details: "Le mercredi à 10h30 uniquement, 600 Rs/pers., minimum 10 participants, places limitées · ⚠ notre visite est prévue à 13h30 : décaler le matin ou renoncer · entrée musée 1 200 Rs/pers. avec dégustation, ouvert lun-sam 10h-16h",
      contact: "+230 243 7900 · administration@aventuredusucre.com", tel: "+2302437900", place: "L'Aventure du Sucre, Beau Plan" },
    { day: 7, when: "Jeu. 12", title: "Massages (matin)",
      details: "Pour ceux qui ne pêchent pas : spa d'hôtel ou masseur à domicile à Rivière Noire — prestataire à choisir",
      place: "La Jetée Road, Rivière Noire" },
    { day: 12, when: "Mar. 17", title: "La Karaye de Val — table d'hôte",
      details: "Dîner créole sur réservation, Calodyne (18 min de Trou aux Biches) · note Google 4,9",
      contact: "+230 5855 8288", tel: "+23058558288", place: "La Karaye de Val, Chemin du Sourire, Calodyne" },
    { day: 14, when: "Jeu. 19", title: "Kayak au coucher du soleil — Lakaz Kayak",
      details: "Rivière Tamarin, 2 h dont 1 h de kayak + dégustation de 3 rhums, ≈ 50 €/pers. · RDV base Lakaz Kayak, Parc de Tamarin (Cap Tamarin) · alternative Yanature",
      contact: "+230 5492 8367 · manawa.com", tel: "+23054928367", place: "Lakaz Kayak, Cap Tamarin, Les Terrasses du Barachois" },
    { day: 15, when: "Ven. 20", title: "Guide pour Pieter Both — Trekking Mauritius (Yanature)",
      details: "« Exclusive Guided Climb », privé, 2 personnes max, 4 h, affiché à partir de 16 000 Rs/pers. sur leur site (à négocier/vérifier) · alternative : Vertical World (7 h, prix sur demande, verticalworldltd.com)",
      contact: "+230 5251 4050 (WhatsApp) · trekkingmauritius.com", wa: "23052514050", place: "Pieter Both, départ La Laura" },
    { day: 15, when: "Ven. 20", title: "Escale Créole — déjeuner",
      details: "Table d'hôte le midi seulement (12h-15h), 1 000-1 500 Rs/pers. · réserver sur WhatsApp en prévenant d'une arrivée tardive après Pieter Both",
      contact: "+230 5422 2332", wa: "23054222332", place: "Escale Créole, B46 Bois Chéri Road, Moka" },
    { day: 15, when: "Ven. 20", title: "Soirée séga tipik",
      details: "Spectacles surtout dans les hôtels (soirée séga hebdomadaire, dîner-spectacle) ; demander à l'hôte de Trou aux Biches ou aux hôtels de Grand Baie le soir où ça joue" },
    { day: 16, when: "Sam. 21", title: "Vallée de Ferney — balade",
      details: "Ouvert 7j/7, activités 8h30-14h · entrée rando 500 Rs/pers. · sentiers balisés de 5 km (1-1,5 h, facile, dernier départ 14h) à 18 km · visite guidée (crécerelle, pigeon rose) sur réservation",
      contact: "+230 660 1937 · lvdf@ferney.mu", tel: "+2306601937", place: "La Vallée de Ferney, Vieux Grand Port" }
  ],

  /* ───────────── INFOS PRATIQUES ───────────── */
  rate: 52.5,
  info: {
    timezone: "L'île est à UTC+4 ; en novembre Paris est en heure d'hiver (UTC+1) : trois heures d'avance sur la France. Quand il est 9h à Paris, il est midi à Maurice. Le jour se lève vers 5h30 et le soleil se couche vers 18h15 — les journées commencent tôt et les soirées sont déjà nocturnes à 19h.",
    cards: [
      { k: "Monnaie", title: "Roupie mauricienne · Rs (MUR)",
        html: "<p><b>1 € ≈ 52-53 Rs.</b> Règle de tête : enlever deux zéros, puis multiplier par 2.</p><ul><li>2 500 Rs → 25 → 50 €</li><li>1 000 Rs → 10 → 20 €</li><li>3 500 Rs → 35 → 70 €</li><li>33 000 Rs → 330 → 660 €</li></ul><p>Un peu au-dessus du vrai taux : parfait pour ne pas se tromper dans le mauvais sens. Billets de 25 à 2 000 Rs ; les petites coupures servent aux marchés, aux snacks et aux pourboires.</p>" },
      { k: "Cash", title: "Retirer de l'argent",
        html: "<ul><li>Distributeurs partout — préférer <b>MCB</b> et <b>SBM</b> (les deux grands réseaux, bien répartis, plafonds corrects), Absa en dépannage : Cascavelle et le centre de Flic-en-Flac la première semaine, La Croisette à Grand Baie ensuite.</li><li>Plafond par retrait souvent limité : pour les 88 110 Rs de cash du groupe, répartir les retraits sur plusieurs jours et plusieurs cartes.</li><li>Carte sans frais à l'étranger (Revolut, N26…) ; refuser la conversion en euros proposée par le distributeur.</li><li>Moins de distributeurs dans le Sud-Est : retirer avant le speedboat du 18 et la journée du 10.</li></ul>" },
      { k: "Change", title: "Changer des euros",
        html: "<ul><li>Aéroport : bureaux de change ouverts à l'arrivée, pratiques pour une première petite somme.</li><li>En ville : Absa, HSBC, Bank One ou BCP proposent souvent de meilleurs taux que la MCB ; Shibani est très répandu mais son taux est moins avantageux.</li><li>Apporter des billets en bon état et comparer les taux affichés du jour.</li></ul>" },
      { k: "Paiement", title: "Carte ou cash ?",
        html: "<p>La carte passe dans les supermarchés et la plupart des restaurants. Le cash reste indispensable pour les marchés, la street food et plusieurs prestataires : Baba Cool (33 000 Rs), Nemo (14 000 Rs), plongée, Vanill'Art, solde de la pêche. Tableau détaillé dans « Cash à prévoir ».</p>" },
      { k: "Connexion", title: "Téléphone & électricité",
        html: "<ul><li>SIM touristique Emtel ou my.t, en vente à l'aéroport — passeport demandé. Data largement suffisante pour Maps et WhatsApp.</li><li>Prises de type G (anglaises) et C, 230 V : prévoir un adaptateur type G par personne, une multiprise pour la villa.</li></ul>" },
      { k: "Culture", title: "Vie locale",
        html: "<ul><li>Langues : créole mauricien, français et anglais — le français passe partout.</li><li>Pourboire non obligatoire ; environ 5 à 10 % au restaurant s'il n'y a pas de frais de service.</li><li>Divali le dimanche 8 novembre : jour férié, certains sites et commerces peuvent être fermés.</li><li>Temples : tenue couvrant épaules et genoux, chaussures retirées à l'entrée.</li></ul>" },
      { k: "Climat", title: "Début de l'été austral",
        html: "<p>Novembre, c'est le début de la saison chaude et humide : chaleur franche, averses courtes et tropicales surtout sur le plateau et l'est, <b>indice UV extrême (11+) dès 9h</b>. La saison cyclonique commence officiellement en novembre mais concerne surtout janvier à mars ; on garde un œil sur metservice.intnet.mu, sans s'inquiéter.</p>" },
      { k: "Apps", title: "Apps à installer avant le vol",
        html: "<ul><li><b>Windy</b> + metservice.intnet.mu — vent, houle, pluie, alertes</li><li><b>Google Maps</b> — carte « Île Maurice » téléchargée hors-ligne</li><li><b>AllTrails / Wikiloc</b> — traces des randos hors-ligne (7 cascades sans guide)</li><li><b>Stellarium</b> ou <b>Sky Guide</b> — soirée étoiles</li><li><b>WhatsApp</b> — tous les prestataires répondent par là</li><li><b>Tricount</b> — dépenses du groupe</li><li><b>Revolut / N26</b> — paiements et retraits sans frais</li><li><b>Google Sheets</b> — notre fichier d'activités</li></ul>" },
      { k: "Santé", title: "Santé & sécurité",
        html: "<ul><li>Crème solaire minérale (plus respectueuse des coraux) et chapeau : le soleil tape fort même par temps nuageux.</li><li>Chaussures d'eau contre les oursins et les coraux ; ne pas toucher les coraux.</li><li>Rester dans le lagon : les courants sont dangereux au-delà de la barrière de corail ; baignade interdite à Gris-Gris.</li><li>Répulsif anti-moustiques, surtout en fin de journée.</li><li>Préférer l'eau en bouteille.</li><li>Urgences : police <b>999</b> · SAMU <b>114</b> · pompiers <b>115</b>.</li></ul>" },
      { k: "Courses", title: "Supermarchés",
        html: "<ul><li>Près de Tamarin : Super U Tamarin (5 min) · Winner's au Cascavelle Shopping Village (10 min, supermarché complet, pharmacie et food court) · Jumbo Flic-en-Flac (15 min).</li><li>Près de Trou aux Biches : Super U Grand Baie, centre commercial La Croisette (15 min) · Store 2000 Grand Baie, réputé pour ses prix bas · Intermart à Calodyne.</li><li>Fruits et légumes : marchés locaux, beaucoup moins chers qu'en supermarché.</li></ul>" }
    ],
    weather: [
      ["Côte ouest (Tamarin, Flic-en-Flac, Le Morne)", "28 — 31 °C", "faible, la plus sèche", "ensoleillée presque tous les jours, soleil couchant face à la mer"],
      ["Nord (Trou aux Biches, Grand Baie)", "28 — 30 °C", "faible", "lagon calme et peu profond, alizé léger"],
      ["Plateau central (Curepipe, Plaine Champagne)", "22 — 26 °C", "averses fréquentes", "nuages l'après-midi, 5 °C de moins qu'en bas — grimper le matin"],
      ["Est et Sud-Est (Mahébourg, Blue Bay)", "27 — 29 °C", "modérée", "alizé plus présent, mer parfois formée hors lagon"],
      ["Eau du lagon", "26 — 27 °C", "—", "pas besoin de combinaison, lycra contre le soleil"]
    ],
    driving: [
      ["Conduite", "à gauche", "volant à droite, priorité dans les ronds-points à ceux qui y sont déjà — ils sont nombreux"],
      ["Permis", "français + international recommandé", "à garder dans la voiture avec le contrat de location"],
      ["Vitesse", "40 · 80 · 110 km/h", "ville · route · autoroute ; radars fixes fréquents"],
      ["Bouchons", "7h — 9h30 · 16h — 18h30", "autour de Port-Louis et d'Ebène ; éviter ces créneaux sur l'autoroute"],
      ["Nuit", "éviter si possible", "routes peu éclairées, piétons et chiens sur les bas-côtés"],
      ["Essence", "même prix partout", "prix fixé par l'État (≈ 65-70 Rs/L), donc aucune marque moins chère — au plus proche ; faire le plein avant le Sud et le Sud-Est, où les stations sont rares"],
      ["Parking", "coupons en station-service", "obligatoires à Port-Louis et dans les centres-villes ; gratuit sur les plages"]
    ],
    carOut: ["Photos et vidéo du tour complet de chaque voiture : rayures, bosses, jantes, pare-brise, intérieur", "Niveau d'essence noté sur le contrat (plein ? à rendre pareil)", "Kilométrage noté", "Pression des pneus, roue de secours, cric, triangle", "Clim, phares, essuie-glaces, klaxon : on teste", "Caution : montant et mode (empreinte CB) — un seul payeur par voiture, noté dans Tricount", "Assurance : franchise, ce qui est exclu (pneus, vitres, bas de caisse)", "Contrat + permis international dans la boîte à gants"],
    carBack: ["Plein refait au même niveau qu'au départ (station la plus proche : Plaine Magnien)", "Nouvelles photos du tour, intérieur vidé", "État des lieux signé en présence de l'agent, copie du PV", "Libération de la caution : délai demandé par écrit"],
    routes: {
      a: ["Depuis la villa (Rivière Noire)", [["La Balise Marina (JPH)", "4 min · 1,4 km"], ["Le Morne", "21 min · 17 km"], ["Flic-en-Flac (plage)", "24 min · 18 km"], ["Plaine Champagne", "27 min · 16 km"], ["Chamarel (7 couleurs)", "29 min · 16 km"], ["Port-Louis (marché)", "43 min · 33 km"], ["Chamouny (Vanill'Art)", "45 min · 36 km"], ["Gris-Gris", "50 min · 41 km"], ["Aéroport SSR", "53 min · 55 km"], ["Triolet (hélico)", "54 min · 46 km"], ["Grand Baie", "59 min · 57 km"], ["Mahébourg · Pointe Jérôme", "1 h · 60 km"], ["Pereybère", "1 h 07 · 61 km"]]],
      b: ["Depuis Trou aux Biches", [["Triolet (hélico)", "6 min · 5 km"], ["Grand Baie · La Croisette", "8 min · 6 km"], ["Turtle Bay (Balaclava)", "15 min · 9 km"], ["Calodyne", "18 min · 15 km"], ["Port-Louis (marché)", "21 min · 17 km"], ["La Laura (Pieter Both)", "29 min · 22 km"], ["Moka (Eureka)", "30 min · 30 km"], ["Henrietta (7 cascades)", "46 min · 43 km"], ["Tamarin", "52 min · 46 km"], ["Aéroport SSR", "56 min · 61 km"], ["Rivière Noire (villa)", "58 min · 49 km"], ["Mahébourg", "1 h 01 · 65 km"], ["Vallée de Ferney", "1 h 02 · 68 km"]]],
      note: "Temps relevés sur Google Maps en conditions fluides (vrais pour les départs de 5h à 7h). Ajouter 10 à 20 min pour tout trajet qui passe par Port-Louis ou Phoenix entre 7h et 9h30 et entre 16h et 18h30."
    }
  },

  /* ───────────── CHECKLIST ───────────── */
  checklistIntro: "L'oubli qui change tout : le sac étanche — speedboat, kayak, catamaran. Et deux litres d'eau par personne pour chaque sommet.",
  checklist: [
    ["Papiers & administratif", ["Passeport valide (6 mois conseillés)", "Formulaire d'arrivée en ligne (si demandé)", "Permis de conduire + international", "Cartes bancaires × 2 (sans frais)", "Euros en billets pour le change", "Assurance voyage / rapatriement", "Réservations en PDF hors-ligne", "Copie du passeport sur le téléphone", "Contrat de location voiture"]],
    ["Tête & soleil", ["Casquette ou chapeau", "Lunettes de soleil (catégorie 3)", "Crème solaire minérale SPF 50", "Stick à lèvres SPF", "Après-soleil / aloe vera", "Répulsif anti-moustiques"]],
    ["Chaussures", ["Chaussures d'eau (oursins, speedboat)", "Sandales", "Chaussures de rando qui accrochent", "Chaussettes de rando × 4"]],
    ["Électronique & câbles", ["Adaptateur type G × 2 + multiprise", "Chargeurs téléphone", "Batterie externe", "Appareil photo + cartes + chargeur", "Écouteurs", "Enceinte (bateau, villa)", "Google Maps hors-ligne téléchargé"]],
    ["Vêtements", ["Maillots de bain × 2-3", "Lycra anti-UV (bateau, snorkeling)", "Shorts × 3", "T-shirts légers × 6", "Tenue légère pour le soir × 2", "Tenue épaules et genoux couverts (temples)", "Coupe-vent léger / k-way (averses)", "Pull léger (clim, hélico à 7h)", "Serviette microfibre", "Paréo", "Sous-vêtements × 8 · pyjama léger"]],
    ["Rando & mer", ["Sac à dos 20 L", "Gourde 1,5 L", "Lampe frontale (départs à 5h-6h)", "Masque & tuba (ou location)", "Sac étanche (speedboat, kayak)", "Housse étanche téléphone", "Gants légers (barreaux de Pieter Both)", "Petit cadenas"]],
    ["Drone & images", ["Drone Mini 5 Pro + 3 batteries + chargeur", "Hélices de rechange, filtres ND", "Enregistrement DCA Maurice + certificat DGAC (PDF)", "Caméra étanche + fixation + batteries", "Cartes SD × 3 (vidées)", "Disque dur / sauvegarde du soir"]],
    ["Hygiène & pharmacie", ["Trousse de toilette", "Pansements, désinfectant, paracétamol", "Anti-diarrhéique + réhydratation", "Antihistaminique", "Mal de mer (5 sorties en mer)", "Pince à épiler (oursins, échardes)", "Biafine / brûlures", "Boules Quies · gel hydroalcoolique"]]
  ],

  /* ───────────── BONS PLANS ───────────── */
  tips: [
    { k: "Manger", title: "Street food", html: "<p>Le meilleur repas de l'île coûte 100 Rs : dholl puri (2 pour ≈ 30-40 Rs) au marché de Port-Louis ou chez Dewa & Sons à Rose-Hill, roti chaud, gâteaux piments, samoussas au coin de la rue, boulettes en bouillon à Chinatown, mine frit ou bol renversé dans un snack chinois. Le soir, les camions-snacks des plages publiques.</p>" },
    { k: "Acheter", title: "Marchés", html: "<ul><li>Port-Louis, marché central — tous les jours, épices et vanille au premier étage</li><li>Mahébourg — le lundi, le plus vivant</li><li>Flacq — mercredi et dimanche, le plus grand de l'île</li><li>Quatre Bornes — jeudi et dimanche, textile</li></ul><p>Négocier gentiment sur les souvenirs, jamais sur les fruits.</p>" },
    { k: "Se baigner", title: "Plages publiques", html: "<p>Toutes gratuites, toutes ombragées de filaos. Les plus belles : Le Morne, La Prairie (coucher de soleil), Mont Choisy, Pereybère, Trou aux Biches, Blue Bay, La Cambuse, Flic-en-Flac. Le dimanche, elles se remplissent de familles et de musique dès 10h : y aller tôt, ou choisir ce jour-là une balade.</p>" },
    { k: "Sous l'eau", title: "Snorkeling depuis la plage", html: "<ul><li>Trou aux Biches — tortues sur les herbiers, tôt le matin</li><li>Blue Bay — parc marin, corail et poissons par centaines</li><li>Turtle Bay (Balaclava) — parc marin du nord-ouest</li><li>Pereybère — eau la plus claire du nord</li><li>Flic-en-Flac — à droite de la plage publique</li></ul><p>Chaussures d'eau, lycra, et on ne touche à rien.</p>" },
    { k: "Regarder", title: "Couchers de soleil", html: "<p>Toute la côte ouest regarde le soleil tomber dans la mer vers 18h15. Arriver 30 min avant, avec de quoi boire : Rivière Noire et Tamarin (à côté de la villa), La Prairie, Flic-en-Flac, Le Morne, puis Trou aux Biches et Mont Choisy la deuxième semaine. La lumière dure 10 minutes : être en place.</p>" },
    { k: "Rapporter", title: "À rapporter", html: "<ul><li>Rhum arrangé de Chamarel, rhum de Saint Aubin ou New Grove</li><li>Thé à la vanille de Bois Chéri</li><li>Sucres spéciaux de l'Aventure du Sucre</li><li>Biscuits manioc Rault</li><li>Vanille de Vanill'Art, piments confits, achards</li></ul><p>Rhum en bagage en soute, bien emballé.</p>" },
    { k: "Dépenser mieux", title: "Économiser", html: "<ul><li>Essence : prix fixé par l'État, identique partout — prendre la station la plus proche</li><li>Retraits : MCB ou SBM, refuser la conversion en euros</li><li>Tables d'hôte et snacks locaux : 400 à 900 Rs le repas complet, contre 1 500+ en restaurant d'hôtel</li><li>Eau : bidons de 5 L au supermarché</li><li>Fruits au bord de la route (ananas, mangues)</li><li>Cash pour les petits achats, carte pour les courses</li></ul>" },
    { k: "Anticiper", title: "Météo mobile", html: "<p>Le nuage qui bouche le plateau n'atteint presque jamais la côte ouest : s'il pleut à Curepipe, il fait beau à Tamarin. Les randos du plateau (Piton, 7 cascades, Pieter Both) se font le matin, avant que les nuages montent ; les plages l'après-midi. Après une grosse pluie, les rivières des 7 cascades grossissent vite : le guide décide.</p>" }
  ],

  /* ───────────── ANNEXES ───────────── */
  hikes: [
    { day: "Sam 7", name: "Piton de la Petite Rivière Noire", prog: "6,3 km · boucle · +215 m · 2h30 – 3h", diff: "Modérée", note: "17,2", src: "AllTrails 4,3/5 · 294 avis", from: ["27 min", "1 h 11"],
      see: "Point culminant de l'île (828 m), vue sur les gorges, la côte ouest et le Morne", warn: "Dernier passage raide avec cordes",
      url: "https://www.alltrails.com/fr/trail/mauritius/savanne/piton-mauritius-trail" },
    { day: "Sam 14", name: "Le Morne Brabant", prog: "7 km · A/R · +540 m · 3 – 5 h", diff: "Soutenue", note: "19,2", src: "AllTrails 4,8/5 · 1 794 avis", from: ["21 min", "1 h 25"],
      see: "Croix du sommet (556 m), tout le lagon, Île aux Bénitiers, côte sud — site UNESCO", warn: "Final en escalade avec cordes, exposé, glissant si mouillé : pas de vertige ; avec Adrien, sans guide pro",
      url: "https://www.alltrails.com/fr/trail/mauritius/riviere-noire/le-morne-brabant-peak" },
    { day: "Dim 15", name: "Gris-Gris → La Roche qui Pleure", prog: "≈ 4 km · A/R · quasi plat · ≈ 1h30", diff: "Facile", note: "—", src: "Wikiloc", from: ["50 min", "1 h 08"],
      see: "Falaises de basalte battues par l'océan, pas de lagon", warn: "Baignade interdite · courants · venteux, sans ombre",
      url: "https://www.wikiloc.com/hiking-trails/gris-gris-103050287" },
    { day: "Jeu 19", name: "Les 7 cascades de Tamarin", prog: "2 à 6 km · +120 à +270 m · 3 – 4 h avec baignades", diff: "Modérée · technique", note: "18,4", src: "AllTrails 4,6/5 · 1 020 avis", from: ["28 min", "46 min"],
      see: "Sept chutes successives et leurs bassins au fond d'une gorge verte", warn: "Terrain glissant, passages à la main près des chutes, à éviter après la pluie ; sans guide, télécharger la trace",
      url: "https://www.alltrails.com/fr/trail/mauritius/plaines-wilhems/seven-cascades-short-loop" },
    { day: "Ven 20", name: "Pieter Both", prog: "≈ 1 km · A/R · +330 m · 4 – 7 h selon le guide", diff: "Difficile · escalade équipée", note: "—", src: "Wikiloc", from: ["49 min", "29 min"],
      see: "Le rocher en équilibre (820 m), Port-Louis, les Montagnes de Moka et tout le nord", warn: "Passages à la main puis escalade équipée (baudrier, corde, barreaux) ; annulé si roche mouillée ou vent ; déconseillé en cas de vertige",
      url: "https://www.wikiloc.com/mountaineering-trails/pieter-both-mountain-track-371337" },
    { day: "Sam 21", name: "Vallée de Ferney", prog: "3 – 4 km · faible · ≈ 2 h", diff: "Facile", note: "17,2", src: "AllTrails 4,3/5 · Blue Route", from: ["1 h", "1 h 02"],
      see: "Forêt indigène, ébènes, crécerelles de Maurice",
      url: "https://www.alltrails.com/fr/randonnee/mauritius/grand-port/la-vallee-de-ferney-blue-route" }
  ],
  hikesMore: [
    { zone: "Sud-est", name: "Lion Mountain", prog: "Vieux Grand Port · 2 – 4 h", diff: "Difficile", note: "16,0", src: "AllTrails 4,5 · 131 avis · 4,8 km", from: ["1 h 02", "1 h 09"], see: "Sommet de 480 m en forme de lion couché, vue sur la baie de Grand Port", url: "https://www.alltrails.com/fr/randonnee/mauritius/grand-port/lion-s-mountain" },
    { zone: "Ouest", name: "Tourelle du Tamarin", prog: "au-dessus de Tamarin · ~2 h", diff: "Modérée", note: "15,5", src: "Visorando · 3,1 km · +432 m", from: ["7 min", "1 h 02"], see: "Courte montée au-dessus de la baie, superbe au coucher du soleil", warn: "Raide : +432 m sur 3 km", url: "https://www.visorando.com/randonnee-la-tourelle-du-tamarin/" },
    { zone: "Ouest", name: "Trois Mamelles", prog: "départ Cascavelle · ~3 h", diff: "Difficile · guide conseillé", note: "15,0", src: "AllTrails 4,4 · 89 avis · 4,5 km", from: ["25 min", "59 min"], see: "La silhouette emblématique vue depuis Tamarin, panorama", warn: "Peu balisé, dernière partie exposée", url: "https://www.alltrails.com/fr/randonnee/mauritius/plaines-wilhems/les-trois-mamelles" },
    { zone: "Gorges", name: "Sentier Macchabée", prog: "départ Le Pétrin · ~4 h", diff: "Modérée", note: "15,0", src: "AllTrails 4,4 · 110 avis · 8,9 km", from: ["39 min", "58 min"], see: "Immersion totale en forêt endémique, dans le calme", url: "https://www.alltrails.com/fr/randonnee/mauritius/riviere-noire/macchabee-view-point" },
    { zone: "Gorges", name: "Parakeet Trail", prog: "départ Le Pétrin · ~7h30", diff: "Très difficile", note: "15,5", src: "AllTrails 4,6 · 29 avis · 19,6 km", from: ["39 min", "58 min"], see: "Le sentier le plus exigeant et le plus récompensé de l'île ; perruche endémique de Maurice", warn: "Traversées de rivières, dénivelés importants, guide recommandé", url: "https://www.alltrails.com/fr/randonnee/mauritius/riviere-noire/machabee-parakeet-paille-en-queue-and-colophanne-trails" },
    { zone: "Nord", name: "Cascades de la Nicolière", prog: "réservoir de la Nicolière · ~25 min de marche", diff: "Modérée · guide obligatoire", note: "15,0", src: "AllTrails 4,1 · 34 avis · 4,3 km", from: ["55 min", "31 min"], see: "Sentier forestier non balisé vers des cascades secrètes", warn: "Pont en bois branlant", url: "https://www.alltrails.com/fr/randonnee/mauritius/moka/la-nicoliere-reservoir-to-pont-jamblon-bridge" }
  ],
  hikesNote: "Les plus votées par le groupe : la Tourelle du Tamarin (coucher de soleil, 2 h, à 10 min de la villa) et Lion Mountain (côté Mahébourg, à combiner avec Blue Bay). Le Parakeet Trail est une journée entière.",

  beaches: [
    { zone: "Sud-ouest", name: "Plage du Morne", from: ["21 min", "1 h 22"], note: "19,0", g: "4,6 · 2 679 avis", q: "Le Morne Public Beach", see: "Sable blanc, lagon turquoise et la montagne du Morne en toile de fond : la carte postale de l'île. Superbe en fin de journée pour le coucher de soleil. Kitesurfeurs d'un côté", warn: "Peu d'ombre sur la zone publique", img: "lemorne" },
    { zone: "Sud-ouest", name: "La Prairie — coucher de soleil", from: ["22 min", "1 h 24"], note: "18,5", g: "4,6 · 736 avis", q: "La Prairie Public Beach", see: "Plage publique sauvage, vue sur le Morne en ombre chinoise, quasiment vide en fin de journée. Apéro rhum sur la plage avec les copains" },
    { zone: "Est", name: "Belle Mare", from: ["1 h 14", "53 min"], note: "18,0", g: "4,5 · 1 685 avis", q: "Belle Mare Beach", see: "Plusieurs kilomètres de sable très fin, lagon calme, filaos pour l'ombre. Superbe au lever du soleil", warn: "Côte est souvent ventée l'après-midi, pas de coucher de soleil sur la mer" },
    { zone: "Sud-est", name: "La Cambuse", from: ["57 min", "1 h 03"], note: "17,5", g: "4,5 · 835 avis", q: "La Cambuse Public Beach", see: "Plage publique très peu fréquentée, sable doré, lagon plus brut. Pique-nique avec les locaux le dimanche. À 10 min de Blue Bay et de l'aéroport" },
    { zone: "Sud-est", name: "Pointe d'Esny", from: ["1 h 02", "1 h 08"], note: "17,5", g: "4,6 · 430 avis", q: "Pointe d'Esny Beach", see: "Une des plus belles plages publiques de l'île, accès par deux petits sentiers. Bien moins fréquentée que les plages d'hôtels. Snorkeling à Anse aux Aigrettes à côté" },
    { zone: "Sud", name: "Riambel", from: ["46 min", "1 h 15"], note: "17,5", g: "4,4 · 146 avis", q: "Riambel Plage Publique", see: "Immense étendue de sable blanc quasiment déserte, rare à Maurice. Pas d'hôtels. Vrai luxe de calme" },
    { zone: "Sud-est", name: "Blue Bay", from: ["58 min", "1 h 04"], note: "17,5", g: "4,5 · 4 281 avis", q: "Blue Bay Public Beach", see: "Petite plage au bord du parc marin, snorkeling directement depuis le sable dans un bleu irréel ; bateau à fond de verre pour le large", warn: "Bondée le week-end, parking difficile" },
    { zone: "Nord-ouest", name: "Trou aux Biches", from: ["1 h 01", "sur place"], note: "17,0", g: "4,5 · 754 avis", q: "Trou aux Biches Public Beach", see: "Eau turquoise très calme, récif proche pour le snorkeling, tortues devant le logement, beau coucher de soleil", warn: "Très construite par endroits" },
    { zone: "Nord-ouest", name: "Mont Choisy", from: ["1 h 02", "6 min"], note: "17,0", g: "4,6 · 3 691 avis", q: "Mon Choisy Public Beach", see: "Longue plage bordée de filaos, eau calme, plus paisible que Grand Baie", warn: "Snorkeling moyen, du monde le dimanche" },
    { zone: "Est", name: "Palmar", from: ["1 h 17", "58 min"], note: "16,5", g: "4,4 · 160 avis", q: "Palmar Public Beach", see: "Aussi belle que Belle Mare, plus calme et plus locale", warn: "Vent fréquent, herbiers par endroits" },
    { zone: "Sud", name: "Bassins naturels de Saint-Félix", from: ["43 min", "1 h 18"], note: "16,0", g: "4,5 · 936 avis", q: "St Felix Public Beach", see: "Bassins formés par la barrière de corail, baignade très sûre, protégée des courants. Connu des locaux, ignoré des touristes" },
    { zone: "Nord", name: "Pereybère", from: ["1 h 07", "17 min"], note: "16,0", g: "4,5 · 3 108 avis", q: "Pereybere Public Beach", see: "Petite crique à l'eau très claire, animée, snacks autour, snorkeling sur les côtés", warn: "Vite pleine, parking difficile" },
    { zone: "Ouest", name: "Flic-en-Flac", from: ["24 min", "56 min"], note: "16,0", g: "4,5 · 1 668 avis", q: "Plage de Flic en Flac", see: "Très longue plage avec un récif pour le snorkeling et de beaux couchers de soleil", warn: "Bondée et bruyante le dimanche, érosion par endroits", img: "flicenflac" },
    { zone: "Sud", name: "Baie du Jacotet", from: ["39 min", "1 h 20"], note: "15,5", g: "4,5 · 210 avis", q: "Baie du Jacotet", see: "Petite baie protégée, snorkeling correct, eau cristalline. Aucune installation : la serviette et le vent" },
    { zone: "Nord-est", name: "Poudre d'Or", from: ["1 h 08", "27 min"], note: "15,0", g: "3,8 · 11 avis", q: "Poudre d'Or Public Beach", see: "Accessible uniquement à pied ou en bateau. Sauvage, déserte, sable doré. Le village vaut le détour à vélo", warn: "Peu d'avis Google (3,8) — à prendre avec prudence" },
    { zone: "Sud", name: "Bel Ombre (Saint-Martin)", from: ["31 min", "1 h 27"], note: "15,0", g: "4,6 · 252 avis", q: "Bel Ombre Public Beach", see: "Plage publique sauvage bordée de filaos, lagon turquoise, pas d'hôtels" },
    { zone: "Sud", name: "Pomponette", from: ["45 min", "1 h 17"], note: "15,0", g: "4,6 · 134 avis", q: "Pomponette Public Beach", see: "Plage publique sauvage du Sud, longue et peu fréquentée, à côté de Riambel. Filaos, sable clair", warn: "Mer parfois agitée : plus pour la balade que la baignade" }
  ],
  beachesNote: "Coucher de soleil : toute la côte ouest (Le Morne, La Prairie, Flic-en-Flac, Trou aux Biches). Snorkeling depuis le sable : Blue Bay, Trou aux Biches, Pereybère. Calme absolu : Riambel, Cambuse, Pointe d'Esny, Jacotet. Les plages du sud sont à 30-45 min de Rivière Noire mais à plus d'1 h 15 de Trou aux Biches : à faire la première semaine.",

  emergency: [
    ["Urgences — police", "999", "999"], ["SAMU", "114", "114"], ["Pompiers", "115", "115"],
    ["Ambassade de France · Port-Louis", "+230 202 0100", "+2302020100"],
    ["Clinique Darné · Floréal (privée)", "+230 601 2300", "+2306012300"],
    ["Wellkin Hospital · Moka (privé)", "+230 605 1000", "+2306051000"]
  ],
  emergencyNote: "Les numéros des cliniques et de l'ambassade sont des standards : les vérifier une fois avant le départ, et enregistrer tous les contacts dans le téléphone.",
  contacts: [
    ["JPH · dauphins, catamaran, pêche", "+230 5729 0901", "+23057290901", "+230 5727 6188 · bureau +230 483 50 60"],
    ["Baba Cool · Sophie", "+230 5723 4134", "+23057234134"],
    ["Nemo Speed Boat · Kenza", "+230 5753 9671", "+23057539671", "Jérôme +230 5771 7917"],
    ["Exploration Sous-Marine · plongée", "+230 5728 9127", "+23057289127"],
    ["Trekking Mauritius · Yanature", "+230 5251 4050", "+23052514050", "WhatsApp"]
  ],

  lexicon: [
    ["Bonjour", "Bonzour"], ["Comment ça va ?", "Ki manyer ?"], ["Merci beaucoup", "Mersi boukou"], ["S'il vous plaît", "Silvouple"],
    ["Oui / non", "Wi / non"], ["Au revoir", "Orevwar · Salam"], ["Combien ça coûte ?", "Komie sa ?"], ["C'est trop cher", "Li tro ser"],
    ["Je ne comprends pas", "Mo pa konpran"], ["Où est… ?", "Kot… ?"], ["Quelle heure est-il ?", "Ki ler ?"], ["Aujourd'hui / demain", "Zordi / dime"],
    ["Manger / boire", "Manze / bwar"], ["L'eau", "Dilo"], ["La mer / la plage", "Lamer / laplaz"], ["C'est bon !", "Li bon !"],
    ["D'accord, ça marche", "Korek"], ["Attention !", "Atansion !"], ["Allons-y", "Anou ale"], ["Doucement", "Dousman"],
    ["Bienvenue", "Bienvini"], ["Bon voyage", "Bon vwayaz"]
  ],
  lexiconNote: "Le créole se prononce comme il s'écrit. Un « bonzour » et un « mersi » ouvrent toutes les portes.",

  food: [
    ["Entrées & street food", [["Dholl puri", "galette de pois cassés roulée avec cari gros pois, rougaille et chatini — le plat national, 30 Rs"], ["Roti chaud / farata", "galette de blé feuilletée, même garniture"], ["Gâteau piment", "beignet de pois cassés au piment, à toute heure"], ["Samoussa", "triangle frit, légumes ou poulet"], ["Boulettes", "dim sum en bouillon, Chinatown à Port-Louis"], ["Salade de palmiste", "cœur de palmier frais, le « caviar » local"]]],
    ["Plats", [["Mine frit", "nouilles sautées sino-mauriciennes, œuf et poulet"], ["Bol renversé", "riz, œuf au plat, poulet et chou, démoulé à l'envers"], ["Briani", "riz parfumé aux épices, poulet, bœuf ou poisson — plat de fête"], ["Vindaye de poisson", "poisson mariné au curcuma, moutarde et oignons"], ["Rougaille", "sauce tomate-oignons-piment, avec saucisses ou poisson salé"], ["Cari ourite", "cari de poulpe, spécialité de la côte"]]],
    ["Desserts", [["Gato patate", "beignet de patate douce à la coco"], ["Napolitaine", "biscuit sablé fourré à la confiture, glaçage rose"], ["Gato sucre", "petits gâteaux sucrés des marchés (foire de Mahébourg)"], ["Biscuits manioc Rault", "cuits au feu de bois depuis 1870, Mahébourg"]]],
    ["Boissons", [["Alouda", "lait, graines de basilic, agar et vanille — glacée, au marché"], ["Fangourin", "jus de canne pressé, à la foire"], ["Phoenix", "la bière locale"], ["Rhum arrangé", "rhum macéré aux fruits et épices, à goûter à Chamarel"], ["Thé à la vanille", "Bois Chéri, avec un peu de lait"]]]
  ],
  foodNote: "Où : le marché central de Port-Louis (jeudi 12), la foire de Mahébourg (lundi 16), les tables d'hôte (La Karaye, Escale Créole), et n'importe quel snack au bord de la route.",

  cash: [
    ["Vanill'Art", "10 nov", "1 500 Rs × 9 pers.", 13500, "3 000 Rs (2 pers.)"],
    ["Baptême de plongée", "11 nov", "3 500 Rs × 5 pers. (+ 3 500 Rs si la 6ᵉ plonge)", 17500, "7 000 Rs (2 pers.)"],
    ["Pêche au gros, solde", "12 nov", "≈ 3 370 Rs (64 €) × 3 pers.", 10110, "3 370 Rs (1 pers.)"],
    ["Catamaran Baba Cool", "13 nov", "bateau privatisé, partagé à 9", 33000, "7 333 Rs (2/9)"],
    ["Speedboat Nemo", "18 nov", "bateau privatisé, à deux", 14000, "14 000 Rs"]
  ],
  cashTotals: { group: "88 110 Rs", groupEur: "≈ 1 670 € — à retirer sur plusieurs jours et plusieurs cartes", two: "34 703 Rs", twoEur: "≈ 660 € — dont 14 000 Rs pour le speedboat du 18" },
  cashNote: "Le catamaran Baba Cool (33 000 Rs, cash uniquement) se paie le vendredi 13 au matin : commencer les retraits dès le lundi 9.",

  tools: [
    ["Notre carte My Maps", "https://www.google.com/maps/d/viewer?mid=1RhQ4FVlUXNC8P6KobCM-dG9PTquyISs&ll=-20.1986872370166%2C57.55840500000003&z=10", "Les lieux du voyage, dans Google Maps"],
    ["Full map activités", "https://www.google.com/maps/d/viewer?mid=1Y5YQjjZWqRUFBGjXIc7WNzUTbYlt1k8&ll=-20.20193122200105%2C57.55964340000002&z=10", "Toutes les activités repérées sur l'île"],
    ["Tricount du groupe", "https://tricount.com/tCAWMsJIjREvpRsXwq", "tricount.com/tCAWMsJIjREvpRsXwq"],
    ["Notre fichier d'activités (Google Sheets)", "https://docs.google.com/spreadsheets/d/1gLke_STZEBhsg7DzVOlgpgxQUh5tD4pWSiO6p80Ckz4/edit?usp=drivesdk", "Mauritius_activities — plages, randos, restos, votes"]
  ],

  toCheck: [
    "Horaire du catamaran JPH du lundi 9 à confirmer.",
    "Doublon dauphins : la sortie du dimanche 8 et le catamaran JPH du lundi 9 incluent tous les deux les dauphins — demander à JPH de remplacer cette partie par plus de snorkeling ou un départ plus tardif.",
    "La date de départ de Chloé n'est pas indiquée dans le planning.",
    "Trou aux Biches : convenir avec l'hôte du dépôt des bagages lundi 16 vers 9h et du départ samedi 21 vers 7h30 (hors fenêtres officielles).",
    "Plongée le 11 : 5 jours avant les vols du 16, la règle des 24 h sans avion est respectée.",
    "Lundi 16 : le groupe rejoint l'aéroport avec les deux autres voitures, à rendre à Pingouin Car Rental.",
    "La Tourelle du Tamarin n'a plus de créneau : seule possibilité restante, le dimanche 15 à 5h15 avant Gris-Gris.",
    "Temps de trajet indicatifs ; vérifier les horaires d'ouverture de Bois Chéri le samedi, de l'Aventure du Sucre le mercredi après-midi et du marché de Port-Louis le jeudi après-midi.",
    "Créer la My Maps de l'île Maurice (logements, activités, restos, plages) et la partager au groupe."
  ],

  outro: { title: "Mo kontan Moris", text: "Que le lagon reste calme, le rhum arrangé bien dosé, et le soleil toujours au rendez-vous à 18h15.", proverb: "« Tipa tipa, nou ariv. »", proverbTr: "petit à petit, on y arrive · dicton créole" }
};
