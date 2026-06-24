import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = blogPostSchema.parse(body);

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        content: data.content,
        excerpt: data.excerpt || "",
        published: data.published ?? true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
