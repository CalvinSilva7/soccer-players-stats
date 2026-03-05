"use client";

import { useState } from "react";
import axios from "axios";

export default function Cadastrar() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/register", {name, email, password})
      setStep("verify");
    } catch (err:any) {
      setError(err.response?.data?.error || "Erro ao cadastrar")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setError("")
    setLoading(true)
    try {
      await axios.post("/api/auth/verify", {email, code});
      alert("Email verificado com sucesso");
      window.location.href = "/"
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao verificar");
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex justify-center pt-20">
      <div className="w-[500px] flex flex-col gap-6">
        <h1 className="text-2xl text-center font-bold">
          {step === "register"
            ? "Complete seu cadastro para assim poder acessar a página"
            : "Digite o código enviado para seu email"}
        </h1>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {step === "register" ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="w-32">Nome</label>
              <input
                type="text"
                placeholder="Digite seu nome"
                className="border rounded-lg p-2 flex-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32">Email</label>
              <input
                type="text"
                placeholder="Digite seu email"
                className="border rounded-lg p-2 flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="border rounded-lg p-2 flex-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-32">Confirmar senha</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                className="border rounded-lg p-2 flex-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="w-32">Código</label>
              <input
                type="text"
                placeholder="Digite o código de 6 dígitos"
                className="border rounded-lg p-2 flex-1"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}