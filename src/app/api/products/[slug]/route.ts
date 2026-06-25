import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachProductMedia, getLocaleFromRequest } from "@/lib/content";
import { getProductMediaBySlug } from "@/lib/db-lang";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = getLocaleFromRequest(request);

  const product = await prisma.product.findUnique({
    where: { slug_lang: { slug, lang: locale } },
    include: { media: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const [mapped] = await attachProductMedia([product], getProductMediaBySlug);
  return NextResponse.json(mapped);
}
