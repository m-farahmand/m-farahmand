import { prisma } from "@/lib/prisma";
import { Timeline } from "@/components/timeline/Timeline";
import type { TimelineEntry } from "@/types";

export const metadata = {
  title: "About Me",
  description: "Year-by-year professional journey and experience.",
};

export default async function AboutPage() {
  const entries = await prisma.timelineEntry.findMany({
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });

  const timelineEntries = entries.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  })) as TimelineEntry[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">About Me</h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">
          Not a company story — a year-based narrative of building software,
          leading teams, and shipping products across fintech, hospitality, IoT,
          and distributed systems.
        </p>
      </div>

      <Timeline entries={timelineEntries} />
    </div>
  );
}
