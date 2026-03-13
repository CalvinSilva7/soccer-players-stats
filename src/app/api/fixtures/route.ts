import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://v3.football.api-sports.io/fixtures";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const team = searchParams.get("team");
  const season = searchParams.get("season") || "2024";

  if (!team) {
    return NextResponse.json(
      { error: "ID do time é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        team,
        season,
      },
      headers: {
        "x-apisports-key": API_KEY,
      },
    });
    if (!response.data.response || response.data.response.length === 0) {
      return NextResponse.json([]);
    }

    const fixtures = response.data.response
      .slice(-5)
      .reverse()
      .map((item: any) => ({
        id: item.fixture.id,
        date: item.fixture.date,
        venue: item.fixture.venue.name,
        homeTeam: {
          id: item.teams.home.id,
          name: item.teams.home.name,
          logo: item.teams.home.logo,
        },
        awayTeam: {
          id: item.teams.away.id,
          name: item.teams.away.name,
          logo: item.teams.away.logo,
        },
        score: {
          home: item.goals.home,
          away: item.goals.away,
        },
      }));

    return NextResponse.json(fixtures);
  } catch (error: any) {
    console.error("Erro", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
