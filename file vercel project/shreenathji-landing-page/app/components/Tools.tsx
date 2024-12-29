import { Button } from '@/components/ui/button'

export default function Tools() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Powerful Tools for Sellers</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take control of your business with robust tools designed specifically for construction material suppliers. 
              Manage orders, track vehicles, and adjust pricing with unparalleled ease.
            </p>
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              Learn More
            </Button>
          </div>
          <div className="relative aspect-video">
            <div 
              className="w-full h-full rounded-lg"
              style={{
                backgroundImage: "url('/placeholder.svg?height=720&width=1280')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

