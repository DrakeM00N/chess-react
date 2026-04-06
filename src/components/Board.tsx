import React from 'react';
import Square from './Square';
import { PieceColor, PieceType } from '../types/chess.types';

interface BoardProps {
  board: ({
    type: PieceType;
    color: PieceColor;
    square: string;
  } | null)[][];
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  isInCheck: boolean;
  kingSquare: string | null;
  playerColor: 'w' | 'b';
  onSquareClick: (square: string) => void;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const Board: React.FC<BoardProps> = ({
  board, selectedSquare, legalMoves, lastMove,
  isInCheck, kingSquare, playerColor, onSquareClick,
}) => {
  const ranks = playerColor === 'w' ? RANKS : [...RANKS].reverse();
  const files = playerColor === 'w' ? FILES : [...FILES].reverse();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      width: 'clamp(280px, min(56vw, 560px), 560px)',
      height: 'clamp(280px, min(56vw, 560px), 560px)',
      border: '3px solid #7a5533',
      borderRadius: '3px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      {ranks.map((rank, ri) =>
        files.map((file, fi) => {
          const square = `${file}${rank}`;
          const boardRank = RANKS.indexOf(rank);
          const boardFile = FILES.indexOf(file);
          const piece = board[boardRank][boardFile];
          const isLight = (boardRank + boardFile) % 2 === 0;
          const isSelected = selectedSquare === square;
          const isLegalMove = legalMoves.includes(square);
          const isLastMove = lastMove?.from === square || lastMove?.to === square;
          const isKingInCheck = isInCheck && kingSquare === square;
          const showRankLabel = fi === 0;
          const showFileLabel = ri === 7;

          return (
            <Square
              key={square}
              square={square}
              piece={piece ? { type: piece.type, color: piece.color } : null}
              isLight={isLight}
              isSelected={isSelected}
              isLegalMove={isLegalMove}
              isLastMove={isLastMove}
              isInCheck={isKingInCheck}
              showFileLabel={showFileLabel}
              showRankLabel={showRankLabel}
              onClick={onSquareClick}
            />
          );
        })
      )}
    </div>
  );
};

export default Board;