"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Partida() {
  const params = useParams();
  const router = useRouter();
  const [lineups, setLineups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-6">
      <button
        onClick={() => router.back()}
        className="text-blue-500 underline mb-4"
      >
        ← Voltar
      </button>

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
    </div>
  );
}
