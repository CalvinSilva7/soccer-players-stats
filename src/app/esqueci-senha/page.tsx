"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSendCode = async () => {
    setError("");
    if (!email) {
        setError("Digite seu email")
        return;
    }
    setLoading(true)
    try {
        await axios.post("/api/auth/forgot-password", { email })
        setStep("code")
    } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao enviar código");
    } finally {
        setLoading(false)
    }
  }

  const handleVerifyAndReset = async () => {
    if (newPassword !== confirmPassword) {
        setError("Senhas não coincidem")
        return
    }
    setLoading(true);
    try {
        await axios.post("/api/auth/reset-password", {
            email,
            code,
            newPassword
        });
        alert("Senha alterada com sucesso!");
        router.push("/");
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao redefinir senha");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen flex justify-center pt-20">
        <div className="w-[500px] flex flex-col gap-6">
          <h1 className="text-2xl text-center font-bold">
            {step === "email" && "Digite seu email para recuperar a senha"}
            {step === "code" && "Digite o código e a nova senha"}
          </h1>
  
          {error && <p className="text-red-500 text-center">{error}</p>}
  
          {step === "email" ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Seu email"
                className="border rounded-lg p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Código de 6 dígitos"
                className="border rounded-lg p-2"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nova senha"
                className="border rounded-lg p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                className="border rounded-lg p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleVerifyAndReset}
                disabled={loading}
                className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Alterando..." : "Alterar senha"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }