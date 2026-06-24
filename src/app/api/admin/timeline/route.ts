import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { timelineSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.timelineEntry.findMany({
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = timelineSchema.parse(body);

    const entry = await prisma.timelineEntry.create({
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        tags: data.tags || "",
        sortOrder: data.sortOrder ?? 0,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create entry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
