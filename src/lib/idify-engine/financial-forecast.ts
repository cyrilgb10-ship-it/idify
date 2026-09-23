export type FinancialForecastData = {
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

function safeNumber(value: number, fallback = 0) {
  if (!Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return value;
}

export function generateFinancialForecast(
  sellingPrice: number,
  monthlySales: number,
  variableCostPerSale: number,
  monthlyFixedCosts: number,
  initialInvestment: number
): FinancialForecastData {
  const price = safeNumber(sellingPrice);
  const sales = Math.floor(safeNumber(monthlySales));
  const variableCost = safeNumber(variableCostPerSale);
  const fixedCosts = safeNumber(monthlyFixedCosts);
  const investment = safeNumber(initialInvestment);

  const monthlyRevenue = price * sales;
  const monthlyVariableCosts = variableCost * sales;
  const monthlyCosts = monthlyVariableCosts + fixedCosts;
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  const profitMargin =
    monthlyRevenue > 0
      ? (monthlyProfit / monthlyRevenue) * 100
      : 0;

  const contributionPerSale = price - variableCost;

  const breakEvenSales =
    contributionPerSale > 0
      ? Math.ceil(fixedCosts / contributionPerSale)
      : 0;

  const breakEvenRevenue = breakEvenSales * price;

  const months: FinancialForecastData["monthly"] = [];

  let cumulativeProfit = -investment;

  for (let month = 1; month <= 12; month++) {
    const revenue = monthlyRevenue;
    const variableCosts = monthlyVariableCosts;
    const totalCosts = variableCosts + fixedCosts;
    const profit = revenue - totalCosts;

    cumulativeProfit += profit;

    months.push({
      month,
      sales,
      revenue,
      variableCosts,
      fixedCosts,
      totalCosts,
      profit,
      cumulativeProfit,
    });
  }

  const annualRevenue = monthlyRevenue * 12;
  const annualProfit = monthlyProfit * 12;

  const returnOnInvestment =
    investment > 0
      ? (annualProfit / investment) * 100
      : 0;

  return {
    assumptions: {
      initialInvestment: investment,
      monthlyFixedCosts: fixedCosts,
      variableCostPerSale: variableCost,
      sellingPrice: price,
      monthlySales: sales,
    },

    monthly: months,

    summary: {
      monthlyRevenue,
      monthlyCosts,
      monthlyProfit,
      annualRevenue,
      annualProfit,
      profitMargin,
      breakEvenSales,
      breakEvenRevenue,
      returnOnInvestment,
    },
  };
}