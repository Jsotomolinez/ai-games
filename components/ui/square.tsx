import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  disabled?: boolean;
}

export default function Square({ value, onClick, disabled = false }: SquareProps) {
  return (
    <button
      className="w-16 h-16 border-2 border-gray-400 text-2xl font-bold flex items-center justify-center bg-white hover:bg-gray-100 transition-colors"
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Square with ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}
