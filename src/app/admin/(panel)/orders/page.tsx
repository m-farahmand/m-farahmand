"use client";

import { useEffect, useState } from "react";
import { formatPrice, orderStatusLabel } from "@/lib/utils";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  }

  if (loading) return <p className="text-zinc-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{order.customerName}</p>
                  <p className="text-sm text-zinc-500">{order.customerEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {order.items && (
                <div className="mb-3 text-sm text-zinc-400">
                  {order.items.map((item) => (
                    <span key={item.id} className="mr-4">
                      {item.product?.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Status:</span>
                {(["pending", "paid", "delivered"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    className={`rounded-full px-3 py-0.5 text-xs transition ${
                      order.status === status
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-800 text-zinc-500 hover:text-white"
                    }`}
                  >
                    {orderStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
