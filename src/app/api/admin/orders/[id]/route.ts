import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = orderStatusSchema.parse(body);

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
