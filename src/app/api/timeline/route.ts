import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.timelineEntry.findMany({
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(entries);
}
