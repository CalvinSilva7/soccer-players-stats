import axios from 'axios'
import { NextResponse } from 'next/server'

const API_URL = "https://v3.football.api-sports.io/leagues"
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")

    if (!search) {
        return NextResponse.json(
            { error: "Parâmetro 'search' é obrigatório" },
            { status: 400 }
        )
    }

    try {
        const response = await axios.get(API_URL, {
            params: { search },
            headers: {
                "x-apisports-key": API_KEY
            }
        })

        const leagueId = response.data.response[0]?.league?.id

        if (!leagueId) {
            return NextResponse.json(
                { error: "Liga não encontrada" },
                { status: 404 }
            )
        }

        return NextResponse.json({ leagueId })

    } catch (error) {
        console.error("Erro ao buscar liga:", error)
        return NextResponse.json(
            { error: "Erro interno ao buscar liga" },
            { status: 500 }
        )
    }
}