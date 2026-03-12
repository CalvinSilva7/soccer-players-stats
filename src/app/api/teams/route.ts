import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!;
const API_URL = "https://v3.football.api-sports.io/teams";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      { error: "Parâmetro search é obrigatorio" },
      { status: 400 },
    );
  }
  const response = await axios.get(API_URL, {
    params: { search },
    headers: {
      "x-apisports-key": API_KEY,
    },
  });
  const teamData = response.data.response?.[0];
  if (!teamData) {
    return NextResponse.json(
      { error: "Erro, time não encontrado" },
      { status: 404 },
    );
  }
  const team = teamData.team;
  const venue = teamData.venue;

  return NextResponse.json({
    id: team.id,
    name: team.name,
    country: team.country,
    founded: team.founded,
    stadium: venue?.name,
    city: venue?.city,
    logo: team.logo,
  });
}
