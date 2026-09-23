"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { LandingPageData } from "@/lib/idify-engine/landing-page";

type Props = {
  data: LandingPageData;
  projectId: string;
};

function normalizeLandingPageData(
  source: LandingPageData
): LandingPageData {
  const raw = source as any;

  const toText = (
    value: unknown,
    fallback = ""
  ): string => {
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

      if (typeof object.companyName === "string") {
        if (typeof object.slogan === "string") {
          return `${object.companyName} — ${object.slogan}`;
        }

        return object.companyName;
      }

      if (typeof object.text === "string") {
        return object.text;
      }

      if (typeof object.content === "string") {
        return object.content;
      }

      if (typeof object.title === "string") {
        return object.title;
      }

      try {
        return JSON.stringify(value);
      } catch {
        return fallback;
      }
    }

    return fallback;
  };

  const toStringArray = (
    value: unknown
  ): string[] => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => toText(item))
      .filter(Boolean);
  };

  const toFaqArray = (
    value: unknown
  ): {
    question: string;
    answer: string;
  }[] => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item: any) => ({
      question: toText(item?.question),
      answer: toText(item?.answer),
    }));
  };

  return {
    hero: {
      title: toText(
        raw?.hero?.title,
        "Votre offre commence ici"
      ),
      subtitle: toText(raw?.hero?.subtitle),
      cta: toText(
        raw?.hero?.cta,
        "Commencer"
      ),
    },

    problem: {
      title: toText(
        raw?.problem?.title,
        "Le problème"
      ),
      content: toText(
        raw?.problem?.content
      ),
    },

    solution: {
      title: toText(
        raw?.solution?.title,
        "La solution"
      ),
      content: toText(
        raw?.solution?.content
      ),
      benefits: toStringArray(
        raw?.solution?.benefits
      ),
    },

    offer: {
      title: toText(
        raw?.offer?.title,
        "Notre offre"
      ),
      content: toText(
        raw?.offer?.content
      ),
      items: toStringArray(
        raw?.offer?.items
      ),
    },

    pricing: {
      title: toText(
        raw?.pricing?.title,
        "Tarification"
      ),
      content: toText(
        raw?.pricing?.content
      ),
      plans: toStringArray(
        raw?.pricing?.plans
      ),
    },

    socialProof: {
      title: toText(
        raw?.socialProof?.title,
        "Ils nous font confiance"
      ),
      content: toText(
        raw?.socialProof?.content
      ),
    },

    faq: {
      title: toText(
        raw?.faq?.title,
        "Questions fréquentes"
      ),
      items: toFaqArray(
        raw?.faq?.items
      ),
    },

    contact: {
      title: toText(
        raw?.contact?.title,
        "Prêt à vous lancer ?"
      ),
      content: toText(
        raw?.contact?.content
      ),
      cta: toText(
        raw?.contact?.cta,
        "Nous contacter"
      ),
    },

    footer: toText(
      raw?.footer
    ),
  };
}

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-black text-neutral-900">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-neutral-600">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          rows={4}
          className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white"
        />
      )}
    </label>
  );
}

function ArrayField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-neutral-600">
        {label}
      </span>

      <textarea
        value={(values ?? []).join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        }
        rows={5}
        placeholder="Un élément par ligne"
        className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white"
      />

      <p className="mt-1 text-[11px] text-neutral-400">
        Un élément par ligne.
      </p>
    </label>
  );
}

export default function LandingPagePreview({
  data,
  projectId,
}: Props) {
  const [view, setView] = useState<
    "desktop" | "mobile"
  >("desktop");

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] =
    useState<LandingPageData>(
      normalizeLandingPageData(data)
    );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateHero(
    field: "title" | "subtitle" | "cta",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      hero: {
        title:
          field === "title"
            ? value
            : current.hero.title,

        subtitle:
          field === "subtitle"
            ? value
            : current.hero.subtitle,

        cta:
          field === "cta"
            ? value
            : current.hero.cta,
      },
    }));
  }

  function updateProblem(
    field: "title" | "content",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      problem: {
        title:
          field === "title"
            ? value
            : current.problem.title,

        content:
          field === "content"
            ? value
            : current.problem.content,
      },
    }));
  }

  function updateSolution(
    field: "title" | "content",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      solution: {
        title:
          field === "title"
            ? value
            : current.solution.title,

        content:
          field === "content"
            ? value
            : current.solution.content,

        benefits:
          current.solution.benefits ?? [],
      },
    }));
  }

  function updateSolutionBenefits(
    values: string[]
  ) {
    setFormData((current) => ({
      ...current,
      solution: {
        title: current.solution.title,
        content: current.solution.content,
        benefits: values,
      },
    }));
  }

  function updateOffer(
    field: "title" | "content",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      offer: {
        title:
          field === "title"
            ? value
            : current.offer.title,

        content:
          field === "content"
            ? value
            : current.offer.content,

        items:
          current.offer.items ?? [],
      },
    }));
  }

  function updateOfferItems(
    values: string[]
  ) {
    setFormData((current) => ({
      ...current,
      offer: {
        title: current.offer.title,
        content: current.offer.content,
        items: values,
      },
    }));
  }

  function updatePricing(
    field: "title" | "content",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      pricing: {
        title:
          field === "title"
            ? value
            : current.pricing.title,

        content:
          field === "content"
            ? value
            : current.pricing.content,

        plans:
          current.pricing.plans ?? [],
      },
    }));
  }

  function updatePricingPlans(
    values: string[]
  ) {
    setFormData((current) => ({
      ...current,
      pricing: {
        title: current.pricing.title,
        content: current.pricing.content,
        plans: values,
      },
    }));
  }

  function updateSocialProof(
    field: "title" | "content",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      socialProof: {
        title:
          field === "title"
            ? value
            : current.socialProof.title,

        content:
          field === "content"
            ? value
            : current.socialProof.content,
      },
    }));
  }

  function updateFaqTitle(
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      faq: {
        title: value,
        items:
          current.faq.items ?? [],
      },
    }));
  }

  function updateFaqItem(
    index: number,
    field: "question" | "answer",
    value: string
  ) {
    setFormData((current) => {
      const items = [
        ...(current.faq?.items ?? []),
      ];

      if (!items[index]) {
        items[index] = {
          question: "",
          answer: "",
        };
      }

      if (field === "question") {
        items[index] = {
          question: value,
          answer: items[index].answer,
        };
      } else {
        items[index] = {
          question: items[index].question,
          answer: value,
        };
      }

      return {
        ...current,
        faq: {
          title: current.faq.title,
          items,
        },
      };
    });
  }

  function updateContact(
    field: "title" | "content" | "cta",
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      contact: {
        title:
          field === "title"
            ? value
            : current.contact.title,

        content:
          field === "content"
            ? value
            : current.contact.content,

        cta:
          field === "cta"
            ? value
            : current.contact.cta,
      },
    }));
  }

  function updateFooter(value: string) {
    setFormData((current) => ({
      ...current,
      footer: value,
    }));
  }

  async function saveChanges() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch(
        `/api/projects/${projectId}/landing-page/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Impossible d'enregistrer les modifications."
        );
      }

      setSaved(true);
      setEditing(false);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setFormData(
      normalizeLandingPageData(data)
    );

    setEditing(false);
    setError("");
    setSaved(false);
  }

  const benefits =
    formData.solution?.benefits ?? [];

  const offerItems =
    formData.offer?.items ?? [];

  const pricingPlans =
    formData.pricing?.plans ?? [];

  const faqItems =
    formData.faq?.items ?? [];

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-sm">

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 bg-white p-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
            Aperçu de la landing page
          </p>

          <p className="mt-1 text-sm font-semibold text-neutral-900">
            {editing
              ? "Mode édition"
              : "Aperçu de votre page"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              setView("desktop")
            }
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              view === "desktop"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Desktop
          </button>

          <button
            type="button"
            onClick={() =>
              setView("mobile")
            }
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              view === "mobile"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Mobile
          </button>

          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setFormData(
                  normalizeLandingPageData(data)
                );

                setEditing(true);
                setSaved(false);
                setError("");
              }}
              className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-black text-black transition hover:bg-amber-300"
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-300 disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={saveChanges}
                disabled={saving}
                className="rounded-lg bg-black px-4 py-2 text-xs font-black text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      {(saved || error) && (
        <div className="border-b border-neutral-200 bg-white px-4 pb-4">

          {saved && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
              ✓ Modifications enregistrées avec succès.
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>
      )}

      {/* EDITOR */}
      {editing && (
        <div className="border-b border-neutral-200 bg-[#f7f7f4] p-4 md:p-6">

          <div className="mx-auto max-w-5xl space-y-5">

            <div className="rounded-2xl bg-black p-5 text-white">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">
                Éditeur IDIFY
              </p>

              <h3 className="mt-2 text-lg font-black">
                Personnalisez votre landing page
              </h3>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-neutral-400">
                Modifiez les textes ci-dessous. L’aperçu se
                met à jour automatiquement.
              </p>
            </div>

            {/* HERO */}
            <EditorSection
              title="Hero"
              description="La première section visible par vos visiteurs."
            >
              <Field
                label="Titre"
                value={formData.hero.title}
                onChange={(value) =>
                  updateHero("title", value)
                }
              />

              <Field
                label="Sous-titre"
                value={formData.hero.subtitle}
                onChange={(value) =>
                  updateHero("subtitle", value)
                }
                textarea
              />

              <Field
                label="Bouton principal"
                value={formData.hero.cta}
                onChange={(value) =>
                  updateHero("cta", value)
                }
              />
            </EditorSection>

            {/* PROBLEM */}
            <EditorSection
              title="Problème"
              description="Présentez le problème auquel votre offre répond."
            >
              <Field
                label="Titre"
                value={formData.problem.title}
                onChange={(value) =>
                  updateProblem("title", value)
                }
              />

              <Field
                label="Contenu"
                value={formData.problem.content}
                onChange={(value) =>
                  updateProblem("content", value)
                }
                textarea
              />
            </EditorSection>

            {/* SOLUTION */}
            <EditorSection
              title="Solution"
              description="Expliquez votre solution et ses bénéfices."
            >
              <Field
                label="Titre"
                value={formData.solution.title}
                onChange={(value) =>
                  updateSolution("title", value)
                }
              />

              <Field
                label="Contenu"
                value={formData.solution.content}
                onChange={(value) =>
                  updateSolution("content", value)
                }
                textarea
              />

              <ArrayField
                label="Bénéfices"
                values={benefits}
                onChange={updateSolutionBenefits}
              />
            </EditorSection>

            {/* OFFER */}
            <EditorSection
              title="Offre"
              description="Présentez ce que vous proposez concrètement."
            >
              <Field
                label="Titre"
                value={formData.offer.title}
                onChange={(value) =>
                  updateOffer("title", value)
                }
              />

              <Field
                label="Contenu"
                value={formData.offer.content}
                onChange={(value) =>
                  updateOffer("content", value)
                }
                textarea
              />

              <ArrayField
                label="Éléments de l'offre"
                values={offerItems}
                onChange={updateOfferItems}
              />
            </EditorSection>

            {/* PRICING */}
            <EditorSection
              title="Tarification"
              description="Personnalisez la présentation de vos tarifs."
            >
              <Field
                label="Titre"
                value={formData.pricing.title}
                onChange={(value) =>
                  updatePricing("title", value)
                }
              />

              <Field
                label="Description"
                value={formData.pricing.content}
                onChange={(value) =>
                  updatePricing("content", value)
                }
                textarea
              />

              <ArrayField
                label="Plans / tarifs"
                values={pricingPlans}
                onChange={updatePricingPlans}
              />
            </EditorSection>

            {/* SOCIAL PROOF */}
            <EditorSection
              title="Preuve sociale"
              description="Ajoutez un message rassurant sans inventer de témoignages."
            >
              <Field
                label="Titre"
                value={formData.socialProof.title}
                onChange={(value) =>
                  updateSocialProof(
                    "title",
                    value
                  )
                }
              />

              <Field
                label="Contenu"
                value={formData.socialProof.content}
                onChange={(value) =>
                  updateSocialProof(
                    "content",
                    value
                  )
                }
                textarea
              />
            </EditorSection>

            {/* FAQ */}
            <EditorSection
              title="Questions fréquentes"
              description="Modifiez les questions et réponses de votre FAQ."
            >
              <Field
                label="Titre de la FAQ"
                value={formData.faq.title}
                onChange={updateFaqTitle}
              />

              {faqItems.length > 0 ? (
                faqItems.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                    >
                      <p className="mb-4 text-xs font-black text-neutral-400">
                        QUESTION {index + 1}
                      </p>

                      <div className="space-y-4">

                        <Field
                          label="Question"
                          value={item.question}
                          onChange={(value) =>
                            updateFaqItem(
                              index,
                              "question",
                              value
                            )
                          }
                        />

                        <Field
                          label="Réponse"
                          value={item.answer}
                          onChange={(value) =>
                            updateFaqItem(
                              index,
                              "answer",
                              value
                            )
                          }
                          textarea
                        />

                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="rounded-xl bg-neutral-50 p-4 text-xs text-neutral-500">
                  Aucune question FAQ disponible.
                </p>
              )}
            </EditorSection>

            {/* CONTACT */}
            <EditorSection
              title="Contact"
              description="Dernier appel à l'action de la page."
            >
              <Field
                label="Titre"
                value={formData.contact.title}
                onChange={(value) =>
                  updateContact("title", value)
                }
              />

              <Field
                label="Contenu"
                value={formData.contact.content}
                onChange={(value) =>
                  updateContact(
                    "content",
                    value
                  )
                }
                textarea
              />

              <Field
                label="Bouton"
                value={formData.contact.cta}
                onChange={(value) =>
                  updateContact("cta", value)
                }
              />
            </EditorSection>

            {/* FOOTER */}
            <EditorSection title="Footer">
              <Field
                label="Texte du footer"
                value={formData.footer}
                onChange={updateFooter}
              />
            </EditorSection>

          </div>
        </div>
      )}

      {/* PREVIEW */}
      <div className="overflow-auto bg-neutral-200 p-4 md:p-8">

        <div
          className={`mx-auto overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-2xl transition-all ${
            view === "mobile"
              ? "w-[390px] max-w-full"
              : "w-full max-w-[1200px]"
          }`}
        >

          {/* HERO */}
          <section className="relative overflow-hidden bg-black px-6 py-16 text-white md:px-12 md:py-24">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

            <div className="relative mx-auto max-w-4xl text-center">

              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
                IDIFY
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                {formData.hero.title}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">
                {formData.hero.subtitle}
              </p>

              <button
                type="button"
                className="mt-8 rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-black"
              >
                {formData.hero.cta}
              </button>

            </div>
          </section>

          {/* PROBLEM */}
          <section className="px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-4xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                Le problème
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.problem.title}
              </h2>

              <p className="mt-6 text-base leading-8 text-neutral-600">
                {formData.problem.content}
              </p>

            </div>
          </section>

          {/* SOLUTION */}
          <section className="bg-[#f7f7f4] px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-5xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                La solution
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.solution.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600">
                {formData.solution.content}
              </p>

              {benefits.length > 0 && (
                <div className="mt-8 grid gap-4 md:grid-cols-2">

                  {benefits.map(
                    (benefit, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-neutral-200 bg-white p-5"
                      >

                        <div className="flex gap-4">

                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-xs font-black text-white">
                            ✓
                          </span>

                          <p className="text-sm font-semibold leading-6 text-neutral-700">
                            {benefit}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>

          {/* OFFER */}
          <section className="px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-5xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                L'offre
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.offer.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-600">
                {formData.offer.content}
              </p>

              {offerItems.length > 0 && (
                <div className="mt-8 grid gap-3">

                  {offerItems.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4"
                      >

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-black">
                          {index + 1}
                        </span>

                        <p className="text-sm font-semibold text-neutral-700">
                          {item}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>

          {/* PRICING */}
          <section className="bg-black px-6 py-14 text-white md:px-12 md:py-20">

            <div className="mx-auto max-w-5xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-400">
                Tarification
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.pricing.title}
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-400">
                {formData.pricing.content}
              </p>

              {pricingPlans.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {pricingPlans.map(
                    (plan, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6"
                      >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-sm font-black text-black">
                          {index + 1}
                        </div>

                        <p className="mt-5 text-sm font-semibold leading-6 text-neutral-200">
                          {plan}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-4xl text-center">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                Confiance
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.socialProof.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-neutral-600">
                {formData.socialProof.content}
              </p>

            </div>
          </section>

          {/* FAQ */}
          <section className="bg-[#f7f7f4] px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-4xl">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">
                FAQ
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                {formData.faq.title}
              </h2>

              {faqItems.length > 0 && (
                <div className="mt-8 space-y-3">

                  {faqItems.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-neutral-200 bg-white p-5"
                      >

                        <p className="text-sm font-black text-neutral-900">
                          {item.question}
                        </p>

                        <p className="mt-3 text-sm leading-7 text-neutral-600">
                          {item.answer}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>

          {/* CONTACT */}
          <section className="px-6 py-14 md:px-12 md:py-20">

            <div className="mx-auto max-w-4xl rounded-3xl bg-amber-400 p-8 text-center md:p-12">

              <h2 className="text-3xl font-black tracking-tight text-black md:text-4xl">
                {formData.contact.title}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/70">
                {formData.contact.content}
              </p>

              <button
                type="button"
                className="mt-8 rounded-xl bg-black px-6 py-3 text-sm font-black text-white"
              >
                {formData.contact.cta}
              </button>

            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-neutral-200 bg-white px-6 py-8 text-center">

            <p className="text-xs leading-6 text-neutral-400">
              {formData.footer}
            </p>

          </footer>

        </div>
      </div>
    </div>
  );
}