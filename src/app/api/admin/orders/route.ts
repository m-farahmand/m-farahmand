import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { mapProduct } from "@/lib/content";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: { include: { media: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        ...item,
        product: item.product ? mapProduct(item.product) : undefined,
      })),
    }))
  );
}
