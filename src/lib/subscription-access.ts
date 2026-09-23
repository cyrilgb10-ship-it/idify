import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { getMaxProjects, canUseVisualIdentity, canUseLandingPage, canUseWebsite } from "@/lib/subscription";

export function hasActiveSubscription(
  plan: SubscriptionPlan,
  expiresAt: Date
) {
  return expiresAt > new Date();
}

export function canCreateProject(
  plan: SubscriptionPlan,
  currentProjectCount: number
) {
  const maxProjects = getMaxProjects(plan);

  if (maxProjects === null) {
    return true;
  }

  return currentProjectCount < maxProjects;
}

export function canAccessVisualIdentity(plan: SubscriptionPlan) {
  return canUseVisualIdentity(plan);
}

export function canAccessLandingPage(plan: SubscriptionPlan) {
  return canUseLandingPage(plan);
}

export function canAccessWebsite(plan: SubscriptionPlan) {
  return canUseWebsite(plan);
}

export function canAccessFinancialForecast(plan: SubscriptionPlan) {
  return plan === "BUSINESS" || plan === "PRO";
}

export function getPlanDisplayName(plan: SubscriptionPlan) {
  switch (plan) {
    case "FREE_TRIAL":
      return "Essai gratuit";

    case "STARTER":
      return "Starter";

    case "BUSINESS":
      return "Business";

    case "PRO":
      return "Pro";

    default:
      return "Essai gratuit";
  }
}