import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { LandingPageData } from "@/lib/idify-engine/landing-page";
import { prisma } from "@/lib/prisma";

import AnalysisButton from "./AnalysisButton";
import PositioningButton from "./PositioningButton";
import BusinessPlanButton from "./BusinessPlanButton";
import MarketingPlanButton from "./MarketingPlanButton";
import FinancialForecast from "./FinancialForecast";
import VisualIdentity from "./VisualIdentity";
import PublishLandingPageButton from "./PublishLandingPageButton";
import LandingPagePreview from "./LandingPagePreview";
import ProjectContact from "./ProjectContact";
import Website from "./Website";
import LandingPageButton from "./LandingPageButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("idify_user_id")?.value;

  if (!userId) {
    redirect("/login");
  }

  /*
   * Utilisateur connecté + abonnement
   */
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const currentPlan =
    user.subscription?.plan ?? "FREE_TRIAL";

  const { id } = await params;

  /*
   * Projet
   */
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      analysis: true,
      positioning: true,
      businessPlan: true,
      marketingPlan: true,
      images: {
        orderBy: {
          createdAt: "desc",
        },
      },
      landingPage: true,
      website: true,
    },
  });

  if (!project) {
    notFound();
  }

  /*
   * Étapes du projet
   */
  const steps = [
    {
      number: "01",
      title: "Votre idée",
      description: "Définir le projet et son concept.",
      href: "#idee",
      available: true,
      completed: true,
    },
    {
      number: "02",
      title: "Analyse",
      description: "Comprendre le marché et les opportunités.",
      href: "#analyse",
      available: true,
      completed: Boolean(project.analysis),
    },
    {
      number: "03",
      title: "Positionnement",
      description: "Clarifier votre cible et votre différence.",
      href: "#positionnement",
      available: Boolean(project.analysis),
      completed: Boolean(project.positioning),
    },
    {
      number: "04",
      title: "Business plan",
      description: "Structurer votre modèle économique.",
      href: "#business-plan",
      available: Boolean(project.positioning),
      completed: Boolean(project.businessPlan),
    },
    {
      number: "05",
      title: "Marketing",
      description: "Préparer votre stratégie d'acquisition.",
      href: "#marketing",
      available: Boolean(project.businessPlan),
      completed: Boolean(project.marketingPlan),
    },
    {
      number: "06",
      title: "Prévisions financières",
      description: "Estimer vos revenus, coûts et rentabilité.",
      href: "#finances",
      available:
        currentPlan === "BUSINESS" ||
        currentPlan === "PRO",
      completed: false,
      pro: true,
    },
    {
      number: "07",
      title: "Identité visuelle",
      description: "Créer vos premiers visuels commerciaux.",
      href: "#identite",
      available:
        currentPlan === "BUSINESS" ||
        currentPlan === "PRO",
      completed: project.images.length > 0,
      pro: true,
    },
    {
      number: "08",
      title: "Landing page",
      description:
        "Créer une page de présentation et de conversion.",
      href: "#landing-page",
      available:
        currentPlan === "BUSINESS" ||
        currentPlan === "PRO",
      completed: Boolean(project.landingPage),
      pro: true,
    },
    {
      number: "09",
      title: "Site web",
      description: "Générer votre véritable site complet.",
      href: "#website",
      available: true,
      completed: Boolean(project.website),
      pro: true,
    },
  ];

  /*
   * Progression
   */
  const completedSteps = steps.filter(
    (step) => step.completed
  ).length;

  const progress = Math.round(
    (completedSteps / steps.length) * 100
  );

  /*
   * Étape actuelle
   */
  const currentStep = project.website
    ? "Site web"
    : project.landingPage
      ? "Landing page"
      : project.images.length > 0
        ? "Identité visuelle"
        : project.marketingPlan
          ? "Prévisions financières"
          : project.businessPlan
            ? "Marketing"
            : project.positioning
              ? "Business plan"
              : project.analysis
                ? "Positionnement"
                : "Analyse à créer";

  /*
   * Landing page
   */
  let landingPageData: LandingPageData | null = null;

  if (project.landingPage?.content) {
    try {
      const parsed = JSON.parse(
        project.landingPage.content
      ) as LandingPageData;

      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.hero &&
        parsed.problem &&
        parsed.solution &&
        parsed.offer &&
        parsed.pricing &&
        parsed.socialProof &&
        parsed.faq &&
        parsed.contact &&
        parsed.footer
      ) {
        landingPageData = parsed;
      }
    } catch {
      landingPageData = null;
    }
  }

  /*
   * Website
   */
  let websiteData = null;

  if (project.website?.content) {
    try {
      websiteData = JSON.parse(
        project.website.content
      );
    } catch {
      websiteData = null;
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-[#f7f7f4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-black text-white"
            >
              I
            </Link>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                IDIFY
              </p>

              <p className="text-sm font-bold text-neutral-900">
                Workspace projet
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:text-black"
          >
            Retour au dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                  Votre projet
                </p>

                <h2 className="mt-2 break-words text-xl font-black tracking-tight">
                  {project.name}
                </h2>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold text-neutral-400">
                      Progression
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {progress}%
                    </p>
                  </div>

                  <p className="text-xs font-medium text-neutral-400">
                    {completedSteps}/{steps.length}
                  </p>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-black transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  Étape actuelle:{" "}
                  <span className="font-semibold text-neutral-800">
                    {currentStep}
                  </span>
                </p>
              </div>

              <nav className="mt-5 space-y-1">
                {steps.map((step) => (
                  <a
                    key={step.number}
                    href={
                      step.available
                        ? step.href
                        : undefined
                    }
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                      step.available
                        ? "cursor-pointer hover:bg-white"
                        : "cursor-not-allowed opacity-40"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                        step.completed
                          ? "bg-black text-white"
                          : "bg-white text-neutral-500 ring-1 ring-neutral-200"
                      }`}
                    >
                      {step.completed
                        ? "✓"
                        : step.number}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-800">
                          {step.title}
                        </p>

                        {step.pro && (
                          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                            Pro
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl bg-black p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
                  IDIFY
                </p>

                <p className="mt-3 text-sm font-semibold leading-6">
                  De l'idée au lancement, dans un seul espace.
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-400">
                  Construisez progressivement votre projet avec les outils
                  IDIFY.
                </p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0">
            {/* Hero */}
            <section
              id="idee"
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative overflow-hidden p-7 md:p-10">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                      Projet
                    </span>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                      {project.status === "COMPLETED"
                        ? "Terminé"
                        : project.status === "IN_PROGRESS"
                          ? "En cours"
                          : "Brouillon"}
                    </span>
                  </div>

                  <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-neutral-950 md:text-6xl">
                    {project.name}
                  </h1>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600 md:text-lg">
                    {project.idea}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#analyse"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
                    >
                      Continuer le projet
                    </a>

                    <a
                      href="#landing-page"
                      className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-300"
                    >
                      Voir la landing page
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid border-t border-neutral-200 md:grid-cols-3">
                <div className="border-b border-neutral-200 p-5 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold text-neutral-400">
                    Progression
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {progress}%
                  </p>
                </div>

                <div className="border-b border-neutral-200 p-5 md:border-b-0 md:border-r">
                  <p className="text-xs font-semibold text-neutral-400">
                    Étape actuelle
                  </p>

                  <p className="mt-1 text-sm font-bold text-neutral-900">
                    {currentStep}
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold text-neutral-400">
                    Étapes terminées
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {completedSteps}
                    <span className="text-sm font-medium text-neutral-400">
                      {" "}
                      / {steps.length}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <ProjectContact
              projectId={project.id}
              initialPhone={project.phone}
            />

            {/* Analysis */}
            <section
              id="analyse"
              className="mt-8 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    02
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Analyse
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Comprendre votre opportunité
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  IDIFY analyse votre idée et identifie les principaux
                  éléments à prendre en compte avant le lancement.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                {project.analysis ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                    {project.analysis.content}
                  </div>
                ) : (
                  <div className="flex flex-col items-start gap-5">
                    <div>
                      <h3 className="text-lg font-bold">
                        Votre analyse n'est pas encore créée.
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                        Générez l'analyse pour débloquer le positionnement,
                        le business plan et les prochaines étapes.
                      </p>
                    </div>

                    <AnalysisButton
                      projectId={project.id}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Positioning */}
            <section
              id="positionnement"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    03
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Positionnement
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Donner une place claire à votre projet
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Définissez votre cible, votre proposition de valeur et
                  votre différence sur le marché.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                {project.positioning ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl bg-neutral-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Client cible
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {project.positioning.targetCustomer}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Proposition de valeur
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {project.positioning.valueProposition}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Différenciation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {project.positioning.differentiation}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Promesse de marque
                      </p>

                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {project.positioning.brandPromise}
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-5 md:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Message principal
                      </p>

                      <p className="mt-2 text-lg font-bold leading-7 text-neutral-900">
                        {project.positioning.mainMessage}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Slogans
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                        {project.positioning.slogans}
                      </p>
                    </div>
                  </div>
                ) : project.analysis ? (
                  <div>
                    <h3 className="text-lg font-bold">
                      Positionnement à créer
                    </h3>

                    <p className="mb-5 mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                      L'analyse est disponible. Vous pouvez maintenant
                      construire votre positionnement.
                    </p>

                    <PositioningButton
                      projectId={project.id}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Terminez d'abord l'analyse pour débloquer cette étape.
                  </p>
                )}
              </div>
            </section>

            {/* Business plan */}
            <section
              id="business-plan"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    04
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Business plan
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Structurer votre modèle économique
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Transformez votre idée et votre positionnement en véritable
                  plan d'entreprise.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                {project.businessPlan ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                    {project.businessPlan.content}
                  </div>
                ) : project.positioning ? (
                  <div>
                    <h3 className="text-lg font-bold">
                      Business plan à créer
                    </h3>

                    <p className="mb-5 mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                      Générez un plan structuré à partir de votre analyse
                      et de votre positionnement.
                    </p>

                    <BusinessPlanButton
                      projectId={project.id}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Terminez d'abord le positionnement.
                  </p>
                )}
              </div>
            </section>

            {/* Marketing */}
            <section
              id="marketing"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    05
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Marketing
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Préparer votre stratégie commerciale
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Construisez une stratégie marketing adaptée à votre
                  activité et à votre cible.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                {project.marketingPlan ? (
                  <div className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                    {project.marketingPlan.content}
                  </div>
                ) : project.businessPlan ? (
                  <div>
                    <h3 className="text-lg font-bold">
                      Stratégie marketing à créer
                    </h3>

                    <p className="mb-5 mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                      Générez votre stratégie d'acquisition, votre contenu,
                      votre lancement et vos indicateurs.
                    </p>

                    <MarketingPlanButton
                      projectId={project.id}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Terminez d'abord le business plan.
                  </p>
                )}
              </div>
            </section>

            {/* Financial forecast */}
            <section
              id="finances"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    06
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Prévisions financières
                  </span>

                  <span className="rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                    BUSINESS+
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Comprendre la rentabilité de votre projet
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Simulez vos ventes, vos coûts, votre bénéfice et votre
                  seuil de rentabilité avant de lancer votre activité.
                </p>
              </div>

              {project.businessPlan ? (
                <FinancialForecast
                  projectId={project.id}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
                  <p className="text-sm text-neutral-500">
                    Terminez d'abord le business plan pour accéder aux
                    prévisions financières.
                  </p>
                </div>
              )}
            </section>

            {/* Visual identity */}
            <section
              id="identite"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    07
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Identité visuelle
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Donnez une image à votre projet
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Créez vos premiers supports visuels et construisez une
                  image cohérente pour votre marque.
                </p>
              </div>

              {project.marketingPlan ? (
                <VisualIdentity
                  projectId={project.id}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
                  <p className="text-sm text-neutral-500">
                    Terminez d'abord la stratégie marketing pour débloquer
                    l'identité visuelle.
                  </p>
                </div>
              )}
            </section>

            {/* Landing page */}
            <section
              id="landing-page"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-bold text-white">
                    08
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Landing page
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Transformez votre projet en page de vente
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  IDIFY construit automatiquement une landing page structurée
                  à partir de votre analyse, de votre positionnement et de
                  votre stratégie.
                </p>
              </div>

              {!project.businessPlan ||
              !project.marketingPlan ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-xl text-white">
                    08
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Landing page verrouillée
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                    Terminez d'abord le business plan et la stratégie
                    marketing pour permettre à IDIFY de construire une page
                    cohérente avec votre projet.
                  </p>
                </div>
              ) : project.landingPage &&
                landingPageData ? (
                <div className="space-y-5">
                  <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        Votre landing page est prête
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Modifiez son contenu puis publiez-la lorsque vous
                        êtes prêt.
                      </p>
                    </div>

                    <PublishLandingPageButton
                      projectId={project.id}
                      published={
                        project.landingPage.published
                      }
                      slug={
                        project.landingPage.slug
                      }
                    />
                  </div>

                  <LandingPagePreview
                    data={landingPageData}
                    projectId={project.id}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white">
                        ✦
                      </div>

                      <h3 className="mt-5 text-xl font-black">
                        Votre landing page est prête à être créée
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                        IDIFY va créer une première version complète avec
                        hero, problème, solution, offre, tarification,
                        FAQ et appel à l'action.
                      </p>

                      <p className="mt-3 text-xs font-medium text-neutral-400">
                        Génération locale — aucune API IA payante nécessaire.
                      </p>
                    </div>

                    <LandingPageButton
                       projectId={project.id}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Website */}
            <section
              id="website"
              className="mt-10 scroll-mt-28"
            >
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${
                      project.website
                        ? "bg-black text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    {project.website ? "✓" : "09"}
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Site web
                  </span>

                  <span className="rounded-md bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    PRO
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Passez de la landing page au site complet
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Générez un véritable site web professionnel à partir de
                  votre projet, de votre positionnement et de votre stratégie.
                </p>
              </div>

              <Website
                projectId={project.id}
                isPro={currentPlan === "PRO"}
                website={websiteData}
                published={project.website?.published ?? false}
                slug={project.website?.slug ?? null}
              />
            </section>

            {/* Bottom CTA */}
            <section className="mt-10 rounded-3xl bg-amber-400 p-7 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/50">
                Continuez à construire
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-black md:text-4xl">
                Votre idée devient progressivement une véritable entreprise.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-black/70">
                Complétez chaque étape et utilisez les résultats précédents
                pour construire la suivante.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {!project.analysis && (
                  <a
                    href="#analyse"
                    className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                  >
                    Commencer l'analyse
                  </a>
                )}

                {project.analysis &&
                  !project.positioning && (
                    <a
                      href="#positionnement"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                    >
                      Créer le positionnement
                    </a>
                  )}

                {project.positioning &&
                  !project.businessPlan && (
                    <a
                      href="#business-plan"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                    >
                      Créer le business plan
                    </a>
                  )}

                {project.businessPlan &&
                  !project.marketingPlan && (
                    <a
                      href="#marketing"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                    >
                      Créer le marketing
                    </a>
                  )}

                {project.businessPlan &&
                  project.marketingPlan &&
                  !project.landingPage && (
                    <a
                      href="#landing-page"
                      className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                    >
                      Créer la landing page
                    </a>
                  )}

                {project.landingPage && (
                  <a
                    href="#website"
                    className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                  >
                    Découvrir Website Pro
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}