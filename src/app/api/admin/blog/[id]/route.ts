import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";
import {
  deleteBlogBySlug,
  resolveBlogSlugFromId,
  serializeBlogPostsForAdmin,
  upsertBlogByLang,
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
    const data = blogPostSchema.parse(body);
    const existingSlug = await resolveBlogSlugFromId(id);
    if (!existingSlug) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const slug =
      data.slug ||
      slugify(data.translations.fa.title || data.translations.en.title);

    if (slug !== existingSlug) {
      await prisma.blogPost.updateMany({
        where: { slug: existingSlug },
        data: { slug },
      });
    }

    await upsertBlogByLang(slug, data.published ?? true, data.translations);

    const posts = await serializeBlogPostsForAdmin();
    const updated = posts.find((p) => p.slug === slug);

    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";
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
    const slug = await resolveBlogSlugFromId(id);
    if (!slug) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await deleteBlogBySlug(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
