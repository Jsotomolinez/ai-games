"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { playFailureSound, playSuccessSound } from "@/utils/audio"

const MAX_ATTEMPTS = 6

const HANGMAN_STAGES = [
  `
   ___
  |   |
  |   
  |   
  |   
  |___
  `,
  `
   ___
  |   |
  |   O
  |   
  |   
  |___
  `,
  `
   ___
  |   |
  |   O
  |   |
  |   
  |___
  `,
  `
   ___
  |   |
  |   O
  |  /|
  |   
  |___
  `,
  `
   ___
  |   |
  |   O
  |  /|\\
  |   
  |___
  `,
  `
   ___
  |   |
  |   O
  |  /|\\
  |  / 
  |___
  `,
  `
   ___
  |   |
  |   O
  |  /|\\
  |  / \\
  |___
  `,
]

export default function HangmanPage() {
  const router = useRouter()
  const [word, setWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    startNewGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (word && gameStatus === "playing") {
      const wordLetters = new Set(word.split(""))
      const guessedWordLetters = new Set([...guessedLetters].filter((letter) => wordLetters.has(letter)))

      if (guessedWordLetters.size === wordLetters.size) {
        setGameStatus("won")
        playSuccessSound()
      } else if (wrongAttempts >= MAX_ATTEMPTS) {
        setGameStatus("lost")
        playFailureSound()
      }
    }
  }, [guessedLetters, wrongAttempts, word, gameStatus])

  const startNewGame = async () => {
    console.log("AI is thinking...")
    const prompt = 'Give me a random English word in uppercase letters only between 5 and 10 characters, without any additional text.'
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (response.status === 429) {
      router.push('/service-unavailble');
      return;
    }
    const data = await response.json()
    const randomWord = data.text.trim().toUpperCase()


    setWord(randomWord)
    setGuessedLetters(new Set())
    setWrongAttempts(0)
    setGameStatus("playing")
    setInputValue("")
  }

  const handleGuess = (letter: string) => {
    const upperLetter = letter.toUpperCase()

    if (guessedLetters.has(upperLetter) || gameStatus !== "playing") {
      return
    }

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(upperLetter)
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(upperLetter)) {
      setWrongAttempts(wrongAttempts + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 1 && /^[A-Z]*$/.test(value)) {
      setInputValue(value)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      handleGuess(inputValue)
      setInputValue("")
    }
  }

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ")

  const sortedGuessedLetters = Array.from(guessedLetters).sort()

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="border-b-2 border-black bg-cyan-400">
          <CardTitle className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Hangman</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className=" p-6 space-y-6">
          {/* Hangman Drawing */}
          <div className="flex justify-center">
            <pre className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-black leading-tight">
              {HANGMAN_STAGES[wrongAttempts]}
            </pre>
          </div>

          {/* Word Display */}
          <div className="text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-black font-mono">
              {displayWord}
            </p>
          </div>

          {/* Attempts Counter */}
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-black">
              Attempts remaining: <span className="text-red-600">{MAX_ATTEMPTS - wrongAttempts}</span>
            </p>
          </div>

          {/* Input Field */}
          {gameStatus === "playing" && (
            <div className="flex flex-col items-center gap-3">
              <label htmlFor="letter-input" className="text-lg sm:text-xl font-bold text-black">
                Type a letter:
              </label>
              <input
                id="letter-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                maxLength={1}
                className="w-20 h-20 text-center text-4xl font-bold uppercase border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                autoFocus
              />
              <p className="text-sm text-muted-foreground">Press Enter to submit</p>
            </div>
          )}

          {/* Guessed Letters */}
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-black mb-2">Guessed Letters:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sortedGuessedLetters.length > 0 ? (
                sortedGuessedLetters.map((letter) => (
                  <span
                    key={letter}
                    className={`px-3 py-1 border-2 border-black font-bold text-lg ${
                      word.includes(letter) ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {letter}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">None yet</span>
              )}
            </div>
          </div>

          {/* Game Status */}
          {gameStatus !== "playing" && (
            <div className="text-center space-y-2">
              <p
                className={`text-2xl sm:text-3xl font-bold ${gameStatus === "won" ? "text-green-600" : "text-red-600"}`}
              >
                {gameStatus === "won" ? "You Won!" : "Game Over!"}
              </p>
              {gameStatus === "lost" && <p className="text-lg sm:text-xl font-bold text-black">The word was: {word}</p>}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t-2 border-black bg-secondary p-6 justify-center">
          <Button onClick={startNewGame}>
            New Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
