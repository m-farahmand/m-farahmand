import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = productSchema.parse(body);
    const slug = data.slug || slugify(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDesc: data.shortDesc || "",
        price: data.price,
        type: data.type,
        inventory: data.type === "device" ? (data.inventory ?? 0) : null,
        features: data.features || "",
      },
      include: { media: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
