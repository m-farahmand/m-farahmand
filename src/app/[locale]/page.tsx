import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Timeline } from "@/components/timeline/Timeline";
import { setRequestLocale } from "next-intl/server";
import type { Product, TimelineEntry } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const [products, timeline] = await Promise.all([
    prisma.product.findMany({
      take: 3,
      include: { media: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.timelineEntry.findMany({
      take: 4,
      orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
    }),
  ]);

  const featuredProducts = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    media: p.media,
  })) as Product[];

  const timelineEntries = timeline.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  })) as TimelineEntry[];

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-400">
            {t("badge")}
          </p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            {t("title")}
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-zinc-400">{t("subtitle")}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
            >
              {t("myJourney")}
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-500/50"
            >
              {t("viewProducts")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ProductGrid products={featuredProducts} title={t("featuredProducts")} />
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="text-sm text-emerald-400 hover:underline"
          >
            {tc("viewAll")}
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 bg-zinc-900/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{t("journeyTitle")}</h2>
              <p className="mt-2 text-zinc-400">{t("journeySubtitle")}</p>
            </div>
            <Link
              href="/about"
              className="text-sm text-emerald-400 hover:underline"
            >
              {tc("fullTimeline")}
            </Link>
          </div>
          <Timeline entries={timelineEntries.reverse()} compact />
        </div>
      </section>
    </>
  );
}
