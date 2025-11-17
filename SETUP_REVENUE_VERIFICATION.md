# Revenue Verification System - Setup Guide

## Quick Start

Follow these steps to get the revenue verification system running:

### 1. Install Dependencies (Already Done)

The system uses existing dependencies - no new packages required.

### 2. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.revenue-integration.example .env.local
```

**Generate encryption keys:**

```bash
# Generate ENCRYPTION_KEY (32 bytes = 64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add to your `.env` file:**

```bash
# Encryption (REQUIRED)
ENCRYPTION_KEY=your_64_character_hex_string

# Cron Security (REQUIRED)
CRON_SECRET=your_cron_secret_token

# Stitch Bank Integration (REQUIRED for bank feeds)
STITCH_CLIENT_ID=get_from_stitch_dashboard
STITCH_CLIENT_SECRET=get_from_stitch_dashboard
STITCH_REDIRECT_URI=http://localhost:3000/api/integrations/stitch/callback
STITCH_ENVIRONMENT=sandbox

# Xero Integration (OPTIONAL - for accounting)
XERO_CLIENT_ID=get_from_xero_developer
XERO_CLIENT_SECRET=get_from_xero_developer

# Other integrations are optional
```

### 3. Run Database Migration

```bash
npx prisma migrate dev --name add_revenue_verification
```

This creates all the new tables:
- ✅ RevenueConnection
- ✅ BankAccount
- ✅ BankTransaction
- ✅ RevenueRecord
- ✅ VerificationLog
- ✅ ManualUpload
- ✅ PayoutSchedule

```bash
npx prisma generate
```

### 4. Get Stitch API Credentials

**Sign up for Stitch:**
1. Go to https://stitch.money/
2. Create account and verify email
3. Navigate to Dashboard > Apps
4. Click "Create App"
5. Configure:
   - Name: "Octrivium Funding"
   - Redirect URI: `http://localhost:3000/api/integrations/stitch/callback`
   - Scopes: `accounts`, `transactions`, `balances`
6. Copy Client ID and Client Secret
7. Add to `.env` file

**Test in Sandbox Mode:**
```bash
STITCH_ENVIRONMENT=sandbox
```

### 5. Get Xero API Credentials (Optional)

1. Go to https://developer.xero.com/
2. Create account
3. Click "New App"
4. Configure:
   - App name: "Octrivium Revenue Verification"
   - OAuth 2.0 redirect URI: `http://localhost:3000/api/integrations/accounting/callback`
   - Scopes: `accounting.transactions`, `accounting.reports.read`, `accounting.contacts`
5. Copy Client ID and Client Secret
6. Add to `.env` file

### 6. Start Development Server

```bash
npm run dev
```

### 7. Test the Integration

**As a Business User:**

1. Register/login as business account
2. Navigate to `/dashboard/revenue`
3. Click "Connect Bank" button
4. Complete Stitch OAuth flow
5. Grant access to bank account
6. Redirect back to dashboard
7. See connected bank account status

**Test Manual Sync:**

Click "Sync Now" button to fetch latest transactions.

### 8. Test Cron Job Locally

```bash
curl -X POST http://localhost:3000/api/cron/verify-revenue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Should return:
```json
{
  "success": true,
  "summary": {
    "totalDeals": 1,
    "verified": 1,
    "flagged": 0,
    "failed": 0,
    "totalRevenueShareAmount": 5000
  }
}
```

## Production Deployment

### 1. Update Environment Variables in Vercel

Add all environment variables to Vercel:
- `ENCRYPTION_KEY`
- `CRON_SECRET`
- `STITCH_CLIENT_ID`
- `STITCH_CLIENT_SECRET`
- `STITCH_ENVIRONMENT=production`
- `XERO_CLIENT_ID` (if using)
- `XERO_CLIENT_SECRET` (if using)

### 2. Update OAuth Redirect URIs

**Stitch Dashboard:**
- Add: `https://your-domain.com/api/integrations/stitch/callback`

**Xero Dashboard:**
- Add: `https://your-domain.com/api/integrations/accounting/callback`

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add revenue verification system"
git push
```

Vercel will automatically deploy and configure the cron job.

### 4. Verify Cron Job Setup

1. Go to Vercel Dashboard
2. Click on your project
3. Navigate to "Cron Jobs" tab
4. Verify job is scheduled: "0 2 1 * *" (1st of month, 2 AM)

### 5. Move to Production APIs

**Stitch:**
1. Submit app for production review
2. Wait for approval
3. Update `STITCH_ENVIRONMENT=production`

**Xero:**
- Production access automatic after OAuth approval

## Usage Guide

### For Businesses

**Connect Bank Account:**
1. Login to dashboard
2. Navigate to Revenue tab
3. Click "Connect Bank"
4. Select your bank
5. Login to online banking
6. Grant access to Octrivium

**Connect Accounting Software:**
1. Click "Connect Xero" (or other provider)
2. Login to accounting software
3. Select organization
4. Grant access to Octrivium

**View Revenue History:**
- Automatic sync on 1st of each month
- Manual sync available anytime
- View verified revenue amounts
- See scheduled payouts to investors

### For Admins

**Review Flagged Revenue:**
1. Check `RevenueRecord` table for `status = 'FLAGGED'`
2. Review `discrepancyNotes`
3. Manually verify with business
4. Approve or reject revenue report

**Monitor Sync Status:**
```sql
SELECT * FROM "RevenueConnection" 
WHERE "lastSyncStatus" = 'FAILED';
```

**View Verification Logs:**
```sql
SELECT * FROM "VerificationLog" 
ORDER BY "createdAt" DESC 
LIMIT 100;
```

## Troubleshooting

### Issue: "Stitch connection failed"

**Solution:**
1. Check `STITCH_CLIENT_ID` and `STITCH_CLIENT_SECRET`
2. Verify redirect URI matches exactly
3. Ensure `STITCH_ENVIRONMENT` is correct
4. Check Stitch dashboard for app status

### Issue: "Token refresh failed"

**Solution:**
- OAuth refresh tokens expire after 60 days
- User must reconnect bank account
- Add notification system to alert businesses

### Issue: "Revenue always flagged"

**Solution:**
- Normal if bank deposits don't match invoiced amounts
- Adjust `DISCREPANCY_THRESHOLD` in `revenue-verification.ts`
- Default is 0.1 (10%) - can increase to 0.15 (15%)

### Issue: "Cron job not running"

**Solution:**
1. Check Vercel cron logs
2. Verify `vercel.json` is deployed
3. Test endpoint manually: `curl -X POST https://your-domain.com/api/cron/verify-revenue -H "Authorization: Bearer CRON_SECRET"`
4. Check Vercel dashboard for cron job errors

### Issue: "Database connection error during cron"

**Solution:**
- Vercel serverless functions have 10-second timeout
- If processing many deals, consider:
  - Breaking into smaller batches
  - Using Vercel Pro for 60-second timeout
  - Moving to dedicated cron service (Railway, Render)

## API Testing

### Test Stitch Connection

```typescript
// app/api/test-stitch/route.ts
import { getStitchClient } from '@/lib/integrations/stitch';

export async function GET() {
  try {
    const client = getStitchClient();
    const authUrl = client.getAuthorizationUrl('test-state', 'test-business-id');
    return Response.json({ success: true, authUrl });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
```

### Test Xero Connection

```typescript
// app/api/test-xero/route.ts
import { getAccountingClient } from '@/lib/integrations/accounting';

export async function GET() {
  try {
    const client = getAccountingClient('XERO');
    const authUrl = client.getAuthorizationUrl('test-state', 'test-business-id');
    return Response.json({ success: true, authUrl });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
```

## Security Best Practices

✅ **Never log decrypted tokens** - Always log encrypted versions
✅ **Rotate encryption keys quarterly** - Update `ENCRYPTION_KEY` periodically
✅ **Use HTTPS in production** - Never send tokens over HTTP
✅ **Validate state tokens** - Prevent CSRF attacks in OAuth flow
✅ **Set token expiry** - Refresh tokens every 60 days
✅ **Limit cron retries** - Prevent infinite loops on failed syncs
✅ **Monitor error counts** - Alert when connection errors exceed threshold

## Performance Optimization

### Batch Processing

For businesses with many transactions:

```typescript
// Process in batches of 100 transactions
const BATCH_SIZE = 100;
for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
  const batch = transactions.slice(i, i + BATCH_SIZE);
  await processBatch(batch);
}
```

### Caching

Cache organization info to reduce API calls:

```typescript
// Cache Xero tenant ID for 1 hour
const cachedTenantId = await redis.get(`xero:tenant:${businessId}`);
if (!cachedTenantId) {
  const tenantId = await fetchTenantId();
  await redis.set(`xero:tenant:${businessId}`, tenantId, 'EX', 3600);
}
```

### Parallel Processing

Fetch bank and accounting data in parallel:

```typescript
const [bankRevenue, accountingRevenue] = await Promise.all([
  fetchBankRevenue(connection, month),
  fetchAccountingRevenue(connection, month)
]);
```

## Monitoring & Alerts

### Setup Notifications

Add to cron job:

```typescript
// Send alert on high error rate
const errorRate = results.filter(r => r.status === 'FAILED').length / results.length;
if (errorRate > 0.2) {
  await sendAdminAlert({
    subject: 'High Revenue Sync Failure Rate',
    message: `${(errorRate * 100).toFixed(0)}% of syncs failed this month`
  });
}
```

### Dashboard Metrics

Track:
- ✅ Total connections active
- ✅ Sync success rate
- ✅ Average revenue per business
- ✅ Discrepancy detection rate
- ✅ Payout completion rate

## Next Steps

After basic setup works:

1. ✅ **Test with real bank account** (Stitch sandbox)
2. ✅ **Test with Xero demo company**
3. ⏳ **Implement other providers** (Sage, QuickBooks, Zoho)
4. ⏳ **Add manual upload system** (PDF/CSV parsing)
5. ⏳ **Build admin review workflow** (flagged revenue approval)
6. ⏳ **Add email notifications** (sync failures, discrepancies)
7. ⏳ **Create investor revenue reports** (monthly PDF)
8. ⏳ **Implement payout automation** (distribute to investors)

## Support

Need help?
- 📖 Read `REVENUE_VERIFICATION_README.md` for detailed docs
- 🐛 Check verification logs in database
- 💬 Contact Octrivium dev team
- 🔧 Review Stitch/Xero API docs
