import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/subscription";

const planOrder = [
  "FREE_TRIAL",
  "STARTER",
  "BUSINESS",
  "PRO",
] as const;

const planStyles = {
  FREE_TRIAL: {
    badge: "Essai",
    accent: "border-neutral-200",
  },
  STARTER: {
    badge: "Starter",
    accent: "border-neutral-200",
  },
  BUSINESS: {
    badge: "Populaire",
    accent: "border-amber-400",
  },
  PRO: {
    badge: "Pro",
    accent: "border-black",
  },
};

export default async function SubscriptionPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("idify_user_id")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      subscription: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const subscription = user.subscription;

  const subscriptionExpired =
    !!subscription &&
    subscription.expiresAt <= new Date();

  const currentPlan =
    subscription && !subscriptionExpired
      ? subscription.plan
      : "FREE_TRIAL";

  const currentPlanConfig = PLANS[currentPlan];

  const displayExpiresAt =
    subscription && !subscriptionExpired
      ? subscription.expiresAt
      : null;

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <a
            href="/dashboard"
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Retour au dashboard
          </a>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
              Abonnement IDIFY
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              Choisissez votre niveau de développement.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
              Débloquez progressivement les outils dont vous avez besoin
              pour transformer votre idée en véritable projet.
            </p>
          </div>
        </div>

        <section className="mb-10 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
                Votre abonnement actuel
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black text-neutral-950">
                  {currentPlanConfig.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    subscriptionExpired
                      ? "bg-red-100 text-red-700"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {subscriptionExpired
                    ? "Expiré"
                    : subscription?.status === "ACTIVE"
                      ? "Actif"
                      : "Essai gratuit"}
                </span>
              </div>

              <p className="mt-2 text-sm text-neutral-500">
                {subscriptionExpired
                  ? "Votre abonnement a expiré. Choisissez une offre pour continuer."
                  : currentPlanConfig.price === 0
                    ? "Vous utilisez actuellement la période d'essai gratuite."
                    : `${currentPlanConfig.price.toLocaleString(
                        "fr-FR"
                      )} FCFA / mois`}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f4] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Expiration
              </p>

              <p className="mt-1 text-sm font-bold text-neutral-900">
                {displayExpiresAt
                  ? new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(displayExpiresAt)
                  : "Aucune"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
              Nos offres
            </p>

            <h2 className="mt-2 text-2xl font-black text-neutral-950">
              Développez votre projet avec IDIFY
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {planOrder.map((plan) => {
              const config = PLANS[plan];
              const style = planStyles[plan];
              const isCurrent =
                plan === currentPlan && !subscriptionExpired;

              return (
                <article
                  key={plan}
                  className={`relative flex flex-col rounded-3xl border-2 bg-white p-6 ${style.accent}`}
                >
                  {plan === "BUSINESS" && (
                    <div className="absolute -top-3 left-5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black text-black">
                      {style.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                        {style.badge}
                      </p>

                      <h3 className="mt-2 text-xl font-black text-neutral-950">
                        {config.name}
                      </h3>
                    </div>

                    {isCurrent && (
                      <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold text-white">
                        ACTUEL
                      </span>
                    )}
                  </div>

                  <div className="mt-6">
                    <span className="text-3xl font-black text-neutral-950">
                      {config.price.toLocaleString("fr-FR")}
                    </span>

                    <span className="ml-1 text-sm text-neutral-400">
                      FCFA
                    </span>

                    {config.price > 0 && (
                      <span className="text-sm text-neutral-400">
                        {" "}
                        / mois
                      </span>
                    )}
                  </div>

                  <div className="my-6 h-px bg-neutral-100" />

                  <ul className="flex-1 space-y-3">
                    {config.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-neutral-600"
                      >
                        <span className="mt-0.5 font-bold text-neutral-900">
                          ✓
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    {isCurrent ? (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-400"
                      >
                        Abonnement actuel
                      </button>
                    ) : plan === "FREE_TRIAL" ? (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-400"
                      >
                        Essai gratuit
                      </button>
                    ) : (
                      <a
                        href={`/dashboard/subscription/checkout?plan=${plan}`}
                        className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition ${
                          plan === "PRO"
                            ? "bg-black text-white hover:bg-neutral-800"
                            : "bg-neutral-950 text-white hover:bg-neutral-800"
                        }`}
                      >
                        Choisir {config.name}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-2xl font-black text-neutral-950">
                3 jours
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                pour découvrir gratuitement IDIFY.
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-neutral-950">
                1 500 FCFA
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                pour commencer avec Starter.
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-neutral-950">
                7 500 FCFA
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                pour accéder à l'expérience Pro complète.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
