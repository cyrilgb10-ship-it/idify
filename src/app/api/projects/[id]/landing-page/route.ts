import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canAccessLandingPage } from "@/lib/subscription-access";
import { generateLandingPage } from "@/lib/idify-engine/landing-page";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function generateUniqueSlug(
  projectName: string,
  projectId: string
) {
  const base = createSlug(projectName) || "projet";

  let slug = base;

  const existing = await prisma.landingPage.findUnique({
    where: { slug },
    select: { projectId: true },
  });

  if (existing && existing.projectId !== projectId) {
    slug = `${base}-${projectId.slice(-6)}`;
  }

  return slug;
}

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

    if (!canAccessLandingPage(user.subscription.plan)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "La génération de landing pages est disponible à partir du plan Business.",
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
        name: true,
        idea: true,
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

    const landingPageData = generateLandingPage(
      project.name,
      project.idea
    );

    const existingLandingPage =
      await prisma.landingPage.findUnique({
        where: {
          projectId: id,
        },
      });

    const slug =
      existingLandingPage?.slug ??
      (await generateUniqueSlug(
        project.name,
        project.id
      ));

    const landingPage = await prisma.landingPage.upsert({
      where: {
        projectId: id,
      },
      update: {
        content: JSON.stringify(landingPageData),
      },
      create: {
        projectId: id,
        content: JSON.stringify(landingPageData),
        slug,
        published: false,
      },
    });

    await prisma.project.update({
      where: {
        id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      landingPage,
    });
  } catch (error) {
    console.error(
      "LANDING_PAGE_GENERATION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible de générer la landing page.",
      },
      { status: 500 }
    );
  }
}