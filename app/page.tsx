import { GameCard } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      <GameCard name="Tic Tac Toe" img="/assets/tic_tac_toe.png" url="/tic-tac-toe" />
      <GameCard name="Battleship" img="/assets/battleship.png" url="/battleship" />
      <GameCard name="Hang man" img="/assets/hang_man.png" url="/hang-man" />
    </div>
  )
}
