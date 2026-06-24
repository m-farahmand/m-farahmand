import type { TimelineEntry } from "@/types";
import { parseTags } from "@/lib/utils";

interface TimelineProps {
  entries: TimelineEntry[];
  compact?: boolean;
}

export function Timeline({ entries, compact = false }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="text-zinc-500">No timeline entries yet.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent md:left-1/2 md:-translate-x-px" />

      <div className="space-y-8">
        {entries.map((entry, index) => {
          const tags = parseTags(entry.tags);
          const isEven = index % 2 === 0;

          return (
            <div
              key={entry.id}
              className={`relative flex items-start gap-6 md:gap-0 ${
                compact
                  ? "flex-row"
                  : isEven
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-emerald-500 bg-zinc-950 md:left-1/2 ${
                  compact ? "top-2" : "top-6"
                }`}
              />

              <div
                className={`ml-10 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                  compact
                    ? ""
                    : isEven
                      ? "md:pr-8 md:text-right"
                      : "md:pl-8"
                }`}
              >
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-emerald-500/30">
                  <span className="mb-1 inline-block rounded-full bg-emerald-500/10 px-3 py-0.5 text-sm font-bold text-emerald-400">
                    {entry.year}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {entry.title}
                  </h3>
                  {!compact && (
                    <>
                      <p className="mb-3 text-sm leading-relaxed text-zinc-400">
                        {entry.description}
                      </p>
                      {tags.length > 0 && (
                        <div
                          className={`flex flex-wrap gap-2 ${
                            isEven && !compact ? "md:justify-end" : ""
                          }`}
                        >
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!compact && <div className="hidden md:block md:w-[calc(50%-2rem)]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
