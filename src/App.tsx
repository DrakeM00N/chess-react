import React, { useState } from 'react';
import Board from './components/Board';
import { useChess } from './hooks/useChess';
import { Chess } from 'chess.js';
import { Difficulty } from './types/chess.types';
import './App.css';
import PromotionModal from './components/PromotionModal';

const PIECE_GLYPHS: Record<string, string> = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
};

function findKingSquare(chess: Chess, color: 'w' | 'b'): string | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (p && p.type === 'k' && p.color === color) {
        return `${'abcdefgh'[f]}${8 - r}`;
      }
    }
  }
  return null;
}

const App: React.FC = () => {
  const {
    chess, board, selectedSquare, legalMoves, gameState,
    history, capturedPieces, difficulty, isAiThinking,
    playerColor, lastMove,
    onSquareClick, setDifficulty, newGame, undoMove, togglePlayerColor,
     pendingPromotion, 
    resolvePromotion,
  } = useChess();

  const [showResult, setShowResult] = useState(false);
  const [prevGameOver, setPrevGameOver] = useState(false);

  const isGameOver = gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;
  if (isGameOver && !prevGameOver) {
    setPrevGameOver(true);
    setTimeout(() => setShowResult(true), 600);
  }
  if (!isGameOver && prevGameOver) {
    setPrevGameOver(false);
    setShowResult(false);
  }

  const kingSquare = findKingSquare(chess, gameState.turn);
  const diffOptions: Difficulty[] = ['easy', 'medium', 'hard'];
  const diffLabels: Record<Difficulty, string> = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' };

  const sortedCaptured = (pieces: string[]) =>
    [...pieces].sort().map(p => PIECE_GLYPHS[p] || p).join('');

  return (
    <div className="app">
      <h1 className="title">Chess vs AI</h1>
      <p className="subtitle">Minimax · Alpha-Beta Pruning</p>

      <div className="game-layout">
        {/* Board */}
        <div className="board-section">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            lastMove={lastMove}
            isInCheck={gameState.isCheck}
            kingSquare={kingSquare}
            playerColor={playerColor}
            onSquareClick={onSquareClick}
          />
          {isAiThinking && (
            <div className="thinking-bar">
              <div className="thinking-fill" />
            </div>
          )}
        </div>

        {/* Panel */}
        <div className="panel">

          {/* Status */}
          <div className="card">
            <div className="card-title">Статус</div>
            <div className="turn-row">
              <div
                className="turn-dot"
                style={{ background: gameState.turn === 'w' ? '#fff' : '#1a1a2e' }}
              />
              <span className="turn-label">
                {isAiThinking
                  ? 'AI думает…'
                  : gameState.turn === playerColor
                  ? 'Ваш ход'
                  : 'Ход AI'}
              </span>
            </div>
            {gameState.isCheck && !gameState.isCheckmate && (
              <div className="check-badge">Шах!</div>
            )}
          </div>

          {/* Difficulty */}
          <div className="card">
            <div className="card-title">Сложность</div>
            <div className="diff-row">
              {diffOptions.map(d => (
                <button
                  key={d}
                  className={`diff-btn${difficulty === d ? ' active' : ''}`}
                  onClick={() => setDifficulty(d)}
                  disabled={isAiThinking}
                >
                  {diffLabels[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Captured */}
          <div className="card">
            <div className="card-title">Захваченные фигуры</div>
            <div className="captured-row">
              <span className="captured-label">Вы:</span>
              <span className="captured-pieces">{sortedCaptured(capturedPieces[playerColor])}</span>
            </div>
            <div className="captured-row">
              <span className="captured-label">AI:</span>
              <span className="captured-pieces">{sortedCaptured(capturedPieces[playerColor === 'w' ? 'b' : 'w'])}</span>
            </div>
          </div>

          {/* History */}
          <div className="card">
            <div className="card-title">История ходов</div>
            <div className="history-list">
              {Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => (
                <div key={i} className="history-row">
                  <span className="hist-num">{i + 1}.</span>
                  <span className="hist-move">{history[i * 2]?.san}</span>
                  <span className="hist-move muted">{history[i * 2 + 1]?.san || ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="card controls">
            <button className="btn primary" onClick={() => { newGame(); setShowResult(false); }}>
              Новая игра
            </button>
            <button className="btn" onClick={undoMove} disabled={isAiThinking || history.length < 2}>
              Отменить ход
            </button>
            <button className="btn" onClick={togglePlayerColor} disabled={isAiThinking}>
              {playerColor === 'w' ? 'Играть за чёрных' : 'Играть за белых'}
            </button>
          </div>
        </div>
      </div>

      {/* Result modal */}
      {showResult && (
        <div className="overlay">
          <div className="result-box">
            <h2>{gameState.isCheckmate ? 'Шах и мат!' : gameState.isStalemate ? 'Пат!' : 'Ничья!'}</h2>
            <p>{gameState.winner === playerColor ? '🎉 Вы победили!' : gameState.winner ? 'AI победил' : 'Ничья'}</p>
            <button className="btn primary" onClick={() => { newGame(); setShowResult(false); }}>
              Играть снова
            </button>
          </div>
        </div>
      )}
      {pendingPromotion && (
        <PromotionModal
          color={playerColor}
          onSelect={resolvePromotion}
        />
      )}
    </div>
  );
};

export default App;