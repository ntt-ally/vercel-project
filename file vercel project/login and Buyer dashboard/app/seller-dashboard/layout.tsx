'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, HelpCircle, LogOut, LayoutDashboard, Package, ShoppingCart, FileText, Users, Truck, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseEnter = () => {
      setIsHovered(true)
      clearTimeout(timeoutId)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      timeoutId = setTimeout(() => setIsCollapsed(true), 300)
    }

    const sidebarElement = document.getElementById('sidebar')
    sidebarElement?.addEventListener('mouseenter', handleMouseEnter)
    sidebarElement?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      sidebarElement?.removeEventListener('mouseenter', handleMouseEnter)
      sidebarElement?.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timeoutId)
    }
  }, [])

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
  }

  const handleLogout = () => {
    router.push('/')
  }

  const navItems = [
    { href: '/seller-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seller-dashboard/products', label: 'Products', icon: Package },
    { href: '/seller-dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/seller-dashboard/invoices', label: 'Invoices', icon: FileText },
    { href: '/seller-dashboard/drivers', label: 'Drivers', icon: Users },
    { href: '/seller-dashboard/vehicles', label: 'Vehicles', icon: Truck },
  ]

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 px-6">
        <div className="flex-1">
          <h1 className="font-semibold text-lg flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 mr-2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Sand & Grit
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              Menu <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => toggleTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <aside
          id="sidebar"
          className={cn(
            "border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-all duration-300",
            (isCollapsed && !isHovered) ? "w-[60px]" : "w-64",
            isCollapsed ? "hover:w-64" : ""
          )}
        >
          <nav className="flex flex-col gap-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  pathname === item.href 
                    ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100" 
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-all duration-300",
                  isCollapsed && !isHovered ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

