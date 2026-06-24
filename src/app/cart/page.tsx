"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, productTypeLabel } from "@/lib/utils";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Your Cart</h1>
        <p className="mb-8 text-zinc-400">Your cart is empty.</p>
        <Link
          href="/products"
          className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">Your Cart</h1>

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
                {productTypeLabel(item.type)}
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
            <p className="w-24 text-right font-medium text-emerald-400">
              {formatPrice(item.price * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-zinc-500 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-8">
        <div>
          <p className="text-sm text-zinc-500">Total</p>
          <p className="text-2xl font-bold text-white">{formatPrice(total)}</p>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-emerald-500 px-8 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
