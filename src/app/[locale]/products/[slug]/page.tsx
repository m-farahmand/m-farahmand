import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import {
  formatPrice,
  parseFeatures,
  productTypeLabel,
} from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: t("productNotFound") };
  return {
    title: product.name,
    description: product.shortDesc || product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");
  const tt = await getTranslations("productTypes");

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
  const typeLabels = {
    software: tt("software"),
    app: tt("app"),
    device: tt("device"),
  };

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
            {productTypeLabel(product.type, typeLabels)}
          </span>
          <h1 className="mb-4 text-4xl font-bold text-white">{product.name}</h1>
          <p className="mb-6 text-3xl font-bold text-emerald-400">
            {formatPrice(product.price, locale as Locale)}
          </p>
          <p className="mb-8 leading-relaxed text-zinc-400">
            {product.description}
          </p>

          {features.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                {t("features")}
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
                ? t("unitsAvailable", { count: product.inventory })
                : t("currentlyOutOfStock")}
            </p>
          )}

          <AddToCartButton product={mapped} />
        </div>
      </div>
    </div>
  );
}
