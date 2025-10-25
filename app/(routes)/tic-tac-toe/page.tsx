
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Square from '@/components/ui/square';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { playFailureSound, playSuccessSound } from '@/utils/audio';

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
  const router = useRouter();
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = squares.every((sq) => sq !== null) && !winner;
  const [loadingAI, setLoadingAI] = useState(false);

  const playAI = React.useCallback(async (board: (string | null)[]) => {
    console.log('AI is thinking...');
    setLoadingAI(true);
    try {
      // Detailed prompt for the AI
      const prompt = `
You are an agent playing Tic-Tac-Toe as the '🔵' player.
The board is represented as an array of 9 positions, where each position can be '❌', '🔵' or null.
Your goal is to choose the index (0-8) where you should play to maximize your chances of winning or blocking the opponent.
Respond only with the index number (0-8) where you want to play, with no additional text.
Current board: ${JSON.stringify(board)}
      `.trim();

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (response.status === 429) {
        router.push('/service-unavailble');
        return;
      }
      const data = await response.json();
      const aiMove = typeof data.text === 'string' ? parseInt(data.text, 10) : null;
      if (aiMove !== null && board[aiMove] === null) {
        const nextSquares = board.slice();
        nextSquares[aiMove] = '🔵';
        setSquares(nextSquares);
        setXIsNext(true);
      }
    } catch (error) {
      console.error('Error playing AI:', error);
    } finally {
      setLoadingAI(false);
    }
  }, [router]);

  function handleClick(i: number) {
    if (squares[i] || winner || loadingAI) return;
    const nextSquares = squares.slice();
    nextSquares[i] = '❌';
    setSquares(nextSquares);
    setXIsNext(false);
    // Only call AI if game not finished after player's move
    const nextWinner = calculateWinner(nextSquares);
    const nextDraw = nextSquares.every((sq) => sq !== null) && !nextWinner;
    if (!nextWinner && !nextDraw) {
      void playAI(nextSquares);
    }
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Removed auto-play effect to avoid recursive calls; AI is triggered directly after the player's move.

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
    if (winner === '❌') {
      playSuccessSound();
    } else {
      playFailureSound();
    } 
  } else if (isDraw) {
    status = 'Draw';
  } else {
    status = `Turn: ${xIsNext ? '❌' : '🔵'}`;
  }


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-primary border-b-2 border-black">
          <CardTitle className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Tic-Tac-Toe</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <div className="mb-6 text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold">{status}</p>
            {loadingAI && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground animate-pulse">🤖 Thinking...</p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-fit">
              {squares.map((value, i) => (
                <Square key={i} value={value} onClick={() => handleClick(i)} disabled={!!winner || loadingAI} />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t-2 border-black pt-6 pb-6">
          <Button
            onClick={handleRestart}
            disabled={loadingAI}
            className="w-full sm:w-auto px-8 py-2 text-base sm:text-lg font-bold"
          >
            Restart game
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}