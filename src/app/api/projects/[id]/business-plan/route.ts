import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { formatBusinessPlan } from "@/lib/idify-engine/business-plan";
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

    const analysis = project.analysis
      ? analyzeProject(project.name, project.idea)
      : null;

    if (!analysis) {
      return NextResponse.json(
        {
          error:
            "Vous devez d'abord générer l'analyse du projet.",
        },
        { status: 400 }
      );
    }

    const positioning = project.positioning
      ? project.positioning
      : generatePositioning(
          project.name,
          project.idea
        );

    const content = formatBusinessPlan(
      project.name,
      project.idea,
      analysis,
      positioning
    );

    const businessPlan =
      await prisma.businessPlan.upsert({
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
      message: "Business plan généré avec succès.",
      businessPlan,
    });
  } catch (error) {
    console.error(
      "PROJECT_BUSINESS_PLAN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de générer le business plan du projet.",
      },
      { status: 500 }
    );
  }
}