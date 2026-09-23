import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { getPlanConfig } from "@/lib/subscription";

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addOneMonth(date: Date) {
  const result = new Date(date);

  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + 1);

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();

  result.setDate(
    Math.min(originalDay, lastDayOfTargetMonth),
  );

  return result;
}

export function getSubscriptionExpiration(
  plan: SubscriptionPlan,
  startedAt: Date = new Date(),
) {
  const config = getPlanConfig(plan);

  if (config.durationMonths === 1) {
    return addOneMonth(startedAt);
  }

  if (config.durationDays !== null) {
    return addDays(startedAt, config.durationDays);
  }

  throw new Error(
    `Durée d'abonnement non configurée pour le plan ${plan}.`,
  );
}
