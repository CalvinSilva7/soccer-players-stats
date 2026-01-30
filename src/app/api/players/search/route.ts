import axios from "axios"
import { NextResponse } from "next/server"

const API_URL = "https://v3.football.api-sports.io/players"
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")
  const leagueId = searchParams.get("league")

  if (!search || search.length < 4) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        search,
        season: 2023,
        ...(leagueId && {league: leagueId})
      },
      headers: {
        "x-apisports-key": API_KEY
      },
    })
    console.log("Resposta completa da API-Sports:", response.data);

    if (response.data.errors && Object.keys(response.data.errors).length > 0) {
      console.error("A API retornou erros:", response.data.errors);
      return NextResponse.json([]); // Retorna vazio para não quebrar o front
    }

    if (!response.data.response || response.data.response.length === 0) {
      return NextResponse.json([]);
    }

    const players = response.data.response.map((item: any) => ({
        id: item.player.id,
        name: item.player.name,
        photo: item.player.photo,
        nationality: item.player.nationality,
        team: item.statistics?.[0]?.team?.name ?? "Sem time",
    }))

    return NextResponse.json(players)
  } catch (error: any) {
    console.error("Erro na requisição:", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
