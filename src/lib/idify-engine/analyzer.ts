export type ProjectAnalysis = {
  summary: string;
  problem: string;
  solution: string;
  customers: string[];
  valueProposition: string;
  market: string;
  competition: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  maturityScore: number;
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectLocation(text: string): string | null {
  const locations: Record<string, string> = {
    lome: "Lomé",
    togo: "Togo",
    cotonou: "Cotonou",
    benin: "Bénin",
    abidjan: "Abidjan",
    "cote d'ivoire": "Côte d'Ivoire",
    "cote d ivoire": "Côte d'Ivoire",
    dakar: "Dakar",
    senegal: "Sénégal",
    bamako: "Bamako",
    mali: "Mali",
    ouagadougou: "Ouagadougou",
    burkina: "Burkina Faso",
    paris: "Paris",
    france: "France",
  };

  for (const [keyword, location] of Object.entries(locations)) {
    if (text.includes(keyword)) {
      return location;
    }
  }

  return null;
}

function detectSector(text: string): string {
  /*
   * IMPORTANT :
   * Les secteurs spécifiques sont détectés avant les termes
   * génériques comme "boutique".
   */

  // ALIMENTATION ET BOISSONS
  if (
    containsAny(text, [
      "jus",
      "boisson",
      "boissons",
      "restaurant",
      "nourriture",
      "repas",
      "plat",
      "plats",
      "cuisine",
      "traiteur",
      "food",
      "snack",
      "fast food",
      "patisserie",
      "gateau",
      "gateaux",
      "boulangerie",
      "pizza",
      "sandwich",
      "glace",
      "glaces",
      "yaourt",
      "yogourt",
      "smoothie",
      "cafe",
      "cafeteria",
    ])
  ) {
    return "Alimentation et boissons";
  }

  // MODE ET HABILLEMENT
  if (
    containsAny(text, [
      "vetement",
      "vetements",
      "habit",
      "habits",
      "mode",
      "fashion",
      "robe",
      "robes",
      "chemise",
      "chemises",
      "pantalon",
      "pantalons",
      "jupe",
      "jupes",
      "chaussure",
      "chaussures",
      "friperie",
      "tenue",
      "tenues",
      "tshirt",
      "t-shirt",
      "tee shirt",
      "costume",
      "costumes",
      "veste",
      "vestes",
      "streetwear",
      "habillement",
    ])
  ) {
    return "Mode et habillement";
  }

  // BEAUTÉ ET SOINS
  if (
    containsAny(text, [
      "coiffure",
      "coiffeur",
      "coiffeuse",
      "beaute",
      "esthetique",
      "maquillage",
      "cosmetique",
      "cosmetiques",
      "ongle",
      "ongles",
      "salon de beaute",
      "barbier",
      "parfum",
      "parfums",
      "skincare",
      "soins de peau",
      "cheveux",
      "perruque",
      "perruques",
    ])
  ) {
    return "Beauté et soins";
  }

  // TECHNOLOGIE ET NUMÉRIQUE
  if (
    containsAny(text, [
      "application",
      "app mobile",
      "site web",
      "site internet",
      "saas",
      "plateforme",
      "logiciel",
      "intelligence artificielle",
      "ia",
      "application mobile",
      "technologie",
      "digital",
      "numerique",
      "informatique",
      "cybersecurite",
      "cybersecurite",
      "api",
      "logiciels",
    ])
  ) {
    return "Technologie et numérique";
  }

  // ÉDUCATION
  if (
    containsAny(text, [
      "formation",
      "formations",
      "cours",
      "education",
      "educatif",
      "educative",
      "ecole",
      "école",
      "apprentissage",
      "formation en ligne",
      "coaching",
      "tutorat",
      "universite",
      "université",
    ])
  ) {
    return "Éducation et formation";
  }

  // TRANSPORT ET LOGISTIQUE
  if (
    containsAny(text, [
      "livraison",
      "transport",
      "logistique",
      "coursier",
      "livreur",
      "livraison a domicile",
      "expedition",
      "moto taxi",
      "taxi",
      "vtc",
      "deménagement",
      "demenagement",
    ])
  ) {
    return "Transport et logistique";
  }

  // AGRICULTURE
  if (
    containsAny(text, [
      "agriculture",
      "agricole",
      "ferme",
      "elevage",
      "production agricole",
      "maraichage",
      "maraichage",
      "peche",
      "pêche",
      "volaille",
      "aviculture",
      "porc",
      "porcs",
      "bétail",
      "betail",
      "semence",
      "semences",
    ])
  ) {
    return "Agriculture et élevage";
  }

  // COMMERCE GÉNÉRAL
  // "boutique" n'est plus considéré comme synonyme de vêtements.
  if (
    containsAny(text, [
      "boutique",
      "commerce",
      "magasin",
      "vente",
      "vendre",
      "produits",
      "distribution",
      "supermarche",
      "supermarché",
    ])
  ) {
    return "Commerce et services";
  }

  return "Commerce et services";
}

function detectCustomers(
  text: string,
  sector: string
): string[] {
  /*
   * MODE ET HABILLEMENT
   */
  if (sector === "Mode et habillement") {
    const customers: string[] = [];

    if (
      containsAny(text, [
        "femme",
        "femmes",
        "feminine",
        "feminin",
        "dame",
        "dames",
        "filles",
      ])
    ) {
      customers.push("Femmes et jeunes femmes");
    }

    if (
      containsAny(text, [
        "homme",
        "hommes",
        "masculin",
        "masculine",
        "garcon",
        "garçons",
      ])
    ) {
      customers.push("Hommes et jeunes hommes");
    }

    if (
      containsAny(text, [
        "enfant",
        "enfants",
        "bebe",
        "bébé",
        "fille",
        "garcon",
        "garçons",
      ])
    ) {
      customers.push(
        "Parents recherchant des vêtements pour enfants"
      );
    }

    if (
      containsAny(text, [
        "jeune",
        "jeunes",
        "etudiant",
        "étudiant",
        "etudiants",
        "étudiants",
        "tendance",
        "streetwear",
        "urbain",
      ])
    ) {
      customers.push("Jeunes et étudiants");
    }

    if (
      containsAny(text, [
        "luxe",
        "premium",
        "haut de gamme",
        "prestige",
      ])
    ) {
      customers.push(
        "Clients recherchant des vêtements premium"
      );
    }

    if (
      containsAny(text, [
        "sport",
        "sportif",
        "sportswear",
        "football",
        "gym",
      ])
    ) {
      customers.push(
        "Personnes intéressées par les vêtements de sport"
      );
    }

    if (customers.length > 0) {
      return [...new Set(customers)];
    }

    return [
      "Femmes et hommes à la recherche de vêtements",
      "Jeunes adultes intéressés par la mode",
      "Clients recherchant des vêtements tendance et accessibles",
    ];
  }

  /*
   * ALIMENTATION
   */
  if (sector === "Alimentation et boissons") {
    if (
      containsAny(text, [
        "restaurant",
        "repas",
        "plat",
        "plats",
        "fast food",
        "snack",
      ])
    ) {
      return [
        "Particuliers recherchant des repas prêts à consommer",
        "Jeunes actifs",
        "Étudiants",
        "Familles",
      ];
    }

    if (
      containsAny(text, [
        "jus",
        "boisson",
        "boissons",
        "smoothie",
      ])
    ) {
      return [
        "Particuliers recherchant des boissons naturelles",
        "Jeunes adultes",
        "Familles",
        "Clients sensibles à une alimentation plus naturelle",
      ];
    }

    return [
      "Particuliers",
      "Familles",
      "Jeunes adultes",
      "Clients recherchant des produits alimentaires accessibles",
    ];
  }

  /*
   * TECHNOLOGIE
   */
  if (sector === "Technologie et numérique") {
    if (
      containsAny(text, [
        "entreprise",
        "entreprises",
        "professionnel",
        "professionnels",
        "b2b",
        "startup",
        "commerce",
      ])
    ) {
      return [
        "Entreprises et professionnels",
        "Startups et entrepreneurs",
        "PME",
      ];
    }

    if (
      containsAny(text, [
        "etudiant",
        "étudiant",
        "particulier",
        "utilisateur",
        "jeune",
      ])
    ) {
      return [
        "Particuliers",
        "Étudiants",
        "Jeunes utilisateurs",
      ];
    }

    return [
      "Entrepreneurs et indépendants",
      "PME et petites entreprises",
      "Utilisateurs recherchant une solution numérique simple",
    ];
  }

  /*
   * ÉDUCATION
   */
  if (sector === "Éducation et formation") {
    if (
      containsAny(text, [
        "enfant",
        "enfants",
        "eleve",
        "élève",
        "scolaire",
        "ecole",
        "école",
      ])
    ) {
      return [
        "Parents d'enfants scolarisés",
        "Élèves et étudiants",
        "Établissements éducatifs",
      ];
    }

    return [
      "Étudiants et apprenants",
      "Jeunes professionnels",
      "Personnes souhaitant développer leurs compétences",
    ];
  }

  /*
   * BEAUTÉ
   */
  if (sector === "Beauté et soins") {
    if (
      containsAny(text, [
        "barbier",
        "homme",
        "hommes",
        "masculin",
      ])
    ) {
      return [
        "Hommes et jeunes hommes",
        "Clients recherchant des services de coiffure et de soins",
      ];
    }

    return [
      "Femmes et jeunes femmes",
      "Clients intéressés par les soins et la beauté",
      "Jeunes adultes",
    ];
  }

  /*
   * TRANSPORT
   */
  if (sector === "Transport et logistique") {
    return [
      "Particuliers ayant besoin de transport ou livraison",
      "Commerçants",
      "Entreprises ayant des besoins logistiques",
    ];
  }

  /*
   * AGRICULTURE
   */
  if (sector === "Agriculture et élevage") {
    return [
      "Ménages recherchant des produits agricoles",
      "Restaurants et commerces alimentaires",
      "Revendeurs et distributeurs",
    ];
  }

  /*
   * COMMERCE / SERVICES
   */
  if (
    containsAny(text, [
      "entreprise",
      "entreprises",
      "professionnel",
      "professionnels",
      "b2b",
      "pme",
    ])
  ) {
    return [
      "Entreprises et professionnels",
      "PME et entrepreneurs",
      "Indépendants",
    ];
  }

  return [
    "Particuliers intéressés par la solution",
    "Jeunes adultes",
    "Clients recherchant une offre accessible",
  ];
}

function generateOpportunities(
  text: string,
  sector: string
): string[] {
  if (sector === "Mode et habillement") {
    return [
      "Développer une présence forte sur Instagram, TikTok et WhatsApp.",
      "Proposer des collections adaptées aux goûts et au pouvoir d'achat local.",
      "Créer des offres promotionnelles et des ventes en quantité limitée.",
      "Utiliser les photos et vidéos pour présenter les produits.",
      "Mettre en place une commande simple par WhatsApp ou via un site.",
    ];
  }

  if (sector === "Alimentation et boissons") {
    return [
      "Développer les commandes via WhatsApp et les réseaux sociaux.",
      "Créer des formules adaptées aux différents budgets.",
      "Développer la livraison locale.",
      "Fidéliser les clients avec des offres récurrentes.",
    ];
  }

  if (sector === "Technologie et numérique") {
    return [
      "Automatiser une partie du parcours utilisateur.",
      "Développer une acquisition via les réseaux sociaux.",
      "Proposer une période d'essai ou une offre d'entrée accessible.",
      "Créer progressivement des fonctionnalités premium.",
    ];
  }

  if (sector === "Beauté et soins") {
    return [
      "Développer une présence sur Instagram, TikTok et WhatsApp.",
      "Présenter clairement les prestations ou produits proposés.",
      "Créer des offres adaptées aux différents budgets.",
      "Fidéliser les clients avec des offres récurrentes.",
    ];
  }

  if (sector === "Éducation et formation") {
    return [
      "Développer une présence digitale auprès des apprenants.",
      "Créer des contenus gratuits pour démontrer l'expertise.",
      "Proposer plusieurs formats d'apprentissage.",
      "Développer progressivement des offres premium.",
    ];
  }

  if (sector === "Transport et logistique") {
    return [
      "Développer les commandes ou réservations via WhatsApp.",
      "Commencer avec une zone géographique maîtrisable.",
      "Créer des formules adaptées aux différents besoins.",
      "Fidéliser les clients professionnels et particuliers.",
    ];
  }

  if (sector === "Agriculture et élevage") {
    return [
      "Développer une clientèle locale régulière.",
      "Créer des partenariats avec restaurants et commerces.",
      "Valoriser la qualité et l'origine des produits.",
      "Développer progressivement la distribution.",
    ];
  }

  return [
    "Commencer avec une offre simple et facilement compréhensible.",
    "Utiliser les réseaux sociaux pour tester rapidement le marché.",
    "Collecter les retours des premiers clients.",
    "Améliorer progressivement l'offre selon les besoins observés.",
  ];
}

function generateRisks(
  text: string,
  sector: string
): string[] {
  if (sector === "Mode et habillement") {
    return [
      "Forte concurrence entre boutiques et vendeurs en ligne.",
      "Risque d'immobiliser de l'argent dans des stocks difficiles à vendre.",
      "Évolution rapide des tendances et préférences des clients.",
      "Besoin de photos et contenus de qualité pour vendre en ligne.",
      "Gestion des tailles, couleurs et disponibilités.",
    ];
  }

  if (sector === "Alimentation et boissons") {
    return [
      "Coût et disponibilité variables des matières premières.",
      "Concurrence locale importante.",
      "Nécessité de maintenir une qualité constante.",
      "Gestion des livraisons et de la conservation des produits.",
    ];
  }

  if (sector === "Technologie et numérique") {
    return [
      "Concurrence importante sur les solutions numériques.",
      "Coût potentiel du développement et de la maintenance.",
      "Nécessité d'offrir une expérience utilisateur simple.",
      "Acquisition des premiers utilisateurs.",
    ];
  }

  if (sector === "Beauté et soins") {
    return [
      "Concurrence locale importante.",
      "Nécessité de maintenir une qualité constante.",
      "Importance de la confiance et de la réputation.",
      "Acquisition et fidélisation des premiers clients.",
    ];
  }

  if (sector === "Éducation et formation") {
    return [
      "Concurrence entre les différentes offres de formation.",
      "Nécessité de maintenir la qualité des contenus.",
      "Difficulté potentielle à attirer les premiers apprenants.",
      "Besoin d'adapter régulièrement les contenus.",
    ];
  }

  if (sector === "Transport et logistique") {
    return [
      "Coûts opérationnels variables.",
      "Gestion des retards et incidents.",
      "Concurrence locale.",
      "Nécessité de maintenir une qualité de service constante.",
    ];
  }

  if (sector === "Agriculture et élevage") {
    return [
      "Variation de la production selon les saisons.",
      "Variation possible des coûts de production.",
      "Gestion du stockage et de la distribution.",
      "Dépendance aux conditions de production.",
    ];
  }

  return [
    "Concurrence sur le marché.",
    "Difficulté potentielle à obtenir les premiers clients.",
    "Besoin de tester l'offre avant d'investir fortement.",
    "Évolution possible des besoins des clients.",
  ];
}

function generateRecommendations(
  text: string,
  sector: string
): string[] {
  if (sector === "Mode et habillement") {
    return [
      "Commencer avec une collection réduite afin de limiter le risque lié au stock.",
      "Identifier précisément le style et la gamme de prix recherchés par les clients.",
      "Créer régulièrement du contenu photo et vidéo des produits.",
      "Utiliser WhatsApp Business pour faciliter les commandes.",
      "Tester plusieurs produits avant d'augmenter les volumes d'achat.",
    ];
  }

  if (sector === "Alimentation et boissons") {
    return [
      "Tester les produits auprès d'un petit groupe de clients.",
      "Calculer précisément le coût de revient de chaque produit.",
      "Définir une zone de livraison réaliste.",
      "Créer une présence régulière sur les réseaux sociaux.",
    ];
  }

  if (sector === "Technologie et numérique") {
    return [
      "Commencer par une version simple du produit.",
      "Identifier le problème principal avant d'ajouter trop de fonctionnalités.",
      "Faire tester le produit par les premiers utilisateurs.",
      "Mesurer les usages et améliorer progressivement l'expérience.",
    ];
  }

  if (sector === "Beauté et soins") {
    return [
      "Identifier précisément les besoins des clients ciblés.",
      "Commencer avec une gamme de prestations ou produits maîtrisable.",
      "Créer régulièrement du contenu de démonstration.",
      "Utiliser WhatsApp Business pour faciliter les prises de contact.",
    ];
  }

  if (sector === "Éducation et formation") {
    return [
      "Identifier précisément le niveau et les besoins des apprenants.",
      "Commencer avec un programme simple et ciblé.",
      "Tester les contenus auprès des premiers apprenants.",
      "Améliorer progressivement l'offre grâce aux retours.",
    ];
  }

  if (sector === "Transport et logistique") {
    return [
      "Commencer avec une zone géographique réaliste.",
      "Calculer précisément les coûts opérationnels.",
      "Définir clairement les délais et conditions du service.",
      "Tester le service auprès des premiers clients.",
    ];
  }

  if (sector === "Agriculture et élevage") {
    return [
      "Identifier les produits ayant la demande la plus régulière.",
      "Calculer précisément les coûts de production.",
      "Créer des relations avec des acheteurs réguliers.",
      "Planifier la production selon la demande.",
    ];
  }

  return [
    "Valider le besoin auprès de clients potentiels.",
    "Commencer avec une offre simple.",
    "Tester le prix avant d'investir fortement.",
    "Créer une présence digitale adaptée à la cible.",
    "Recueillir les retours des premiers clients.",
  ];
}

function calculateMaturity(text: string): number {
  let score = 20;

  if (text.length > 80) score += 10;
  if (text.length > 150) score += 10;

  if (
    containsAny(text, [
      "client",
      "clients",
      "cible",
      "femme",
      "femmes",
      "homme",
      "hommes",
      "etudiant",
      "étudiant",
      "entreprise",
      "entreprises",
    ])
  ) {
    score += 15;
  }

  if (
    containsAny(text, [
      "prix",
      "fcfa",
      "cout",
      "coût",
      "budget",
      "vente",
      "vendre",
      "revenu",
    ])
  ) {
    score += 15;
  }

  if (
    containsAny(text, [
      "lome",
      "lomé",
      "togo",
      "cotonou",
      "benin",
      "abidjan",
      "dakar",
    ])
  ) {
    score += 10;
  }

  if (
    containsAny(text, [
      "site",
      "application",
      "instagram",
      "facebook",
      "tiktok",
      "whatsapp",
    ])
  ) {
    score += 10;
  }

  return Math.min(score, 100);
}

export function analyzeProject(
  name: string,
  idea: string
): ProjectAnalysis {
  const text = normalizeText(`${name} ${idea}`);

  const location = detectLocation(text);
  const sector = detectSector(text);
  const customers = detectCustomers(text, sector);

  const locationText = location
    ? `à ${location}`
    : "sur son marché local";

  const summary =
    `${name} est un projet dans le secteur ${sector.toLowerCase()} ` +
    `${locationText}. ` +
    `L'idée consiste à développer une offre répondant à un besoin identifié ` +
    `auprès d'une clientèle spécifique.`;

  const problem =
    `Les clients ciblés peuvent rencontrer des difficultés à trouver ` +
    `une offre suffisamment adaptée à leurs besoins, leur budget ` +
    `ou leurs habitudes d'achat. Le besoin exact devra être validé ` +
    `avec des clients potentiels.`;

  const solution =
    `${name} propose une solution structurée autour du secteur ` +
    `${sector.toLowerCase()}, avec une attention particulière portée ` +
    `à la simplicité de l'offre, à l'expérience client et à l'accessibilité.`;

  const valueProposition =
    `Proposer une offre claire et accessible permettant aux clients ` +
    `de répondre plus facilement à leur besoin grâce à une expérience ` +
    `simple, pratique et adaptée au marché ciblé.`;

  const market =
    `Le marché potentiel dépend principalement de la taille de la clientèle ` +
    `ciblée, du pouvoir d'achat, de la concurrence et des habitudes de consommation. ` +
    `Pour ${sector.toLowerCase()}, une validation locale du marché permettra ` +
    `d'estimer plus précisément la demande.`;

  const competition = [
    "Acteurs locaux déjà établis.",
    "Vendeurs indépendants et petites entreprises.",
    "Solutions alternatives proposées directement par les clients ou concurrents.",
  ];

  return {
    summary,
    problem,
    solution,
    customers,
    valueProposition,
    market,
    competition,
    opportunities: generateOpportunities(text, sector),
    risks: generateRisks(text, sector),
    recommendations: generateRecommendations(text, sector),
    maturityScore: calculateMaturity(text),
  };
}

export function formatAnalysis(
  name: string,
  idea: string
): string {
  const analysis = analyzeProject(name, idea);

  return [
    `ANALYSE DU PROJET`,
    ``,
    `Résumé`,
    analysis.summary,
    ``,
    `Problème identifié`,
    analysis.problem,
    ``,
    `Solution`,
    analysis.solution,
    ``,
    `Clients cibles`,
    ...analysis.customers.map(
      (customer) => `• ${customer}`
    ),
    ``,
    `Proposition de valeur`,
    analysis.valueProposition,
    ``,
    `Marché`,
    analysis.market,
    ``,
    `Concurrence`,
    ...analysis.competition.map(
      (item) => `• ${item}`
    ),
    ``,
    `Opportunités`,
    ...analysis.opportunities.map(
      (item) => `• ${item}`
    ),
    ``,
    `Risques`,
    ...analysis.risks.map(
      (item) => `• ${item}`
    ),
    ``,
    `Recommandations`,
    ...analysis.recommendations.map(
      (item) => `• ${item}`
    ),
    ``,
    `Maturité estimée du projet`,
    `${analysis.maturityScore}/100`,
  ].join("\n");
}