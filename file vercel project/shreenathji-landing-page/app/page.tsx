import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Tools from './components/Tools'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Tools />
      </main>
      <Footer />
    </div>
  )
}

