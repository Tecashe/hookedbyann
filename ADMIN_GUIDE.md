# HookedByAnn - Admin Guide

## Admin Login & Access

### Where to Login
- **Admin Dashboard**: `https://yourdomain.com/dashboard`
- **Sign In**: Use the sign-in button in the header or go to `/` and click "Sign In"

### Admin Requirements
- Must have an account with admin role
- Admin role is set in the database

### Setting Up Your Admin Account

1. **Create Account**:
   - Go to your site homepage
   - Click "Sign Up"
   - Enter your email and password
   - Verify your email

2. **Grant Admin Role**:
   - Go to Neon dashboard
   - Open your database
   - Run this SQL query:
   \`\`\`sql
   UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
   \`\`\`

3. **Access Dashboard**:
   - Sign in with your account
   - Go to `/dashboard`
   - You should see the admin dashboard

## Admin Dashboard Overview

### Main Dashboard (`/dashboard`)
Shows key business metrics:
- **Total Revenue**: All-time revenue from orders
- **Total Orders**: Number of orders received
- **Total Customers**: Number of registered customers
- **Average Order Value**: Average amount per order
- **Recent Orders**: Latest orders with status

### Quick Navigation
- **Products**: Manage your product catalog
- **Orders**: View and manage customer orders
- **Inventory**: Track stock levels
- **Analytics**: View sales data and trends
- **Coupons**: Create discount codes

## Managing Products

### Add a New Product

1. Go to `/dashboard/products`
2. Click "Add Product" button
3. Fill in product details:

**Basic Information**
- **Product Name**: What customers see (e.g., "Oversized Cream Cardigan")
- **Description**: Detailed description of the product
- **Category**: Type of item (e.g., "Cardigans", "Sweaters", "Hats")
- **Price**: In USD (e.g., 45.99)

**Variants**
- **Colors**: Available colors (comma-separated)
  - Example: `Cream, Beige, Brown, Black`
- **Sizes**: Available sizes (comma-separated)
  - Example: `XS, S, M, L, XL, XXL`

**Images**
- **Product Images**: Upload multiple photos
  - First image is the main product image
  - Additional images appear in gallery
  - Recommended: 5-10 high-quality images

**Inventory**
- **Stock Level**: Number of units available
- **Featured**: Check to display on homepage

4. Click "Create Product"

### Edit a Product

1. Go to `/dashboard/products`
2. Find the product in the list
3. Click "Edit" button
4. Update any information
5. Click "Save Changes"

### Delete a Product

1. Go to `/dashboard/products`
2. Find the product in the list
3. Click "Delete" button
4. Confirm deletion

## Managing Orders

### View Orders

1. Go to `/dashboard/orders`
2. See all customer orders in a table
3. Click on an order to view details

### Order Details Include
- Order ID and date
- Customer name and email
- Items ordered (product, quantity, color, size)
- Order total
- Shipping address
- Current status

### Update Order Status

1. Go to `/dashboard/orders`
2. Click on an order
3. Click "Update Status" button
4. Select new status:
   - **Pending**: Initial status when order is placed
   - **Processing**: Order is being prepared
   - **Shipped**: Order has been sent
   - **Delivered**: Order received by customer
5. Click "Update"

**Note**: Customer receives email notification when status changes

## Inventory Management

### View Inventory

1. Go to `/dashboard/inventory`
2. See all products with stock levels
3. Status indicators:
   - **Green (In Stock)**: 5+ units available
   - **Yellow (Low Stock)**: Less than 5 units
   - **Red (Out of Stock)**: 0 units

### Update Stock

1. Go to `/dashboard/inventory`
2. Find the product
3. Click "Edit" to go to product page
4. Update stock level
5. Save changes

### Low Stock Alerts

- Yellow alert appears when product has less than 5 units
- Red alert appears when product is out of stock
- Consider restocking when you see these alerts

## Analytics & Reports

### View Analytics

1. Go to `/dashboard/analytics`
2. See key metrics:
   - Total revenue
   - Total orders
   - Total customers
   - Average order value

### Charts & Data

**Revenue Trend**
- Shows monthly revenue over time
- Helps identify seasonal trends
- Plan inventory based on trends

**Order Status Distribution**
- Pie chart showing order statuses
- Helps track fulfillment progress

**Top Products**
- Shows best-selling products
- Displays units sold and revenue
- Use to identify popular items

## Discount Codes & Coupons

### Create a Coupon

1. Go to `/dashboard/coupons`
2. Click "Create Coupon"
3. Fill in details:

**Coupon Code**
- Unique code customers enter at checkout
- Example: `SUMMER20`, `WELCOME10`
- Case-insensitive

**Discount Type**
- **Percentage**: Discount as % (e.g., 20% off)
- **Fixed Amount**: Discount in $ (e.g., $10 off)

**Discount Amount**
- For percentage: 0-100
- For fixed: amount in dollars

**Usage Limits**
- **Max Uses**: Leave empty for unlimited
- Example: 100 uses per coupon

**Restrictions**
- **Minimum Order Amount**: Minimum purchase required
- Example: $50 minimum to use coupon

**Expiration**
- Set when coupon expires
- Leave empty for no expiration

4. Click "Create Coupon"

### Manage Coupons

1. Go to `/dashboard/coupons`
2. See all active coupons
3. View usage statistics
4. Edit or delete coupons

### Coupon Examples

**Example 1: Welcome Discount**
- Code: `WELCOME10`
- Type: Percentage
- Discount: 10%
- Max Uses: 100
- Min Amount: $0
- Expires: Never

**Example 2: Summer Sale**
- Code: `SUMMER20`
- Type: Percentage
- Discount: 20%
- Max Uses: Unlimited
- Min Amount: $50
- Expires: August 31, 2024

**Example 3: Free Shipping**
- Code: `FREESHIP`
- Type: Fixed
- Discount: $5
- Max Uses: 500
- Min Amount: $30
- Expires: Never

## Best Practices

### Product Management
- Use high-quality product images
- Write detailed descriptions
- Keep colors and sizes accurate
- Update stock regularly
- Mark popular items as featured

### Order Management
- Update order status promptly
- Respond to customer inquiries quickly
- Keep shipping information accurate
- Monitor for issues or complaints

### Inventory
- Check inventory weekly
- Restock low-stock items
- Remove out-of-stock items from featured
- Plan for seasonal demand

### Promotions
- Create seasonal coupons
- Offer welcome discounts
- Run limited-time promotions
- Track coupon effectiveness

### Analytics
- Review sales trends monthly
- Identify top-performing products
- Plan inventory based on trends
- Adjust pricing if needed

## Troubleshooting

### Can't Access Dashboard
- Verify you're logged in
- Check that your account has admin role
- Try logging out and back in

### Product Not Showing
- Verify product is active
- Check that images uploaded successfully
- Ensure stock level is greater than 0

### Order Status Won't Update
- Refresh the page
- Try again
- Check for error messages

### Coupon Not Working
- Verify coupon code is correct
- Check expiration date
- Verify minimum order amount is met
- Check usage limit hasn't been reached

## Support

For technical issues:
1. Check this guide
2. Review error messages
3. Check Vercel logs
4. Contact support

---

**Admin Dashboard**: `/dashboard`
**Products**: `/dashboard/products`
**Orders**: `/dashboard/orders`
**Inventory**: `/dashboard/inventory`
**Analytics**: `/dashboard/analytics`
**Coupons**: `/dashboard/coupons`
