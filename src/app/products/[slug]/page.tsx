import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import {
  formatPrice,
  parseFeatures,
  productTypeLabel,
} from "@/lib/utils";
import type { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDesc || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { media: true },
  });

  if (!product) notFound();

  const mapped = {
    ...product,
    createdAt: product.createdAt.toISOString(),
  } as Product;

  const features = parseFeatures(product.features);
  const imageUrl = product.media[0]?.url;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-64 w-full object-contain"
            />
          ) : (
            <div className="text-8xl text-zinc-700">📦</div>
          )}
        </div>

        <div>
          <span className="mb-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
            {productTypeLabel(product.type)}
          </span>
          <h1 className="mb-4 text-4xl font-bold text-white">{product.name}</h1>
          <p className="mb-6 text-3xl font-bold text-emerald-400">
            {formatPrice(product.price)}
          </p>
          <p className="mb-8 leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Features
              </h2>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-zinc-300"
                  >
                    <span className="text-emerald-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.inventory !== null && (
            <p className="mb-6 text-sm text-zinc-500">
              {product.inventory > 0
                ? `${product.inventory} units available`
                : "Currently out of stock"}
            </p>
          )}

          <AddToCartButton product={mapped} />
        </div>
      </div>
    </div>
  );
}
