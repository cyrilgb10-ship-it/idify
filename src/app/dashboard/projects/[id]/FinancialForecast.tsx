"use client";

import { useState } from "react";

type Forecast = {
  assumptions: {
    initialInvestment: number;
    monthlyFixedCosts: number;
    variableCostPerSale: number;
    sellingPrice: number;
    monthlySales: number;
  };
  monthly: {
    month: number;
    sales: number;
    revenue: number;
    variableCosts: number;
    fixedCosts: number;
    totalCosts: number;
    profit: number;
    cumulativeProfit: number;
  }[];
  summary: {
    monthlyRevenue: number;
    monthlyCosts: number;
    monthlyProfit: number;
    annualRevenue: number;
    annualProfit: number;
    profitMargin: number;
    breakEvenSales: number;
    breakEvenRevenue: number;
    returnOnInvestment: number;
  };
};

type Props = {
  projectId: string;
};

function formatFCFA(value: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(value)) + " F";
}

export default function FinancialForecast({ projectId }: Props) {
  const [sellingPrice, setSellingPrice] = useState("5000");
  const [monthlySales, setMonthlySales] = useState("100");
  const [variableCostPerSale, setVariableCostPerSale] = useState("2000");
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState("100000");
  const [initialInvestment, setInitialInvestment] = useState("500000");

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateForecast() {
    setError("");
    setForecast(null);

    const values = [
      Number(sellingPrice),
      Number(monthlySales),
      Number(variableCostPerSale),
      Number(monthlyFixedCosts),
      Number(initialInvestment),
    ];

    if (values.some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Veuillez renseigner uniquement des nombres positifs.");
      return;
    }

    if (Number(sellingPrice) <= 0) {
      setError("Le prix de vente doit être supérieur à 0.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${projectId}/financial-forecast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellingPrice: Number(sellingPrice),
            monthlySales: Number(monthlySales),
            variableCostPerSale: Number(variableCostPerSale),
            monthlyFixedCosts: Number(monthlyFixedCosts),
            initialInvestment: Number(initialInvestment),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Impossible de générer les prévisions financières."
        );
        return;
      }

      setForecast(data.forecast);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
            Simulateur financier
          </p>

          <h3 className="mt-2 text-xl font-black tracking-tight">
            Estimez la rentabilité de votre projet
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Renseignez quelques hypothèses simples. IDIFY calculera
            automatiquement votre chiffre d’affaires, vos coûts, votre
            bénéfice et votre seuil de rentabilité.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Prix de vente"
            value={sellingPrice}
            onChange={setSellingPrice}
            placeholder="5000"
          />

          <Field
            label="Ventes par mois"
            value={monthlySales}
            onChange={setMonthlySales}
            placeholder="100"
          />

          <Field
            label="Coût variable / vente"
            value={variableCostPerSale}
            onChange={setVariableCostPerSale}
            placeholder="2000"
          />

          <Field
            label="Charges fixes / mois"
            value={monthlyFixedCosts}
            onChange={setMonthlyFixedCosts}
            placeholder="100000"
          />

          <Field
            label="Investissement initial"
            value={initialInvestment}
            onChange={setInitialInvestment}
            placeholder="500000"
          />
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={generateForecast}
          disabled={loading}
          className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Calcul en cours..."
            : "Générer les prévisions"}
        </button>
      </div>

      {forecast && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="CA mensuel"
              value={formatFCFA(forecast.summary.monthlyRevenue)}
            />

            <Metric
              label="Bénéfice mensuel"
              value={formatFCFA(forecast.summary.monthlyProfit)}
              positive={forecast.summary.monthlyProfit >= 0}
            />

            <Metric
              label="Bénéfice annuel"
              value={formatFCFA(forecast.summary.annualProfit)}
              positive={forecast.summary.annualProfit >= 0}
            />

            <Metric
              label="Marge bénéficiaire"
              value={`${forecast.summary.profitMargin.toFixed(1)} %`}
              positive={forecast.summary.profitMargin >= 0}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                Seuil de rentabilité
              </p>

              <p className="mt-3 text-3xl font-black">
                {forecast.summary.breakEvenSales}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                ventes nécessaires par mois
              </p>

              <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-400">
                  Chiffre d'affaires au seuil
                </p>

                <p className="mt-1 text-lg font-black text-neutral-900">
                  {formatFCFA(
                    forecast.summary.breakEvenRevenue
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                Retour sur investissement
              </p>

              <p
                className={`mt-3 text-3xl font-black ${
                  forecast.summary.returnOnInvestment >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {forecast.summary.returnOnInvestment.toFixed(1)} %
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                projection basée sur 12 mois
              </p>

              <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-400">
                  Investissement initial
                </p>

                <p className="mt-1 text-lg font-black text-neutral-900">
                  {formatFCFA(
                    forecast.assumptions.initialInvestment
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">
                Projection
              </p>

              <h3 className="mt-2 text-xl font-black">
                Prévision sur 12 mois
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-neutral-50 text-left">
                  <tr>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      Mois
                    </th>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      Ventes
                    </th>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      CA
                    </th>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      Coûts
                    </th>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      Bénéfice
                    </th>
                    <th className="px-5 py-4 font-bold text-neutral-500">
                      Cumul
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {forecast.monthly.map((month) => (
                    <tr
                      key={month.month}
                      className="border-t border-neutral-100"
                    >
                      <td className="px-5 py-4 font-bold">
                        Mois {month.month}
                      </td>

                      <td className="px-5 py-4 text-neutral-600">
                        {month.sales}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatFCFA(month.revenue)}
                      </td>

                      <td className="px-5 py-4 text-neutral-600">
                        {formatFCFA(month.totalCosts)}
                      </td>

                      <td
                        className={`px-5 py-4 font-bold ${
                          month.profit >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatFCFA(month.profit)}
                      </td>

                      <td
                        className={`px-5 py-4 font-bold ${
                          month.cumulativeProfit >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatFCFA(month.cumulativeProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-neutral-600">
        {label}
      </span>

      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-black focus:bg-white"
      />
    </label>
  );
}

function Metric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-black ${
          positive === undefined
            ? "text-neutral-950"
            : positive
              ? "text-emerald-600"
              : "text-red-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}