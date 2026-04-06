import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Square from '../../components/Square';

describe('Square компонент', () => {
  const defaultProps = {
    square: 'e4',
    piece: null,
    isLight: true,
    isSelected: false,
    isLegalMove: false,
    isLastMove: false,
    isInCheck: false,
    showFileLabel: false,
    showRankLabel: false,
    onClick: vi.fn(),
  };

  it('рендерится без ошибок', () => {
    const { container } = render(<Square {...defaultProps} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('вызывает onClick при клике', () => {
    const onClick = vi.fn();
    const { container } = render(<Square {...defaultProps} onClick={onClick} />);
    fireEvent.click(container.firstChild!);
    expect(onClick).toHaveBeenCalledWith('e4');
  });

  it('показывает метку ранга', () => {
    render(<Square {...defaultProps} showRankLabel square='a4' />);
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('показывает метку файла', () => {
    render(<Square {...defaultProps} showFileLabel square='e1' />);
    expect(screen.getByText('e')).toBeTruthy();
  });

  it('применяет светлый фон для светлой клетки', () => {
    const { container } = render(<Square {...defaultProps} isLight />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.background).toBe('rgb(240, 217, 181)');
  });

  it('применяет тёмный фон для тёмной клетки', () => {
    const { container } = render(<Square {...defaultProps} isLight={false} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.background).toBe('rgb(181, 136, 99)');
  });

  it('подсвечивает выбранную клетку', () => {
    const { container } = render(<Square {...defaultProps} isSelected />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.background).toBe('rgb(246, 246, 105)');
  });

  it('показывает точку легального хода', () => {
    const { container } = render(<Square {...defaultProps} isLegalMove />);
    expect(container.querySelector('div > div')).toBeTruthy();
  });
});