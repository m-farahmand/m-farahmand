import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { mapProduct } from "@/lib/content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { media: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalPrice = 0;
    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (product.inventory !== null && product.inventory < item.quantity) {
        throw new Error(`Insufficient inventory for ${product.name}`);
      }
      const lineTotal = product.price * item.quantity;
      totalPrice += lineTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const product = productMap.get(item.productId)!;
        if (product.inventory !== null) {
          await tx.product.updateMany({
            where: { slug: product.slug },
            data: { inventory: { decrement: item.quantity } },
          });
        }
      }

      return tx.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          notes: data.notes,
          totalPrice,
          status: "pending",
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: { include: { media: true } } } },
        },
      });
    });

    return NextResponse.json(
      {
        ...order,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          ...item,
          product: item.product ? mapProduct(item.product) : undefined,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
