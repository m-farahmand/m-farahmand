import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  attachProductMedia,
  getLocaleFromRequest,
} from "@/lib/content";
import { getProductMediaBySlug } from "@/lib/db-lang";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);

  const products = await prisma.product.findMany({
    where: { lang: locale },
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = await attachProductMedia(products, getProductMediaBySlug);
  return NextResponse.json(mapped);
}
