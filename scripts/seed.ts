import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

async function seed() {
  console.log("[v0] Starting database seed...")

  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        "clerkId" TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        image TEXT,
        role TEXT DEFAULT 'customer',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "Product" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INT NOT NULL,
        category TEXT NOT NULL,
        colors TEXT[] DEFAULT ARRAY[]::TEXT[],
        sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
        images TEXT[] DEFAULT ARRAY[]::TEXT[],
        gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
        stock INT DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "Cart" (
        id TEXT PRIMARY KEY,
        "userId" TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "CartItem" (
        id TEXT PRIMARY KEY,
        "cartId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        quantity INT DEFAULT 1,
        color TEXT,
        size TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("cartId") REFERENCES "Cart"(id) ON DELETE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"(id),
        UNIQUE("cartId", "productId", color, size)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "totalPrice" INT NOT NULL,
        status TEXT DEFAULT 'pending',
        "shippingAddress" TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        "stripeSessionId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        quantity INT NOT NULL,
        price INT NOT NULL,
        color TEXT,
        size TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"(id)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "Review" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE,
        UNIQUE("userId", "productId")
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS "WishlistItem" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
        UNIQUE("userId", "productId")
      );
    `

    console.log("[v0] Tables created successfully")

    // Seed products
    const products = [
      {
        id: "cozy-cardigan-cream",
        name: "Cozy Oversized Cardigan",
        description:
          "A luxuriously soft oversized cardigan perfect for layering. Hand-crocheted with premium yarn for maximum comfort and durability. Features a relaxed fit and beautiful stitch detail.",
        price: 8999,
        category: "cardigans",
        colors: ["Cream", "Sage Green", "Dusty Rose", "Charcoal"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: ["/cream-oversized-crochet-cardigan.jpg", "/cream-cardigan-detail-shot.jpg"],
        gallery: ["/cardigan-flat-lay.jpg", "/cardigan-texture-close-up.jpg", "/cardigan-worn-styling.jpg"],
        stock: 25,
        featured: true,
      },
      {
        id: "summer-crop-top",
        name: "Summer Crop Top",
        description:
          "Lightweight and breathable crop top perfect for summer. Features an intricate stitch pattern that catches the light beautifully. Pairs perfectly with high-waisted bottoms.",
        price: 4999,
        category: "tops",
        colors: ["White", "Blush", "Lavender", "Mint"],
        sizes: ["XS", "S", "M", "L", "XL"],
        images: ["/white-crochet-crop-top.jpg", "/crop-top-detail.jpg"],
        gallery: ["/crop-top-flat-lay.jpg", "/crop-top-texture.jpg"],
        stock: 30,
        featured: true,
      },
      {
        id: "beach-cover-up",
        name: "Beach Cover-Up Dress",
        description:
          "Elegant beach cover-up with flowing silhouette. Perfect for beach days or casual summer outings. Made with breathable yarn for comfort in warm weather.",
        price: 6999,
        category: "dresses",
        colors: ["Natural", "Coral", "Ocean Blue", "Sunset Orange"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: ["/crochet-beach-cover-up-dress.jpg", "/beach-dress-detail.jpg"],
        gallery: ["/beach-dress-flat-lay.jpg", "/beach-dress-texture.jpg"],
        stock: 20,
        featured: true,
      },
      {
        id: "chunky-sweater",
        name: "Chunky Knit Sweater",
        description:
          "Cozy chunky knit sweater with a modern design. Perfect for fall and winter. Features a comfortable fit and beautiful texture.",
        price: 7999,
        category: "tops",
        colors: ["Oatmeal", "Burgundy", "Forest Green", "Navy"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        images: ["/chunky-sweater.jpg"],
        gallery: [],
        stock: 15,
        featured: false,
      },
      {
        id: "boho-shawl",
        name: "Boho Crochet Shawl",
        description:
          "Beautiful boho-inspired crochet shawl. Perfect for layering or as a statement piece. Lightweight and versatile.",
        price: 5999,
        category: "accessories",
        colors: ["Cream", "Terracotta", "Sage", "Charcoal"],
        sizes: ["One Size"],
        images: ["/boho-shawl.jpg"],
        gallery: [],
        stock: 18,
        featured: false,
      },
    ]

    for (const product of products) {
      await sql`
        INSERT INTO "Product" (id, name, description, price, category, colors, sizes, images, gallery, stock, featured)
        VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, ${product.category}, 
                ${JSON.stringify(product.colors)}, ${JSON.stringify(product.sizes)}, 
                ${JSON.stringify(product.images)}, ${JSON.stringify(product.gallery)}, ${product.stock}, ${product.featured})
        ON CONFLICT (id) DO NOTHING;
      `
    }

    console.log("[v0] Products seeded successfully")
    console.log("[v0] Database seed completed!")
  } catch (error) {
    console.error("[v0] Seed error:", error)
    throw error
  }
}

seed()
