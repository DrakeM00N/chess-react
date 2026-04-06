import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chess } from 'chess.js';
import Board from '../../components/Board';

function getBoard() {
  return new Chess().board();
}

const defaultProps = {
  board: getBoard(),
  selectedSquare: null,
  legalMoves: [],
  lastMove: null,
  isInCheck: false,
  kingSquare: null,
  playerColor: 'w' as const,
  onSquareClick: vi.fn(),
};

describe('Board компонент', () => {
  it('рендерит 64 клетки', () => {
    const { container } = render(<Board {...defaultProps} />);
    const squares = screen.getAllByTestId('square');
    expect(squares.length).toBe(64);
  });

  it('рендерит фигуры начальной позиции', () => {
    const { container } = render(<Board {...defaultProps} />);
    const pieces = container.querySelectorAll('img');
    expect(pieces.length).toBe(32);
  });

  it('рендерится для чёрных (перевёрнутая доска)', () => {
    const { container } = render(<Board {...defaultProps} playerColor='b' />);
    const squares = screen.getAllByTestId('square');
    expect(squares.length).toBe(64);
  });
});