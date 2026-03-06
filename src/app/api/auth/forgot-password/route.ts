import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Email não encontrado" },
      { status: 400 },
    );
  }

  const code = generateCode();

  await prisma.user.update({
    where: { email },
    data: {
      verifyCode: code,
      codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  const trasporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      servername: "smtp.gmail.com",
    },
  });
  await trasporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Recuperação de senha",
    html: `<h2>Seu código de recuperação: ${code}</h2><p>Expira em 10 minutos.</p>`,
  });

  return NextResponse.json({ message: "Código enviado para seu email" });
}
