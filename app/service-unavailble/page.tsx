import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ServiceUnavailable() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-[#FF6B6B] border-b-2 border-black">
          <CardTitle className="text-center py-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">429</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className="bg-[#FFF4E6] p-8 sm:p-10 md:p-12">
          <div className="text-center space-y-6">
            <div className="text-6xl sm:text-7xl md:text-8xl">⏳</div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Service Unavailable</h2>

            <p className="text-base sm:text-lg md:text-xl text-black/80 max-w-md mx-auto leading-relaxed">
              We have reached the limit of requests for today. Please come back tomorrow to continue playing.
            </p>

            <div className="pt-4">
              <p className="text-sm sm:text-base md:text-lg text-black/60">
                The service will be available again in 24 hours
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-[#FFF4E6] border-t-2 border-black p-6 justify-center">
          <Link href="/">
            <Button className="bg-[#4ECDC4] hover:bg-[#45b8b0] text-black font-bold text-base sm:text-lg px-8 py-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150">
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
