import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { formatAnalysis } from "@/lib/idify-engine/analyzer";

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
        {
          error: "Vous devez être connecté.",
        },
        { status: 401 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        name: true,
        idea: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Projet introuvable.",
        },
        { status: 404 }
      );
    }

    const content = formatAnalysis(
      project.name,
      project.idea
    );

    const analysis = await prisma.aIAnalysis.upsert({
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
      message: "Analyse générée avec succès.",
      analysis,
    });
  } catch (error) {
    console.error(
      "PROJECT_ANALYSIS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de générer l'analyse du projet.",
      },
      { status: 500 }
    );
  }
}