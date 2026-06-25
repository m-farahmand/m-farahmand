import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { timelineSchema } from "@/lib/validations";
import {
  serializeTimelineForAdmin,
  upsertTimelineByLang,
} from "@/lib/db-lang";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await serializeTimelineForAdmin());
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = timelineSchema.parse(body);

    await upsertTimelineByLang(
      data.year,
      data.sortOrder ?? 0,
      data.translations
    );

    const entries = await serializeTimelineForAdmin();
    const created = entries.find(
      (e) => e.year === data.year && e.sortOrder === (data.sortOrder ?? 0)
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create entry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
