# Vercel Environment Variables Setup

Please add these environment variables to your Vercel project:

## PayPal Configuration

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following:

### Production & Preview & Development:

```
PAYPAL_CLIENT_ID=<your-paypal-sandbox-client-id>
```

```
PAYPAL_CLIENT_SECRET=EKo__FuiGqPkwBAh8Py2STDecEBE5HlEnjYnOGNWKWPz0XRzis4yfQJTRhot35lO4tTwLfCzh9b4dXK1
```

```
PAYPAL_MODE=sandbox
```

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-sandbox-client-id>
```

## Important Notes:

- You need to get your PayPal Client ID from the PayPal Developer Dashboard
- The Client Secret has been provided above
- Mode is set to "sandbox" for testing
- The NEXT_PUBLIC_ prefix exposes the Client ID to the browser (required for PayPal buttons)
- Never expose the Client Secret to the browser

## Getting Your PayPal Client ID:

1. Go to https://developer.paypal.com/dashboard/
2. Log in with your PayPal account
3. Go to Apps & Credentials
4. Under "Sandbox" tab, you'll see your Default Application
5. Copy the "Client ID" 
6. Use this for both PAYPAL_CLIENT_ID and NEXT_PUBLIC_PAYPAL_CLIENT_ID

After adding these, redeploy your Vercel project for the changes to take effect.
