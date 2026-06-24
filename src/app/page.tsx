import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Timeline } from "@/components/timeline/Timeline";
import type { Product, TimelineEntry } from "@/types";

export default async function HomePage() {
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

  const timelineEntries = timeline.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  })) as TimelineEntry[];

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-400">
            Developer &amp; Product Builder
          </p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Building software, systems, and products that scale.
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-zinc-400">
            Full-stack engineer with experience in microservices, distributed
            systems, IoT, and product management. Explore my journey and
            products.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
            >
              My Journey
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-500/50"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ProductGrid products={featuredProducts} title="Featured Products" />
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="text-sm text-emerald-400 hover:underline"
          >
            View all products &rarr;
          </Link>
        </div>
      </section>

      <section className="border-t border-zinc-800/60 bg-zinc-900/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">My Journey</h2>
              <p className="mt-2 text-zinc-400">
                A year-by-year look at my professional path.
              </p>
            </div>
            <Link
              href="/about"
              className="text-sm text-emerald-400 hover:underline"
            >
              Full timeline &rarr;
            </Link>
          </div>
          <Timeline entries={timelineEntries.reverse()} compact />
        </div>
      </section>
    </>
  );
}
