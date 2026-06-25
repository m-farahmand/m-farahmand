"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice, orderStatusLabel } from "@/lib/utils";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const t = useTranslations("admin");
  const to = useTranslations("orderStatus");
  const tc = useTranslations("common");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const statusLabels = {
    pending: to("pending"),
    paid: to("paid"),
    delivered: to("delivered"),
  };

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

  if (loading) return <p className="text-zinc-500">{tc("loading")}</p>;

  return (
    <div dir="rtl">
      <h1 className="mb-8 text-2xl font-bold text-white">{t("orders")}</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-500">{t("noOrders")}</p>
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
                <div className="text-end">
                  <p className="font-bold text-emerald-400">
                    {formatPrice(order.totalPrice, "fa")}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>

              {order.items && (
                <div className="mb-3 text-sm text-zinc-400">
                  {order.items.map((item) => (
                    <span key={item.id} className="ms-4">
                      {item.product?.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">{t("status")}:</span>
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
                    {orderStatusLabel(status, statusLabels)}
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
