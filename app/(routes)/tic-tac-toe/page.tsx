'use client';

import React, { useState, useEffect } from 'react';
import Square from '@/components/ui/square';
import { Button } from '@/components/ui/button';

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToePage() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = squares.every((sq) => sq !== null) && !winner;
  const [loadingAI, setLoadingAI] = useState(false);

  const playAI = React.useCallback(async () => {
    setLoadingAI(true);
    try {
      // Prompt detallado para la IA
      const prompt = `
Eres un agente que juega Tic-Tac-Toe (3 en raya) como el jugador '🔵'.
El tablero está representado como un array de 9 posiciones, donde cada posición puede ser '❌', '🔵' o null.
Tu objetivo es elegir el índice (0-8) donde deberías jugar para maximizar tus posibilidades de ganar o bloquear al oponente.
Responde únicamente con el número del índice donde quieres jugar, sin ningún texto adicional.
Tablero actual: ${JSON.stringify(squares)}
      `.trim();

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      const aiMove = typeof data.text === 'string' ? parseInt(data.text, 10) : null;
      if (aiMove !== null && squares[aiMove] === null) {
        const nextSquares = squares.slice();
        nextSquares[aiMove] = '🔵';
        setSquares(nextSquares);
        setXIsNext(true);
      }
    } catch (error) {
      console.error('Error al jugar la IA:', error);
    } finally {
      setLoadingAI(false);
    }
  }, [squares]);

  function handleClick(i: number) {
    if (squares[i] || winner || loadingAI) return;
    const nextSquares = squares.slice();
    nextSquares[i] = '❌';
    setSquares(nextSquares);
    setXIsNext(false);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  useEffect(() => {
    // Si es el turno de la IA y el juego no ha terminado, llama a la API
    if (!xIsNext && !winner && !isDraw && !loadingAI) {
      playAI();
    }
  }, [xIsNext, winner, isDraw, squares, loadingAI, playAI]);

  let status;
  if (winner) {
    status = `Ganador: ${winner}`;
  } else if (isDraw) {
    status = 'Empate';
  } else {
    status = `Turno de: ${xIsNext ? '❌' : '🔵'}`;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-card w-fit p-5 h-fit shadow-lg">
        <h1 className="text-3xl font-bold mb-4">3 en Raya</h1>
        <div className="mb-2 text-lg">{status}</div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {squares.map((value, i) => (
            <Square key={i} value={value} onClick={() => handleClick(i)} disabled={!!winner || loadingAI} />
          ))}
        </div>
        <Button onClick={handleRestart} disabled={loadingAI}>
          Reiniciar
        </Button>
        {loadingAI && <div className="mt-2 text-blue-500">Pensando...</div>}
      </div>
    </>
  );
}