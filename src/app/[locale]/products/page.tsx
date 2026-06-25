import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("products");
  const tt = await getTranslations("productTypes");

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
        <h1 className="mb-4 text-4xl font-bold text-white">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-zinc-400">{t("subtitle")}</p>
      </div>

      <div className="mb-8 flex gap-2 text-sm text-zinc-500">
        <span className="rounded-full bg-zinc-800 px-3 py-1">{tt("software")}</span>
        <span className="rounded-full bg-zinc-800 px-3 py-1">{tt("app")}</span>
        <span className="rounded-full bg-zinc-800 px-3 py-1">{tt("device")}</span>
      </div>

      <ProductGrid products={mapped} />
    </div>
  );
}
