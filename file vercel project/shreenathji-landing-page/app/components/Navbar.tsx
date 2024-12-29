'use client'

import { useState } from 'react'
import { Package2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Package2 className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Shreenathji</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-sm text-white/90 hover:text-white">
              Products
            </Link>
            <Link href="#" className="text-sm text-white/90 hover:text-white">
              Services
            </Link>
            <Link href="#" className="text-sm text-white/90 hover:text-white">
              About
            </Link>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              Log In
            </Button>
            <Button className="bg-white text-black hover:bg-white/90">Get Started</Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <Link href="#" className="block text-white/90 hover:text-white">
                Products
              </Link>
              <Link href="#" className="block text-white/90 hover:text-white">
                Services
              </Link>
              <Link href="#" className="block text-white/90 hover:text-white">
                About
              </Link>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <Button variant="outline" className="w-full text-white border-white hover:bg-white hover:text-black">
                  Log In
                </Button>
                <Button className="w-full bg-white text-black hover:bg-white/90">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

