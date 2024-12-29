import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-20 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Elevate Your Construction Game
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Shreenathji's all-in-one platform gives you everything you need to streamline your sand & grit supply chain. 
            No matter the scale of your project, our powerful platform can help grow your construction business.
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}

