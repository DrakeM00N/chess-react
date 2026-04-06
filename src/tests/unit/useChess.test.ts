import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChess } from '../../hooks/useChess';

vi.mock('../../utils/ai', () => ({
  getBestMove: () => ({ from: 'e7', to: 'e5', promotion: undefined }),
}));

describe('useChess hook', () => {
  it('инициализируется с начальной позицией', () => {
    const { result } = renderHook(() => useChess());
    expect(result.current.gameState.turn).toBe('w');
    expect(result.current.history).toHaveLength(0);
    expect(result.current.selectedSquare).toBeNull();
  });

  it('выбирает фигуру при клике', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e2'); });
    expect(result.current.selectedSquare).toBe('e2');
    expect(result.current.legalMoves.length).toBeGreaterThan(0);
  });

  it('снимает выделение при повторном клике', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e2'); });
    act(() => { result.current.onSquareClick('e2'); });
    expect(result.current.selectedSquare).toBeNull();
  });

  it('не выбирает пустую клетку', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e4'); });
    expect(result.current.selectedSquare).toBeNull();
  });

  it('не выбирает чужую фигуру', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e7'); });
    expect(result.current.selectedSquare).toBeNull();
  });

  it('делает ход', async () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e2'); });
    act(() => { result.current.onSquareClick('e4'); });
    expect(result.current.history.length).toBeGreaterThanOrEqual(1);
  });

  it('сбрасывает игру', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e2'); });
    act(() => { result.current.onSquareClick('e4'); });
    act(() => { result.current.newGame(); });
    expect(result.current.history).toHaveLength(0);
    expect(result.current.gameState.turn).toBe('w');
  });

  it('меняет сложность', () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.setDifficulty('hard'); });
    expect(result.current.difficulty).toBe('hard');
  });

  it('отменяет ход', async () => {
    const { result } = renderHook(() => useChess());
    act(() => { result.current.onSquareClick('e2'); });
    act(() => { result.current.onSquareClick('e4'); });
    await vi.waitFor(() => expect(result.current.history.length).toBeGreaterThanOrEqual(1));
    act(() => { result.current.undoMove(); });
    expect(result.current.history).toHaveLength(0);
  });
});