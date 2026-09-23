import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { formatMarketingPlan } from "@/lib/idify-engine/marketing-plan";
import { analyzeProject } from "@/lib/idify-engine/analyzer";
import { generatePositioning } from "@/lib/idify-engine/positioning";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("idify_user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        analysis: true,
        positioning: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projet introuvable." },
        { status: 404 }
      );
    }

    if (!project.analysis) {
      return NextResponse.json(
        {
          error:
            "Vous devez d'abord générer l'analyse du projet.",
        },
        { status: 400 }
      );
    }

    if (!project.positioning) {
      return NextResponse.json(
        {
          error:
            "Vous devez d'abord générer le positionnement du projet.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeProject(
      project.name,
      project.idea
    );

    const positioning = generatePositioning(
      project.name,
      project.idea
    );

    const content = formatMarketingPlan(
      project.name,
      project.idea,
      analysis,
      positioning
    );

    const marketingPlan =
      await prisma.marketingPlan.upsert({
        where: {
          projectId: project.id,
        },
        update: {
          content,
        },
        create: {
          projectId: project.id,
          content,
        },
      });

    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      message: "Plan marketing généré avec succès.",
      marketingPlan,
    });
  } catch (error) {
    console.error(
      "PROJECT_MARKETING_PLAN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de générer le plan marketing du projet.",
      },
      { status: 500 }
    );
  }
}