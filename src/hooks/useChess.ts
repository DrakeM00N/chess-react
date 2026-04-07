import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { Difficulty, GameState, MoveResult, PieceType } from '../types/chess.types';
import { getBestMoveWorker } from '../utils/ai';

interface UseChessReturn {
  chess: Chess;
  board: ReturnType<Chess['board']>;
  selectedSquare: string | null;
  legalMoves: string[];
  gameState: GameState;
  history: Move[];
  capturedPieces: { w: string[]; b: string[] };
  difficulty: Difficulty;
  isAiThinking: boolean;
  playerColor: 'w' | 'b';
  lastMove: { from: string; to: string } | null;
  onSquareClick: (square: string) => void;
  setDifficulty: (d: Difficulty) => void;
  newGame: () => void;
  undoMove: () => void;
  togglePlayerColor: () => void;
  pendingPromotion: { from: string; to: string } | null;
resolvePromotion: (piece: PieceType) => void;
}

function getGameState(chess: Chess): GameState {
  return {
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isDraw: chess.isDraw(),
    turn: chess.turn(),
    winner: chess.isCheckmate() ? (chess.turn() === 'w' ? 'b' : 'w') : null,
  };
}

function getCaptured(history: Move[]): { w: string[]; b: string[] } {
  const captured: { w: string[]; b: string[] } = { w: [], b: [] };
  for (const move of history) {
    if (move.captured) {
      // The side that moved captured an opponent piece
      captured[move.color].push(move.captured);
    }
  }
  return captured;
}

export function useChess(): UseChessReturn {
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>(getGameState(chessRef.current));
  const [history, setHistory] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{ w: string[]; b: string[] }>({ w: [], b: [] });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const syncState = useCallback(() => {
    const chess = chessRef.current;
    setBoard(chess.board());
    setGameState(getGameState(chess));
    const hist = chess.history({ verbose: true }) as Move[];
    setHistory(hist);
    setCapturedPieces(getCaptured(hist));
    if (hist.length > 0) {
      const last = hist[hist.length - 1];
      setLastMove({ from: last.from, to: last.to });
    }
  }, []);

  const doAiMove = useCallback(() => {
  const chess = chessRef.current;
  if (chess.isGameOver() || chess.turn() === playerColor) return;
  setIsAiThinking(true);
  getBestMoveWorker(chess, difficulty, (move) => {
    if (move) {
      chess.move(move);
      syncState();
    }
    setIsAiThinking(false);
  });
}, [difficulty, playerColor, syncState]);

  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);

const onSquareClick = useCallback((square: string) => {
  const chess = chessRef.current;
  if (chess.isGameOver() || chess.turn() !== playerColor || isAiThinking) return;

  if (selectedSquare === null) {
    const piece = chess.get(square as Square);
    if (!piece || piece.color !== playerColor) return;
    setSelectedSquare(square);
    const moves = chess.moves({ square: square as Square, verbose: true }) as Move[];
    setLegalMoves(moves.map(m => m.to));
  } else {
    if (square === selectedSquare) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
    try {
      const piece = chess.get(selectedSquare as Square);
      const isPromo =
        piece?.type === 'p' &&
        ((playerColor === 'w' && square[1] === '8') ||
         (playerColor === 'b' && square[1] === '1'));

      if (isPromo) {
        // Проверяем что ход вообще легален перед показом модала
        const legalTargets = chess.moves({ square: selectedSquare as Square, verbose: true }) as Move[];
        const isLegal = legalTargets.some(m => m.to === square);
        if (!isLegal) {
          const newPiece = chess.get(square as Square);
          if (newPiece && newPiece.color === playerColor) {
            setSelectedSquare(square);
            const moves = chess.moves({ square: square as Square, verbose: true }) as Move[];
            setLegalMoves(moves.map(m => m.to));
          } else {
            setSelectedSquare(null);
            setLegalMoves([]);
          }
          return;
        }
        setPendingPromotion({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      chess.move({ from: selectedSquare, to: square });
      syncState();
      setSelectedSquare(null);
      setLegalMoves([]);
      setTimeout(() => doAiMove(), 200);
    } catch {
      const piece = chess.get(square as Square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
        const moves = chess.moves({ square: square as Square, verbose: true }) as Move[];
        setLegalMoves(moves.map(m => m.to));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    }
  }
}, [selectedSquare, playerColor, isAiThinking, syncState, doAiMove]);

const resolvePromotion = useCallback((piece: PieceType) => {
  if (!pendingPromotion) return;
  const chess = chessRef.current;
  try {
    chess.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: piece });
    syncState();
    setPendingPromotion(null);
    setTimeout(() => doAiMove(), 200);
  } catch {
    setPendingPromotion(null);
  }
}, [pendingPromotion, syncState, doAiMove]);

  const newGame = useCallback(() => {
    chessRef.current = new Chess();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setIsAiThinking(false);
    syncState();
  }, [syncState]);

  const undoMove = useCallback(() => {
    const chess = chessRef.current;
    if (isAiThinking) return;
    chess.undo(); // undo AI move
    chess.undo(); // undo player move
    setSelectedSquare(null);
    setLegalMoves([]);
    syncState();
  }, [isAiThinking, syncState]);

  const togglePlayerColor = useCallback(() => {
    setPlayerColor(prev => prev === 'w' ? 'b' : 'w');
    chessRef.current = new Chess();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setIsAiThinking(false);
    syncState();
  }, [syncState]);

  // AI moves first if player is black
  useEffect(() => {
    if (playerColor === 'b') doAiMove();
  }, [playerColor]); // eslint-disable-line

  return {
    chess: chessRef.current,
    board,
    selectedSquare,
    legalMoves,
    gameState,
    history,
    capturedPieces,
    difficulty,
    isAiThinking,
    playerColor,
    lastMove,
    onSquareClick,
    setDifficulty,
    newGame,
    undoMove,
    togglePlayerColor,
    pendingPromotion, 
    resolvePromotion,
  };
}