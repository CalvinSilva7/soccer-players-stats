import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST (request: Request) {
    const {email, password, name} = await request.json()


const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) {
        return NextResponse.json({error: "Usuario ja cadastrado"}, {status: 400})
    }

const code = generateCode();
const hashedPassword = await bcrypt.hash(password, 10)

await prisma.user.create({
    data: {
        email,
        password: hashedPassword,
        name,
        verifyCode: code,
        codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
    },
});

console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
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
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Código de verificação",
    html: `<h2>Seu código de verificação: ${code}</h2><p>Expira em 10 minutos.</p>`,
  });

    return NextResponse.json({message: "Código enviado para seu email"});
}
