export type WebsitePage = {
  title: string;
  content: string;
};

export type WebsiteData = {
  siteName: string;
  tagline: string;
  description: string;

  navigation: {
    label: string;
    href: string;
  }[];

  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };

  sections: {
    id: string;
    title: string;
    content: string;
    items: string[];
  }[];

  pages: WebsitePage[];

  contact: {
    title: string;
    content: string;
    cta: string;
  };

  footer: string;
};

function cleanText(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

function detectSector(idea: string) {
  const text = idea.toLowerCase();

  if (
    text.includes("jus") ||
    text.includes("boisson") ||
    text.includes("restaurant") ||
    text.includes("restaurant")
  ) {
    return "alimentation";
  }

  if (
    text.includes("vêtement") ||
    text.includes("vetement") ||
    text.includes("mode") ||
    text.includes("habit") ||
    text.includes("chaussure")
  ) {
    return "mode";
  }

  if (
    text.includes("coiffure") ||
    text.includes("salon") ||
    text.includes("beauté") ||
    text.includes("beaute")
  ) {
    return "beauté";
  }

  if (
    text.includes("formation") ||
    text.includes("cours") ||
    text.includes("école") ||
    text.includes("ecole")
  ) {
    return "éducation";
  }

  if (
    text.includes("informatique") ||
    text.includes("logiciel") ||
    text.includes("application") ||
    text.includes("saas")
  ) {
    return "technologie";
  }

  if (
    text.includes("immobilier") ||
    text.includes("maison") ||
    text.includes("terrain")
  ) {
    return "immobilier";
  }

  return "entreprise";
}

export function generateWebsite(
  projectName: string,
  idea: string
): WebsiteData {
  const name = cleanText(projectName);
  const projectIdea = cleanText(idea);
  const sector = detectSector(projectIdea);

  const sectorDescriptions: Record<string, string> = {
    alimentation:
      `${name} propose des produits alimentaires et boissons conçus pour répondre aux besoins de ses clients avec qualité et simplicité.`,

    mode:
      `${name} propose une sélection de produits de mode pensés pour permettre à ses clients de trouver facilement des articles adaptés à leur style.`,

    beauté:
      `${name} accompagne ses clients avec des produits et services dédiés à la beauté, au bien-être et à la confiance en soi.`,

    éducation:
      `${name} propose des solutions d'apprentissage accessibles et pratiques pour aider ses clients à développer leurs connaissances et leurs compétences.`,

    technologie:
      `${name} développe des solutions technologiques simples et utiles pour répondre aux besoins concrets de ses utilisateurs.`,

    immobilier:
      `${name} propose des solutions immobilières adaptées aux personnes qui souhaitent trouver, vendre, louer ou valoriser un bien.`,

    entreprise:
      `${name} développe une offre pensée pour répondre à un besoin concret du marché avec une approche simple, professionnelle et accessible.`,
  };

  const description =
    sectorDescriptions[sector] ??
    sectorDescriptions.entreprise;

  return {
    siteName: name,

    tagline: `Une solution simple et efficace pour répondre à vos besoins.`,

    description,

    navigation: [
      {
        label: "Accueil",
        href: "#accueil",
      },
      {
        label: "À propos",
        href: "#a-propos",
      },
      {
        label: "Services",
        href: "#services",
      },
      {
        label: "Pourquoi nous",
        href: "#avantages",
      },
      {
        label: "FAQ",
        href: "#faq",
      },
      {
        label: "Contact",
        href: "#contact",
      },
    ],

    hero: {
      title: `Bienvenue chez ${name}`,
      subtitle: projectIdea,
      primaryCta: "Découvrir notre offre",
      secondaryCta: "Nous contacter",
    },

    sections: [
      {
        id: "a-propos",
        title: "À propos",
        content: description,
        items: [
          "Une offre pensée pour les besoins réels des clients",
          "Une expérience simple et accessible",
          "Une approche professionnelle",
        ],
      },

      {
        id: "services",
        title: "Nos services",
        content:
          `Découvrez l'offre proposée par ${name} et trouvez la solution adaptée à vos besoins.`,
        items: [
          "Une offre adaptée à vos besoins",
          "Un accompagnement personnalisé",
          "Un service simple et rapide",
          "Une expérience client soignée",
        ],
      },

      {
        id: "avantages",
        title: "Pourquoi choisir " + name + " ?",
        content:
          "Notre objectif est de proposer une expérience claire, pratique et orientée vers les résultats.",
        items: [
          "Qualité",
          "Simplicité",
          "Rapidité",
          "Accompagnement",
          "Satisfaction client",
        ],
      },

      {
        id: "processus",
        title: "Comment ça fonctionne ?",
        content:
          "Notre processus est conçu pour permettre aux clients de passer rapidement de leur besoin à la solution.",
        items: [
          "Découvrez notre offre",
          "Choisissez la solution qui vous convient",
          "Contactez-nous ou passez commande",
          "Recevez votre produit ou service",
        ],
      },

      {
        id: "faq",
        title: "Questions fréquentes",
        content:
          "Retrouvez les réponses aux principales questions concernant notre activité.",
        items: [
          "Comment commander ?",
          "Comment obtenir plus d'informations ?",
          "Quels sont les moyens de paiement disponibles ?",
          "Comment nous contacter ?",
        ],
      },
    ],

    pages: [
      {
        title: "Accueil",
        content:
          `Découvrez ${name}, son offre et les solutions proposées à ses clients.`,
      },
      {
        title: "À propos",
        content: description,
      },
      {
        title: "Services",
        content:
          `Découvrez les produits et services proposés par ${name}.`,
      },
      {
        title: "Contact",
        content:
          `Contactez ${name} pour obtenir plus d'informations ou demander un accompagnement.`,
      },
    ],

    contact: {
      title: "Parlons de votre projet",
      content:
        "Une question, une demande ou besoin de plus d'informations ? Notre équipe est disponible pour vous répondre.",
      cta: "Nous contacter",
    },

    footer: `© ${new Date().getFullYear()} ${name}. Tous droits réservés.`,
  };
}