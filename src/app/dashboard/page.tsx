"use client";

import { useEffect, useState } from "react";



export default function Dashboard() {

    const [playerName, setPlayerName] = useState("")
    const [teamName, setTeamName] = useState("")
    const [leagueName, setLeagueName] = useState("")
    const [coachName, setCoachName] = useState("")
    const [playerSuggestions, setPlayerSuggetions] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLeague, setSelectedLeague] = useState<{id: number, name: string} | null>(null);
    const [isSearchingLeague, setIsSearchingLeague] = useState(false);
    const [leagueSuggestions, setLeagueSuggestions] = useState<any[]>([]);
    

    useEffect(() => {
      if (leagueName.length < 3 || (selectedLeague && leagueName === selectedLeague.name)) {
        setLeagueSuggestions([]);
        return;
      }
  
      const delayDebounce = setTimeout(async () => {
        setIsSearchingLeague(true);
        try {
          const response = await fetch(`/api/leagues?search=${encodeURIComponent(leagueName)}`);
          if (response.ok) {
            const data = await response.json();
            setLeagueSuggestions(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error("Erro ao buscar ligas:", error);
        } finally {
          setIsSearchingLeague(false);
        }
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    }, [leagueName, selectedLeague]);

    useEffect(() => {
      if (playerName.length < 4 || !selectedLeague) {
        setPlayerSuggetions([]);
        return;
      }
  
      const delayDebounce = setTimeout(async () => {
        setIsSearching(true);
        try {
          const url = `/api/players/search?search=${encodeURIComponent(playerName)}&league=${selectedLeague.id}`;
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            setPlayerSuggetions(data);
          }
        } catch (error) {
          console.error("Erro ao buscar jogadores:", error);
        } finally {
          setIsSearching(false);
        }
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    }, [playerName, selectedLeague]); 

    async function handleSearch() {
    if (coachName) {
      const res = await fetch(`/api/coach?search=${coachName}`)
      const result = await res.json()
      console.log(result)
    }
    if (teamName) {
      const response = await fetch(`/api/teams?search=${teamName}`)
      const data = await response.json()

      console.log(data)
    }
  }
      
  /*
   * DESIGN — Para manter o front visível: evitar fundo e textos só em zinc (cinza).
   * Usar: gradiente no fundo, títulos em cor forte (emerald-800), bordas/focus em emerald,
   * placeholders com placeholder:text-slate-400.
   */
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-6">

  <h1 className="text-2xl font-bold mb-6 text-emerald-800">
    Soccer Player Stats
  </h1>

  <div className="space-y-6">

  <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100 relative">
          <h2 className="font-semibold mb-2 text-emerald-800">1. Buscar e selecionar liga</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite a liga (ex: Premier League, Saudi...)"
              value={leagueName}
              onChange={(e) => {
                setLeagueName(e.target.value);
                setSelectedLeague(null); // Reseta se mudar o texto
              }}
              className={`border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 placeholder:text-slate-400 ${selectedLeague ? 'border-emerald-500 ring-emerald-200 bg-emerald-50/50' : 'border-slate-300 focus:ring-emerald-400 focus:border-emerald-400'}`}
            />
            {isSearchingLeague && <div className="absolute right-3 top-2.5 animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />}
          </div>

          {/* LISTA DE SUGESTÕES DE LIGA */}
          {leagueSuggestions.length > 0 && !selectedLeague && (
            <ul className="absolute z-[60] left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {leagueSuggestions.map((league) => (
                <li
                  key={league.id}
                  className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-none"
                  onClick={() => {
                    setSelectedLeague({ id: league.id, name: league.name });
                    setLeagueName(league.name);
                    setLeagueSuggestions([]);
                  }}
                >
                  <p className="font-bold text-slate-800">{league.name}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
    
  <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100 relative">
          <h2 className="font-semibold mb-2 text-emerald-800">Buscar jogador</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite ao menos 3 letras (ex: Neymar)"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border border-slate-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-400"
            />
            
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {playerSuggestions.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              {playerSuggestions.map((player) => (
                <li
                  key={player.id}
                  className="p-3 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none"
                  onClick={() => {
                    setPlayerName(player.name);
                    setPlayerSuggetions([]);
                  }}
                >
                  {player.photo && (
                    <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full bg-emerald-100" />
                  )}
                  <div>
                    <p className="font-bold text-slate-800">{player.name}</p>
                    <p className="text-xs text-slate-500">{player.team} — {player.nationality}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

    <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
      <h2 className="font-semibold mb-2 text-emerald-800">Buscar time</h2>
      <input
        type="text"
        placeholder="Digite o nome do time"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="border border-slate-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-400"
      />
    </section>

    <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
      <h2 className="font-semibold mb-2 text-emerald-800">Buscar treinador</h2>
      <input
        type="text"
        placeholder="Digite o nome do treinador"
        value={coachName}
        onChange={(e) => setCoachName (e.target.value)}
        className="border border-slate-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-400"
      />
    </section>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 font-medium shadow-sm"
          >
            Buscar
          </button>
        </div>

  </div>
</div>
  )
}
