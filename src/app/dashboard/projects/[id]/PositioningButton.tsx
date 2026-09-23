"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PositioningButtonProps = {
  projectId: string;
};

export default function PositioningButton({
  projectId,
}: PositioningButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handlePositioning() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/positioning`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Impossible de générer le positionnement."
        );
        return;
      }

      router.refresh();
    } catch {
      setError(
        "Impossible de contacter le serveur. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={handlePositioning}
        disabled={loading}
        className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Création..."
          : "Créer mon positionnement →"}
      </button>

      {error && (
        <p className="mt-3 max-w-xs text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}