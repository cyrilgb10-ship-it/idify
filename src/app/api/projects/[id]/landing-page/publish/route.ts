import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
    where: {
      slug,
    },
    select: {
      projectId: true,
    },
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

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        name: true,
        landingPage: true,
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

    if (!project.landingPage) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vous devez d'abord générer une landing page.",
        },
        { status: 400 }
      );
    }

    const slug =
      project.landingPage.slug ||
      (await generateUniqueSlug(
        project.name,
        project.id
      ));

    const landingPage = await prisma.landingPage.update({
      where: {
        projectId: id,
      },
      data: {
        slug,
        published: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Landing page publiée avec succès.",
      landingPage: {
        id: landingPage.id,
        slug: landingPage.slug,
        published: landingPage.published,
        publishedAt: landingPage.publishedAt,
      },
    });
  } catch (error) {
    console.error(
      "LANDING_PAGE_PUBLISH_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible de publier la landing page.",
      },
      { status: 500 }
    );
  }
}