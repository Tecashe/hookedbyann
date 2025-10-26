"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { useUser } from "@clerk/nextjs"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const { isSignedIn } = useUser() || { isSignedIn: false }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const clerkConfigured = !!useUser

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-full bg-primary" />
            HookedByAnn
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu - Only show if Clerk is configured */}
            {clerkConfigured && (
              <>
                {isSignedIn ? (
                  <Button variant="outline" size="sm" className="bg-transparent">
                    User Menu
                  </Button>
                ) : (
                  <div className="hidden sm:flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Sign In
                    </Button>
                    <Button size="sm">Sign Up</Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t py-4 space-y-3">
            <Link href="/products" className="block text-sm font-medium hover:text-primary">
              Shop
            </Link>
            <Link href="/#about" className="block text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/#testimonials" className="block text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
            <Link href="/#contact" className="block text-sm font-medium hover:text-primary">
              Contact
            </Link>
            {clerkConfigured && !isSignedIn && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Sign In
                </Button>
                <Button size="sm" className="flex-1">
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
