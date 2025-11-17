# PayPal Integration Setup

## Environment Variables

Add these to your `.env.local` file or Vercel environment variables:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=EKo__FuiGqPkwBAh8Py2STDecEBE5HlEnjYnOGNWKWPz0XRzis4yfQJTRhot35lO4tTwLfCzh9b4dXK1
PAYPAL_MODE=sandbox

# For frontend (will be exposed to client)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
```

## Testing in Sandbox

1. Use PayPal sandbox credentials for testing
2. Visit https://developer.paypal.com/dashboard/ to get your sandbox credentials
3. Use sandbox test accounts to make test payments

## Production Setup

1. Change `PAYPAL_MODE=production`
2. Replace credentials with live PayPal credentials
3. Ensure your PayPal business account is verified

## Features Implemented

- ✅ Create PayPal orders via API
- ✅ Capture payments after approval
- ✅ Store investment records in database
- ✅ Support for ZAR currency
- ✅ Payment method selection (Card/PayPal)
- ✅ Mobile-responsive PayPal buttons

## API Routes

- `/api/paypal/create-order` - Creates a PayPal order
- `/api/paypal/capture-order` - Captures payment and creates investment record
