import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canAccessVisualIdentity } from "@/lib/subscription-access";
import cloudinary from "@/lib/cloudinary";

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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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

    if (!canAccessVisualIdentity(user.subscription.plan)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "L'identité visuelle est disponible à partir du plan Business.",
          code: "PLAN_REQUIRED",
          requiredPlan: "BUSINESS",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucune image fournie.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Le fichier doit être une image.",
        },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "L'image ne doit pas dépasser 10 Mo.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `idify/projects/${project.id}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Upload Cloudinary impossible."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });

    const prompt = formData.get("prompt");

    const generatedImage = await prisma.generatedImage.create({
      data: {
        projectId: project.id,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        prompt: prompt ? String(prompt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      image: generatedImage,
    });
  } catch (error) {
    console.error("PROJECT_IMAGE_UPLOAD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Impossible d'enregistrer l'image.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
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

    const images = await prisma.generatedImage.findMany({
      where: {
        projectId: project.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("PROJECT_IMAGES_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Impossible de récupérer les images.",
      },
      { status: 500 }
    );
  }
}