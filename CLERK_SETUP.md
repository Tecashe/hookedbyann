# Clerk Authentication Setup

## Getting Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in or create a new account
3. Create a new application
4. Navigate to **API Keys** section
5. Copy your **Publishable Key** and **Secret Key**

## Adding Keys to Your Project

In the v0 sidebar, go to **Vars** and add these environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key (starts with `pk_`)
- `CLERK_SECRET_KEY` - Your Clerk secret key (starts with `sk_`)

## Clerk Configuration

The application uses Clerk for:
- User authentication (sign up, sign in, sign out)
- User profile management
- Admin role verification for dashboard access

## Testing Without Clerk

If you want to test the site without Clerk configured:
1. The site will still load and display products
2. Cart functionality will work
3. Checkout will require authentication
4. Admin dashboard will be inaccessible

Once you add your Clerk keys, all features will be fully functional.
