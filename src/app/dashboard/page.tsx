"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [playerName, setPlayerName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [playerSuggestions, setPlayerSuggetions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isSearchingLeague, setIsSearchingLeague] = useState(false);
  const [leagueSuggestions, setLeagueSuggestions] = useState<any[]>([]);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserName(data.user.name);
          setUserAvatar(data.user.avatar || "");
        }
      });
  }, []);

  useEffect(() => {
    if (
      leagueName.length < 3 ||
      (selectedLeague && leagueName === selectedLeague.name)
    ) {
      setLeagueSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearchingLeague(true);
      try {
        const response = await fetch(
          `/api/leagues?search=${encodeURIComponent(leagueName)}`,
        );
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
          if (data.length > 0) {
            console.log(
              "Sugestões de jogadores:",
              data.map(
                (p: {
                  id: number;
                  name: string;
                  team?: string;
                  nationality?: string;
                }) => ({
                  id: p.id,
                  name: p.name,
                  team: p.team,
                  nationality: p.nationality,
                }),
              ),
            );
          }
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
      const res = await fetch(`/api/coach?search=${coachName}`);
      const result = await res.json();
      console.log(result);
    }
    if (teamName) {
      const response = await fetch(`/api/teams?search=${teamName}`);
      const data = await response.json();

      console.log(data);
    }
  }

  const handlePlayerSelect = async (player: any) => {
    setPlayerName(player.name);
    setPlayerSuggetions([]);
    setSelectedPlayer(player);
    setSummary("");
    setLoadingSummary(true);

    try {
      const response = await fetch("/api/players/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: player.name,
          stats: player,
        }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch {
      setSummary("Erro ao gerar resumo");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-emerald-800">
        Soccer Player Stats
      </h1>

      <div className="space-y-6">
        <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100 relative">
          <h2 className="font-semibold mb-2 text-emerald-800">
            1. Buscar e selecionar liga
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite a liga (ex: Premier League, Saudi...)"
              value={leagueName}
              onChange={(e) => {
                setLeagueName(e.target.value);
                setSelectedLeague(null);
              }}
              className={`border rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 placeholder:text-slate-400 ${selectedLeague ? "border-emerald-500 ring-emerald-200 bg-emerald-50/50" : "border-slate-300 focus:ring-emerald-400 focus:border-emerald-400"}`}
            />
            {isSearchingLeague && (
              <div className="absolute right-3 top-2.5 animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full" />
            )}
          </div>

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
          <h2 className="font-semibold mb-2 text-emerald-800">
            Buscar jogador
          </h2>
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
                  onClick={() => handlePlayerSelect(player)}
                >
                  {player.photo && (
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-10 h-10 rounded-full bg-emerald-100"
                    />
                  )}
                  <div>
                    <p className="font-bold text-slate-800">{player.name}</p>
                    <p className="text-xs text-slate-500">
                      {player.team} — {player.nationality}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {selectedPlayer && (
          <section className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
            <div className="flex items-center gap-4 mb-4">
              {selectedPlayer.photo && (
                <img
                  src={selectedPlayer.photo}
                  alt={selectedPlayer.name}
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedPlayer.name}
                </h2>
                <p className="text-slate-500">
                  {selectedPlayer.team} — {selectedPlayer.nationality}
                </p>
                <p className="text-sm text-slate-400">
                  {selectedPlayer.position} • {selectedPlayer.age} anos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  {selectedPlayer.appearances ?? "-"}
                </p>
                <p className="text-xs text-slate-500">Jogos</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  {selectedPlayer.goals ?? "-"}
                </p>
                <p className="text-xs text-slate-500">Gols</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-emerald-700">
                  {selectedPlayer.assists ?? "-"}
                </p>
                <p className="text-xs text-slate-500">Assistências</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {selectedPlayer.yellowCards ?? "-"}
                </p>
                <p className="text-xs text-slate-500">Amarelos</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">
                  {selectedPlayer.redCards ?? "-"}
                </p>
                <p className="text-xs text-slate-500">Vermelhos</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedPlayer.rating
                    ? Number(selectedPlayer.rating).toFixed(1)
                    : "-"}
                </p>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
            </div>
          </section>
        )}

        {loadingSummary && (
          <div className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
            <p className="text-emerald-600 animate-pulse">
              Gerando resumo com IA...
            </p>
          </div>
        )}

        {summary && (
          <section className="bg-white p-4 rounded-xl shadow-md border border-emerald-100">
            <h2 className="font-semibold mb-2 text-emerald-800">
              Resumo do Jogador (IA)
            </h2>
            <p className="text-slate-700 whitespace-pre-line">{summary}</p>
          </section>
        )}
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
          <h2 className="font-semibold mb-2 text-emerald-800">
            Buscar treinador
          </h2>
          <input
            type="text"
            placeholder="Digite o nome do treinador"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
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
      <Link
        href="/perfil"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-xl hover:opacity-80 shadow-lg overflow-hidden"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center">
            {userName ? userName[0].toUpperCase() : "?"}
          </div>
        )}
      </Link>
    </div>
  );
}
