# Email Receiving Setup Guide

## Critical Steps to Fix Email Receiving

### 1. Add Environment Variable to Vercel

Your webhook secret is in the local `.env` file but **needs to be added to Vercel**:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `octrivium-funding`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `RESEND_WEBHOOK_SECRET`
   - **Value:** `whsec_NUDXfPVB6VBXf4ig7PnesW4Q9ZVa8Dbn`
   - **Environment:** Production, Preview, Development (check all)
5. Click **Save**
6. **Redeploy** your application for the changes to take effect

### 2. Configure Resend Webhook

1. Go to [Resend Dashboard](https://resend.com/dashboard)
2. Navigate to **Webhooks** section
3. **Edit or verify** your existing webhook:
   - **URL:** `https://octrivium.co.za/api/webhooks/resend` (NO www!)
   - **Events:** Enable "Email Received" (email.received)
   - **Signing Secret:** Should match the one above

### 3. Set Up Inbound Email Routing in Resend

This is the most important step:

1. In Resend Dashboard, go to **Domains** → `octrivium.co.za`
2. Look for **Inbound Routing** or **Email Receiving** section
3. Configure inbound routes for your aliases:
   - `support@octrivium.co.za` → Forward to webhook
   - `info@octrivium.co.za` → Forward to webhook
   - Or use a catch-all: `*@octrivium.co.za` → Forward to webhook
4. Make sure the webhook destination is your webhook URL

### 4. Optional: Change FROM Email Address

Currently using `noreply@octrivium.co.za` which might confuse users.

Consider changing to `support@octrivium.co.za`:

1. Update in Vercel environment variables: `RESEND_FROM_EMAIL=support@octrivium.co.za`
2. Redeploy

### 5. Test Email Receiving

After completing above steps:

1. Send a test email from your Gmail to `support@octrivium.co.za`
2. Check your Octrivium inbox at `/dashboard/emails`
3. Use the **Email Diagnostics** page to verify configuration
4. Check Resend logs for webhook delivery status

### Troubleshooting

If emails still don't appear:

1. Check Resend **Logs** → **Webhooks** for delivery attempts
2. Look for 4xx/5xx errors
3. Verify webhook URL has NO `www.` prefix
4. Ensure inbound routing is properly configured
5. Check that webhook secret matches in both Vercel and Resend

### Current Configuration

- **Webhook URL:** `https://octrivium.co.za/api/webhooks/resend` ✅ (corrected)
- **Email Aliases:** `support@octrivium.co.za`, `info@octrivium.co.za`
- **Plan:** ADMIN (Unlimited features)
- **Webhook Secret:** Added to local `.env`, needs Vercel

### Next Steps

1. ✅ Add `RESEND_WEBHOOK_SECRET` to Vercel
2. ✅ Verify webhook URL in Resend (remove www)
3. ✅ Configure inbound email routing in Resend
4. ✅ Test by sending email from Gmail
5. ✅ Check diagnostics page for confirmation
