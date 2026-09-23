import type { ProjectAnalysis } from "./analyzer";
import type { ProjectPositioning } from "./positioning";

export type MarketingPlanData = {
  marketingObjective: string;
  targetAudience: string;
  brandMessage: string;
  contentStrategy: string;
  socialMediaStrategy: string;
  whatsappStrategy: string;
  acquisitionStrategy: string;
  launchCampaign: string;
  contentIdeas: string;
  promotionStrategy: string;
  retentionStrategy: string;
  marketingCalendar: string;
  kpis: string;
};

export function generateMarketingPlan(
  name: string,
  idea: string,
  analysis: ProjectAnalysis,
  positioning: ProjectPositioning
): MarketingPlanData {
  return {
    marketingObjective:
      `L'objectif marketing de ${name} est de faire connaître l'offre, ` +
      `attirer les premiers clients, générer des ventes et construire ` +
      `progressivement une clientèle fidèle.\n\n` +
      `Le marketing doit commencer avec des actions simples, mesurables ` +
      `et adaptées au budget disponible.`,

    targetAudience:
      positioning.targetCustomer,

    brandMessage:
      positioning.mainMessage +
      `\n\nPromesse de marque :\n${positioning.brandPromise}`,

    contentStrategy:
      `Le contenu doit principalement montrer la valeur réelle de l'offre ` +
      `et répondre aux questions de la clientèle cible.\n\n` +
      `Les contenus peuvent être organisés autour de quatre catégories :\n` +
      `• Présentation des produits ou services\n` +
      `• Conseils et contenus éducatifs\n` +
      `• Témoignages et preuves sociales\n` +
      `• Promotions et offres spéciales`,

    socialMediaStrategy:
      `Instagram : présenter l'offre avec des photos, vidéos courtes, ` +
      `stories et témoignages.\n\n` +
      `TikTok : publier des vidéos courtes, démonstrations, conseils et ` +
      `contenus permettant de découvrir rapidement l'activité.\n\n` +
      `Facebook : développer la visibilité locale, publier les offres et ` +
      `interagir avec les clients.\n\n` +
      `La priorité doit être donnée aux plateformes réellement utilisées ` +
      `par la clientèle cible.`,

    whatsappStrategy:
      `WhatsApp Business peut servir de canal commercial direct.\n\n` +
      `Actions recommandées :\n` +
      `• Créer un catalogue\n` +
      `• Ajouter les informations de contact\n` +
      `• Présenter clairement les prix\n` +
      `• Répondre rapidement aux demandes\n` +
      `• Relancer les prospects intéressés\n` +
      `• Demander des avis après les ventes\n` +
      `• Informer les anciens clients des nouvelles offres`,

    acquisitionStrategy:
      `Les premiers clients peuvent être recherchés grâce à :\n` +
      `• Réseau personnel\n` +
      `• Recommandations\n` +
      `• Réseaux sociaux\n` +
      `• Groupes WhatsApp et Facebook pertinents\n` +
      `• Prospection directe\n` +
      `• Partenariats locaux\n` +
      `• Promotions de lancement\n\n` +
      `La différenciation à communiquer est :\n` +
      positioning.differentiation,

    launchCampaign:
      `Campagne de lancement en 7 jours\n\n` +
      `Jour 1 — Présenter le problème auquel l'offre répond.\n` +
      `Jour 2 — Présenter le produit ou service.\n` +
      `Jour 3 — Montrer les avantages principaux.\n` +
      `Jour 4 — Publier une démonstration ou un exemple.\n` +
      `Jour 5 — Présenter un témoignage ou une preuve.\n` +
      `Jour 6 — Proposer une offre de lancement.\n` +
      `Jour 7 — Rappeler l'offre et inviter les prospects à commander.`,

    contentIdeas:
      `10 idées de contenus à adapter au projet :\n\n` +
      `1. Pourquoi ce produit ou service a été créé\n` +
      `2. Le problème principal rencontré par les clients\n` +
      `3. Comment utiliser le produit ou service\n` +
      `4. Les erreurs à éviter dans ce domaine\n` +
      `5. Avant / après\n` +
      `6. Questions fréquentes des clients\n` +
      `7. Présentation des coulisses de l'activité\n` +
      `8. Témoignage d'un client\n` +
      `9. Comparaison entre différentes offres\n` +
      `10. Offre spéciale ou nouveauté`,

    promotionStrategy:
      `Les promotions doivent être utilisées pour faciliter l'acquisition ` +
      `sans dégrader durablement la marge.\n\n` +
      `Exemples :\n` +
      `• Offre de lancement\n` +
      `• Réduction limitée dans le temps\n` +
      `• Offre groupée\n` +
      `• Bonus pour première commande\n` +
      `• Programme de recommandation\n` +
      `• Offre destinée aux clients fidèles`,

    retentionStrategy:
      `Après une première vente, l'objectif est de transformer le client ` +
      `en client régulier.\n\n` +
      `Actions recommandées :\n` +
      `• Suivi après achat\n` +
      `• Service client rapide\n` +
      `• Demande d'avis\n` +
      `• Offres réservées aux anciens clients\n` +
      `• Nouveautés communiquées régulièrement\n` +
      `• Programme de fidélité lorsque le volume le justifie`,

    marketingCalendar:
      `Semaine 1 : lancement et présentation de l'offre.\n` +
      `Semaine 2 : contenus éducatifs et démonstrations.\n` +
      `Semaine 3 : témoignages, preuves et réponses aux objections.\n` +
      `Semaine 4 : promotion, relance et analyse des résultats.\n\n` +
      `Après le premier mois, conserver les formats qui génèrent le plus ` +
      `de contacts, ventes ou demandes.`,

    kpis:
      `Les indicateurs à suivre sont :\n` +
      `• Nombre de prospects\n` +
      `• Nombre de demandes reçues\n` +
      `• Nombre de ventes\n` +
      `• Taux de conversion\n` +
      `• Coût d'acquisition client\n` +
      `• Chiffre d'affaires généré\n` +
      `• Nombre de clients récurrents\n` +
      `• Engagement sur les contenus\n\n` +
      `L'objectif est de prendre les décisions marketing à partir des ` +
      `résultats réellement observés.`,

    // Utilisé pour éviter une fonction trop générique et conserver
    // les informations issues de l'analyse du projet.
  };
}

export function formatMarketingPlan(
  name: string,
  idea: string,
  analysis: ProjectAnalysis,
  positioning: ProjectPositioning
): string {
  const plan = generateMarketingPlan(
    name,
    idea,
    analysis,
    positioning
  );

  return [
    "PLAN MARKETING",
    "",
    `PROJET : ${name}`,
    `IDÉE : ${idea}`,
    "",
    "1. OBJECTIF MARKETING",
    plan.marketingObjective,
    "",
    "2. AUDIENCE CIBLE",
    plan.targetAudience,
    "",
    "3. MESSAGE DE MARQUE",
    plan.brandMessage,
    "",
    "4. STRATÉGIE DE CONTENU",
    plan.contentStrategy,
    "",
    "5. STRATÉGIE RÉSEAUX SOCIAUX",
    plan.socialMediaStrategy,
    "",
    "6. STRATÉGIE WHATSAPP BUSINESS",
    plan.whatsappStrategy,
    "",
    "7. ACQUISITION CLIENT",
    plan.acquisitionStrategy,
    "",
    "8. CAMPAGNE DE LANCEMENT",
    plan.launchCampaign,
    "",
    "9. IDÉES DE CONTENU",
    plan.contentIdeas,
    "",
    "10. STRATÉGIE PROMOTIONNELLE",
    plan.promotionStrategy,
    "",
    "11. FIDÉLISATION",
    plan.retentionStrategy,
    "",
    "12. CALENDRIER MARKETING",
    plan.marketingCalendar,
    "",
    "13. INDICATEURS DE PERFORMANCE",
    plan.kpis,
  ].join("\n");
}