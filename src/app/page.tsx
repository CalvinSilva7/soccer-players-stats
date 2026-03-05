"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEntrar() {
    setError("");

    if (!usuario || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: usuario,
        password: senha,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Email"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="border border-zinc-800 rounded-lg p-2"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="border border-zinc-800 rounded-lg p-2"
      />
      <div className="flex justify-center gap-2">
        <button
          onClick={handleEntrar}
          disabled={loading}
          className="bg-blue-500 text-white rounded-lg p-2 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <Link
          href="/cadastrar"
          className="bg-red-500 text-white rounded-lg p-2"
        >
          Cadastrar
        </Link>
      </div>
    </div>
  );
}