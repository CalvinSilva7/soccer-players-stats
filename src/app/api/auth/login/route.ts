import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  console.log("USER:", user);
  console.log("EMAIL RECEBIDO:", email);

  if (!user) {
    return NextResponse.json(
      { error: "Usuario nao encontrado" },
      { status: 400 },
    );
  }

  if (!user.verified) {
    return NextResponse.json(
      { error: "Email não verificado" },
      { status: 400 },
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  const token = await createToken(user.id);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });
  }
  const response = NextResponse.json({
    message: "Login realizado com sucesso",
    user: { id: user.id, name: user.name, email: user.email },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
