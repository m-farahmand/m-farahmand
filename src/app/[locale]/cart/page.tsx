"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, productTypeLabel } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const tt = useTranslations("productTypes");
  const locale = useLocale() as Locale;

  const typeLabels = {
    software: tt("software"),
    app: tt("app"),
    device: tt("device"),
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mb-8 text-zinc-400">{t("empty")}</p>
        <Link
          href="/products"
          className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">{t("title")}</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-800 text-2xl">
              📦
            </div>
            <div className="flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-white hover:text-emerald-400"
              >
                {item.name}
              </Link>
              <p className="text-sm text-zinc-500">
                {productTypeLabel(item.type, typeLabels)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 text-zinc-400 hover:text-white"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="flex h-8 w-8 items-center justify-center rounded border border-zinc-700 text-zinc-400 hover:text-white"
              >
                +
              </button>
            </div>
            <p className="w-24 text-end font-medium text-emerald-400">
              {formatPrice(item.price * item.quantity, locale)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-zinc-500 hover:text-red-400"
            >
              {tc("remove")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-8">
        <div>
          <p className="text-sm text-zinc-500">{tc("total")}</p>
          <p className="text-2xl font-bold text-white">{formatPrice(total, locale)}</p>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-emerald-500 px-8 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          {t("proceedToCheckout")}
        </Link>
      </div>
    </div>
  );
}
