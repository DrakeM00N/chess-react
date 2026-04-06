import React from 'react';
import pieceImages from '../utils/pieceImages';
import { PieceColor, PieceType } from '../types/chess.types';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const src = pieceImages[color][type];
  return (
    <img
      src={src}
      alt={`${color}${type}`}
      style={{
        width: '80%',
        height: '80%',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
        filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.4))',
      }}
    />
  );
};

export default Piece;