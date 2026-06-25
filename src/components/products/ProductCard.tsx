"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/types";
import { formatPrice, productTypeLabel } from "@/lib/utils";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("common");
  const tt = useTranslations("productTypes");
  const locale = useLocale() as Locale;
  const imageUrl = product.media?.[0]?.url;

  const typeLabels = {
    software: tt("software"),
    app: tt("app"),
    device: tt("device"),
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="flex h-40 items-center justify-center bg-zinc-800/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-24 w-24 object-contain opacity-80 transition group-hover:opacity-100"
          />
        ) : (
          <div className="text-4xl text-zinc-600">📦</div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
            {productTypeLabel(product.type, typeLabels)}
          </span>
          {product.inventory !== null && (
            <span className="text-xs text-zinc-500">
              {t("inStock", { count: product.inventory })}
            </span>
          )}
        </div>

        <h3 className="mb-1 text-lg font-semibold text-white">{product.name}</h3>
        <p className="mb-4 flex-1 text-sm text-zinc-400 line-clamp-2">
          {product.shortDesc || product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-emerald-400">
            {formatPrice(product.price, locale)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
          >
            {t("view")}
          </Link>
        </div>
      </div>
    </article>
  );
}
