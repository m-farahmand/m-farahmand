import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLocaleFromRequest, mapTimelineEntry } from "@/lib/content";

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);

  const entries = await prisma.timelineEntry.findMany({
    where: { lang: locale },
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(entries.map(mapTimelineEntry));
}
