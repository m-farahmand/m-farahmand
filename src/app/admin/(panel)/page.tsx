import { prisma } from "@/lib/prisma";
import { formatPrice, orderStatusLabel } from "@/lib/utils";

export default async function AdminDashboard() {
  const [orderCount, productCount, timelineCount, recentOrders, totalRevenue] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.timelineEntry.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ["paid", "delivered"] } },
      }),
    ]);

  const stats = [
    { label: "Total Orders", value: orderCount },
    { label: "Products", value: productCount },
    { label: "Timeline Entries", value: timelineCount },
    {
      label: "Revenue (Paid)",
      value: formatPrice(totalRevenue._sum.totalPrice || 0),
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Dashboard</h1>

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

      <h2 className="mb-4 text-lg font-semibold text-white">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/80 text-left text-zinc-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="text-zinc-300">
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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
