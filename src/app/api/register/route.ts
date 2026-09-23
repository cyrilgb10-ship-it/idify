import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSubscriptionExpiration } from "@/lib/billing";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Cette adresse email est déjà utilisée.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const startedAt = new Date();

    const expiresAt = getSubscriptionExpiration(
      "FREE_TRIAL",
      startedAt
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,

        subscription: {
          create: {
            plan: "FREE_TRIAL",
            status: "ACTIVE",
            startedAt,
            expiresAt,
          },
        },
      },

      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        error: "Une erreur interne est survenue.",
      },
      { status: 500 }
    );
  }
}
