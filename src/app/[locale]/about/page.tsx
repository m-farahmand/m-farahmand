import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Timeline } from "@/components/timeline/Timeline";
import type { TimelineEntry } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const entries = await prisma.timelineEntry.findMany({
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
  });

  const timelineEntries = entries.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  })) as TimelineEntry[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">{t("title")}</h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-400">{t("subtitle")}</p>
      </div>

      <Timeline entries={timelineEntries} />
    </div>
  );
}
