import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="bg-primary border-b-2 border-black">
          <CardTitle className="text-center py-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-destructive-foreground">404</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-secondary p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-foreground">Page not found</h2>
          <p className="text-base sm:text-lg text-foreground">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary hover:text-accent-foreground font-bold text-lg sm:text-xl px-8 py-4 border-4 border-black transition-colors duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Go to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
