"use client";

import { useState } from "react";



export default function Dashboard() {

    const [playerName, setPlayerName] = useState("")
    const [teamName, setTeamName] = useState("")
    const [leagueName, setLeagueName] = useState("")
    const [coachName, setCoachName] = useState("")

    async function handleSearch() {
      let leagueId: number | undefined
      
      if (leagueName) {
        const leagueRes = await fetch(`/api/leagues?search=${leagueName}`)
        if (!leagueRes.ok) {
          const errorData = await leagueRes.json().catch(() => ({})); 
          console.error("Erro na API de Ligas:", errorData);
          alert("Liga não encontrada ou erro na busca.");
          return;
        }
        const leagueData = await leagueRes.json()
        leagueId = leagueData.leagueId
      }
      const params = new URLSearchParams({
        search: playerName,
        ...(leagueId&& {league: String(leagueId)})
      })
      if (playerName) {
      const response = await fetch(`/api/players?${params.toString()}`)
      const data = await response.json()

      console.log(data)
    }
    if (coachName) {
      const res = await fetch(`/api/coach?search=${coachName}`)
      const result = await res.json()
      console.log(result)
    }
  }
      
  return (
    <div className="min-h-screen bg-zinc-100 p-6">

  <h1 className="text-2xl font-bold mb-6">
    Soccer Player Stats
  </h1>

  <div className="space-y-6">
    
    <section className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Buscar jogador</h2>
      <input
        type="text"
        placeholder="Digite o nome do jogador"
        value={playerName}
        onChange={(e)=> setPlayerName (e.target.value)}
        className="border border-zinc-300 rounded-lg p-2 w-full"
      />
    </section>

    <section className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Buscar time</h2>
      <input
        type="text"
        placeholder="Digite o nome do time"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="border border-zinc-300 rounded-lg p-2 w-full"
      />
    </section>

    <section className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Buscar liga</h2>
      <input
        type="text"
        placeholder="Digite o nome da liga"
        value={leagueName}
        onChange={(e) => setLeagueName (e.target.value)}
        className="border border-zinc-300 rounded-lg p-2 w-full"
      />
    </section>

    <section className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2">Buscar treinador</h2>
      <input
        type="text"
        placeholder="Digite o nome do treinador"
        value={coachName}
        onChange={(e) => setCoachName (e.target.value)}
        className="border border-zinc-300 rounded-lg p-2 w-full"
      />
    </section>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

  </div>
</div>
  )
}
