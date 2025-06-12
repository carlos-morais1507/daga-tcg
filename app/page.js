
"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [cartasNaoLocais, setCartasNaoLocais] = useState([]);
  const [cartasLocais, setCartasLocais] = useState([]);
  const [deck, setDeck] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("nao-locais");
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPBNQ2wehYsoT6wbQzSCb-eyuoOR1U3-FvOLpVYaLoUCszlB9eSsnYqV699Sjh_4vTMQXk4KmRByAa/pub?output=csv",
      {
        download: true,
        header: true,
        complete: (results) => {
          const unique = [];
          const seen = new Set();
          results.data.forEach((row) => {
            if (!seen.has(row.NOME)) {
              seen.add(row.NOME);
              unique.push(row);
            }
          });
          setCartasNaoLocais(unique);
        },
      },
    );

    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGvRSbB8O8hVmPs7kt2Y9fLPsHz8sfdT8BMzesP4nnhQ7H15lt2Ts5adx_yRWABevxQxrwha03RooX/pub?output=csv",
      {
        download: true,
        header: true,
        complete: (results) => {
          const unique = [];
          const seen = new Set();
          results.data.forEach((row) => {
            if (!seen.has(row.NOME)) {
              seen.add(row.NOME);
              unique.push(row);
            }
          });
          setCartasLocais(unique);
        },
      },
    );
  }, []);

  const adicionarCarta = (carta) => {
    setDeck((prev) => {
      const nome = carta.NOME;
      const existente = prev.find((c) => c.NOME === nome);
      const totalCartas = prev.reduce((acc, c) => acc + c.quantidade, 0);

      const ehLocal = (carta.TIPO || "").toLowerCase().includes("local");
      const locaisNoDeck = prev
        .filter((c) => (c.TIPO || "").toLowerCase().includes("local"))
        .reduce((acc, c) => acc + c.quantidade, 0);

      const limite = ehLocal
        ? 2
        : (carta.ATRIBUTO || "").toLowerCase().includes("personagem")
        ? 1
        : 5;

      if (totalCartas >= 50) return prev;
      if (ehLocal && locaisNoDeck >= 10) return prev;

      if (existente) {
        if (existente.quantidade >= limite) return prev;
        return prev.map((c) =>
          c.NOME === nome ? { ...c, quantidade: c.quantidade + 1 } : c,
        );
      }

      return [...prev, { ...carta, quantidade: 1 }];
    });
  };

  const removerCarta = (nome) => {
    setDeck((prev) =>
      prev
        .map((c) =>
          c.NOME === nome ? { ...c, quantidade: c.quantidade - 1 } : c,
        )
        .filter((c) => c.quantidade > 0),
    );
  };

  const cartas = abaAtiva === "locais" ? cartasLocais : cartasNaoLocais;

  return (
    <div className="flex">
      <div className="w-1/4 h-screen sticky top-0 p-4 border-r overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Seu Deck</h2>
        {deck.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma carta adicionada ainda.</p>
        ) : (
          <>
            <ul className="space-y-2 text-sm">
              {deck.map((carta, i) => (
                <li key={carta.NOME} className="flex justify-between items-center border p-2 rounded bg-white">
                  <div>
                    <p>{carta.NOME} x{carta.quantidade}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => removerCarta(carta.NOME)} className="px-2 bg-red-500 text-white rounded">−</button>
                    <button onClick={() => adicionarCarta(carta)} className="px-2 bg-green-600 text-white rounded">+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm font-semibold text-gray-700">
              Total: {deck.reduce((sum, c) => sum + c.quantidade, 0)} / 50 cartas
            </div>
            <button
              onClick={() => setMostrarLista(true)}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded"
            >
              ✅ Confirmar Deck
            </button>
          </>
        )}
      </div>

      <div className="w-3/4 p-4">
        <div className="flex gap-4 mb-4">
          <button onClick={() => setAbaAtiva("nao-locais")} className={"px-4 py-2 rounded " + (abaAtiva === "nao-locais" ? "bg-purple-600 text-white" : "bg-gray-200")}>
            Não-Locais
          </button>
          <button onClick={() => setAbaAtiva("locais")} className={"px-4 py-2 rounded " + (abaAtiva === "locais" ? "bg-purple-600 text-white" : "bg-gray-200")}>
            Locais
          </button>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cartas.map((carta, index) => (
            <li key={carta.NOME} className="border rounded p-3 shadow text-sm flex flex-col justify-between">
              <div>
                <p className="font-semibold">{carta.NOME}</p>
                {abaAtiva === "locais" ? (
                  <>
                    <p>💰 Ouro: {carta.OURO}</p>
                    <p>👥 População: {carta.POPUL}</p>
                    <p className="text-xs mt-5">{carta.HABILIDADE}</p>
                  </>
                ) : (
                  <>
                    <p>Tipo: {carta.TIPO}</p>
                    <p>Custo: {carta.CUSTO}</p>
                    <p>Facção: {carta.FACÇÃO}</p>
                    <p>Atributo: {carta.ATRIBUTO}</p>
                    <p className="font-bold mt-5">{carta.NOME_HAB1}</p>
                    <p className="text-xs">{carta.HAB1}</p>
                  </>
                )}
              </div>
              <button onClick={() => adicionarCarta(carta)} className="mt-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                Adicionar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {mostrarLista && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Lista do Deck</h2>
            <ul className="text-left text-sm max-h-96 overflow-y-auto">
              {deck.map((carta, i) => (
                <li key={carta.NOME}>- {carta.NOME} x{carta.quantidade}</li>
              ))}
            </ul>
            <button
              onClick={() => setMostrarLista(false)}
              className="mt-6 w-full py-2 px-4 bg-red-600 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
