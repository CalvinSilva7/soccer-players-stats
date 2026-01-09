import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <input type="text" placeholder="Usuario" className="border border-zinc-800 rounded-lg p-2" />
      <input type="password" placeholder="Senha" className="border border-zinc-800 rounded-lg p-2" />
      <div className="flex justify-center gap-2">
        <button className="bg-blue-500 text-white rounded-lg p-2">Entrar</button>
        <Link
        href= "/cadastrar"
        className="bg-red-500 text-white rounded-lg p-2">
        Cadastrar
        </Link>
      </div>
    </div>
  );
}
