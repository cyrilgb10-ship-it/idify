import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const PLAN_LIMITS: Record<string, number | null> = {
  FREE_TRIAL: 3,
  STARTER: 5,
  BUSINESS: null,
  PRO: null,
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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
      return "bg-green-100 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("idify_user_id")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
      projects: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          _count: {
            select: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const plan = user.subscription?.plan ?? "FREE_TRIAL";
  const limit = PLAN_LIMITS[plan] ?? 3;
  const projectCount = user.projects.length;

  const progress =
    limit === null
      ? 100
      : Math.min(100, Math.round((projectCount / limit) * 100));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-block text-sm text-gray-500 hover:text-gray-900"
            >
              ← Retour au dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Mes projets
            </h1>

            <p className="mt-1 text-gray-600">
              Transforme tes idées en projets structurés avec IDIFY.
            </p>
          </div>

          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Nouveau projet
          </Link>
        </div>

        {/* Subscription / project usage */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Plan actuel
              </p>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {plan === "FREE_TRIAL"
                    ? "Essai gratuit"
                    : plan === "STARTER"
                      ? "Starter"
                      : plan === "BUSINESS"
                        ? "Business"
                        : "Pro"}
                </h2>

                {plan === "FREE_TRIAL" && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    3 jours
                  </span>
                )}
              </div>
            </div>

            <div className="w-full sm:max-w-xs">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">Projets</span>

                <span className="font-semibold text-gray-900">
                  {projectCount}
                  {limit !== null ? ` / ${limit}` : " / ∞"}
                </span>
              </div>

              {limit !== null && (
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-black transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              )}

              {limit === null && (
                <p className="text-xs text-gray-500">
                  Projets illimités avec ton abonnement.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Empty state */}
        {user.projects.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                💡
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Aucun projet pour le moment
              </h2>

              <p className="mt-2 text-gray-500">
                Commence avec une idée. IDIFY t'aidera à la transformer en
                projet structuré.
              </p>

              <Link
                href="/dashboard/projects/new"
                className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Créer mon premier projet
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* Search */}
            <div className="mb-5">
              <form action="/dashboard/projects" method="GET">
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher un projet..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </form>
            </div>

            {/* Projects */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {user.projects.map((project) => (
                <article
                  key={project.id}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-gray-900">
                        {project.name}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Créé le {formatDate(project.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        project.status,
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <div className="mb-5">
                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                      {project.idea}
                    </p>
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">Visuels</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {project._count.images}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">Dernière mise à jour</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Ouvrir le projet →
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
