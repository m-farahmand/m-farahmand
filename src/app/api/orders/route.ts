import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
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
          await tx.product.update({
            where: { id: product.id },
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
          items: { include: { product: true } },
        },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
