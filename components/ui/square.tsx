"use client"

import { cn } from "@/lib/utils"

interface SquareProps {
  value: string | null
  onClick: () => void
  disabled?: boolean
}

export default function Square({ value, onClick, disabled }: SquareProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
        "border-3 border-black",
        "bg-card text-card-foreground",
        "text-3xl sm:text-4xl md:text-5xl font-bold",
        "transition-all duration-150",
        "hover:bg-secondary hover:scale-105",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
        "hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
        "active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      )}
    >
      {value}
    </button>
  )
}
