import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(base64, {
      folder: "avatars",
      width: 200,
      height: 200,
      crop: "fill",
      gravity: "face",
    });

    await prisma.user.update({
      where: { id: payload.userId as string },
      data: { avatar: result.secure_url },
    });

    return NextResponse.json({ avatar: result.secure_url });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro ao fazer upload" },
      { status: 500 },
    );
  }
}
