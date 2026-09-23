"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BusinessPlanButtonProps = {
  projectId: string;
};

export default function BusinessPlanButton({
  projectId,
}: BusinessPlanButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBusinessPlan() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/business-plan`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Impossible de générer le business plan."
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
        onClick={handleBusinessPlan}
        disabled={loading}
        className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Création..."
          : "Créer mon business plan →"}
      </button>

      {error && (
        <p className="mt-3 max-w-xs text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}