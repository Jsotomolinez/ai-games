"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { playFailureSound, playShootSound, playSinkingSound, playSuccessSound } from "@/utils/audio"
// import Square from "@/components/ui/square"

type CellState = "empty" | "ship" | "miss" | "hit" | "sunk"

interface Cell {
  state: CellState
  shipId?: number
}

interface Ship {
  id: number
  size: number
  hits: number
  sunk: boolean
}

const BOARD_SIZE = 10
const SHIPS = [
  { id: 1, size: 5, name: "Aircraft Carrier" },
  { id: 2, size: 4, name: "Battleship" },
  { id: 3, size: 3, name: "Cruiser" },
  { id: 4, size: 3, name: "Submarine" },
  { id: 5, size: 2, name: "Destroyer" },
]

export default function BattleshipPage() {
  const router = useRouter()
  const [gamePhase, setGamePhase] = useState<"placement" | "battle" | "gameOver">("placement")
  const [playerBoard, setPlayerBoard] = useState<Cell[][]>([])
  const [enemyBoard, setEnemyBoard] = useState<Cell[][]>([])
  const [playerShips, setPlayerShips] = useState<Ship[]>([])
  const [enemyShips, setEnemyShips] = useState<Ship[]>([])
  const [currentShipIndex, setCurrentShipIndex] = useState(0)
  const [isHorizontal, setIsHorizontal] = useState(true)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [message, setMessage] = useState("Place your Aircraft Carrier (5 cells)")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [winner, setWinner] = useState<"player" | "enemy" | null>(null)

  // Initialize boards
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const emptyBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() =>
        Array(BOARD_SIZE)
          .fill(null)
          .map(() => ({ state: "empty" as CellState })),
      )

    setPlayerBoard(JSON.parse(JSON.stringify(emptyBoard)))
    setEnemyBoard(JSON.parse(JSON.stringify(emptyBoard)))
    setPlayerShips(SHIPS.map((s) => ({ ...s, hits: 0, sunk: false })))
    setEnemyShips(SHIPS.map((s) => ({ ...s, hits: 0, sunk: false })))
    setGamePhase("placement")
    setCurrentShipIndex(0)
    setIsHorizontal(true)
    setMessage("Place your Aircraft Carrier (5 cells)")
    setWinner(null)
    setIsPlayerTurn(true)
  }

  const canPlaceShip = (board: Cell[][], row: number, col: number, size: number, horizontal: boolean): boolean => {
    if (horizontal) {
      if (col + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row][col + i].state !== "empty") return false
      }
    } else {
      if (row + size > BOARD_SIZE) return false
      for (let i = 0; i < size; i++) {
        if (board[row + i][col].state !== "empty") return false
      }
    }
    return true
  }

  const placeShip = (
    board: Cell[][],
    row: number,
    col: number,
    shipId: number,
    size: number,
    horizontal: boolean,
  ): Cell[][] => {
    const newBoard = JSON.parse(JSON.stringify(board))
    if (horizontal) {
      for (let i = 0; i < size; i++) {
        newBoard[row][col + i] = { state: "ship" as CellState, shipId }
      }
    } else {
      for (let i = 0; i < size; i++) {
        newBoard[row + i][col] = { state: "ship" as CellState, shipId }
      }
    }
    return newBoard
  }

  const handlePlayerPlacement = (row: number, col: number) => {
    if (gamePhase !== "placement") return

    const ship = SHIPS[currentShipIndex]
    if (canPlaceShip(playerBoard, row, col, ship.size, isHorizontal)) {
      const newBoard = placeShip(playerBoard, row, col, ship.id, ship.size, isHorizontal)
      setPlayerBoard(newBoard)

      if (currentShipIndex < SHIPS.length - 1) {
        setCurrentShipIndex(currentShipIndex + 1)
        setMessage(`Place your ${SHIPS[currentShipIndex + 1].name} (${SHIPS[currentShipIndex + 1].size} cells)`)
      } else {
        placeEnemyShips()
        setGamePhase("battle")
        setMessage("Your turn! Fire at the enemy board")
      }
    }
  }

  const placeEnemyShips = () => {
    let newBoard = JSON.parse(JSON.stringify(enemyBoard))

    SHIPS.forEach((ship) => {
      let placed = false
      while (!placed) {
        const horizontal = Math.random() > 0.5
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)

        if (canPlaceShip(newBoard, row, col, ship.size, horizontal)) {
          newBoard = placeShip(newBoard, row, col, ship.id, ship.size, horizontal)
          placed = true
        }
      }
    })

    setEnemyBoard(newBoard)
  }

  const handlePlayerShot = (row: number, col: number) => {
    if (gamePhase !== "battle" || !isPlayerTurn) return

    const cell = enemyBoard[row][col]
    if (cell.state === "miss" || cell.state === "hit" || cell.state === "sunk") return

    const newBoard = JSON.parse(JSON.stringify(enemyBoard))
    const newShips = [...enemyShips]

    if (cell.state === "ship") {
      newBoard[row][col].state = "hit"
      const ship = newShips.find((s) => s.id === cell.shipId)
      if (ship) {
        ship.hits++
        if (ship.hits === ship.size) {
          ship.sunk = true
          markShipAsSunk(newBoard, cell.shipId!)
          setMessage("Sunk!")

          if (newShips.every((s) => s.sunk)) {
            setEnemyBoard(newBoard)
            setEnemyShips(newShips)
            setWinner("player")
            setGamePhase("gameOver")
            setMessage("¡Ganaste! Hundiste todos los barcos enemigos")
            playSuccessSound()
            return
          }
        } else {
          setMessage("Hit!")
          playShootSound()
        }
      }
    } else {
      newBoard[row][col].state = "miss"
      setMessage("Miss...")
    }

    setEnemyBoard(newBoard)
    setEnemyShips(newShips)
    setIsPlayerTurn(false)
    setTimeout(() => {
      enemyTurn()
    }, 1000)
  }

  const markShipAsSunk = (board: Cell[][], shipId: number) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j].shipId === shipId) {
          board[i][j].state = "sunk"
          playSinkingSound()
        }
      }
    }
  }

  async function enemyTurn() {
    console.log("AI is thinking...");
    let row: number = 0, col: number = 0
    const sanitizedBoard = playerBoard.map(row =>
      row.map(cell => {
        // Oculta las casillas que contienen barcos no impactados marcándolas como "empty"
        if (cell.state === "ship") {
          return { state: "empty" as CellState }
        }
        // Mantén el resto de estados (incluyendo hits/sunk/miss). Opcionalmente puedes quitar shipId aquí si quieres más privacidad.
        return { state: cell.state, shipId: cell.shipId }
      }),
    )

    const prompt = `You are an agent playing Battleship as the enemy player.
  The player's board is a 10x10 grid where each cell can be "empty", "ship", "miss", "hit", or "sunk".
  Your goal is to choose the coordinates (row and column) where you should fire to maximize your chances of sinking the player's ships.
  Respond only with the coordinates in the format "row,column" with indices starting at 0 (for example, "3,5"), with no additional text.
  Current player board: ${JSON.stringify(sanitizedBoard)}
    `.trim();
    do {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (response.status === 429) {
        router.push('/service-unavailble')
        return
      }
      const data = await response.json();
      const text = typeof data.text === 'string' ? data.text.trim() : ''
      const parts = text.split(',')
      if (parts.length === 2) {
        const r = parseInt(parts[0], 10)
        const c = parseInt(parts[1], 10)
        if (
          Number.isFinite(r) &&
          Number.isFinite(c) &&
          r >= 0 && r < BOARD_SIZE &&
          c >= 0 && c < BOARD_SIZE
        ) {
          row = r
          col = c
        } else {
          row = Math.floor(Math.random() * BOARD_SIZE)
          col = Math.floor(Math.random() * BOARD_SIZE)
        }
      } else {
        row = Math.floor(Math.random() * BOARD_SIZE)
        col = Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (
      playerBoard[row][col].state === "miss" ||
      playerBoard[row][col].state === "hit" ||
      playerBoard[row][col].state === "sunk"
    )

    const newBoard = JSON.parse(JSON.stringify(playerBoard))
    const newShips = [...playerShips]
    const cell = playerBoard[row][col]

    if (cell.state === "ship") {
      newBoard[row][col].state = "hit"
      playShootSound()
      const ship = newShips.find((s) => s.id === cell.shipId)
      if (ship) {
        ship.hits++
        if (ship.hits === ship.size) {
          ship.sunk = true
          markShipAsSunk(newBoard, cell.shipId!)

          if (newShips.every((s) => s.sunk)) {
            markShipAsSunk(newBoard, cell.shipId!)
            setWinner("enemy")
            setGamePhase("gameOver")
            setMessage("You lost. The AI sank all your ships")
            setPlayerBoard(newBoard)
            setPlayerShips(newShips)
            playFailureSound()
            return
          }
        }
      }
    } else {
      newBoard[row][col].state = "miss"
    }

    setPlayerBoard(newBoard)
    setPlayerShips(newShips)
    setIsPlayerTurn(true)
    setMessage("Your turn! Fire at the enemy board")
  }

  const getCellDisplay = (cell: Cell, isEnemy: boolean): string => {
    if (isEnemy) {
      if (cell.state === "hit") return "💥"
      if (cell.state === "sunk") return "☠️"
      if (cell.state === "miss") return "💧"
      return ""
    } else {
      if (cell.state === "ship") return "🚢"
      if (cell.state === "hit") return "💥"
      if (cell.state === "sunk") return "☠️"
      if (cell.state === "miss") return "💧"
      return ""
    }
  }

  const getCellColor = (cell: Cell, isEnemy: boolean): string => {
    if (cell.state === "hit") return "bg-destructive"
    if (cell.state === "sunk") return "bg-destructive/80"
    if (cell.state === "miss") return "bg-muted"
    if (!isEnemy && cell.state === "ship") return "bg-primary"
    return "bg-card"
  }

  const renderBoard = (board: Cell[][], isEnemy: boolean) => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          <div className="w-6 sm:w-8" />
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <div
              key={i}
              className="w-8 h-6 sm:w-10 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            <div className="w-6 sm:w-8 h-8 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold">
              {letters[rowIndex]}
            </div>
            {row.map((cell, colIndex) => (
              <div key={colIndex} className="relative">
                <button
                  onClick={() => {
                    if (isEnemy && gamePhase === "battle") {
                      handlePlayerShot(rowIndex, colIndex)
                    } else if (!isEnemy && gamePhase === "placement") {
                      handlePlayerPlacement(rowIndex, colIndex)
                    }
                  }}
                  disabled={
                    (isEnemy &&
                      (gamePhase !== "battle" ||
                        !isPlayerTurn ||
                        cell.state === "miss" ||
                        cell.state === "hit" ||
                        cell.state === "sunk")) ||
                    (!isEnemy && gamePhase !== "placement")
                  }
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10
                    border-2 border-black
                    ${getCellColor(cell, isEnemy)}
                    text-lg sm:text-xl
                    transition-all duration-150
                    hover:scale-105 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    hover:bg-secondary
                    hover:cursor-pointer
                    active:scale-95
                    active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                  `}
                >
                  {getCellDisplay(cell, isEnemy)}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-fit md:w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-primary border-b-2 border-black">
          <CardTitle className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Battleship 🚢</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{message}</p>
            {gamePhase === "placement" && (
              <Button
                onClick={() => setIsHorizontal(!isHorizontal)}
              >
                Rotate: {isHorizontal ? "Horizontal ↔️" : "Vertical ↕️"}
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {gamePhase === "battle" && !isPlayerTurn && (
              <p className="mt-2 text-sm sm:text-base text-muted-foreground text-center animate-pulse">🤖 Thinking...</p>
            )}
            {gamePhase !== "placement" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-destructive">Enemy Board</h2>
                {renderBoard(enemyBoard, true)}
              </div>
            )}

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-primary">Your Board</h2>
              {renderBoard(playerBoard, false)}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-secondary border-t-2 border-black p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm sm:text-base font-bold">
            {gamePhase === "battle" && (
              <div className="flex gap-4">
                <span>Your ships: {playerShips.filter((s) => !s.sunk).length}/5</span>
                <span>Enemy ships: {enemyShips.filter((s) => !s.sunk).length}/5</span>
              </div>
            )}
          </div>
          <Button onClick={initializeGame}>
            New Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
