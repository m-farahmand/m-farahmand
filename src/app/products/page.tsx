import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/types";

export const metadata = {
  title: "Products",
  description: "Software, apps, and devices built and sold.",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { media: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  })) as Product[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">Products</h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Software tools, web &amp; mobile apps, and IoT devices — built from
          real-world experience.
        </p>
      </div>

      <div className="mb-8 flex gap-2 text-sm text-zinc-500">
        <span className="rounded-full bg-zinc-800 px-3 py-1">Software</span>
        <span className="rounded-full bg-zinc-800 px-3 py-1">Apps</span>
        <span className="rounded-full bg-zinc-800 px-3 py-1">Devices</span>
      </div>

      <ProductGrid products={mapped} />
    </div>
  );
}
