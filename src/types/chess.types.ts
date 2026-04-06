export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Square {
  piece: Piece | null;
  file: string;
  rank: number;
}

export type BoardSquare = {
  square: string;  // e.g. "e4"
  piece: Piece | null;
};

export interface GameState {
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  turn: PieceColor;
  winner: PieceColor | null;
}

export interface MoveResult {
  from: string;
  to: string;
  promotion?: PieceType;
}

export type Difficulty = 'easy' | 'medium' | 'hard';