import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { playerName, stats } = await request.json();

  if (!playerName) {
    return NextResponse.json(
      { error: "Nome do jogador é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const prompt = playerName.startsWith("Partida")
      ? `
        Você é um analista de futebol. Analise esta partida com base nas escalações e estatísticas.
        
        ${JSON.stringify(stats)}
        
        Fale sobre:
        - Análise tática das formações
        - Jogadores chave de cada time
        - Como o jogo provavelmente se desenrolou baseado nas estatísticas
        
        Responda em português do Brasil em no máximo 3 parágrafos.
      `
      : `
        Você é um analista de futebol. Gere um resumo curto (máximo 3 parágrafos) sobre o jogador ${playerName}.
        
        ${stats ? `Aqui estão as estatísticas atuais dele: ${JSON.stringify(stats)}` : "Use seu conhecimento sobre o jogador."}
        
        Fale sobre:
        - Momento atual da carreira
        - Pontos fortes e fracos
        - Desempenho recente
        
        Responda em português do Brasil.
      `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const text = completion.choices[0]?.message?.content || "Sem resumo";

    return NextResponse.json({ summary: text });
  } catch (err) {
    console.log("ERRO GROQ:", err);
    return NextResponse.json(
      { error: "Erro ao gerar resumo" },
      { status: 500 },
    );
  }
}
