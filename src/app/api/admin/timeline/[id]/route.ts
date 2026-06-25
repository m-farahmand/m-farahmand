import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { timelineSchema } from "@/lib/validations";
import {
  deleteTimelineGroup,
  resolveTimelineGroupFromId,
  serializeTimelineForAdmin,
  upsertTimelineByLang,
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
    const data = timelineSchema.parse(body);
    const group = await resolveTimelineGroupFromId(id);
    if (!group) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (group.year !== data.year || group.sortOrder !== (data.sortOrder ?? 0)) {
      await deleteTimelineGroup(group.year, group.sortOrder);
    }

    await upsertTimelineByLang(
      data.year,
      data.sortOrder ?? 0,
      data.translations
    );

    const entries = await serializeTimelineForAdmin();
    const updated = entries.find(
      (e) => e.year === data.year && e.sortOrder === (data.sortOrder ?? 0)
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update entry";
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
    const group = await resolveTimelineGroupFromId(id);
    if (!group) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await deleteTimelineGroup(group.year, group.sortOrder);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
}
