import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function getPlanLabel(plan?: string) {
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
      return "Aucun abonnement";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "DRAFT":
      return "Brouillon";
    case "IN_PROGRESS":
      return "En cours";
    case "COMPLETED":
      return "Terminé";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("idify_user_id")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      projects: {
        orderBy: {
          updatedAt: "desc",
        },
        take: 8,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const subscription = user.subscription;

  const daysLeft = subscription
    ? Math.max(
        0,
        Math.ceil(
          (subscription.expiresAt.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const completedProjects = user.projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const inProgressProjects = user.projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const firstName =
    user.name?.trim().split(" ")[0] || "Créateur";

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#111111]">
      <div className="flex min-h-screen">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden w-[250px] shrink-0 border-r border-[#e5e5df] bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-[#eeeeea] px-7">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-sm font-black text-white">
                I
              </div>

              <span className="text-xl font-bold tracking-[-0.04em]">
                IDIFY
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b9b93]">
              Workspace
            </p>

            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-[#f3f3ef] px-3 py-2.5 text-sm font-semibold text-[#111111]"
              >
                <span className="text-base">⌂</span>
                Accueil
              </Link>

              <Link
                href="/dashboard/projects"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#66665f] transition hover:bg-[#f7f7f4] hover:text-[#111111]"
              >
                <span className="text-base">□</span>
                Mes projets
              </Link>

              <Link
                href="/dashboard/projects/new"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#66665f] transition hover:bg-[#f7f7f4] hover:text-[#111111]"
              >
                <span className="text-base">＋</span>
                Nouveau projet
              </Link>
            </div>

            <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9b9b93]">
              Outils
            </p>

            <div className="space-y-1">
              <div className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#a1a19a]">
                <span>✦</span>
                Analyse IA
                <span className="ml-auto rounded-md bg-[#f1f1ed] px-1.5 py-0.5 text-[9px] font-bold">
                  IA
                </span>
              </div>

              <div className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#a1a19a]">
                <span>◈</span>
                Business plan
              </div>

              <div className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#a1a19a]">
                <span>✧</span>
                Marketing
              </div>
            </div>
          </nav>

          <div className="border-t border-[#eeeeea] p-4">
            <div className="rounded-2xl bg-[#111111] p-4 text-white">
              <p className="text-xs font-semibold text-white/50">
                ABONNEMENT
              </p>

              <p className="mt-2 text-sm font-semibold">
                {getPlanLabel(subscription?.plan)}
              </p>

              <p className="mt-1 text-xs text-white/50">
                {daysLeft > 0
                  ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`
                  : "Expiré"}
              </p>

              <Link
                href="/dashboard/subscription"
                className="mt-4 block rounded-lg bg-white px-3 py-2 text-center text-xs font-bold text-[#111111] transition hover:bg-[#f1f1ed]"
              >
                Gérer l'abonnement
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8e2] text-xs font-bold">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">
                  {user.name || "Utilisateur"}
                </p>
                <p className="truncate text-[11px] text-[#999990]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENU */}
        <div className="min-w-0 flex-1">
          {/* MOBILE HEADER */}
          <header className="flex h-16 items-center justify-between border-b border-[#e5e5df] bg-white px-5 lg:hidden">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-xs font-black text-white">
                I
              </div>

              <span className="font-bold tracking-[-0.04em]">
                IDIFY
              </span>
            </Link>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e8e2] text-xs font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
            {/* TOP */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a19f95]">
                  Votre espace de création
                </p>

                <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                  Bonjour {firstName}.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#77776f] sm:text-base">
                  Transformez une idée en projet structuré,
                  étape par étape, avec l&apos;intelligence
                  artificielle.
                </p>
              </div>

              <Link
                href="/dashboard/projects/new"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#252525]"
              >
                <span className="text-lg leading-none">＋</span>
                Créer un projet
              </Link>
            </div>

            {/* CREATION CARD */}
            <section className="relative mt-8 overflow-hidden rounded-[28px] border border-[#deded6] bg-white">
              <div className="grid lg:grid-cols-[1.4fr_0.6fr]">
                <div className="p-7 sm:p-9 lg:p-12">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e7e7e0] bg-[#fafaf7] px-3 py-1.5 text-[11px] font-semibold text-[#6f6f68]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                    IDIFY AI
                  </div>

                  <h2 className="max-w-2xl text-2xl font-bold tracking-[-0.04em] sm:text-3xl lg:text-4xl">
                    Qu&apos;avez-vous envie de créer
                    aujourd&apos;hui ?
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#77776f]">
                    Décrivez votre idée simplement. IDIFY peut
                    ensuite vous aider à définir votre concept,
                    votre positionnement, votre business plan,
                    votre marketing et bien plus.
                  </p>

                  <Link
                    href="/dashboard/projects/new"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#111111] px-5 py-3 text-sm font-semibold transition hover:bg-[#111111] hover:text-white"
                  >
                    Commencer maintenant
                    <span>→</span>
                  </Link>
                </div>

                <div className="relative hidden overflow-hidden bg-[#f2f2ec] lg:block">
                  <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full border border-[#deded6]" />
                  <div className="absolute right-[-25px] top-[-25px] h-44 w-44 rounded-full border border-[#deded6]" />

                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="rounded-2xl border border-[#deded6] bg-white p-5 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a09f96]">
                        Exemple
                      </p>

                      <p className="mt-3 text-sm font-medium leading-6 text-[#33332f]">
                        &quot;Je veux lancer une marque de
                        jus naturels à Lomé.&quot;
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs text-[#8b8b83]">
                        <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                        IDIFY transforme votre idée en plan
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[#deded6] bg-[#deded6] sm:grid-cols-3">
              <div className="bg-white p-5 sm:p-6">
                <p className="text-xs font-medium text-[#999990]">
                  Projets
                </p>

                <p className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                  {user.projects.length}
                </p>

                <p className="mt-1 text-xs text-[#a09f96]">
                  projets créés
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6">
                <p className="text-xs font-medium text-[#999990]">
                  En cours
                </p>

                <p className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                  {inProgressProjects}
                </p>

                <p className="mt-1 text-xs text-[#a09f96]">
                  projets actifs
                </p>
              </div>

              <div className="bg-white p-5 sm:p-6">
                <p className="text-xs font-medium text-[#999990]">
                  Terminés
                </p>

                <p className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                  {completedProjects}
                </p>

                <p className="mt-1 text-xs text-[#a09f96]">
                  projets finalisés
                </p>
              </div>
            </section>

            {/* PROJECTS */}
            <section className="mt-10">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a09f96]">
                    Workspace
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-[-0.03em]">
                    Vos projets
                  </h2>
                </div>

                {user.projects.length > 0 && (
                  <Link
                    href="/dashboard/projects"
                    className="text-xs font-semibold text-[#66665f] transition hover:text-[#111111]"
                  >
                    Voir tous →
                  </Link>
                )}
              </div>

              {user.projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d7d7cf] bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f1ec] text-lg">
                    ✦
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Aucun projet pour le moment
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888880]">
                    Votre espace est prêt. Créez votre première
                    idée et commencez à la transformer en projet
                    concret.
                  </p>

                  <Link
                    href="/dashboard/projects/new"
                    className="mt-6 inline-flex rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252525]"
                  >
                    Créer mon premier projet
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-[#deded6] bg-white">
                  {user.projects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      className={`group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fafaf7] sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
                        index !== user.projects.length - 1
                          ? "border-b border-[#eeeeea]"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1f1ec] text-sm font-bold text-[#55554f]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-[#22221f] group-hover:text-[#000000]">
                            {project.name}
                          </h3>

                          <p className="mt-1 truncate text-xs text-[#96968e]">
                            {project.idea}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pl-[60px] sm:pl-0">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                            project.status
                          )}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>

                        <span className="text-[#aaa9a0] transition group-hover:translate-x-1 group-hover:text-[#111111]">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* PROGRESSION */}
            <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
              <div className="rounded-2xl border border-[#deded6] bg-white p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a09f96]">
                      Parcours
                    </p>

                    <h2 className="mt-1 text-lg font-bold">
                      De l&apos;idée au lancement
                    </h2>
                  </div>

                  <span className="text-xl">✦</span>
                </div>

                <div className="mt-7 space-y-5">
                  {[
                    ["01", "Votre idée", true],
                    ["02", "Analyse & positionnement", false],
                    ["03", "Business plan", false],
                    ["04", "Marketing", false],
                    ["05", "Landing page", false],
                  ].map(([number, label, active]) => (
                    <div
                      key={String(number)}
                      className="flex items-center gap-4"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          active
                            ? "bg-[#111111] text-white"
                            : "border border-[#deded6] bg-[#fafaf7] text-[#a0a099]"
                        }`}
                      >
                        {number}
                      </div>

                      <div className="h-px flex-1 bg-[#eeeeea]" />

                      <span
                        className={`text-xs font-medium ${
                          active
                            ? "text-[#22221f]"
                            : "text-[#aaa9a0]"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#deded6] bg-[#111111] p-6 text-white sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                  Votre abonnement
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">
                  {getPlanLabel(subscription?.plan)}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {daysLeft > 0
                    ? `Votre accès actuel reste actif pendant ${daysLeft} jour${daysLeft > 1 ? "s" : ""}.`
                    : "Votre accès actuel a expiré."}
                </p>

                <Link
                  href="/dashboard/subscription"
                  className="mt-7 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#111111] transition hover:bg-[#eeeeea]"
                >
                  Voir les offres →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}