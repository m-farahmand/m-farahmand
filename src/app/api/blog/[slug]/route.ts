import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocaleFromRequest, mapBlogPost } from "@/lib/content";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = getLocaleFromRequest(request);

  const post = await prisma.blogPost.findUnique({
    where: { slug_lang: { slug, lang: locale } },
  });

  if (!post || !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(mapBlogPost(post));
}
