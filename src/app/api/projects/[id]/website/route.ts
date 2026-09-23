import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/idify-engine/website";
import { canAccessWebsite } from "@/lib/subscription-access";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const userId = (
      request.headers.get("cookie") || ""
    )
      .split(";")
      .map((item) => item.trim())
      .find((item) =>
        item.startsWith("idify_user_id=")
      )
      ?.split("=")[1];

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
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur introuvable.",
        },
        { status: 404 }
      );
    }

    if (!user.subscription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Aucun abonnement actif n'est associé à votre compte.",
        },
        { status: 403 }
      );
    }

    if (
      user.subscription.expiresAt <= new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Votre abonnement a expiré.",
        },
        { status: 403 }
      );
    }

    if (
      !canAccessWebsite(
        user.subscription.plan
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "La génération de site web complet est réservée au plan Pro.",
        },
        { status: 403 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
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

    const websiteData = generateWebsite(
      project.name,
      project.idea
    );

    const website = await prisma.website.upsert({
      where: {
        projectId: project.id,
      },
      create: {
        projectId: project.id,
        content: JSON.stringify(
          websiteData
        ),
      },
      update: {
        content: JSON.stringify(
          websiteData
        ),
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
      success: true,
      website: websiteData,
    });
  } catch (error) {
    console.error(
      "WEBSITE_GENERATION_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Une erreur est survenue pendant la génération du site web.",
      },
      { status: 500 }
    );
  }
}