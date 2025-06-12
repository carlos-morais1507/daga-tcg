function addCard(deck, card) {
  const nome = card.NOME;
  const existente = deck.find((c) => c.NOME === nome);
  const totalCartas = deck.reduce((acc, c) => acc + c.quantidade, 0);

  const ehLocal = (card.TIPO || "").toLowerCase().includes("local");
  const locaisNoDeck = deck
    .filter((c) => (c.TIPO || "").toLowerCase().includes("local"))
    .reduce((acc, c) => acc + c.quantidade, 0);

  const limite = ehLocal
    ? 2
    : (card.ATRIBUTO || "").toLowerCase().includes("personagem")
    ? 1
    : 5;

  if (totalCartas >= 50) return deck;
  if (ehLocal && locaisNoDeck >= 10) return deck;

  if (existente) {
    if (existente.quantidade >= limite) return deck;
    return deck.map((c) =>
      c.NOME === nome ? { ...c, quantidade: c.quantidade + 1 } : c
    );
  }

  return [...deck, { ...card, quantidade: 1 }];
}

function removeCard(deck, nome) {
  return deck
    .map((c) =>
      c.NOME === nome ? { ...c, quantidade: c.quantidade - 1 } : c
    )
    .filter((c) => c.quantidade > 0);
}

module.exports = { addCard, removeCard };
