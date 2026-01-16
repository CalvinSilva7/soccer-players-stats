import axios from 'axios'
import { NextResponse } from "next/server"

const API_URL = "https://v3.football.api-sports.io/players"
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const search = searchParams.get("search")
    const league = searchParams.get("league")


    if (!search || !league) {
        return NextResponse.json(
            {error: "Parametro search é obrigatorio"},
            {status: 400}
        )
    }
    try {
        const response = await axios.get (
        API_URL, {
            params: {
                search,
                league,
                season: 2023

            }, 
                headers: {
                    "x-apisports-key": API_KEY,
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