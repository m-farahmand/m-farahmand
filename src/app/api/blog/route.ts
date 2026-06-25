import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocaleFromRequest, mapBlogPost } from "@/lib/content";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);

  const posts = await prisma.blogPost.findMany({
    where: { published: true, lang: locale },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts.map(mapBlogPost));
}
