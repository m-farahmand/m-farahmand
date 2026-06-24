"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Checkout</h1>
        <p className="mb-8 text-zinc-400">No items to checkout.</p>
        <Link href="/products" className="text-emerald-400 hover:underline">
          Browse products
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
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/checkout/confirmation?orderId=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Full Name</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              Phone (optional)
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-200">
              <strong>Manual Payment:</strong> After placing your order, you
              will receive payment instructions via email. Your order status will
              be updated once payment is confirmed.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Order Summary
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
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-zinc-800 pt-4">
            <div className="flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-emerald-400">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
