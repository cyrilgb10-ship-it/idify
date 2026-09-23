"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  initialPhone: string | null;
};

export default function ProjectContact({
  projectId,
  initialPhone,
}: Props) {
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function savePhone() {
    setMessage("");

    if (!phone.trim()) {
      setMessage("Veuillez renseigner un numéro WhatsApp.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `/api/projects/${projectId}/contact`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.error ||
            data.message ||
            "Impossible d'enregistrer le numéro."
        );
        return;
      }

      setPhone(data.project.phone);
      setMessage("Numéro WhatsApp enregistré ✓");
    } catch (error) {
      console.error(error);

      setMessage(
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
            Contact commercial
          </p>

          <h3 className="mt-2 text-base font-bold text-neutral-900">
            WhatsApp de votre projet
          </h3>

          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Ce numéro sera utilisé par les visiteurs de votre
            landing page pour vous contacter directement sur
            WhatsApp.
          </p>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="+228 90 00 00 00"
            className="mt-4 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black"
          />
        </div>

        <button
          type="button"
          onClick={savePhone}
          disabled={isSaving}
          className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-xs font-medium ${
            message.includes("✓")
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}