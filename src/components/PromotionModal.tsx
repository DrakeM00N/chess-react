import React from 'react';
import pieceImages from '../utils/pieceImages';
import { PieceColor, PieceType } from '../types/chess.types';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
}

const PIECES: PieceType[] = ['q', 'r', 'b', 'n'];

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200,
    }}>
      <div style={{
        background: '#16213e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <p style={{ color: '#8888aa', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Выбери фигуру
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {PIECES.map(piece => (
            <div
              key={piece}
              onClick={() => onSelect(piece)}
              style={{
                width: '72px', height: '72px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(233,69,96,0.2)';
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e94560';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <img
                src={pieceImages[color][piece]}
                alt={piece}
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;