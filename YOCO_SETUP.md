# Yoco Payment Integration Setup

## Overview
Yoco is a South African payment gateway that allows you to accept ZAR payments directly. The integration is now complete and ready to test.

## What's Been Implemented

### 1. YocoButton Component (`components/accounting/YocoButton.tsx`)
- Loads Yoco JavaScript SDK dynamically
- Shows a payment popup when customer clicks "Pay with Yoco"
- Handles the payment token and sends it to your server
- Displays loading states and error messages
- Styled with Yoco's brand colors

### 2. Payment Processing API (`app/api/yoco/process-payment/route.ts`)
- Receives payment token from Yoco
- Charges the card using Yoco's REST API
- Updates invoice status to PAID
- Adds funds to your wallet (locked for 7 days processing)
- Creates transaction record
- Full error handling and logging

### 3. Updated Invoice Payment Page
- Shows **Yoco button first** (for ZAR payments)
- Shows PayPal option second (for USD payments)
- Both options available to customers

## Setup Steps

### Step 1: Get Your Yoco API Keys
1. Go to https://developer.yoco.com/online/resources/integration-keys
2. Log in to your Yoco account (or sign up if you don't have one)
3. You'll see two types of keys:
   - **Test Keys** (for testing): Use these during development
     - Public Key: starts with `pk_test_`
     - Secret Key: starts with `sk_test_`
   - **Live Keys** (for real payments): Use these in production
     - Public Key: starts with `pk_live_`
     - Secret Key: starts with `sk_live_`

### Step 2: Add Keys to Local Environment
1. Open your `.env` file in the project root
2. Add these lines (using your test keys for now):
```env
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_yourPublicKeyHere
YOCO_SECRET_KEY=sk_test_yourSecretKeyHere
```

### Step 3: Add Keys to Vercel (Production)
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add two variables:
   - Name: `NEXT_PUBLIC_YOCO_PUBLIC_KEY`
     - Value: `pk_live_yourLivePublicKey` (use live key for production)
   - Name: `YOCO_SECRET_KEY`
     - Value: `sk_live_yourLiveSecretKey` (use live key for production)
4. Important: Make sure `NEXT_PUBLIC_YOCO_PUBLIC_KEY` is available to **all environments** (Production, Preview, Development)
5. `YOCO_SECRET_KEY` should only be in Production and Preview (not exposed to browser)

### Step 4: Test the Integration
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Create a test invoice or use an existing unpaid one

3. Go to the payment page: `http://localhost:3000/pay/[paymentLink]`

4. Click "Pay with Yoco" button

5. Use Yoco test card details:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)

6. Complete the payment and verify:
   - Invoice status changes to PAID
   - Transaction appears in your wallet
   - Amount is locked for 7 days

### Step 5: Deploy to Vercel
1. After testing locally, commit your changes:
   ```bash
   git add .
   git commit -m "Add Yoco payment integration"
   git push
   ```

2. Vercel will automatically deploy

3. Test with live payment on production URL

## How It Works for Customers

1. Customer receives invoice with payment link
2. Clicks the payment link
3. Sees invoice details and two payment options:
   - **Pay with Yoco (ZAR)** - Direct ZAR payment
   - **Pay with PayPal (USD)** - USD conversion with fees shown
4. Clicks "Pay with Yoco"
5. Yoco popup appears
6. Enters card details
7. Payment processed instantly
8. Invoice marked as PAID
9. Customer sees success message

## Security Notes
- Public key (`NEXT_PUBLIC_*`) is safe to expose in browser
- Secret key is only used server-side and never exposed
- All payments processed through Yoco's secure API
- PCI compliance handled by Yoco
- No card details stored on your server

## Yoco Features
- ✅ Accepts all major cards (Visa, Mastercard, Amex)
- ✅ Instant payment processing
- ✅ ZAR currency support
- ✅ Mobile-optimized payment popup
- ✅ 3D Secure authentication when required
- ✅ Detailed transaction reporting in Yoco dashboard
- ✅ Automatic settlement to your bank account

## Payment Flow Timeline
1. **Customer pays** → Instant
2. **Invoice marked PAID** → Instant
3. **Funds added to wallet (locked)** → Instant
4. **Funds available for withdrawal** → After 7 days
5. **Yoco settles to your bank** → According to Yoco's schedule

## Next Steps After Setup
1. ✅ Test with Yoco test keys locally
2. ✅ Add live keys to Vercel production
3. ✅ Send test invoice to yourself
4. ✅ Complete test payment
5. ✅ Verify invoice marked as paid
6. ✅ Check transaction in wallet
7. ✅ Review payment in Yoco dashboard

## Troubleshooting

### "Yoco is not loaded" error
- Check that `NEXT_PUBLIC_YOCO_PUBLIC_KEY` is set correctly
- Verify key starts with `pk_test_` or `pk_live_`
- Redeploy if you just added the environment variable

### Payment fails silently
- Check browser console for errors
- Verify secret key is correct in Vercel
- Check API logs: `npx vercel logs [deployment-url]`

### Invoice not marked as paid
- Check that payment returned `status: 'successful'`
- Look at API route logs for error messages
- Verify invoice exists and isn't already paid

## Support
- Yoco Documentation: https://developer.yoco.com/
- Yoco Support: support@yoco.com
- Test Cards: https://developer.yoco.com/online/resources/testing

## Differences from PayPal
| Feature | Yoco | PayPal |
|---------|------|--------|
| Currency | ZAR only | USD (in sandbox) |
| Fees | Standard Yoco rates | 3.9% + $0.30 |
| Settlement | Direct to bank | Via PayPal account |
| For SA customers | ✅ Best option | ❌ Currency conversion |
| International | ❌ ZAR only | ✅ USD works globally |

## Recommendation
- Use **Yoco** for South African customers (ZAR)
- Use **PayPal** for international customers (USD)
- Both options are now available on every invoice!
