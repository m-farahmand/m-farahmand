"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      type: product.type as "software" | "app" | "device",
      imageUrl: product.media?.[0]?.url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  const outOfStock =
    product.inventory !== null && product.inventory <= 0;

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex-1 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {outOfStock ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={outOfStock}
        className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}
