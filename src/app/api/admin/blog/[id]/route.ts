import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, slugify } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations";

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

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug || slugify(data.title),
        content: data.content,
        excerpt: data.excerpt || "",
        published: data.published ?? true,
      },
    });

    return NextResponse.json(post);
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
