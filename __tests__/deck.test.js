const { addCard, removeCard } = require('../lib/deck.cjs');

describe('Deck rules', () => {
  test('não ultrapassar 50 cartas totais', () => {
    let deck = [];
    // fill deck with 50 generic cards (10 names * 5 copies)
    for (let i = 0; i < 10; i++) {
      const card = { NOME: `carta${i}`, ATRIBUTO: 'acao', TIPO: 'acao' };
      for (let j = 0; j < 5; j++) {
        deck = addCard(deck, card);
      }
    }
    expect(deck.reduce((sum, c) => sum + c.quantidade, 0)).toBe(50);
    const extra = { NOME: 'extra', ATRIBUTO: 'acao', TIPO: 'acao' };
    const updated = addCard(deck, extra);
    expect(updated).toEqual(deck); // não adiciona
  });

  test('respeitar limites individuais', () => {
    const personagem = { NOME: 'heroi', ATRIBUTO: 'Personagem', TIPO: 'acao' };
    let deck = addCard([], personagem);
    deck = addCard(deck, personagem); // tentativa acima do limite 1
    expect(deck.find(c => c.NOME === 'heroi').quantidade).toBe(1);

    const local = { NOME: 'cidade', ATRIBUTO: 'local', TIPO: 'Local' };
    deck = addCard(deck, local);
    deck = addCard(deck, local);
    deck = addCard(deck, local); // limite 2
    expect(deck.find(c => c.NOME === 'cidade').quantidade).toBe(2);

    const comum = { NOME: 'magia', ATRIBUTO: 'acao', TIPO: 'acao' };
    for (let i = 0; i < 6; i++) {
      deck = addCard(deck, comum);
    }
    expect(deck.find(c => c.NOME === 'magia').quantidade).toBe(5);
  });

  test('remover cartas corretamente', () => {
    const card = { NOME: 'teste', ATRIBUTO: 'acao', TIPO: 'acao' };
    let deck = addCard([], card);
    deck = addCard(deck, card);
    deck = removeCard(deck, 'teste');
    expect(deck.find(c => c.NOME === 'teste').quantidade).toBe(1);
    deck = removeCard(deck, 'teste');
    expect(deck.find(c => c.NOME === 'teste')).toBeUndefined();
  });
});
