import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import {
  serializeProductsForAdmin,
  upsertProductByLang,
} from "@/lib/db-lang";

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

  return NextResponse.json(await serializeProductsForAdmin());
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = productSchema.parse(body);
    const slug =
      data.slug || slugify(data.translations.fa.name || data.translations.en.name);

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
    const created = products.find((p) => p.slug === slug);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
