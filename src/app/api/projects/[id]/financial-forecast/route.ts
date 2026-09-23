import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  canAccessFinancialForecast,
} from "@/lib/subscription-access";
import {
  generateFinancialForecast,
} from "@/lib/idify-engine/financial-forecast";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("idify_user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous devez être connecté.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: {
          select: {
            plan: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user?.subscription) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun abonnement actif.",
        },
        { status: 403 }
      );
    }

    if (user.subscription.expiresAt <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Votre abonnement a expiré.",
          code: "SUBSCRIPTION_EXPIRED",
        },
        { status: 403 }
      );
    }

    if (!canAccessFinancialForecast(user.subscription.plan)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Les prévisions financières sont disponibles à partir du plan Business.",
          code: "PLAN_REQUIRED",
          requiredPlan: "BUSINESS",
        },
        { status: 403 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Projet introuvable.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const sellingPrice = Number(body.sellingPrice);
    const monthlySales = Number(body.monthlySales);
    const variableCostPerSale = Number(body.variableCostPerSale);
    const monthlyFixedCosts = Number(body.monthlyFixedCosts);
    const initialInvestment = Number(body.initialInvestment);

    const values = [
      sellingPrice,
      monthlySales,
      variableCostPerSale,
      monthlyFixedCosts,
      initialInvestment,
    ];

    if (
      values.some(
        (value) =>
          !Number.isFinite(value) || value < 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tous les montants doivent être des nombres positifs.",
        },
        { status: 400 }
      );
    }

    if (sellingPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Le prix de vente doit être supérieur à 0.",
        },
        { status: 400 }
      );
    }

    const forecast = generateFinancialForecast(
      sellingPrice,
      monthlySales,
      variableCostPerSale,
      monthlyFixedCosts,
      initialInvestment
    );

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      forecast,
    });
  } catch (error) {
    console.error(
      "FINANCIAL_FORECAST_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible de générer les prévisions financières.",
      },
      { status: 500 }
    );
  }
}