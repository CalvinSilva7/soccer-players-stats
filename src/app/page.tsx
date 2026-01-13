"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";


export default function Home() {
  const router = useRouter()

  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")

  function handleEntrar() {
    if (!usuario || !senha) {
      alert("Preencha todos os campos")
      return;
    }
    router.push("/dashboard")
  }


  return (
      
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <input type="text" 
             placeholder="Usuario"
             value={usuario}
             onChange={(e) =>setUsuario(e.target.value)} 
             className="border border-zinc-800 rounded-lg p-2"
              />
      <input type="password" 
             placeholder="Senha"
             value={senha}
             onChange={(e) =>setSenha(e.target.value)}
             className="border border-zinc-800 rounded-lg p-2" 
             />
      <div className="flex justify-center gap-2">
        <button onClick={handleEntrar} className="bg-blue-500 text-white rounded-lg p-2">Entrar</button>
        <Link
        href= "/cadastrar"
        className="bg-red-500 text-white rounded-lg p-2">
        Cadastrar
        </Link>
      </div>
    </div>
  );
  handleEntrar()
}
