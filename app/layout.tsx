import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HookedByAnn - Handmade Crochet Clothing",
  description:
    "Discover beautifully crafted crochet pieces made with premium yarn and attention to detail. Each item is unique and made with love.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const layoutContent = (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )

  if (clerkPublishableKey) {
    return <ClerkProvider publishableKey={clerkPublishableKey}>{layoutContent}</ClerkProvider>
  }

  return layoutContent
}
