import axios from 'axios'
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const search = searchParams.get("search")
    const league = searchParams.get("league")
    const team = searchParams.get("team")

    if (!search) {
        return NextResponse.json(
            {error: "Parametro search é obrigatorio"},
            {status: 400}
        )
    }
    try {
        console.log("🚀 Chamando API Football...");
        const response = await axios.get (
        "https://v3.football.api-sports.io/players", {
            params: {
                search,
                league: league ? Number(league) : 307,
                team: team || undefined,
                season: 2023

            }, 
                headers: {
                    "x-apisports-key": process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!,
                },
        }
    )
    return NextResponse.json(response.data)
    } catch (error: any) {
        return NextResponse.json(
            {error: "Erro ao buscar jogador"},
            {status: 500}
        )
    }
}