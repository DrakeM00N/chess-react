import React from 'react';
import Piece from './Piece';
import { PieceColor, PieceType } from '../types/chess.types';

interface SquareProps {
  square: string;
  piece: { type: PieceType; color: PieceColor } | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  showFileLabel: boolean;
  showRankLabel: boolean;
  onClick: (square: string) => void;
}

const Square: React.FC<SquareProps> = ({
  square, piece, isLight, isSelected,
  isLegalMove, isLastMove, isInCheck,
  showFileLabel, showRankLabel, onClick,
}) => {
  const getBackground = () => {
    if (isSelected)  return '#f6f669';
    if (isInCheck)   return '#e74c3c';
    if (isLastMove)  return isLight ? '#cdd16a' : '#aaa23a';
    return isLight   ? '#f0d9b5' : '#b58863';
  };

  return (
    <div
  data-testid="square"
  data-legal={isLegalMove}
  onClick={() => onClick(square)}
  style={{
    position: 'relative',
    width: '100%',
    aspectRatio: '1',
    background: getBackground(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
  }}
>
      {/* Rank label (1-8) — left side */}
      {showRankLabel && (
        <span style={{
          position: 'absolute', top: 2, left: 3,
          fontSize: 'clamp(8px, 1.2vw, 12px)',
          fontWeight: 600, lineHeight: 1,
          color: isLight ? '#b58863' : '#f0d9b5',
          userSelect: 'none',
        }}>
          {square[1]}
        </span>
      )}

      {/* File label (a-h) — bottom side */}
      {showFileLabel && (
        <span style={{
          position: 'absolute', bottom: 2, right: 3,
          fontSize: 'clamp(8px, 1.2vw, 12px)',
          fontWeight: 600, lineHeight: 1,
          color: isLight ? '#b58863' : '#f0d9b5',
          userSelect: 'none',
        }}>
          {square[0]}
        </span>
      )}

      {/* Legal move dot */}
      {isLegalMove && !piece && (
        <div style={{
          width: '30%', height: '30%',
          borderRadius: '50%',
          background: 'rgba(20, 85, 30, 0.5)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Legal capture ring */}
      {isLegalMove && piece && (
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 0 4px rgba(20,120,40,0.6)',
          borderRadius: 0, pointerEvents: 'none', zIndex: 1,
        }} />
      )}

      {/* Piece */}
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;