"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Partida() {
  const params = useParams();
  const router = useRouter();
  const [lineups, setLineups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchStats, setMatchStats] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [matchSummary, setMatchSummary] = useState("");
  const [loadingMatchSummary, setLoadingMatchSummary] = useState(false);

  useEffect(() => {
    fetch(`/api/lineups?fixture=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLineups(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-center mt-20">Carregando lineup...</p>;

  if (lineups.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-slate-500">
          Lineup não disponível para esta partida
        </p>
        <button
          onClick={() => router.back()}
          className="text-blue-500 underline mt-4"
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleShowStats = async () => {
    if (matchStats.length > 0) {
      setShowStats(!showStats);
      return;
    }

    setLoadingStats(true);
    try {
      const response = await fetch(`/api/match-stats?fixture=${params.id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMatchStats(data);
        setShowStats(true);
      }
    } catch {
      console.error("Erro ao buscar estatísticas");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleMatchSummary = async () => {
    setLoadingMatchSummary(true);
    setMatchSummary("");

    try {
      const response = await fetch("/api/players/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: `Partida ${lineups[0]?.team.name} vs ${lineups[1]?.team.name}`,
          stats: {
            homeTeam: lineups[0]?.team.name,
            homeFormation: lineups[0]?.formation,
            homeCoach: lineups[0]?.coach.name,
            homeStartXI: lineups[0]?.startXI.map((p: any) => p.name),
            awayTeam: lineups[1]?.team.name,
            awayFormation: lineups[1]?.formation,
            awayCoach: lineups[1]?.coach.name,
            awayStartXI: lineups[1]?.startXI.map((p: any) => p.name),
            matchStats: matchStats.length > 0 ? matchStats : undefined,
          },
        }),
      });
      const data = await response.json();
      setMatchSummary(data.summary);
    } catch {
      setMatchSummary("Erro ao gerar análise");
    } finally {
      setLoadingMatchSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="text-blue-500 underline"
        >
          ← Voltar
        </button>
        <button
          onClick={handleShowStats}
          disabled={loadingStats}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm disabled:opacity-50"
        >
          {loadingStats
            ? "Carregando..."
            : showStats
              ? "Esconder estatísticas"
              : "Ver estatísticas da partida"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lineups.map((lineup) => (
          <section
            key={lineup.team.id}
            className="bg-white p-6 rounded-xl shadow-md border border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={lineup.team.logo}
                alt={lineup.team.name}
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {lineup.team.name}
                </h2>
                <p className="text-sm text-emerald-600">
                  Formação: {lineup.formation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg">
              {lineup.coach.photo && (
                <img
                  src={lineup.coach.photo}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}
              <p className="text-sm text-slate-600">
                Treinador: {lineup.coach.name}
              </p>
            </div>

            <h3 className="font-semibold text-emerald-800 mb-2">Titulares</h3>
            <div className="space-y-1 mb-4">
              {lineup.startXI.map((player: any) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 bg-emerald-50 rounded"
                >
                  <span className="w-8 text-center font-bold text-emerald-700">
                    {player.number}
                  </span>
                  <span className="text-sm text-slate-800">{player.name}</span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {player.position}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-slate-600 mb-2">Reservas</h3>
            <div className="space-y-1">
              {lineup.substitutes.map((player: any) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded"
                >
                  <span className="w-8 text-center font-bold text-slate-500">
                    {player.number}
                  </span>
                  <span className="text-sm text-slate-600">{player.name}</span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {player.position}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {showStats && matchStats.length >= 2 && (
        <section className="mt-6 bg-white p-6 rounded-xl shadow-md border border-emerald-100">
          <h2 className="text-lg font-bold text-center text-slate-800 mb-4">
            Estatísticas da Partida
          </h2>
          <div className="flex justify-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <img src={matchStats[0].team.logo} alt="" className="w-6 h-6" />
              <span className="font-medium">{matchStats[0].team.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{matchStats[1].team.name}</span>
              <img src={matchStats[1].team.logo} alt="" className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-3">
            {matchStats[0].statistics.map((stat: any, index: number) => {
              const homeStat = stat.value ?? 0;
              const awayStat = matchStats[1].statistics[index]?.value ?? 0;
              const homeNum =
                typeof homeStat === "string"
                  ? parseInt(homeStat) || 0
                  : homeStat;
              const awayNum =
                typeof awayStat === "string"
                  ? parseInt(awayStat) || 0
                  : awayStat;
              const total = homeNum + awayNum || 1;

              return (
                <div key={stat.type}>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>{homeStat}</span>
                    <span className="font-medium text-slate-800">
                      {stat.type}
                    </span>
                    <span>{awayStat}</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="bg-emerald-500 rounded-l-full"
                      style={{ width: `${(homeNum / total) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500 rounded-r-full"
                      style={{ width: `${(awayNum / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {/* Botão de análise IA */}
      <div className="mt-6">
        <button
          onClick={handleMatchSummary}
          disabled={loadingMatchSummary}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50"
        >
          {loadingMatchSummary ? "Analisando..." : "Analisar partida com IA"}
        </button>
      </div>

      {loadingMatchSummary && (
        <div className="mt-4 bg-white p-4 rounded-xl shadow-md border border-emerald-100">
          <p className="text-emerald-600 animate-pulse">
            Gerando análise com IA...
          </p>
        </div>
      )}

      {matchSummary && (
        <section className="mt-4 bg-white p-4 rounded-xl shadow-md border border-emerald-100">
          <h2 className="font-semibold mb-2 text-emerald-800">
            Análise da Partida (IA)
          </h2>
          <p className="text-slate-700 whitespace-pre-line">{matchSummary}</p>
        </section>
      )}
    </div>
  );
}
