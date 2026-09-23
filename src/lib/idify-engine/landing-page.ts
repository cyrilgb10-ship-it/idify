import { analyzeProject } from "./analyzer";
import { generatePositioning } from "./positioning";

export type LandingPageData = {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  problem: {
    title: string;
    content: string;
  };
  solution: {
    title: string;
    content: string;
    benefits: string[];
  };
  offer: {
    title: string;
    content: string;
    items: string[];
  };
  pricing: {
    title: string;
    content: string;
    plans: string[];
  };
  socialProof: {
    title: string;
    content: string;
  };
  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  contact: {
    title: string;
    content: string;
    cta: string;
  };
  footer: string;
};

function clean(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();
}

function normalizeText(value: string): string {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function firstSentence(value: string): string {
  const cleaned = clean(value);

  if (!cleaned) {
    return "";
  }

  const match = cleaned.match(/^(.+?[.!?])(?:\s|$)/);

  return match ? match[1] : cleaned;
}

/**
 * Détection du secteur.
 *
 * IMPORTANT :
 * "boutique" n'est jamais considéré comme synonyme de vêtements.
 *
 * Exemple :
 * - boutique de vêtements -> mode
 * - boutique de chaussures -> mode
 * - boutique de jus -> alimentation
 * - boutique de cosmétiques -> beauté
 * - boutique informatique -> technologie
 * - boutique agricole -> agriculture
 * - boutique seule -> service / commerce
 */
function detectSector(idea: string): string {
  const text = normalizeText(idea);

  // ALIMENTATION ET BOISSONS
  if (
    /jus|boisson|boissons|restaurant|restauration|nourriture|repas|plat|plats|cuisine|traiteur|food|snack|fast food|patisserie|gateau|gateaux|boulangerie|pizza|sandwich|glace|glaces|yaourt|yogourt|smoothie|cafe|cafeteria/.test(
      text
    )
  ) {
    return "alimentation";
  }

  // MODE ET HABILLEMENT
  if (
    /vetement|vetements|habit|habits|mode|fashion|robe|robes|pantalon|pantalons|chaussure|chaussures|chemise|chemises|jupe|jupes|friperie|tenue|tenues|tshirt|t-shirt|tee shirt|costume|costumes|veste|vestes|streetwear|habillement/.test(
      text
    )
  ) {
    return "mode";
  }

  // BEAUTÉ ET SOINS
  if (
    /coiffure|coiffeur|coiffeuse|beaute|esthetique|maquillage|cosmetique|cosmetiques|ongle|ongles|salon de beaute|barbier|parfum|parfums|skincare|soins de peau|cheveux|perruque|perruques/.test(
      text
    )
  ) {
    return "beauté";
  }

  // ÉDUCATION ET FORMATION
  if (
    /ecole|formation|formations|cours|education|enseignement|educatif|educative|apprentissage|universite|coaching|tutorat|formation en ligne/.test(
      text
    )
  ) {
    return "éducation";
  }

  // TECHNOLOGIE ET NUMÉRIQUE
  if (
    /application|app mobile|application mobile|logiciel|logiciels|saas|site web|site internet|plateforme|informatique|technologie|tech|ia|intelligence artificielle|digital|numerique|cybersecurite|api/.test(
      text
    )
  ) {
    return "technologie";
  }

  // TRANSPORT ET LOGISTIQUE
  if (
    /transport|livraison|livreur|coursier|moto taxi|taxi|vtc|voiture|logistique|expedition|demenagement/.test(
      text
    )
  ) {
    return "transport";
  }

  // AGRICULTURE ET ÉLEVAGE
  if (
    /agriculture|agricole|ferme|elevage|production agricole|maraichage|peche|production animale|aviculture|volaille|betail|semence|semences/.test(
      text
    )
  ) {
    return "agriculture";
  }

  // COMMERCE GÉNÉRAL / SERVICES
  //
  // Une "boutique" sans précision sectorielle
  // reste un commerce général.
  return "service";
}

function getSectorContent(
  sector: string,
  targetCustomer: string
) {
  switch (sector) {
    case "mode":
      return {
        problem:
          `Les clients veulent trouver des vêtements qui correspondent réellement à leur style, leur budget et leur quotidien. ${targetCustomer} ont besoin d'une offre claire, attractive et facile à découvrir.`,
        solution:
          "Une expérience mode pensée autour des besoins réels des clients, avec une sélection cohérente, des informations claires et une présentation qui facilite la décision d'achat.",
        benefits: [
          "Une sélection adaptée au public cible",
          "Des offres présentées de manière claire et attractive",
          "Une expérience simple pour découvrir et commander",
        ],
        offer:
          "Une offre de vêtements construite autour du style, du budget et des attentes de la clientèle cible.",
        offerItems: [
          "Collection principale",
          "Sélections et nouveautés",
          "Offres promotionnelles",
          "Conseils pour choisir les produits",
        ],
      };

    case "alimentation":
      return {
        problem:
          `Les clients recherchent des produits alimentaires ou des boissons bons, accessibles et faciles à commander. ${targetCustomer} veulent pouvoir identifier rapidement ce qui correspond à leurs envies et à leur budget.`,
        solution:
          "Une offre alimentaire claire et attractive qui met en avant les produits, leur qualité, leur fraîcheur et la simplicité de commande.",
        benefits: [
          "Une offre facile à comprendre",
          "Des produits présentés de façon attractive",
          "Une commande simple et pratique",
        ],
        offer:
          "Une sélection de produits alimentaires ou de boissons conçue pour répondre aux habitudes et aux besoins de la clientèle cible.",
        offerItems: [
          "Produits principaux",
          "Menus ou formules",
          "Offres spéciales",
          "Commandes et livraison selon le modèle choisi",
        ],
      };

    case "beauté":
      return {
        problem:
          `Les clients recherchent des services ou produits de beauté qui correspondent à leurs besoins et leur permettent d'obtenir un résultat satisfaisant. ${targetCustomer} ont besoin d'une offre rassurante et facile à comprendre.`,
        solution:
          "Une expérience beauté centrée sur les besoins du client, avec des prestations ou produits clairement présentés et une communication qui inspire confiance.",
        benefits: [
          "Des prestations ou produits clairement expliqués",
          "Une expérience pensée pour le client",
          "Une prise de contact simple",
        ],
        offer:
          "Une gamme de services ou produits beauté adaptée aux attentes de la clientèle cible.",
        offerItems: [
          "Prestations ou produits principaux",
          "Formules adaptées",
          "Offres découvertes",
          "Conseils et accompagnement",
        ],
      };

    case "éducation":
      return {
        problem:
          `Les apprenants ont besoin de contenus accessibles, structurés et adaptés à leur niveau. ${targetCustomer} recherchent une solution qui leur permet de progresser de manière concrète.`,
        solution:
          "Une expérience d'apprentissage structurée autour d'objectifs clairs, de contenus utiles et d'un accompagnement adapté.",
        benefits: [
          "Des contenus organisés par objectif",
          "Une progression claire",
          "Des ressources adaptées aux apprenants",
        ],
        offer:
          "Une offre de formation construite autour des compétences et résultats recherchés par la clientèle cible.",
        offerItems: [
          "Modules de formation",
          "Ressources pédagogiques",
          "Exercices pratiques",
          "Accompagnement ou suivi",
        ],
      };

    case "technologie":
      return {
        problem:
          `Les utilisateurs et entreprises recherchent des outils simples capables de résoudre un problème précis sans complexité inutile. ${targetCustomer} ont besoin d'une solution claire, fiable et facile à utiliser.`,
        solution:
          "Une solution technologique pensée autour du problème utilisateur, avec une expérience simple et des fonctionnalités directement utiles.",
        benefits: [
          "Une expérience simple à utiliser",
          "Des fonctionnalités centrées sur les besoins réels",
          "Un parcours utilisateur clair",
        ],
        offer:
          "Une solution digitale structurée autour du problème principal identifié et des besoins de la clientèle cible.",
        offerItems: [
          "Fonctionnalité principale",
          "Fonctionnalités complémentaires",
          "Accompagnement ou support",
          "Évolutions selon les besoins",
        ],
      };

    case "transport":
      return {
        problem:
          `Les clients ont besoin de solutions de transport ou de livraison pratiques, rapides et adaptées à leur quotidien. ${targetCustomer} recherchent surtout simplicité et fiabilité.`,
        solution:
          "Une solution de transport pensée pour simplifier les déplacements, les livraisons ou la logistique selon le besoin identifié.",
        benefits: [
          "Une organisation simple",
          "Un service adapté au besoin",
          "Une communication claire avec le client",
        ],
        offer:
          "Un service de transport ou de livraison adapté aux besoins spécifiques de la clientèle ciblée.",
        offerItems: [
          "Service principal",
          "Options complémentaires",
          "Formules adaptées",
          "Prise de commande ou réservation",
        ],
      };

    case "agriculture":
      return {
        problem:
          `Les consommateurs et professionnels recherchent des produits agricoles accessibles, fiables et adaptés à leurs besoins. ${targetCustomer} ont besoin d'une offre clairement présentée.`,
        solution:
          "Une offre agricole structurée autour de la qualité des produits, de la disponibilité et d'une relation simple avec les clients.",
        benefits: [
          "Une offre clairement présentée",
          "Des produits adaptés aux besoins",
          "Une relation directe avec les clients",
        ],
        offer:
          "Une gamme de produits ou services agricoles adaptée au marché ciblé.",
        offerItems: [
          "Produits principaux",
          "Formats ou quantités disponibles",
          "Offres professionnelles ou particulières",
          "Commande et livraison selon le modèle",
        ],
      };

    default:
      return {
        problem:
          `Les clients recherchent une solution simple à un problème concret. ${targetCustomer} ont besoin d'une offre claire, crédible et facile à comprendre.`,
        solution:
          "Une solution construite autour du besoin principal identifié, avec une expérience simple et une proposition de valeur clairement expliquée.",
        benefits: [
          "Une offre claire et compréhensible",
          "Une expérience simple",
          "Une solution centrée sur le besoin client",
        ],
        offer:
          "Une offre structurée autour du problème principal et des attentes de la clientèle cible.",
        offerItems: [
          "Offre principale",
          "Services ou produits complémentaires",
          "Formules adaptées",
          "Accompagnement client",
        ],
      };
  }
}

function generateFaq(
  sector: string,
  targetCustomer: string,
  projectName: string
) {
  const base = [
    {
      question: `À qui s'adresse ${projectName} ?`,
      answer: `${projectName} s'adresse principalement à ${targetCustomer}.`,
    },
    {
      question: "Pourquoi choisir cette solution ?",
      answer:
        "Parce que l'offre est construite autour d'un besoin concret et cherche à proposer une expérience simple, claire et adaptée au client.",
    },
    {
      question: "Comment commencer ?",
      answer:
        "Il suffit de découvrir l'offre, de choisir la solution qui correspond à son besoin puis de prendre contact ou de commander selon le fonctionnement du projet.",
    },
  ];

  const sectorFaq: Record<
    string,
    { question: string; answer: string }[]
  > = {
    mode: [
      {
        question: "Comment choisir un article ?",
        answer:
          "La sélection doit être présentée avec les informations essentielles afin d'aider le client à choisir selon son style, sa taille et son budget.",
      },
      {
        question: "Les articles sont-ils disponibles immédiatement ?",
        answer:
          "La disponibilité dépend du stock réel du projet et doit être indiquée avant la commande.",
      },
    ],

    alimentation: [
      {
        question: "Comment passer une commande ?",
        answer:
          "Les clients peuvent découvrir les produits disponibles puis suivre le parcours de commande prévu par l'entreprise.",
      },
      {
        question: "La livraison est-elle disponible ?",
        answer:
          "La disponibilité de la livraison dépend de la zone couverte et du fonctionnement défini par l'entreprise.",
      },
    ],

    beauté: [
      {
        question: "Comment réserver une prestation ?",
        answer:
          "Le client peut consulter les prestations proposées puis utiliser le canal de contact prévu pour demander une réservation.",
      },
      {
        question: "Les prestations sont-elles personnalisables ?",
        answer:
          "Certaines prestations peuvent être adaptées selon les besoins du client et les possibilités proposées par l'entreprise.",
      },
    ],

    éducation: [
      {
        question: "À quel niveau s'adressent les formations ?",
        answer:
          `Les contenus doivent être présentés selon les niveaux correspondant à ${targetCustomer}.`,
      },
      {
        question: "Comment accéder aux contenus ?",
        answer:
          "L'accès dépend du modèle choisi : cours en ligne, accompagnement, sessions physiques ou combinaison de plusieurs formats.",
      },
    ],

    technologie: [
      {
        question: "La solution est-elle facile à utiliser ?",
        answer:
          "L'objectif est de proposer une expérience simple, avec les fonctionnalités essentielles accessibles rapidement.",
      },
      {
        question: "Existe-t-il un accompagnement ?",
        answer:
          "Le niveau d'accompagnement dépend de l'offre choisie et des services proposés par le projet.",
      },
    ],

    transport: [
      {
        question: "Comment demander le service ?",
        answer:
          "Le client peut utiliser le canal de réservation ou de contact prévu par l'entreprise.",
      },
      {
        question: "Quelles zones sont couvertes ?",
        answer:
          "Les zones couvertes dépendent du périmètre opérationnel défini par l'entreprise.",
      },
    ],

    agriculture: [
      {
        question: "Quels produits sont disponibles ?",
        answer:
          "Les produits disponibles dépendent de la production, du stock et de la saison.",
      },
      {
        question: "Peut-on commander en quantité ?",
        answer:
          "Les commandes en quantité peuvent être proposées selon les capacités de production et les besoins du marché.",
      },
    ],

    service: [
      {
        question: "Comment bénéficier du service ?",
        answer:
          "Le client peut découvrir l'offre puis utiliser le canal de contact prévu pour obtenir les informations nécessaires.",
      },
      {
        question: "Le service peut-il être personnalisé ?",
        answer:
          "La personnalisation dépend du type de service et des possibilités proposées par l'entreprise.",
      },
    ],
  };

  return [
    ...base,
    ...(sectorFaq[sector] ?? sectorFaq.service),
  ];
}

export function generateLandingPage(
  projectName: string,
  idea: string
): LandingPageData {
  const safeProjectName = clean(projectName);
  const safeIdea = clean(idea);

  const analysis = analyzeProject(
    safeProjectName,
    safeIdea
  );

  const positioning = generatePositioning(
    safeProjectName,
    safeIdea
  );

  const sector = detectSector(safeIdea);

  const targetCustomer =
    clean(positioning.targetCustomer) ||
    analysis.customers.join(", ") ||
    "clients à la recherche d'une solution adaptée";

  const valueProposition =
    clean(positioning.valueProposition) ||
    "Une solution conçue pour répondre à un besoin concret.";

  const brandPromise =
    clean(positioning.brandPromise) ||
    "Une expérience simple, claire et adaptée à vos besoins.";

  const mainMessage =
    clean(positioning.mainMessage) ||
    firstSentence(valueProposition);

  const slogan =
    clean(positioning.slogans.split("\n")[0]) ||
    safeProjectName;

  const sectorContent = getSectorContent(
    sector,
    targetCustomer
  );

  const problemFromAnalysis =
    clean(analysis.problem) ||
    sectorContent.problem;

  const recommendations =
    analysis.recommendations.length > 0
      ? analysis.recommendations
          .slice(0, 3)
          .map((item) => clean(item))
          .filter(Boolean)
      : [];

  const offerItems = [
    ...sectorContent.offerItems,
    ...recommendations,
  ]
    .filter(Boolean)
    .slice(0, 6);

  const faq = generateFaq(
    sector,
    targetCustomer,
    safeProjectName
  );

  const cta =
    sector === "technologie"
      ? "Découvrir la solution"
      : sector === "alimentation"
        ? "Découvrir nos produits"
        : sector === "mode"
          ? "Découvrir la collection"
          : sector === "beauté"
            ? "Découvrir nos prestations"
            : sector === "éducation"
              ? "Découvrir les formations"
              : sector === "transport"
                ? "Découvrir le service"
                : sector === "agriculture"
                  ? "Découvrir nos produits"
                  : "Découvrir l'offre";

  return {
    hero: {
      title:
        mainMessage ||
        `${safeProjectName} : une solution pensée pour vous`,
      subtitle:
        `${brandPromise} Une offre pensée pour ${targetCustomer}.`,
      cta,
    },

    problem: {
      title:
        "Le problème que nous voulons résoudre",
      content: problemFromAnalysis,
    },

    solution: {
      title: `La solution ${safeProjectName}`,
      content:
        `${valueProposition} ${sectorContent.solution}`,
      benefits: sectorContent.benefits,
    },

    offer: {
      title: "Une offre pensée pour vos besoins",
      content: sectorContent.offer,
      items: offerItems,
    },

    pricing: {
      title: "Une offre adaptée à votre budget",
      content:
        "Les tarifs doivent être définis selon le modèle économique réel du projet. IDIFY ne crée pas de prix fictifs.",
      plans: [
        "Offre principale — à définir",
        "Formule complémentaire — à définir",
        "Offre premium ou personnalisée — selon le modèle",
      ],
    },

    socialProof: {
      title: "Pourquoi nous faire confiance ?",
      content:
        "Cette section est conçue pour accueillir de vrais témoignages, résultats clients, partenaires ou preuves de confiance lorsque l'entreprise en dispose.",
    },

    faq: {
      title: "Questions fréquentes",
      items: faq,
    },

    contact: {
      title: `Prêt à découvrir ${safeProjectName} ?`,
      content:
        `Découvrez une solution pensée pour ${targetCustomer} et construite autour d'un besoin concret.`,
      cta: "Commencer maintenant",
    },

    footer:
      `${safeProjectName} — ${slogan}. Une solution pensée autour des besoins de ses clients.`,
  };
}

export function formatLandingPage(
  data: LandingPageData
): string {
  return JSON.stringify(data, null, 2);
}
