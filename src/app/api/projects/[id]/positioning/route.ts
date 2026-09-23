import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
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

    const userId =
      cookieStore.get("idify_user_id")?.value;

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

    const positioning = generatePositioning(
      project.name,
      project.idea
    );

    const savedPositioning =
      await prisma.positioning.upsert({
        where: {
          projectId: project.id,
        },
        update: positioning,
        create: {
          projectId: project.id,
          ...positioning,
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
      message:
        "Positionnement généré avec succès.",
      positioning: savedPositioning,
    });
  } catch (error) {
    console.error(
      "PROJECT_POSITIONING_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Impossible de générer le positionnement du projet.",
      },
      { status: 500 }
    );
  }
}