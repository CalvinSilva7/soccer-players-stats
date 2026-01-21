import axios from 'axios'
import { NextResponse } from "next/server"

const API_URL = "https://v3.football.api-sports.io/coachs"
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY!

export async function GET(req: Request) {
    const {searchParams} = new URL (req.url)
    const search = searchParams.get("search")

    if (!search) {
        return NextResponse.json(
            {error: "Search param é obrigatorio"},
            {status: 400}
        )
    }
        const response = await axios.get(API_URL, {
            params: {search},
            headers: {
                "x-apisports-key": API_KEY
            }
        })
        const coach = response.data.response?.[0]

        if (!coach) {
            return NextResponse.json(
                {error: "Técnico não existe"},
                {status: 404}
            )
        }
    const career = coach.career?.[0]
    return NextResponse.json({
    name: coach.name,
    nationality: coach.nationality,
    age: coach.age,
    team: career?.team?.name
})
}