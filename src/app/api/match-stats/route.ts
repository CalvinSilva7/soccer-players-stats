import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://v3.football.api-sports.io/fixtures/statistics";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!;

export async function GET(req: Request) {
  const urlString = req.url;
  const fixtureMatch = urlString.match(/fixture=(\d+)/);
  const fixture = fixtureMatch ? fixtureMatch[1] : null;

  if (!fixture) {
    return NextResponse.json(
      { error: "ID da partida é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(API_URL, {
      params: { fixture },
      headers: {
        "x-apisports-key": API_KEY,
      },
    });
    if (!response.data.response || response.data.response.length === 0) {
      return NextResponse.json(
        { error: "Estatísticas não disponívenis" },
        { status: 404 },
      );
    }

    const stats = response.data.response.map((item: any) => ({
      team: {
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logo,
      },
      statistics: item.statistics.map((stat: any) => ({
        type: stat.type,
        value: stat.value,
      })),
    }));
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Erro:", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
