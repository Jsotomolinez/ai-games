import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-primary shadow-lg mb-5 p-1">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <Link href="/">
          <h1>humano vs IA 🤖</h1>
        </Link>
      </div>
    </header>
  );
} 