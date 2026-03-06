import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, code, newPassword } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.verifyCode !== code) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
    return NextResponse.json({ error: "Código expirado" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      verifyCode: null,
      codeExpiresAt: null,
    },
  });

  return NextResponse.json(
    { message: "Senha alterada com sucesso" },
    { status: 200 },
  );
}
