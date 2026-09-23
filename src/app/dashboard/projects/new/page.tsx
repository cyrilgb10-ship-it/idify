"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Veuillez donner un nom à votre projet.");
      return;
    }

    if (idea.trim().length < 10) {
      setError(
        "Décrivez votre idée avec au moins 10 caractères."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Veuillez renseigner votre numéro WhatsApp."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          idea: idea.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Impossible de créer le projet."
        );
        return;
      }

      router.push(
        `/dashboard/projects/${data.project.id}`
      );
    } catch (error) {
      console.error(error);

      setError(
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-amber-600">
            Nouveau projet
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            Transformons votre idée en projet
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
            Décrivez votre idée. IDIFY va ensuite vous aider
            à structurer votre projet, son positionnement,
            votre business plan, votre marketing et votre
            landing page.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-7">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-neutral-900"
              >
                Nom du projet
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Ex : Jus Naturels Lomé"
                maxLength={100}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
              />

              <p className="mt-2 text-xs text-neutral-500">
                Donnez un nom simple et mémorisable à votre
                projet.
              </p>
            </div>

            <div>
              <label
                htmlFor="idea"
                className="mb-2 block text-sm font-semibold text-neutral-900"
              >
                Votre idée
              </label>

              <textarea
                id="idea"
                value={idea}
                onChange={(event) =>
                  setIdea(event.target.value)
                }
                placeholder="Ex : Je veux vendre des jus naturels à Lomé, principalement aux étudiants, travailleurs et familles..."
                maxLength={2000}
                rows={7}
                className="w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
              />

              <div className="mt-2 flex justify-between gap-4 text-xs text-neutral-500">
                <span>
                  Plus votre description est précise, plus
                  l'analyse sera pertinente.
                </span>

                <span className="shrink-0">
                  {idea.length}/2000
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-neutral-900"
              >
                Numéro WhatsApp professionnel
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="Ex : +228 90 00 00 00"
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
              />

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Ce numéro sera utilisé par vos visiteurs
                pour vous contacter depuis votre landing page.
                Utilisez de préférence un numéro WhatsApp
                professionnel.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-2xl border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Création du projet..."
                  : "Créer mon projet →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}