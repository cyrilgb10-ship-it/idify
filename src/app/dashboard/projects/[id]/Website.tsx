"use client";

import { useState } from "react";

type WebsiteData = {
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

pages: {
title: string;
content: string;
}[];

contact: {
title: string;
content: string;
cta: string;
};

footer: string;
};

type Props = {
projectId: string;
website?: WebsiteData | null;
isPro: boolean;
published?: boolean;
slug?: string | null;
};

export default function Website({
projectId,
website = null,
isPro,
published = false,
slug = null,
}: Props) {
const [data, setData] = useState<WebsiteData | null>(
website
);

const [isGenerating, setIsGenerating] =
useState(false);

const [device, setDevice] =
useState<"desktop" | "mobile">("desktop");

const [activePage, setActivePage] =
useState("home");

const [isPublishing, setIsPublishing] =
useState(false);

const [publishedState, setPublishedState] =
useState(published);

const [currentSlug, setCurrentSlug] =
useState<string | null>(slug);

const [isCopied, setIsCopied] =
useState(false);

async function generate() {
if (!isPro) {
alert(
"La génération du site complet est réservée au plan Pro."
);
return;
}

try {
  setIsGenerating(true);

  const response = await fetch(
    `/api/projects/${projectId}/website`,
    {
      method: "POST",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    alert(
      result.message ||
        "Impossible de générer le site web."
    );
    return;
  }

  setData(result.website);
  setActivePage("home");

  // Une nouvelle génération doit être republiée.
  setPublishedState(false);
  setCurrentSlug(null);
  setIsCopied(false);
} catch (error) {
  console.error(error);

  alert(
    "Une erreur est survenue pendant la génération du site."
  );
} finally {
  setIsGenerating(false);
}

}

async function publish() {
if (!data) {
alert(
"Générez d'abord votre site avant de le publier."
);
return;
}

try {
  setIsPublishing(true);

  const response = await fetch(
    `/api/projects/${projectId}/website/publish`,
    {
      method: "POST",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    alert(
      result.message ||
        "Impossible de publier le site."
    );
    return;
  }

  setPublishedState(true);
  setCurrentSlug(result.website.slug);
} catch (error) {
  console.error(error);

  alert(
    "Une erreur est survenue pendant la publication du site."
  );
} finally {
  setIsPublishing(false);
}

}

async function copyPublicLink() {
if (!currentSlug) {
return;
}

const url = `${window.location.origin}/site/${currentSlug}`;

try {
  await navigator.clipboard.writeText(url);

  setIsCopied(true);

  setTimeout(() => {
    setIsCopied(false);
  }, 2000);
} catch (error) {
  console.error(error);

  alert(
    "Impossible de copier le lien."
  );
}

}

if (!isPro) {
return ( <section
     id="website"
     className="mt-10 scroll-mt-24"
   > <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8"> <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"> <div> <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
🔒 PRO </div>

          <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
            Site web complet
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            La génération automatique d'un véritable
            site web professionnel est réservée aux
            utilisateurs du plan Pro.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6">
        <h3 className="text-base font-bold text-neutral-950">
          Passez au plan Pro pour débloquer cette
          fonctionnalité
        </h3>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Avec le plan Pro, IDIFY peut transformer votre
          projet en un site web complet avec une
          structure professionnelle prête à
          personnaliser.
        </p>

        <a
          href="/dashboard/subscription"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Passer au plan Pro →
        </a>
      </div>
    </div>
  </section>
);

}

return ( <section
   id="website"
   className="mt-10 scroll-mt-24"
 > <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">

```
    {/* HEADER */}
    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
          ✦ PRO
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
          Site web complet
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Transformez votre projet en un véritable
          site web professionnel avec un aperçu
          interactif avant publication.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={isGenerating}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating
            ? "Génération..."
            : data
              ? "Régénérer le site"
              : "Générer le site"}
        </button>

        {data && (
          <>
            {publishedState ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Site publié
                </div>

                <button
                  type="button"
                  onClick={copyPublicLink}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-bold text-neutral-800 transition hover:bg-neutral-100"
                >
                  {isCopied
                    ? "Lien copié ✓"
                    : "Copier le lien"}
                </button>

                {currentSlug && (
                  <a
                    href={`/site/${currentSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    Voir le site →
                  </a>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={publish}
                disabled={isPublishing}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPublishing
                  ? "Publication..."
                  : "Publier le site"}
              </button>
            )}
          </>
        )}
      </div>
    </div>

    {/* EMPTY STATE */}
    {!data && !isGenerating && (
      <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950">
        <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>

        <div className="px-6 py-16 text-center text-white md:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
            🌐
          </div>

          <h3 className="mt-5 text-2xl font-black">
            Votre site est prêt à être généré
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-400">
            IDIFY va créer automatiquement la structure
            de votre site à partir de votre projet,
            de votre positionnement et de votre stratégie.
          </p>

          <button
            type="button"
            onClick={generate}
            className="mt-7 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
          >
            Générer mon site →
          </button>
        </div>
      </div>
    )}

    {/* LOADING */}
    {isGenerating && (
      <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950">
        <div className="flex items-center gap-2 border-b border-neutral-800 px-5 py-4">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />

          <span className="ml-3 text-xs text-neutral-500">
            IDIFY Website Studio
          </span>
        </div>

        <div className="px-6 py-20 text-center text-white">
          <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-white/10 text-3xl">
            ✦
          </div>

          <h3 className="mt-5 text-xl font-bold">
            Construction de votre site...
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-400">
            IDIFY prépare la structure, les pages,
            les sections et les appels à l'action.
          </p>

          <div className="mx-auto mt-7 h-2 max-w-sm overflow-hidden rounded-full bg-neutral-800">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-white" />
          </div>
        </div>
      </div>
    )}

    {/* WEBSITE STUDIO */}
    {data && !isGenerating && (
      <div className="mt-8">

        {/* STUDIO TOOLBAR */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                Website Studio
              </p>

              <p className="mt-1 text-sm font-semibold text-neutral-900">
                {data.siteName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="flex rounded-xl border border-neutral-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() =>
                    setDevice("desktop")
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    device === "desktop"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  🖥 Desktop
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDevice("mobile")
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    device === "mobile"
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:bg-neutral-100"
                  }`}
                >
                  📱 Mobile
                </button>
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={isGenerating}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-50"
              >
                Régénérer
              </button>

              {publishedState ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Publié
                  </div>

                  <button
                    type="button"
                    onClick={copyPublicLink}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 transition hover:bg-neutral-100"
                  >
                    {isCopied
                      ? "Lien copié ✓"
                      : "Copier le lien"}
                  </button>

                  {currentSlug && (
                    <a
                      href={`/site/${currentSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      Voir →
                    </a>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={isPublishing}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPublishing
                    ? "Publication..."
                    : "Publier le site"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PREVIEW AREA */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">

          {/* BROWSER BAR */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="hidden max-w-md flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-center text-[11px] text-neutral-500 sm:block">
              {publishedState && currentSlug
                ? `/site/${currentSlug}`
                : `idify.preview/${data.siteName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
            </div>

            <div className="w-14" />
          </div>

          {/* DEVICE FRAME */}
          <div className="overflow-auto bg-neutral-200 p-4 md:p-8">

            <div
              className={`mx-auto overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
                device === "mobile"
                  ? "w-[375px] max-w-full rounded-[28px] border-[8px] border-neutral-950"
                  : "w-full max-w-[1100px] rounded-xl"
              }`}
            >

              {/* SITE HEADER */}
              <header className="border-b border-neutral-200 bg-white">
                <div
                  className={`mx-auto flex items-center justify-between gap-5 px-5 py-5 ${
                    device === "mobile"
                      ? "flex-col items-start"
                      : ""
                  }`}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setActivePage("home")
                    }
                    className="text-left"
                  >
                    <p className="text-lg font-black tracking-tight text-neutral-950">
                      {data.siteName}
                    </p>

                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                      {data.tagline}
                    </p>
                  </button>

                  <nav
                    className={`flex gap-2 ${
                      device === "mobile"
                        ? "w-full flex-col"
                        : "flex-wrap items-center justify-end"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActivePage("home")
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activePage === "home"
                          ? "bg-black text-white"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      Accueil
                    </button>

                    {data.navigation.map(
                      (item, index) => (
                        <button
                          key={`${item.href}-${index}`}
                          type="button"
                          onClick={() => {
                            const matchingPage =
                              data.pages.find(
                                (page) =>
                                  page.title.toLowerCase() ===
                                  item.label.toLowerCase()
                              );

                            if (matchingPage) {
                              setActivePage(
                                matchingPage.title
                              );
                            } else {
                              setActivePage(
                                item.label
                              );
                            }
                          }}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            activePage === item.label
                              ? "bg-black text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setActivePage("contact")
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        activePage === "contact"
                          ? "bg-black text-white"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      Contact
                    </button>
                  </nav>
                </div>
              </header>

              {/* HOME PAGE */}
              {activePage === "home" && (
                <main>

                  {/* HERO */}
                  <section className="relative overflow-hidden bg-neutral-950 px-6 py-16 text-white md:px-12 md:py-24">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

                    <div className="relative mx-auto max-w-4xl">
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-300">
                        {data.siteName}
                      </span>

                      <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">
                        {data.hero.title}
                      </h1>

                      <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
                        {data.hero.subtitle}
                      </p>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePage("contact")
                          }
                          className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
                        >
                          {data.hero.primaryCta}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const firstSection =
                              data.sections[0];

                            if (firstSection) {
                              document
                                .getElementById(
                                  `preview-section-${firstSection.id}`
                                )
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                });
                            }
                          }}
                          className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                        >
                          {data.hero.secondaryCta}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* DESCRIPTION */}
                  <section className="border-b border-neutral-200 bg-white px-6 py-14 md:px-12">
                    <div className="mx-auto max-w-4xl">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                        À propos
                      </p>

                      <p className="mt-4 text-xl font-semibold leading-9 text-neutral-800 md:text-2xl">
                        {data.description}
                      </p>
                    </div>
                  </section>

                  {/* SECTIONS */}
                  <section className="bg-neutral-50 px-6 py-14 md:px-12">
                    <div className="mx-auto max-w-5xl space-y-6">
                      {data.sections.map(
                        (section, index) => (
                          <article
                            id={`preview-section-${section.id}`}
                            key={section.id}
                            className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white ${
                              index % 2 === 1
                                ? "md:ml-12"
                                : "md:mr-12"
                            }`}
                          >
                            <div className="p-6 md:p-8">
                              <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">
                                  {String(
                                    index + 1
                                  ).padStart(2, "0")}
                                </div>

                                <div className="min-w-0">
                                  <h2 className="text-xl font-black tracking-tight text-neutral-950 md:text-2xl">
                                    {section.title}
                                  </h2>

                                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                                    {section.content}
                                  </p>
                                </div>
                              </div>

                              {section.items.length >
                                0 && (
                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                  {section.items.map(
                                    (
                                      item,
                                      itemIndex
                                    ) => (
                                      <div
                                        key={`${section.id}-${itemIndex}`}
                                        className="flex gap-3 rounded-xl bg-neutral-50 p-4"
                                      >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                          ✓
                                        </span>

                                        <span className="text-sm leading-6 text-neutral-700">
                                          {item}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  </section>

                  {/* CTA */}
                  <section className="bg-amber-300 px-6 py-14 md:px-12 md:py-20">
                    <div className="mx-auto max-w-4xl">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-black/50">
                        Passez à l'action
                      </p>

                      <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-black md:text-5xl">
                        {data.contact.title}
                      </h2>

                      <p className="mt-5 max-w-2xl text-sm leading-7 text-black/70 md:text-base">
                        {data.contact.content}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setActivePage("contact")
                        }
                        className="mt-7 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
                      >
                        {data.contact.cta}
                      </button>
                    </div>
                  </section>
                </main>
              )}

              {/* GENERATED PAGES */}
              {activePage !== "home" &&
                activePage !== "contact" && (
                  <main className="min-h-[500px] bg-neutral-50 px-6 py-14 md:px-12 md:py-20">
                    {(() => {
                      const page =
                        data.pages.find(
                          (item) =>
                            item.title ===
                            activePage
                        );

                      if (!page) {
                        return (
                          <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-xl text-white">
                              📄
                            </div>

                            <h2 className="mt-5 text-2xl font-black">
                              {activePage}
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-neutral-500">
                              Cette page fait partie de
                              la structure de votre site.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <article className="mx-auto max-w-4xl">
                          <div className="rounded-3xl bg-neutral-950 p-8 text-white md:p-12">
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
                              Page
                            </span>

                            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                              {page.title}
                            </h1>

                            <p className="mt-6 text-base leading-8 text-neutral-300">
                              {page.content}
                            </p>
                          </div>

                          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
                            <p className="text-sm leading-8 text-neutral-700">
                              {page.content}
                            </p>
                          </div>
                        </article>
                      );
                    })()}
                  </main>
                )}

              {/* CONTACT PAGE */}
              {activePage === "contact" && (
                <main className="min-h-[500px] bg-neutral-50 px-6 py-14 md:px-12 md:py-20">
                  <div className="mx-auto max-w-3xl">
                    <div className="rounded-3xl bg-neutral-950 p-8 text-white md:p-12">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
                        Contact
                      </span>

                      <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                        {data.contact.title}
                      </h1>

                      <p className="mt-6 text-base leading-8 text-neutral-300">
                        {data.contact.content}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          alert(
                            "Le formulaire de contact pourra être connecté lors de la publication du site."
                          );
                        }}
                        className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
                      >
                        {data.contact.cta}
                      </button>
                    </div>
                  </div>
                </main>
              )}

              {/* FOOTER */}
              <footer className="border-t border-neutral-200 bg-white px-6 py-8">
                <div
                  className={`mx-auto flex gap-4 ${
                    device === "mobile"
                      ? "flex-col"
                      : "flex-col items-center justify-between md:flex-row"
                  }`}
                >
                  <div>
                    <p className="font-black text-neutral-950">
                      {data.siteName}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      {data.tagline}
                    </p>
                  </div>

                  <p className="text-xs leading-5 text-neutral-400">
                    {data.footer}
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* PREVIEW INFO */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Pages
            </p>

            <p className="mt-2 text-2xl font-black text-neutral-950">
              {data.pages.length + 1}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Accueil + pages générées
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Sections
            </p>

            <p className="mt-2 text-2xl font-black text-neutral-950">
              {data.sections.length}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Sections présentes sur l'accueil
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Statut
            </p>

            <p className="mt-2 text-2xl font-black text-neutral-950">
              {publishedState
                ? "Publié"
                : "Brouillon"}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {publishedState
                ? "Votre site est accessible publiquement."
                : "Votre site est prêt à être publié."}
            </p>
          </div>
        </div>

        {/* PUBLICATION */}
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-bold text-neutral-900">
                {publishedState
                  ? "Votre site est en ligne 🚀"
                  : "Votre site est prêt à être publié"}
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {publishedState
                  ? "Partagez votre lien public avec vos clients."
                  : "Publiez votre site pour obtenir automatiquement un lien public."}
              </p>

              {publishedState && currentSlug && (
                <p className="mt-2 break-all text-xs font-semibold text-emerald-600">
                  /site/{currentSlug}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">

              {publishedState ? (
                <>
                  <button
                    type="button"
                    onClick={copyPublicLink}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 transition hover:bg-neutral-100"
                  >
                    {isCopied
                      ? "Lien copié ✓"
                      : "Copier le lien"}
                  </button>

                  {currentSlug && (
                    <a
                      href={`/site/${currentSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
                    >
                      Ouvrir le site →
                    </a>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={publish}
                  disabled={isPublishing}
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPublishing
                    ? "Publication..."
                    : "Publier mon site →"}
                </button>
              )}

            </div>
          </div>
        </div>

      </div>
    )}
  </div>
</section>

);
}
