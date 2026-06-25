import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";
import {
  serializeBlogPostsForAdmin,
  upsertBlogByLang,
} from "@/lib/db-lang";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await serializeBlogPostsForAdmin());
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = blogPostSchema.parse(body);
    const slug =
      data.slug ||
      slugify(data.translations.fa.title || data.translations.en.title);

    await upsertBlogByLang(slug, data.published ?? true, data.translations);

    const posts = await serializeBlogPostsForAdmin();
    const created = posts.find((p) => p.slug === slug);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
