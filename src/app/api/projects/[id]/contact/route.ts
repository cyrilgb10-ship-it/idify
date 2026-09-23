import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("idify_user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Vous devez être connecté.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const phone = String(body.phone ?? "").trim();

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Le numéro WhatsApp est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          error: "Le numéro WhatsApp est trop long.",
        },
        { status: 400 }
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
          error: "Projet introuvable.",
        },
        { status: 404 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        phone,
      },
      select: {
        id: true,
        phone: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Numéro WhatsApp enregistré.",
      project: updatedProject,
    });
  } catch (error) {
    console.error(
      "UPDATE_PROJECT_CONTACT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Impossible d'enregistrer le numéro WhatsApp.",
      },
      { status: 500 }
    );
  }
}