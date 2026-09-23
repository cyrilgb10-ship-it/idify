"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MarketingPlanButtonProps = {
  projectId: string;
};

export default function MarketingPlanButton({
  projectId,
}: MarketingPlanButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMarketingPlan() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/marketing-plan`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Impossible de générer le plan marketing."
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
        onClick={handleMarketingPlan}
        disabled={loading}
        className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Création..."
          : "Créer mon plan marketing →"}
      </button>

      {error && (
        <p className="mt-3 max-w-xs text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}