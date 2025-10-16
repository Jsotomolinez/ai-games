// import Image from "next/image";

import { GameCard } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <GameCard
        name="Game 1"
        img="/assets/tic_tac_toe.png"
        url="/tic-tac-toe"
      />
      
    </>
    );
}
