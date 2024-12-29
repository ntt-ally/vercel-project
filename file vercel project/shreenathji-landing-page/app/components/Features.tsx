import { ShoppingCart, TrendingUp, Truck } from 'lucide-react'

const features = [
  {
    icon: <ShoppingCart className="h-12 w-12" />,
    title: 'Easy Purchasing',
    description: 'Buy various types of sand and grit in your preferred size and quantity with just a click.'
  },
  {
    icon: <TrendingUp className="h-12 w-12" />,
    title: 'Real-time Management',
    description: 'Track inventory, manage orders, and adjust pricing in real-time with our powerful tools.'
  },
  {
    icon: <Truck className="h-12 w-12" />,
    title: 'Efficient Logistics',
    description: 'Streamline your delivery process with integrated vehicle tracking and management.'
  }
]

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

