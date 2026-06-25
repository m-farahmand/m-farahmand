"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("checkout");
  const tc = useTranslations("common");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mb-8 text-zinc-400">{t("noItems")}</p>
        <Link href="/products" className="text-emerald-400 hover:underline">
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.get("name"),
          customerEmail: form.get("email"),
          customerPhone: form.get("phone") || undefined,
          notes: form.get("notes") || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("orderFailed"));

      clearCart();
      router.push(`/checkout/confirmation?orderId=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("somethingWrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">{t("title")}</h1>

      <div className="grid gap-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{t("fullName")}</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">{tc("email")}</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              {t("phoneOptional")}
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              {t("notesOptional")}
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-200">
              <strong>{t("manualPaymentTitle")}</strong> {t("manualPaymentText")}
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? t("placingOrder") : t("placeOrder")}
          </button>
        </form>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {t("orderSummary")}
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-zinc-400">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-white">
                  {formatPrice(item.price * item.quantity, locale)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <div className="flex justify-between font-bold">
              <span className="text-white">{tc("total")}</span>
              <span className="text-emerald-400">{formatPrice(total, locale)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
