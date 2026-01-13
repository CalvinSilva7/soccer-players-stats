"use client";

import { useState } from "react";

export default function Dashboard() {

    const [playerName, setPlayerName] = useState("")
    const [teamName, setTeamName] = useState("")
    const [leagueName, setLeagueName] = useState("")
    const [coachName, setCoachName] = useState("")

    function handleSearch() {
        console.log ("Jogador", playerName)
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
