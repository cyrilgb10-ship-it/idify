import { analyzeProject } from "./analyzer";

export type ProjectPositioning = {
  targetCustomer: string;
  customerProblem: string;
  valueProposition: string;
  differentiation: string;
  brandPromise: string;
  mainMessage: string;
  salesArguments: string;
  positioning: string;
  slogans: string;
};

function getMainCustomer(
  customers: string[]
): string {
  if (customers.length === 0) {
    return "Particuliers intéressés par la solution";
  }

  return customers[0];
}

function generateSectorData(
  idea: string,
  sector: string
): {
  value: string;
  differentiation: string;
} {
  const text = idea.toLowerCase();

  /*
   * ALIMENTATION
   * Priorité au secteur détecté par analyzer.ts.
   */
  if (sector === "Alimentation et boissons") {
    if (
      text.includes("jus") ||
      text.includes("boisson") ||
      text.includes("smoothie")
    ) {
      return {
        value:
          "Proposer des boissons de qualité, accessibles et adaptées aux habitudes de consommation locales.",
        differentiation:
          "Se différencier par la fraîcheur, le goût, la qualité des ingrédients, le prix, la proximité et une commande simple.",
      };
    }

    if (
      text.includes("restaurant") ||
      text.includes("repas") ||
      text.includes("plat") ||
      text.includes("food") ||
      text.includes("snack")
    ) {
      return {
        value:
          "Proposer des repas accessibles et pratiques répondant aux besoins quotidiens des clients.",
        differentiation:
          "Se différencier par la qualité des repas, le goût, la rapidité, le prix et la simplicité de commande.",
      };
    }

    return {
      value:
        "Proposer une offre alimentaire claire, accessible et adaptée aux habitudes des consommateurs.",
      differentiation:
        "Se différencier par la qualité, la fraîcheur, le prix, la proximité et une expérience de commande simple.",
    };
  }

  /*
   * MODE
   */
  if (sector === "Mode et habillement") {
    return {
      value:
        "Proposer une sélection de vêtements et articles de mode adaptés aux goûts, aux besoins et au budget de la clientèle ciblée.",
      differentiation:
        "Se différencier par la sélection des produits, le style, la qualité, le prix, la disponibilité et l'expérience client.",
    };
  }

  /*
   * BEAUTÉ
   */
  if (sector === "Beauté et soins") {
    return {
      value:
        "Proposer des produits ou services de beauté adaptés aux besoins réels des clients.",
      differentiation:
        "Se différencier par la qualité des prestations ou produits, l'écoute du client, la confiance et la simplicité de prise de contact.",
    };
  }

  /*
   * TECHNOLOGIE
   */
  if (sector === "Technologie et numérique") {
    return {
      value:
        "Simplifier un problème précis grâce à une solution numérique accessible et facile à utiliser.",
      differentiation:
        "Se différencier par la simplicité, l'expérience utilisateur, l'automatisation et l'adaptation aux besoins réels des utilisateurs.",
    };
  }

  /*
   * ÉDUCATION
   */
  if (sector === "Éducation et formation") {
    return {
      value:
        "Permettre aux utilisateurs d'acquérir des connaissances ou compétences de manière accessible et pratique.",
      differentiation:
        "Se différencier par la simplicité des contenus, l'accompagnement et l'adaptation au niveau des apprenants.",
    };
  }

  /*
   * TRANSPORT
   */
  if (sector === "Transport et logistique") {
    return {
      value:
        "Faciliter le déplacement, la livraison ou la logistique de manière pratique, fiable et accessible.",
      differentiation:
        "Se différencier par la rapidité, la fiabilité, la disponibilité, la proximité et la simplicité du service.",
    };
  }

  /*
   * AGRICULTURE
   */
  if (sector === "Agriculture et élevage") {
    return {
      value:
        "Proposer des produits ou services agricoles adaptés aux besoins du marché local.",
      differentiation:
        "Se différencier par la qualité des produits, la disponibilité, la proximité, la régularité et la relation directe avec les clients.",
    };
  }

  /*
   * COMMERCE ET SERVICES
   *
   * Une simple présence du mot "boutique" ne déclenche
   * désormais plus un contenu lié aux vêtements.
   */
  return {
    value:
      "Apporter une solution simple et accessible à un besoin clairement identifié chez les clients ciblés.",
    differentiation:
      "Se différencier par la proximité avec les clients, la simplicité de l'offre, la qualité du service et l'adaptation au contexte local.",
  };
}

function generateSlogans(
  name: string,
  customer: string,
  sector: string
): string[] {
  if (sector === "Alimentation et boissons") {
    return [
      `${name} — Le goût pensé pour vous.`,
      `${name} — La qualité au quotidien.`,
      `${name} — Simple, frais et accessible.`,
    ];
  }

  if (sector === "Mode et habillement") {
    return [
      `${name} — Votre style, votre identité.`,
      `${name} — Le style pensé pour vous.`,
      `${name} — La mode à votre image.`,
    ];
  }

  if (sector === "Beauté et soins") {
    return [
      `${name} — Révélez votre beauté.`,
      `${name} — Prenez soin de vous.`,
      `${name} — La beauté pensée pour vous.`,
    ];
  }

  if (sector === "Technologie et numérique") {
    return [
      `${name} — La technologie simplement.`,
      `${name} — Une solution pensée pour vous.`,
      `${name} — Simplifiez votre quotidien.`,
    ];
  }

  if (sector === "Éducation et formation") {
    return [
      `${name} — Apprendre pour avancer.`,
      `${name} — Votre progression commence ici.`,
      `${name} — Des compétences pour demain.`,
    ];
  }

  if (sector === "Transport et logistique") {
    return [
      `${name} — Simplement plus proche.`,
      `${name} — Le service qui vous accompagne.`,
      `${name} — Rapidité et simplicité.`,
    ];
  }

  if (sector === "Agriculture et élevage") {
    return [
      `${name} — La qualité au cœur du local.`,
      `${name} — Produire pour répondre aux besoins.`,
      `${name} — Des produits pensés pour vous.`,
    ];
  }

  return [
    `${name} — Simplement pensé pour vous.`,
    `${name} — Une meilleure solution, simplement.`,
    `${name} — Pensé pour les besoins d'aujourd'hui.`,
  ];
}

export function generatePositioning(
  name: string,
  idea: string
): ProjectPositioning {
  const analysis = analyzeProject(name, idea);

  const customer = getMainCustomer(
    analysis.customers
  );

  /*
   * On utilise directement le secteur déterminé
   * par analyzer.ts.
   *
   * Cela évite que positioning.ts détecte
   * indépendamment un autre secteur.
   */
  const sector = analysis.summary
    .replace(/^.*secteur /, "")
    .split(" à ")[0]
    .trim();

  /*
   * Détection plus fiable à partir des données
   * d'analyse.
   */
  let detectedSector = "Commerce et services";

  if (analysis.summary.includes("alimentation et boissons")) {
    detectedSector = "Alimentation et boissons";
  } else if (
    analysis.summary.includes("mode et habillement")
  ) {
    detectedSector = "Mode et habillement";
  } else if (
    analysis.summary.includes("beauté et soins")
  ) {
    detectedSector = "Beauté et soins";
  } else if (
    analysis.summary.includes("technologie et numérique")
  ) {
    detectedSector = "Technologie et numérique";
  } else if (
    analysis.summary.includes("éducation et formation")
  ) {
    detectedSector = "Éducation et formation";
  } else if (
    analysis.summary.includes("transport et logistique")
  ) {
    detectedSector = "Transport et logistique";
  } else if (
    analysis.summary.includes("agriculture et élevage")
  ) {
    detectedSector = "Agriculture et élevage";
  }

  const sectorData = generateSectorData(
    idea,
    detectedSector
  );

  const otherCustomers = analysis.customers
    .slice(1)
    .filter(Boolean);

  const targetCustomer =
    `Le client principal identifié est ${customer}.` +
    (otherCustomers.length > 0
      ? ` D'autres profils peuvent également être ciblés : ${otherCustomers.join(
          ", "
        )}.`
      : "");

  const customerProblem =
    `Le projet cherche principalement à répondre à un besoin ` +
    `chez ${customer}. Le besoin exact devra être confirmé ` +
    `par des échanges avec des clients potentiels et des tests réels.`;

  const valueProposition =
    sectorData.value;

  const differentiation =
    sectorData.differentiation;

  const brandPromise =
    `${name} s'engage à proposer une solution claire, ` +
    `accessible et orientée vers un besoin concret de ses clients.`;

  const mainMessage =
    `${name} aide ${customer.toLowerCase()} ` +
    `à répondre plus simplement à un besoin concret grâce ` +
    `à une offre pensée pour être accessible et facile à utiliser.`;

  const salesArguments = [
    "Solution simple à comprendre.",
    "Offre adaptée au besoin principal du client.",
    "Possibilité de commencer avec une offre accessible.",
    "Relation directe avec les clients.",
    "Possibilité d'améliorer progressivement l'offre grâce aux retours.",
  ].join("\n");

  const positioning =
    `${name} se positionne comme une solution ` +
    `accessible et orientée vers les besoins de ${customer.toLowerCase()}, ` +
    `avec un accent particulier sur la simplicité, la proximité ` +
    `et la valeur apportée au client.`;

  const slogans = generateSlogans(
    name,
    customer,
    detectedSector
  ).join("\n");

  return {
    targetCustomer,
    customerProblem,
    valueProposition,
    differentiation,
    brandPromise,
    mainMessage,
    salesArguments,
    positioning,
    slogans,
  };
}