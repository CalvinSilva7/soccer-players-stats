export default function Cadastrar() {
    return (
      <div className="min-h-screen flex justify-center pt-20">
        
        <div className="w-[500px] flex flex-col gap-6">
  
          <h1 className="text-2xl text-center font-bold">
            Complete seu cadastro para assim poder acessar a página
          </h1>
          <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="w-32">
              Nome
            </label>
  
            <input
              type="text"
              placeholder="Digite seu nome"
              className="border rounded-lg p-2 flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-32">
              Email
            </label>
  
            <input
              type="text"
              placeholder="Digite seu email"
              className="border rounded-lg p-2 flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-32">
              Senha
            </label>
  
            <input
              type="password"
              placeholder="Digite sua senha"
              className="border rounded-lg p-2 flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-32">
              Confirmar senha
            </label>
  
            <input
              type="password"
              placeholder="Confirme sua senha"
              className="border rounded-lg p-2 flex-1"
            />
          </div>
        </div>
        </div>
      </div>
    );
  }
  