import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://v3.football.api-sports.io/fixtures/lineups";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!;

export async function GET(req: Request) {
  const urlString = req.url;
  const fixtureMatch = urlString.match(/fixture=(\d+)/);
  const teamMatch = urlString.match(/team=(\d+)/);
  const fixture = fixtureMatch ? fixtureMatch[1] : null;
  const team = teamMatch ? teamMatch[1] : null;

  if (!fixture) {
    return NextResponse.json(
      { error: "ID da partida é obrigatorio" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        fixture,
        ...(team && { team }),
      },
      headers: {
        "x-apisports-key": API_KEY,
      },
    });
    console.log("LINEUPS API:", JSON.stringify(response.data, null, 2));
    if (!response.data.response || response.data.response.length === 0) {
      return NextResponse.json(
        { error: "Lineup não disponível" },
        { status: 404 },
      );
    }
    const lineups = response.data.response.map((item: any) => ({
      team: {
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logo,
      },
      formation: item.formation,
      coach: {
        name: item.coach.name,
        photo: item.coach.photo,
      },
      startXI: item.startXI.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number,
        position: p.player.pos,
        grid: p.player.grid,
      })),
      substitutes: item.substitutes.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        number: p.player.number,
        position: p.player.pos,
      })),
    }));

    return NextResponse.json(lineups);
  } catch (error: any) {
    console.error("Erro:", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
