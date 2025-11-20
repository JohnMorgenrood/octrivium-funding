# Yoco Live Keys - Add to Vercel

## Environment Variables to Add

Go to your Vercel project → Settings → Environment Variables and add:

### 1. NEXT_PUBLIC_YOCO_PUBLIC_KEY
- **Value:** `pk_live_yourPublicKeyHere` (get from Yoco dashboard)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Note:** This is safe to expose to the browser (that's why it's NEXT_PUBLIC_*)

### 2. YOCO_SECRET_KEY
- **Value:** `sk_live_yourSecretKeyHere` (get from Yoco dashboard)
- **Environments:** ✅ Production, ✅ Preview (DO NOT add to Development)
- **Note:** This is SECRET and should only be used server-side

## Steps to Add in Vercel:

1. Go to: https://vercel.com/[your-username]/octrivium-funding/settings/environment-variables

2. Click "Add New" for each variable

3. After adding both, redeploy:
   - Go to Deployments tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"

## Testing Locally:

Your local `.env` file has been updated with the live keys. To test:

1. Start dev server: `npm run dev`
2. Create or open an unpaid invoice
3. Go to the payment page
4. Click "Pay with Yoco"
5. Use a real card to test (since these are live keys)
6. Check that invoice is marked as PAID

## ⚠️ Important Notes:

- **These are LIVE keys** - Real payments will be processed
- Test with a small amount first (like R1.00)
- Check your Yoco dashboard to see payments: https://portal.yoco.com/
- All payments go to your linked bank account
- Funds are locked in your wallet for 7 days before withdrawal

## After Testing:

Once you confirm it works:
1. Commit changes: `git add . && git commit -m "Add Yoco payment gateway"`
2. Push to GitHub: `git push`
3. Vercel will auto-deploy
4. Add environment variables in Vercel
5. Redeploy
6. Send real invoice to test with live payment!

Your accounting software now accepts ZAR payments! 🎉
