import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "minha-chave-secreta",
);

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const { name, currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario não encontrado" },
        { status: 404 },
      );
    }
    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Digite a senha atual" },
          { status: 400 },
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({
      message: "Perfil atualizado",
      user: updatedUser,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
