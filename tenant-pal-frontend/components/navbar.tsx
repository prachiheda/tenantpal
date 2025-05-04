"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-emerald-500 p-1">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">TenantPal</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="block md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Testimonials
          </Link>
          <Button variant="outline" className="ml-2">
            Sign In
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline">Sign In</Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
