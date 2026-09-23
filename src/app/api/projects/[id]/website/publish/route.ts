import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

type Props = {
params: Promise<{
id: string;
}>;
};

function createSlug(name: string) {
return name
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "")
.slice(0, 60);
}

async function generateUniqueSlug(
baseSlug: string,
websiteId: string
) {
const cleanBase =
createSlug(baseSlug) ||
`site-${websiteId.slice(0, 8)}`;

let slug = cleanBase;

const existing = await prisma.website.findFirst({
where: {
slug,
NOT: {
id: websiteId,
},
},
select: {
id: true,
},
});

if (!existing) {
return slug;
}

let counter = 2;

while (true) {
const candidate = `${cleanBase}-${counter}`;

const conflict = await prisma.website.findFirst({
  where: {
    slug: candidate,
    NOT: {
      id: websiteId,
    },
  },
  select: {
    id: true,
  },
});

if (!conflict) {
  return candidate;
}

counter += 1;

}
}

export async function POST(
_request: Request,
{ params }: Props
) {
try {
const cookieStore = await cookies();

const userId =
  cookieStore.get("idify_user_id")?.value;

if (!userId) {
  return NextResponse.json(
    {
      success: false,
      message: "Vous devez être connecté.",
    },
    { status: 401 }
  );
}

const { id } = await params;

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
        "Vous devez avoir un abonnement Pro actif.",
    },
    { status: 403 }
  );
}

if (user.subscription.plan !== "PRO") {
  return NextResponse.json(
    {
      success: false,
      message:
        "La publication du site est réservée au plan Pro.",
    },
    { status: 403 }
  );
}

if (
  user.subscription.expiresAt < new Date()
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Votre abonnement Pro a expiré.",
    },
    { status: 403 }
  );
}

const project = await prisma.project.findFirst({
  where: {
    id,
    userId,
  },
  include: {
    website: true,
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

if (!project.website) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Vous devez d'abord générer le site.",
    },
    { status: 400 }
  );
}

const slug = await generateUniqueSlug(
  project.website.slug ||
    project.name,
  project.website.id
);

const website =
  await prisma.website.update({
    where: {
      id: project.website.id,
    },
    data: {
      slug,
      published: true,
      publishedAt: new Date(),
    },
  });

return NextResponse.json({
  success: true,
  message:
    "Site publié avec succès.",
  website: {
    id: website.id,
    slug: website.slug,
    published: website.published,
    publishedAt:
      website.publishedAt,
  },
});

} catch (error) {
console.error(
"WEBSITE_PUBLISH_ERROR:",
error
);

return NextResponse.json(
  {
    success: false,
    message:
      "Une erreur est survenue pendant la publication.",
  },
  { status: 500 }
);

}
}
