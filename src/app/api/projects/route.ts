import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canCreateProject } from "@/lib/subscription-access";

export async function POST(request: Request) {
  try {
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

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const idea = String(body.idea ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Le nom du projet est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Le nom du projet est trop long.",
        },
        { status: 400 }
      );
    }

    if (!idea) {
      return NextResponse.json(
        {
          success: false,
          message: "L'idée du projet est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (idea.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Décrivez votre idée avec au moins 10 caractères.",
        },
        { status: 400 }
      );
    }

    if (idea.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "La description de l'idée est trop longue.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Le numéro WhatsApp est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Le numéro WhatsApp est trop long.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
            status: true,
            expiresAt: true,
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
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

    const subscription = user.subscription;

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Aucun abonnement actif n'est associé à votre compte.",
        },
        { status: 403 }
      );
    }

    const isExpired = subscription.expiresAt <= new Date();

    if (isExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Votre abonnement a expiré. Veuillez renouveler votre abonnement pour créer un nouveau projet.",
          code: "SUBSCRIPTION_EXPIRED",
        },
        { status: 403 }
      );
    }

    const allowed = canCreateProject(
      subscription.plan,
      user._count.projects
    );

    if (!allowed) {
      const maxProjects =
        subscription.plan === "FREE_TRIAL"
          ? 1
          : subscription.plan === "STARTER"
            ? 5
            : null;

      return NextResponse.json(
        {
          success: false,
          message:
            maxProjects !== null
              ? `Votre abonnement ${subscription.plan === "FREE_TRIAL" ? "gratuit" : "Starter"} permet au maximum ${maxProjects} projet${maxProjects > 1 ? "s" : ""}. Passez à une offre supérieure pour continuer.`
              : "Vous ne pouvez pas créer davantage de projets avec votre abonnement actuel.",
          code: "PROJECT_LIMIT_REACHED",
          maxProjects,
        },
        { status: 403 }
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        idea,
        phone,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Projet créé avec succès.",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PROJECT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Impossible de créer le projet.",
      },
      { status: 500 }
    );
  }
}