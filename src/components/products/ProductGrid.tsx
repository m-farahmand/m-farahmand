"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  const t = useTranslations("common");

  if (products.length === 0) {
    return <p className="text-center text-zinc-500">{t("noProducts")}</p>;
  }

  return (
    <section>
      {title && (
        <h2 className="mb-8 text-2xl font-bold text-white">{title}</h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
