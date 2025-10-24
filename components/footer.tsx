import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-primary border-t border-border mt-auto shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href="https://jsotomolinez.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold hover:opacity-80 transition-opacity text-center"
          >
            Built by: JSotoMolinez
          </Link>
          <p className="text-sm sm:text-base text-center">
            Using Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
