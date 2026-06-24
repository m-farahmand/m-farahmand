import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        shortDesc: data.shortDesc || "",
        price: data.price,
        type: data.type,
        inventory: data.type === "device" ? (data.inventory ?? 0) : null,
        features: data.features || "",
      },
      include: { media: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
