"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  published?: boolean;
  slug?: string | null;
};

export default function PublishLandingPageButton({
  projectId,
  published = false,
  slug = null,
}: Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [publishedState, setPublishedState] =
    useState(published);
  const [currentSlug, setCurrentSlug] =
    useState<string | null>(slug);

  async function publish() {
    try {
      setIsPublishing(true);

      const response = await fetch(
        `/api/projects/${projectId}/landing-page/publish`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Impossible de publier la landing page."
        );
        return;
      }

      setPublishedState(true);
      setCurrentSlug(data.landingPage.slug);
    } catch (error) {
      console.error(error);

      alert(
        "Une erreur est survenue pendant la publication."
      );
    } finally {
      setIsPublishing(false);
    }
  }

  async function copyLink() {
    if (!currentSlug) {
      return;
    }

    const url = `${window.location.origin}/p/${currentSlug}`;

    try {
      await navigator.clipboard.writeText(url);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      alert("Impossible de copier le lien.");
    }
  }

  // URL relative volontairement :
  // elle est identique côté serveur et côté navigateur.
  const publicUrl = currentSlug
    ? `/p/${currentSlug}`
    : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {!publishedState ? (
        <button
          type="button"
          onClick={publish}
          disabled={isPublishing}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPublishing
            ? "Publication..."
            : "Publier la landing page"}
        </button>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Landing page publiée
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            {isCopied
              ? "Lien copié ✓"
              : "Copier le lien"}
          </button>

          {publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
            >
              Voir la page →
            </a>
          )}
        </>
      )}
    </div>
  );
}