import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { getBestMove } from '../../utils/ai';

describe('AI — getBestMove', () => {
  it('возвращает ход для начальной позиции', () => {
    const chess = new Chess();
    const move = getBestMove(chess, 'easy');
    expect(move).not.toBeNull();
  });

  it('возвращает null когда нет ходов (мат)', () => {
    const chess = new Chess('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3');
    const move = getBestMove(chess, 'easy');
    expect(move).toBeNull();
  });

  it('находит мат в 1 ход', () => {
    // Позиция где белые могут поставить мат в 1
    const chess = new Chess('6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1');
    const move = getBestMove(chess, 'medium');
    expect(move).not.toBeNull();
  });

  it('работает на всех уровнях сложности', () => {
  const chess = new Chess();
  expect(getBestMove(chess, 'easy')).not.toBeNull();
  expect(getBestMove(chess, 'medium')).not.toBeNull();
}, 60000); 

  it('не мутирует исходную доску', () => {
    const chess = new Chess();
    const fenBefore = chess.fen();
    getBestMove(chess, 'medium');
    expect(chess.fen()).toBe(fenBefore);
  });
});