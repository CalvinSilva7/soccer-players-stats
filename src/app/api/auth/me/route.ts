import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "minha-chave",
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 400 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario não encontrado" },
        { status: 400 },
      );
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }
}
