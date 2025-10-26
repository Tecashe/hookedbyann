# HookedByAnn - Complete Setup Guide

## Overview
HookedByAnn is a fully-featured e-commerce platform for handmade crochet clothing with admin dashboard, customer accounts, and advanced features.

## Prerequisites
- Clerk account (for authentication)
- Neon database (PostgreSQL)
- Stripe account (for payments)
- Node.js 18+

## Step 1: Environment Variables Setup

Add these to your Vercel project's environment variables:

### Clerk Authentication
\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
\`\`\`

### Database
\`\`\`
NEON_NEON_DATABASE_URL=your_neon_connection_string
\`\`\`

### Stripe Payments
\`\`\`
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
\`\`\`

## Step 2: Database Setup

1. Run Prisma migrations:
\`\`\`bash
npx prisma db push
\`\`\`

2. Seed initial data (optional):
\`\`\`bash
npx prisma db seed
\`\`\`

## Step 3: Admin Setup

1. Create your first admin account:
   - Sign up at `/` with your email
   - Go to Neon dashboard and manually update your user role to "admin"
   - SQL: `UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com'`

2. Access admin dashboard at `/dashboard`

## Step 4: Add Your Products

1. Go to `/dashboard/products`
2. Click "Add Product"
3. Fill in:
   - Product name
   - Description
   - Price (in dollars)
   - Category
   - Colors (comma-separated)
   - Sizes (comma-separated)
   - Upload images
   - Set stock level
4. Click "Create Product"

## Features Overview

### Customer Features
- Browse products with advanced search and filtering
- Add items to cart and wishlist
- Leave product reviews and ratings
- Checkout with Stripe
- Track orders in real-time
- View order history
- Manage profile and preferences

### Admin Features
- **Dashboard**: Overview of sales, revenue, and metrics
- **Products**: Add, edit, delete products with images
- **Orders**: View and manage customer orders
- **Inventory**: Track stock levels with low-stock alerts
- **Analytics**: Sales trends, top products, customer insights
- **Coupons**: Create and manage discount codes

### Business Features
- Product reviews and ratings system
- Wishlist functionality
- Advanced search with filters (price, color, size, category)
- Discount codes and coupons
- Inventory management with alerts
- Order tracking and status updates
- Customer account dashboard
- Virtual try-on feature

## Admin Login & Access

**Admin Dashboard URL**: `/dashboard`

**Admin Features Available**:
- `/dashboard` - Overview and metrics
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/inventory` - Stock tracking
- `/dashboard/analytics` - Sales analytics
- `/dashboard/coupons` - Discount codes

## Customer Features

**Customer Account URL**: `/account`

**Customer Features Available**:
- `/account` - Dashboard with order summary
- `/account/orders` - Order history
- `/account/profile` - Profile information
- `/wishlist` - Saved items
- `/products` - Browse with filters
- `/cart` - Shopping cart
- `/checkout` - Secure checkout

## Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Troubleshooting

### Clerk Not Configured
- Ensure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Restart the development server

### Database Connection Issues
- Verify `NEON_DATABASE_URL` is correct
- Check Neon dashboard for connection status
- Run `npx prisma db push` to sync schema

### Stripe Errors
- Verify Stripe keys are correct
- Check Stripe dashboard for API key status
- Ensure webhook is configured (if using webhooks)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Clerk, Neon, and Stripe documentation
3. Check application logs in Vercel dashboard
