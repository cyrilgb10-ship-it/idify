import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function text(
  value: unknown,
  fallback = ""
): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;

    if (typeof object.text === "string") {
      return object.text;
    }

    if (typeof object.content === "string") {
      return object.content;
    }

    if (typeof object.title === "string") {
      return object.title;
    }

    if (typeof object.companyName === "string") {
      return object.companyName;
    }
  }

  return fallback;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => text(item))
    .filter(Boolean);
}

function createWhatsAppLink(
  phone: string,
  projectName: string
) {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone) {
    return null;
  }

  const message = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par votre offre "${projectName}". Je souhaite avoir plus d'informations.`
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export default async function PublicLandingPage({
  params,
}: Props) {
  const { slug } = await params;

  const landingPage = await prisma.landingPage.findFirst({
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

  if (!landingPage) {
    notFound();
  }

  let data: any;

  try {
    data = JSON.parse(landingPage.content);
  } catch {
    notFound();
  }

  const projectName = landingPage.project.name;
  const whatsappLink = landingPage.project.phone
    ? createWhatsAppLink(
        landingPage.project.phone,
        projectName
      )
    : null;

  const heroTitle = text(
    data?.hero?.title,
    projectName
  );

  const heroSubtitle = text(
    data?.hero?.subtitle
  );

  const heroCta = text(
    data?.hero?.cta,
    "Nous contacter"
  );

  const problemTitle = text(
    data?.problem?.title,
    "Le problème"
  );

  const problemContent = text(
    data?.problem?.content
  );

  const solutionTitle = text(
    data?.solution?.title,
    "La solution"
  );

  const solutionContent = text(
    data?.solution?.content
  );

  const benefits = stringArray(
    data?.solution?.benefits
  );

  const offerTitle = text(
    data?.offer?.title,
    "Notre offre"
  );

  const offerContent = text(
    data?.offer?.content
  );

  const offerItems = stringArray(
    data?.offer?.items
  );

  const pricingTitle = text(
    data?.pricing?.title,
    "Tarification"
  );

  const pricingContent = text(
    data?.pricing?.content
  );

  const pricingPlans = stringArray(
    data?.pricing?.plans
  );

  const socialTitle = text(
    data?.socialProof?.title,
    "Pourquoi nous choisir ?"
  );

  const socialContent = text(
    data?.socialProof?.content
  );

  const faqTitle = text(
    data?.faq?.title,
    "Questions fréquentes"
  );

  const faqItems = Array.isArray(data?.faq?.items)
    ? data.faq.items
        .map((item: any) => ({
          question: text(item?.question),
          answer: text(item?.answer),
        }))
        .filter(
          (item: {
            question: string;
            answer: string;
          }) => item.question || item.answer
        )
    : [];

  const contactTitle = text(
    data?.contact?.title,
    "Prêt à vous lancer ?"
  );

  const contactContent = text(
    data?.contact?.content
  );

  const contactCta = text(
    data?.contact?.cta,
    "Nous contacter"
  );

  const footer = text(
    data?.footer,
    projectName
  );

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-neutral-950">
      {/* HERO */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              {projectName}
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>

            {heroSubtitle && (
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
                {heroSubtitle}
              </p>
            )}

            <div className="mt-10">
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  {heroCta}
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  {heroCta}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            Le problème
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {problemTitle}
          </h2>

          <p className="mt-6 text-lg leading-8 text-neutral-600">
            {problemContent}
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
            La solution
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            {solutionTitle}
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
            {solutionContent}
          </p>

          {benefits.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={`${benefit}-${index}`}
                  className="rounded-2xl border border-neutral-200 bg-[#f7f7f4] p-6"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    {index + 1}
                  </div>

                  <p className="font-medium leading-7">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OFFER */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
          L'offre
        </p>

        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          {offerTitle}
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
          {offerContent}
        </p>

        {offerItems.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {offerItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <span className="text-xl text-amber-500">
                  ✓
                </span>

                <p className="leading-7 text-neutral-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PRICING */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Tarification
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {pricingTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-600">
              {pricingContent}
            </p>
          </div>

          {pricingPlans.length > 0 && (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={`${plan}-${index}`}
                  className="rounded-2xl border border-neutral-200 bg-[#f7f7f4] p-7"
                >
                  <p className="text-lg font-semibold">
                    {plan}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="rounded-3xl bg-neutral-950 p-8 text-white sm:p-12">
          <h2 className="text-3xl font-bold">
            {socialTitle}
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
            {socialContent}
          </p>
        </div>
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="border-y border-neutral-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              {faqTitle}
            </h2>

            <div className="mt-10 space-y-4">
              {faqItems.map(
                (
                  item: {
                    question: string;
                    answer: string;
                  },
                  index: number
                ) => (
                  <details
                    key={`${item.question}-${index}`}
                    className="group rounded-2xl border border-neutral-200 bg-[#f7f7f4] p-6"
                  >
                    <summary className="cursor-pointer list-none font-semibold">
                      {item.question}
                    </summary>

                    <p className="mt-4 leading-7 text-neutral-600">
                      {item.answer}
                    </p>
                  </details>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-5xl px-6 py-24 text-center sm:px-8"
      >
        <h2 className="text-4xl font-bold sm:text-5xl">
          {contactTitle}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
          {contactContent}
        </p>

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {contactCta}
          </a>
        ) : (
          <p className="mt-8 text-sm text-neutral-500">
            Les informations de contact seront bientôt
            disponibles.
          </p>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-neutral-500">
          {footer}
        </div>
      </footer>
    </main>
  );
}