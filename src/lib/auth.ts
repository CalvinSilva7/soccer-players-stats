import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "minha-chave-temporaria"
    );

    export async function createToken(userId: string) {
      const token = await new SignJWT({userId})
        .setProtectedHeader({alg: "HS256"})
        .setExpirationTime("7d")
        .sign(secret)
      return token
    }




