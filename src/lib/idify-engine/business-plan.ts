import type { ProjectAnalysis } from "./analyzer";
import type { ProjectPositioning } from "./positioning";

export type BusinessPlanData = {
  executiveSummary: string;
  projectPresentation: string;
  problem: string;
  solution: string;
  targetMarket: string;
  valueProposition: string;
  marketAnalysis: string;
  competition: string;
  businessModel: string;
  revenueSources: string;
  pricingStrategy: string;
  commercialStrategy: string;
  marketingStrategy: string;
  resources: string;
  launchPlan: string;
  risks: string;
  actionPlan: string;
};

export function generateBusinessPlan(
  name: string,
  idea: string,
  analysis: ProjectAnalysis,
  positioning: ProjectPositioning
): BusinessPlanData {
  const customers = positioning.targetCustomer;

  return {
    executiveSummary:
      `${name} est un projet conçu pour répondre à un besoin concret ` +
      `identifié auprès d'une clientèle ciblée. Le projet repose sur une ` +
      `offre simple, accessible et différenciée. L'objectif initial est ` +
      `de valider la demande, obtenir les premiers clients et améliorer ` +
      `progressivement l'offre grâce aux retours du marché.`,

    projectPresentation:
      `${name} a pour objectif de développer une activité autour de ` +
      `l'idée suivante : "${idea}". Le projet doit commencer avec une ` +
      `offre maîtrisée afin de limiter les risques et de permettre une ` +
      `validation rapide du marché.`,

    problem:
      analysis.problem,

    solution:
      analysis.solution,

    targetMarket:
      `La clientèle principale identifiée est : ${customers}\n\n` +
      `Le marché devra être étudié localement afin de mesurer la demande, ` +
      `le pouvoir d'achat, les habitudes des clients et les solutions ` +
      `déjà disponibles.`,

    valueProposition:
      positioning.valueProposition,

    marketAnalysis:
      analysis.market +
      `\n\nLes principaux facteurs à surveiller sont la demande, ` +
      `les prix pratiqués par les concurrents, les habitudes d'achat, ` +
      `la disponibilité des fournisseurs et l'évolution du marché.`,

    competition:
      analysis.competition
        .map((item) => `• ${item}`)
        .join("\n") +
      `\n\nLa différenciation proposée est :\n${positioning.differentiation}`,

    businessModel:
      `${name} peut commencer avec un modèle simple basé sur la vente ` +
      `directe de l'offre aux clients. Selon l'évolution du projet, ` +
      `des offres supplémentaires, des produits complémentaires ou ` +
      `des formules récurrentes pourront être ajoutés.`,

    revenueSources:
      `Les principales sources de revenus potentielles sont :\n` +
      `• Vente directe des produits ou services\n` +
      `• Offres ou formules premium\n` +
      `• Produits ou services complémentaires\n` +
      `• Commandes récurrentes ou fidélisation des clients`,

    pricingStrategy:
      `Le prix devra être déterminé à partir du coût réel de production ` +
      `ou d'acquisition, des prix pratiqués par les concurrents, ` +
      `du pouvoir d'achat de la clientèle et de la marge souhaitée.\n\n` +
      `Il est recommandé de tester plusieurs niveaux de prix avant ` +
      `de fixer définitivement la tarification.`,

    commercialStrategy:
      `La stratégie commerciale doit commencer par une offre simple ` +
      `et facile à comprendre. Les premiers clients peuvent être ` +
      `obtenus grâce au réseau personnel, aux recommandations, ` +
      `aux réseaux sociaux et aux contacts directs avec la clientèle cible.\n\n` +
      `Le positionnement commercial principal est :\n${positioning.positioning}`,

    marketingStrategy:
      `Les principaux canaux à tester sont :\n` +
      `• WhatsApp Business\n` +
      `• Instagram\n` +
      `• TikTok\n` +
      `• Facebook\n` +
      `• Recommandations clients\n` +
      `• Contenu photo et vidéo\n\n` +
      `Message principal :\n${positioning.mainMessage}`,

    resources:
      `Les ressources nécessaires dépendront du type exact d'activité. ` +
      `Le lancement devra généralement prévoir :\n` +
      `• Budget initial\n` +
      `• Produits, matières premières ou outils nécessaires\n` +
      `• Identité visuelle\n` +
      `• Canaux de communication\n` +
      `• Moyen de paiement\n` +
      `• Organisation de la livraison ou de la prestation\n` +
      `• Suivi des ventes et des dépenses`,

    launchPlan:
      `Le lancement doit être réalisé progressivement.\n\n` +
      `Phase 1 — Préparation : définir l'offre, le prix et la cible.\n` +
      `Phase 2 — Test : présenter l'offre à un petit groupe de clients.\n` +
      `Phase 3 — Validation : analyser les ventes et les retours.\n` +
      `Phase 4 — Développement : augmenter progressivement les ventes ` +
      `et améliorer l'offre.`,

    risks:
      analysis.risks
        .map((risk) => `• ${risk}`)
        .join("\n"),

    actionPlan:
      `30 premiers jours\n` +
      `• Finaliser l'offre\n` +
      `• Définir les prix\n` +
      `• Identifier les premiers clients\n` +
      `• Créer les supports marketing\n` +
      `• Réaliser les premières ventes ou tests\n\n` +
      `60 jours\n` +
      `• Mesurer les ventes\n` +
      `• Identifier les produits ou services les plus demandés\n` +
      `• Améliorer l'offre\n` +
      `• Développer l'acquisition client\n\n` +
      `90 jours\n` +
      `• Stabiliser le modèle économique\n` +
      `• Augmenter les ventes\n` +
      `• Fidéliser les meilleurs clients\n` +
      `• Préparer les prochaines étapes de croissance`,
  };
}

export function formatBusinessPlan(
  name: string,
  idea: string,
  analysis: ProjectAnalysis,
  positioning: ProjectPositioning
): string {
  const plan = generateBusinessPlan(
    name,
    idea,
    analysis,
    positioning
  );

  return [
    "BUSINESS PLAN",
    "",
    "1. RÉSUMÉ EXÉCUTIF",
    plan.executiveSummary,
    "",
    "2. PRÉSENTATION DU PROJET",
    plan.projectPresentation,
    "",
    "3. PROBLÈME",
    plan.problem,
    "",
    "4. SOLUTION",
    plan.solution,
    "",
    "5. MARCHÉ CIBLE",
    plan.targetMarket,
    "",
    "6. PROPOSITION DE VALEUR",
    plan.valueProposition,
    "",
    "7. ANALYSE DU MARCHÉ",
    plan.marketAnalysis,
    "",
    "8. CONCURRENCE",
    plan.competition,
    "",
    "9. MODÈLE ÉCONOMIQUE",
    plan.businessModel,
    "",
    "10. SOURCES DE REVENUS",
    plan.revenueSources,
    "",
    "11. STRATÉGIE DE PRIX",
    plan.pricingStrategy,
    "",
    "12. STRATÉGIE COMMERCIALE",
    plan.commercialStrategy,
    "",
    "13. STRATÉGIE MARKETING",
    plan.marketingStrategy,
    "",
    "14. RESSOURCES NÉCESSAIRES",
    plan.resources,
    "",
    "15. PLAN DE LANCEMENT",
    plan.launchPlan,
    "",
    "16. RISQUES",
    plan.risks,
    "",
    "17. PLAN D'ACTION 30 / 60 / 90 JOURS",
    plan.actionPlan,
  ].join("\n");
}