import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

function parseWebsite(
  content: string
): WebsiteData | null {
  try {
    const data = JSON.parse(content);

    if (
      !data ||
      typeof data !== "object" ||
      !data.siteName ||
      !data.hero ||
      !Array.isArray(data.sections) ||
      !data.contact
    ) {
      return null;
    }

    return {
      siteName: String(data.siteName),
      tagline: String(data.tagline ?? ""),
      description: String(data.description ?? ""),

      navigation: Array.isArray(data.navigation)
        ? data.navigation
        : [],

      hero: {
        title: String(data.hero.title ?? ""),
        subtitle: String(data.hero.subtitle ?? ""),
        primaryCta: String(
          data.hero.primaryCta ?? "Nous contacter"
        ),
        secondaryCta: String(
          data.hero.secondaryCta ?? "Découvrir"
        ),
      },

      sections: data.sections.map(
        (section: {
          id?: string;
          title?: string;
          content?: string;
          items?: unknown;
        }) => ({
          id: String(
            section.id ??
              `section-${Math.random()
                .toString(36)
                .slice(2, 8)}`
          ),
          title: String(section.title ?? ""),
          content: String(section.content ?? ""),
          items: Array.isArray(section.items)
            ? section.items.map(String)
            : [],
        })
      ),

      pages: Array.isArray(data.pages)
        ? data.pages.map(
            (page: {
              title?: string;
              content?: string;
            }) => ({
              title: String(page.title ?? ""),
              content: String(page.content ?? ""),
            })
          )
        : [],

      contact: {
        title: String(data.contact.title ?? ""),
        content: String(data.contact.content ?? ""),
        cta: String(
          data.contact.cta ?? "Nous contacter"
        ),
      },

      footer: String(data.footer ?? ""),
    };
  } catch {
    return null;
  }
}

function createWhatsAppLink(
  phone: string | null | undefined,
  siteName: string
) {
  if (!phone) {
    return null;
  }

  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone) {
    return null;
  }

  const message = `Bonjour, je viens de visiter le site ${siteName} et je souhaite avoir plus d'informations.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    message
  )}`;
}

export default async function PublicWebsitePage({
  params,
}: Props) {
  const { slug } = await params;

  const website = await prisma.website.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      project: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
  });

  if (!website) {
    notFound();
  }

  const data = parseWebsite(website.content);

  if (!data) {
    notFound();
  }

  const whatsappLink = createWhatsAppLink(
    website.project.phone,
    data.siteName
  );

  return (
    <main className="min-h-screen bg-white text-neutral-950">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">

          <a
            href="#accueil"
            className="shrink-0"
          >
            <p className="text-xl font-black tracking-tight">
              {data.siteName}
            </p>

            {data.tagline && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
                {data.tagline}
              </p>
            )}
          </a>

          <nav className="hidden flex-wrap items-center gap-2 md:flex">

            <a
              href="#accueil"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
            >
              Accueil
            </a>

            {data.sections.slice(0, 4).map(
              (section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                  {section.title}
                </a>
              )
            )}

            <a
              href="#contact"
              className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              Contact
            </a>

          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="accueil"
        className="relative overflow-hidden bg-neutral-950 px-6 py-24 text-white md:px-10 md:py-32"
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-300">
            {data.siteName}
          </span>

          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[1.02] tracking-[-0.05em] md:text-7xl">
            {data.hero.title}
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-neutral-300 md:text-xl">
            {data.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">

            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black transition hover:bg-neutral-200"
              >
                {data.hero.primaryCta}
              </a>
            ) : (
              <a
                href="#contact"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-black transition hover:bg-neutral-200"
              >
                {data.hero.primaryCta}
              </a>
            )}

            <a
              href="#sections"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {data.hero.secondaryCta}
            </a>

          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {data.description && (
        <section className="border-b border-neutral-200 px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-5xl">

            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
              À propos
            </p>

            <p className="mt-5 text-2xl font-semibold leading-10 text-neutral-800 md:text-3xl">
              {data.description}
            </p>

          </div>
        </section>
      )}

      {/* SECTIONS */}
      {data.sections.length > 0 && (
        <section
          id="sections"
          className="bg-neutral-50 px-6 py-16 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-6xl space-y-8">

            {data.sections.map(
              (section, index) => (
                <article
                  id={section.id}
                  key={section.id}
                  className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
                >
                  <div className="p-7 md:p-10">

                    <div className="flex items-start gap-5">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-xs font-bold text-white">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="min-w-0">

                        <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                          {section.title}
                        </h2>

                        {section.content && (
                          <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
                            {section.content}
                          </p>
                        )}

                      </div>
                    </div>

                    {section.items.length > 0 && (
                      <div className="mt-8 grid gap-3 md:grid-cols-2">

                        {section.items.map(
                          (item, itemIndex) => (
                            <div
                              key={`${section.id}-${itemIndex}`}
                              className="flex gap-3 rounded-2xl bg-neutral-50 p-4"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                                ✓
                              </span>

                              <p className="text-sm leading-6 text-neutral-700">
                                {item}
                              </p>
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
      )}

      {/* PAGES */}
      {data.pages.length > 0 && (
        <section className="px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">

            <div className="mb-10">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                Informations
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Découvrez notre univers
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {data.pages.map(
                (page, index) => (
                  <article
                    key={`${page.title}-${index}`}
                    className="rounded-3xl border border-neutral-200 bg-white p-7"
                  >

                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Page
                    </p>

                    <h3 className="mt-3 text-xl font-black">
                      {page.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-neutral-600">
                      {page.content}
                    </p>

                  </article>
                )
              )}

            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-amber-300 px-6 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-5xl">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/50">
            Contact
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-black md:text-6xl">
            {data.contact.title}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-black/70">
            {data.contact.content}
          </p>

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              {data.contact.cta}
            </a>
          ) : (
            <a
              href="#accueil"
              className="mt-8 inline-flex rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              {data.contact.cta}
            </a>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="font-black">
              {data.siteName}
            </p>

            {data.tagline && (
              <p className="mt-1 text-xs text-neutral-400">
                {data.tagline}
              </p>
            )}

          </div>

          <p className="text-xs leading-5 text-neutral-400">
            {data.footer}
          </p>

        </div>
      </footer>

    </main>
  );
}
