"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice, orderStatusLabel } from "@/lib/utils";

type RecentOrder = {
  id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const to = useTranslations("orderStatus");
  const tc = useTranslations("common");
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [timelineCount, setTimelineCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      setRecentOrders(orders.slice(0, 5));
      setOrderCount(orders.length);

      const [productsRes, timelineRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/timeline"),
      ]);
      const products = await productsRes.json();
      const timeline = await timelineRes.json();
      setProductCount(products.length);
      setTimelineCount(timeline.length);

      const paidRevenue = orders
        .filter((o: RecentOrder) => o.status === "paid" || o.status === "delivered")
        .reduce((sum: number, o: RecentOrder) => sum + o.totalPrice, 0);
      setRevenue(paidRevenue);
      setLoading(false);
    }
    load();
  }, []);

  const statusLabels = {
    pending: to("pending"),
    paid: to("paid"),
    delivered: to("delivered"),
  };

  const stats = [
    { label: t("totalOrders"), value: orderCount },
    { label: t("products"), value: productCount },
    { label: t("timelineEntries"), value: timelineCount },
    { label: t("revenuePaid"), value: formatPrice(revenue, "fa") },
  ];

  if (loading) return <p className="text-zinc-500">{tc("loading")}</p>;

  return (
    <div dir="rtl">
      <h1 className="mb-8 text-2xl font-bold text-white">{t("dashboard")}</h1>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-white">{t("recentOrders")}</h2>
      {recentOrders.length === 0 ? (
        <p className="text-zinc-500">{t("noOrders")}</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/80 text-start text-zinc-500">
              <tr>
                <th className="px-4 py-3">{t("customer")}</th>
                <th className="px-4 py-3">{tc("total")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-4 py-3">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="text-zinc-300">
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{formatPrice(order.totalPrice, "fa")}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
                      {orderStatusLabel(order.status, statusLabels)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
