import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full bg-primary shadow-lg">
      <div className="mx-auto flex h-16 sm:h-20 items-center justify-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Human vs IA 🤖</h1>
        </Link>
      </div>
    </header>
  )
}
