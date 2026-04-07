import { Chess, Move } from 'chess.js';
import { Difficulty } from '../types/chess.types';

export function getBestMoveWorker(
  chess: Chess,
  difficulty: Difficulty,
  onResult: (move: Move | null) => void
): void {
  const worker = new Worker(
    new URL('../workers/ai.worker.ts', import.meta.url),
    { type: 'module' }
  );
  worker.postMessage({ fen: chess.fen(), difficulty });
  worker.onmessage = (e: MessageEvent) => {
    onResult(e.data);
    worker.terminate();
  };
  worker.onerror = (err) => {
    console.error('Worker error:', err);
    worker.terminate();
    onResult(null);
  };
}

// Для unit тестов
export function getBestMove(chess: Chess, difficulty: Difficulty): Move | null {
  const PIECE_VALUES: Record<string, number> = { p:100, n:320, b:330, r:500, q:900, k:20000 };
  const depthMap: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
  const depth = depthMap[difficulty];

  function evalBoard(): number {
    let score = 0;
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;
        score += piece.color === 'w' ? PIECE_VALUES[piece.type] : -PIECE_VALUES[piece.type];
      }
    }
    return score;
  }

  function minimax(d: number, alpha: number, beta: number, maximizing: boolean): number {
    if (d === 0 || chess.isGameOver()) {
      if (chess.isCheckmate()) return maximizing ? -30000 : 30000;
      if (chess.isDraw()) return 0;
      return evalBoard();
    }
    const moves = chess.moves({ verbose: true });
    if (maximizing) {
      let best = -Infinity;
      for (const move of moves) {
        chess.move(move); best = Math.max(best, minimax(d-1, alpha, beta, false)); chess.undo();
        alpha = Math.max(alpha, best); if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of moves) {
        chess.move(move); best = Math.min(best, minimax(d-1, alpha, beta, true)); chess.undo();
        beta = Math.min(beta, best); if (beta <= alpha) break;
      }
      return best;
    }
  }

  const moves = chess.moves({ verbose: true }) as Move[];
  if (moves.length === 0) return null;
  const isMax = chess.turn() === 'w';
  let bestMove: Move | null = null;
  let bestVal = isMax ? -Infinity : Infinity;
  for (const move of moves) {
    chess.move(move);
    const val = minimax(depth-1, -Infinity, Infinity, !isMax);
    chess.undo();
    if (isMax ? val > bestVal : val < bestVal) { bestVal = val; bestMove = move; }
  }
  return bestMove;
}