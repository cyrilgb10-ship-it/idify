"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Email ou mot de passe incorrect.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur de connexion est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl lg:grid-cols-2">

          {/* Présentation */}
          <section className="hidden min-h-[680px] flex-col justify-between border-r border-white/10 p-10 lg:flex xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-[#050816]">
                  I
                </div>

                <span className="text-2xl font-bold tracking-tight">
                  IDIFY
                </span>
              </div>

              <div className="mt-28 max-w-lg">
                <div className="mb-5 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
                  ✦ Ton espace de création
                </div>

                <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                  Ton idée.
                  <span className="block bg-gradient-to-r from-violet-300 via-white to-blue-300 bg-clip-text text-transparent">
                    Ton business.
                  </span>
                </h1>

                <p className="mt-7 max-w-md text-lg leading-8 text-slate-400">
                  Retrouve tes projets, tes analyses, tes stratégies marketing
                  et toutes tes créations IA au même endroit.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-3">
                  <InfoCard
                    title="Projets"
                    text="Organise tes idées"
                  />

                  <InfoCard
                    title="IA"
                    text="Génère tes contenus"
                  />

                  <InfoCard
                    title="Business"
                    text="Structure ton projet"
                  />

                  <InfoCard
                    title="Marketing"
                    text="Prépare ton lancement"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} IDIFY
            </p>
          </section>

          {/* Formulaire */}
          <section className="flex min-h-[680px] items-center justify-center p-6 sm:p-10 xl:p-14">
            <div className="w-full max-w-md">

              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-[#050816]">
                  I
                </div>

                <span className="text-xl font-bold">
                  IDIFY
                </span>
              </div>

              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  BIENVENUE
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Bon retour 👋
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Connecte-toi pour retrouver ton espace IDIFY.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Adresse email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="toi@example.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      Mot de passe
                    </label>

                   
                </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ton mot de passe"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-slate-600 outline-none transition focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-2xl bg-white px-5 py-4 font-semibold text-[#050816] transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {loading ? "Connexion..." : "Se connecter"}
                  </span>

                  {!loading && (
                    <span className="absolute right-5 text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-600">OU</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-sm text-slate-500">
                Tu n'as pas encore de compte ?{" "}
                <a
                  href="/register"
                  className="font-semibold text-white transition hover:text-violet-300"
                >
                  Créer un compte
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-sm font-semibold text-white">
        {title}
      </div>

      <div className="mt-1 text-xs text-slate-500">
        {text}
      </div>
    </div>
  );
}