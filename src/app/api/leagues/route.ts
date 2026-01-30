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
        const response = await axios.get(API_URL, {
            params: { search },
            headers: {
                "x-apisports-key": API_KEY
            }
        })

        const leagues = response.data.response.map((item: any) => ({
            id: item.league.id,
            name: item.league.name,
            country: item.country.name,
            logo: item.league.logo
        }));
        
        if (leagues.length === 0) {
            return NextResponse.json({ error: "Liga não encontrada" }, { status: 404 });
        }
        
        return NextResponse.json(leagues);
    }