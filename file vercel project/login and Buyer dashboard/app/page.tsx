import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-yellow-300 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Sand & Grit Seller Portal</h1>
      <p className="text-xl mb-8">Manage your sand and grit products with ease</p>
      <Button asChild>
        <Link href="/login">Get Started</Link>
      </Button>
    </div>
  )
}

