import type { SubscriptionPlan } from "@/generated/prisma/enums";

export type PlanConfig = {
  name: string;
  price: number;
  durationDays: number | null;
  durationMonths: number | null;
  maxProjects: number | null;
  features: string[];
};

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  FREE_TRIAL: {
    name: "Essai gratuit",
    price: 0,
    durationDays: 3,
    durationMonths: null,
    maxProjects: 3,
    features: [
      "3 projets",
      "Analyse du projet",
      "Positionnement",
      "Business plan",
      "Marketing",
    ],
  },

  STARTER: {
    name: "Starter",
    price: 1500,
    durationDays: null,
    durationMonths: 1,
    maxProjects: 5,
    features: [
      "5 projets",
      "Analyse du projet",
      "Positionnement",
      "Business plan",
      "Marketing",
    ],
  },

  BUSINESS: {
    name: "Business",
    price: 3500,
    durationDays: null,
    durationMonths: 1,
    maxProjects: null,
    features: [
      "Projets illimités",
      "Analyse du projet",
      "Positionnement",
      "Business plan",
      "Marketing",
      "Identité visuelle",
      "Prévisions financières",
      "Landing pages",
    ],
  },

  PRO: {
    name: "Pro",
    price: 7500,
    durationDays: null,
    durationMonths: 1,
    maxProjects: null,
    features: [
      "Projets illimités",
      "Toutes les fonctionnalités Business",
      "Identité visuelle avancée",
      "Prévisions financières",
      "Landing pages",
      "Génération de site web complet",
      "Fonctionnalités avancées",
    ],
  },
};

export function getPlanConfig(plan: SubscriptionPlan) {
  return PLANS[plan];
}

export function canUseVisualIdentity(plan: SubscriptionPlan) {
  return plan === "BUSINESS" || plan === "PRO";
}

export function canUseLandingPage(plan: SubscriptionPlan) {
  return plan === "BUSINESS" || plan === "PRO";
}

export function canUseWebsite(plan: SubscriptionPlan) {
  return plan === "PRO";
}

export function canUseFinancialForecast(plan: SubscriptionPlan) {
  return plan === "BUSINESS" || plan === "PRO";
}

export function getMaxProjects(plan: SubscriptionPlan) {
  return PLANS[plan].maxProjects;
}
