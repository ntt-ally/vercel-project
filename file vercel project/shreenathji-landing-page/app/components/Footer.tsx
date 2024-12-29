import Link from 'next/link'
import { Package2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-20">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Package2 className="h-8 w-8" />
              <span className="text-xl font-bold">Shreenathji</span>
            </Link>
            <p className="text-white/70">
              Elevating construction supply management with innovative solutions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-white">Features</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Enterprise</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-white">About</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-white/70 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Support</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white">Documentation</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/70">
          <p>© {new Date().getFullYear()} Shreenathji. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

