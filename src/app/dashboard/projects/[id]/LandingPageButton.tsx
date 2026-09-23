"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
projectId: string;
};

export default function LandingPageButton({
projectId,
}: Props) {
const router = useRouter();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function generateLandingPage() {
try {
setLoading(true);
setError("");

  const response = await fetch(
    `/api/projects/${projectId}/landing-page`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        data.error ||
        "Impossible de générer la landing page."
    );
  }

  router.refresh();
} catch (err) {
  console.error(
    "LANDING_PAGE_GENERATION_ERROR:",
    err
  );

  setError(
    err instanceof Error
      ? err.message
      : "Une erreur est survenue."
  );
} finally {
  setLoading(false);
}

}

return ( <div> <button
     type="button"
     onClick={generateLandingPage}
     disabled={loading}
     className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
   >
{loading ? (
<> <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
Génération...
</>
) : (
<> <span>✦</span>
Générer ma landing page
</>
)} </button>

```
  {error && (
    <p className="mt-3 max-w-md text-sm font-medium leading-6 text-red-600">
      {error}
    </p>
  )}
</div>

);
}
