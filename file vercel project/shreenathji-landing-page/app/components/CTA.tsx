import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Construction Supply Process?</h2>
        <p className="text-xl text-blue-100 mb-8">Join our growing community of construction professionals and experience hassle-free transactions.</p>
        <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg">
          Sign Up Today
        </Button>
      </div>
    </section>
  )
}

