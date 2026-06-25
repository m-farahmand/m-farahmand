import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import {
  deleteProductBySlug,
  resolveProductSlugFromId,
  serializeProductsForAdmin,
  upsertProductByLang,
} from "@/lib/db-lang";

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
    const existingSlug = await resolveProductSlugFromId(id);
    if (!existingSlug) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const slug =
      data.slug ||
      slugify(data.translations.fa.name || data.translations.en.name);

    if (slug !== existingSlug) {
      await prisma.product.updateMany({
        where: { slug: existingSlug },
        data: { slug },
      });
    }

    await upsertProductByLang(
      slug,
      {
        price: data.price,
        type: data.type,
        inventory: data.type === "device" ? (data.inventory ?? 0) : null,
      },
      data.translations
    );

    const products = await serializeProductsForAdmin();
    const updated = products.find((p) => p.slug === slug);

    return NextResponse.json(updated);
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
    const slug = await resolveProductSlugFromId(id);
    if (!slug) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await deleteProductBySlug(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
