import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">English Output Practice</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Improve your English speaking and writing skills with our adaptive practice sessions.
      </p>
      <Link href="/settings">
        <Button size="lg">
          Start Practice
        </Button>
      </Link>
    </div>
  )
}
