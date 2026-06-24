import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  getSession,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return NextResponse.json({ email: user.email, role: user.role });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(session);
}

export async function DELETE() {
  const { clearAuthCookie } = await import("@/lib/auth");
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
