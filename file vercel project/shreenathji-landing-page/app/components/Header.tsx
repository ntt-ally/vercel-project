import Link from 'next/link'
import { Package2 } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Package2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Shreenathji</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="#" className="text-gray-600 hover:text-blue-600">About</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-blue-600">Services</Link></li>
            <li><Link href="#" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

