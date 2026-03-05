import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request){
    const {email, code} = await request.json()

    const user = await prisma.user.findUnique({where: {email}});

    if (!user || user.verifyCode !== code) {
        return NextResponse.json({error: "Código inválido"}, {status: 400})
    }

    if (user.codeExpiresAt && user.codeExpiresAt < new Date()) {
        return NextResponse.json({error: "Código expirado"}, {status: 400})
    }

    await prisma.user.update({
        where: {email},
        data: {verified: true, verifyCode: null, codeExpiresAt: null},
    });

    return NextResponse.json({message: "Email verificado com sucesso"});
}