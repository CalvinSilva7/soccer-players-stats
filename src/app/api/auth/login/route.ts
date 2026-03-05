import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const {email, password} = await request.json()

    const user = await prisma.user.findUnique({where: {email}});

    if (!user) {
        return NextResponse.json({error: "Usuario nao encontrado"}, {status: 400})
    }

    if (!user.verified) {
        return NextResponse.json({error: "Email não verificado"}, {status: 400})
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        return NextResponse.json({error:"Senha incorreta"}, {status: 400})
    }
    return NextResponse.json({message: "Login realizado com sucesso", user: {id: user.id, name: user.name, email: user.email}})
}