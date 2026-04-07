import { Chess } from 'chess.js';

const PIECE_VALUES: Record<string, number> = { p:100, n:320, b:330, r:500, q:900, k:20000 };

function evalBoard(chess: Chess): number {
  let score = 0;
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const val = PIECE_VALUES[piece.type] || 0;
      score += piece.color === 'w' ? val : -val;
    }
  }
  return score;
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (depth === 0 || chess.isGameOver()) {
    if (chess.isCheckmate()) return maximizing ? -30000 : 30000;
    if (chess.isDraw()) return 0;
    return evalBoard(chess);
  }
  const moves = chess.moves({ verbose: true });
  moves.sort((a: any, b: any) => (b.captured ? PIECE_VALUES[b.captured] || 0 : 0) - (a.captured ? PIECE_VALUES[a.captured] || 0 : 0));

  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      chess.move(move); best = Math.max(best, minimax(chess, depth-1, alpha, beta, false)); chess.undo();
      alpha = Math.max(alpha, best); if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      chess.move(move); best = Math.min(best, minimax(chess, depth-1, alpha, beta, true)); chess.undo();
      beta = Math.min(beta, best); if (beta <= alpha) break;
    }
    return best;
  }
}

self.onmessage = function(e: MessageEvent) {
  const { fen, difficulty } = e.data;
  const depthMap: Record<string, number> = { easy: 1, medium: 2, hard: 4 };
  const depth = depthMap[difficulty] || 2;

  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true }) as any[];
  if (moves.length === 0) { self.postMessage(null); return; }

  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }
  moves.sort((a: any, b: any) => (b.captured ? PIECE_VALUES[b.captured] || 0 : 0) - (a.captured ? PIECE_VALUES[a.captured] || 0 : 0));

  const isMaximizing = chess.turn() === 'w';
  let bestMove = null;
  let bestVal = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    chess.move(move);
    const val = minimax(chess, depth-1, -Infinity, Infinity, !isMaximizing);
    chess.undo();
    if (isMaximizing ? val > bestVal : val < bestVal) {
      bestVal = val; bestMove = move;
    }
  }
  self.postMessage(bestMove);
};