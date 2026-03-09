"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Perfil() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((res) => {
        setName(res.data.user.name);
        setEmail(res.data.user.email);
        setAvatar(res.data.user.avatar || "");
        setCreatedAt(
          new Date(res.data.user.createdAt).toLocaleDateString("pt-BR"),
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log("ERRO:", err);
        //  router.push("/");
      });
  }, []);

  const handleUpdate = async () => {
    setError("");
    setMessage("");

    try {
      const response = await axios.put("/api/auth/update-profile", {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setMessage(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post("/api/auth/upload-avatar", formData);
      setAvatar(response.data.avatar);
      setMessage("Foto atualizada");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao enviar foto");
    }
  };

  if (loading) return <p className="text-center mt-20">Carregando...</p>;

  return (
    <div className="min-h-screen flex justify-center pt-20">
      <div className="w-[500px] flex flex-col gap-6">
        <h1 className="text-2xl text-center font-bold">Meu Perfil</h1>

        <div className="flex flex-col items-center gap-2">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-600">
              {name ? name[0].toUpperCase() : "?"}
            </div>
          )}
          <label className="text-blue-500 underline text-sm cursor-pointer">
            Trocar foto
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="w-32">Email</label>
            <input
              type="text"
              value={email}
              disabled
              className="border rounded-lg p-2 flex-1 bg-gray-800 text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-2 flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32">Membro desde</label>
            <p className="p-2">{createdAt}</p>
          </div>

          <hr />

          <p className="text-sm text-gray-500">
            Preencha abaixo apenas se quiser trocar a senha:
          </p>

          <div className="flex items-center gap-2">
            <label className="w-32">Senha atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Senha atual"
              className="border rounded-lg p-2 flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32">Nova senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              className="border rounded-lg p-2 flex-1"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
          >
            Salvar alterações
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-500 underline text-sm text-center"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
