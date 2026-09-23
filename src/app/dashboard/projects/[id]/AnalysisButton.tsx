"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnalysisButtonProps = {
  projectId: string;
};

export default function AnalysisButton({
  projectId,
}: AnalysisButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalysis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/analysis`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Impossible de générer l'analyse."
        );
        return;
      }

      router.refresh();
    } catch {
      setError(
        "Impossible de contacter le serveur. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={handleAnalysis}
        disabled={loading}
        className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Analyse en cours..."
          : "Analyser mon idée →"}
      </button>

      {error && (
        <p className="mt-3 max-w-xs text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}