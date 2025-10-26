import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PRODUCTS } from "@/lib/products"
import { ArrowRight, Star, Truck, RotateCcw, Award } from "lucide-react"

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">Handmade Crochet Clothing</h1>
              <p className="mt-6 text-xl text-muted-foreground">
                Discover beautifully crafted crochet pieces made with premium yarn and attention to detail. Each item is
                unique and made with love by Ann.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent">
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src="/cream-oversized-crochet-cardigan.jpg"
                alt="Featured crochet cardigan"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6 text-center">
              <Truck className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 font-semibold text-lg">Free Shipping</h3>
              <p className="mt-2 text-sm text-muted-foreground">On all orders over $50. Fast and reliable delivery.</p>
            </Card>
            <Card className="p-6 text-center">
              <RotateCcw className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 font-semibold text-lg">Easy Returns</h3>
              <p className="mt-2 text-sm text-muted-foreground">30-day return policy. No questions asked.</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 font-semibold text-lg">Quality Guaranteed</h3>
              <p className="mt-2 text-sm text-muted-foreground">Premium yarn and expert craftsmanship.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Featured Collection</h2>
            <p className="mt-4 text-lg text-muted-foreground">Explore our most popular handmade crochet pieces</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <p className="mt-2 text-lg font-bold">${(product.priceInCents / 100).toFixed(2)}</p>
                    <Button className="mt-4 w-full bg-transparent" variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image src="/cardigan-worn-styling.jpg" alt="Ann at work" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-bold">About HookedByAnn</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Hi, I'm Ann! Every piece in my collection is handmade with love and attention to detail. I use only
                premium quality yarn and traditional crochet techniques to create clothing that's not just beautiful,
                but also durable and comfortable.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                My mission is to bring the art of crochet to everyone, creating unique, wearable pieces that celebrate
                craftsmanship and individuality. Each item is made to order, ensuring you get something truly special.
              </p>
              <Button asChild className="mt-8">
                <Link href="/products">Shop My Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">What Customers Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of happy customers who love HookedByAnn pieces
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Sarah M.",
                text: "The quality is incredible! The cardigan fits perfectly and the craftsmanship is amazing. I've received so many compliments!",
                rating: 5,
              },
              {
                name: "Emma L.",
                text: "I tried the virtual try-on feature and it was so helpful! I knew exactly how the dress would look on me before ordering.",
                rating: 5,
              },
              {
                name: "Jessica R.",
                text: "Customer service was fantastic and the shipping was fast. The crochet top is exactly what I was looking for!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <p className="mt-4 font-semibold">{testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold">Ready to Find Your Perfect Piece?</h2>
          <p className="mt-6 text-lg opacity-90">
            Browse my collection and discover handmade crochet clothing that's uniquely yours.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
