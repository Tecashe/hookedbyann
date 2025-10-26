# HookedByAnn - Complete Features Guide

## Customer Features

### 1. Product Browsing & Search
- **Location**: `/products`
- **Features**:
  - Search by product name
  - Filter by category, color, size, price range
  - Sort by newest, price (low-high, high-low), popularity
  - View product details with full gallery
  - See product reviews and ratings

### 2. Shopping Cart
- **Location**: `/cart`
- **Features**:
  - Add items with color and size selection
  - Update quantities
  - Remove items
  - View cart total
  - Apply discount codes
  - Proceed to checkout

### 3. Checkout & Payments
- **Location**: `/checkout`
- **Features**:
  - Secure Stripe payment processing
  - Enter shipping address
  - Apply coupon codes for discounts
  - Order confirmation
  - Email receipt

### 4. Product Reviews
- **Location**: Product detail page
- **Features**:
  - Leave 1-5 star ratings
  - Write detailed reviews
  - View average rating and breakdown
  - See other customer reviews
  - Update your own review

### 5. Wishlist
- **Location**: `/wishlist`
- **Features**:
  - Save favorite items
  - View all wishlist items
  - Quick add to cart from wishlist
  - Remove items from wishlist
  - Share wishlist (future feature)

### 6. Virtual Try-On
- **Location**: Product detail page → "Try On" button
- **Features**:
  - Upload your photo
  - See product overlaid on your image
  - Adjust product size and position
  - Preview different colors
  - Download try-on photo

### 7. Customer Account
- **Location**: `/account`
- **Features**:
  - View account dashboard
  - See order summary and stats
  - Track pending orders
  - View total spent
  - Quick access to wishlist

### 8. Order History
- **Location**: `/account/orders`
- **Features**:
  - View all past orders
  - See order details and items
  - Track order status (pending → processing → shipped → delivered)
  - View order total and date
  - Click for detailed order information

### 9. Profile Management
- **Location**: `/account/profile`
- **Features**:
  - View profile information
  - See member since date
  - Access Clerk settings for updates
  - View account type

## Admin Features

### 1. Dashboard Overview
- **Location**: `/dashboard`
- **Displays**:
  - Total revenue
  - Total orders
  - Total customers
  - Average order value
  - Recent orders
  - Quick action buttons

### 2. Product Management
- **Location**: `/dashboard/products`
- **Features**:
  - View all products in table format
  - Add new products
  - Edit existing products
  - Delete products
  - Upload multiple images
  - Set colors and sizes
  - Manage stock levels
  - Mark as featured

### 3. Order Management
- **Location**: `/dashboard/orders`
- **Features**:
  - View all customer orders
  - See order details and items
  - Update order status
  - View customer information
  - Track order timeline
  - Filter by status

### 4. Inventory Management
- **Location**: `/dashboard/inventory`
- **Features**:
  - View all products with stock levels
  - See inventory status (in-stock, low-stock, out-of-stock)
  - Get low-stock alerts
  - Quick edit links to products
  - Stock statistics

### 5. Analytics Dashboard
- **Location**: `/dashboard/analytics`
- **Displays**:
  - Total revenue (all-time)
  - Total orders count
  - Total customers count
  - Average order value
  - Revenue trend chart (monthly)
  - Order status distribution pie chart
  - Top 5 products by revenue
  - Sales breakdown

### 6. Discount Codes & Coupons
- **Location**: `/dashboard/coupons`
- **Features**:
  - Create new discount codes
  - Set percentage or fixed amount discounts
  - Set usage limits
  - Set minimum order amounts
  - Set expiration dates
  - View coupon usage statistics
  - Edit existing coupons
  - Delete coupons
  - Activate/deactivate coupons

## How to Use Key Features

### Creating a Product

1. Go to `/dashboard/products`
2. Click "Add Product"
3. Fill in:
   - **Name**: Product title (e.g., "Oversized Cream Cardigan")
   - **Description**: Detailed product description
   - **Price**: In dollars (e.g., 45.99)
   - **Category**: Type of item (e.g., "Cardigans", "Sweaters")
   - **Colors**: Comma-separated (e.g., "Cream, Beige, Brown")
   - **Sizes**: Comma-separated (e.g., "XS, S, M, L, XL")
   - **Images**: Upload multiple product photos
   - **Stock**: Number of units available
   - **Featured**: Check to show on homepage
4. Click "Create Product"

### Creating a Discount Code

1. Go to `/dashboard/coupons`
2. Click "Create Coupon"
3. Fill in:
   - **Code**: Unique code (e.g., "SUMMER20")
   - **Type**: Percentage or fixed amount
   - **Discount**: Amount or percentage
   - **Max Uses**: Leave empty for unlimited
   - **Min Amount**: Minimum order to use coupon
   - **Expiration**: When coupon expires
4. Click "Create Coupon"

### Managing Orders

1. Go to `/dashboard/orders`
2. Click on an order to view details
3. Update status:
   - Pending → Processing
   - Processing → Shipped
   - Shipped → Delivered
4. View customer information and items

### Viewing Analytics

1. Go to `/dashboard/analytics`
2. See key metrics at the top
3. View revenue trend over time
4. See order status distribution
5. Check top-performing products

## Coupon System

### How Customers Use Coupons
1. Add items to cart
2. Go to checkout
3. Enter coupon code
4. Discount applies automatically
5. Complete purchase

### Coupon Types
- **Percentage**: Discount as percentage (e.g., 20% off)
- **Fixed Amount**: Discount as dollar amount (e.g., $10 off)

### Coupon Restrictions
- Minimum order amount
- Usage limits (per coupon)
- Expiration dates
- Active/inactive status

## Inventory Alerts

- **In Stock**: 5+ units available
- **Low Stock**: Less than 5 units (yellow alert)
- **Out of Stock**: 0 units (red alert)

Admin receives alerts on inventory page for low-stock items.

## Order Status Flow

1. **Pending**: Order received, awaiting processing
2. **Processing**: Order being prepared for shipment
3. **Shipped**: Order sent to customer
4. **Delivered**: Order received by customer
5. **Cancelled**: Order cancelled (if applicable)

## Review System

- **Rating**: 1-5 stars
- **Comment**: Detailed review text
- **Verification**: Only customers who purchased can review
- **One Review Per Product**: Each customer can only review a product once
- **Moderation**: Admin can moderate reviews (future feature)

## Wishlist Features

- Save items for later
- View all saved items
- Quick add to cart
- Remove items
- Persistent across sessions
- Requires login

## Virtual Try-On

- Upload your photo
- See product on your image
- Adjust size and position with sliders
- Preview different colors
- Download result to share
- No account required

---

For more information or support, please contact support@hookedbyann.com
