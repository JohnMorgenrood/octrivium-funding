# Revenue Verification System Documentation

## Overview

The Octrivium Revenue Verification System provides **automated revenue tracking and verification** for businesses using three layers of integration:

1. **Primary Layer**: Bank feed integration via Stitch (South African Open Banking)
2. **Secondary Layer**: Accounting software integration (Sage, Xero, QuickBooks, Zoho)
3. **Fallback Layer**: Manual document upload

## Features

✅ **Automatic Revenue Tracking**
- Monthly automated sync from bank accounts and accounting software
- Real-time transaction categorization and revenue calculation
- Cross-reference between bank and accounting data for accuracy

✅ **Fraud Detection**
- Automatic discrepancy detection between data sources
- 10% tolerance threshold for normal business variations
- Automatic flagging of suspicious revenue reports

✅ **Automated Payouts**
- Calculate revenue-share amounts based on deal terms
- Schedule payouts to investors automatically
- Track payout status and completion

✅ **Business Dashboard**
- View all connected accounts and sync status
- Browse revenue history and verification logs
- Monitor upcoming and completed payouts

## Architecture

### Database Schema

#### RevenueConnection
Stores OAuth connections to banks and accounting software.

```typescript
{
  businessId: string
  sourceType: 'BANK_FEED' | 'ACCOUNTING' | 'MANUAL_UPLOAD'
  provider?: 'SAGE' | 'XERO' | 'QUICKBOOKS' | 'ZOHO'
  isConnected: boolean
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'FAILED' | 'DISCONNECTED'
  accessToken: string (encrypted)
  refreshToken: string (encrypted)
  lastSyncAt: DateTime
}
```

#### BankAccount
Individual bank accounts linked via Stitch.

```typescript
{
  accountId: string
  accountName: string
  accountNumber: string
  bankName: string
  currentBalance: Decimal
  isActive: boolean
}
```

#### RevenueRecord
Verified monthly revenue for each deal.

```typescript
{
  dealId: string
  month: DateTime
  totalRevenue: Decimal
  revenueShareAmount: Decimal
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED'
  hasDiscrepancy: boolean
  payoutScheduled: boolean
}
```

#### PayoutSchedule
Scheduled investor payouts.

```typescript
{
  dealId: string
  month: DateTime
  revenueShareAmount: Decimal
  platformFee: Decimal
  netPayoutAmount: Decimal
  status: 'SCHEDULED' | 'PROCESSING' | 'COMPLETED' | 'PAUSED'
  scheduledDate: DateTime
  investorCount: number
}
```

## Integration Guides

### 1. Stitch Bank Feed Integration

**Setup:**
1. Create account at https://stitch.money/
2. Create a new app in Stitch Console
3. Configure redirect URI: `https://your-domain.com/api/integrations/stitch/callback`
4. Add credentials to `.env`:
   ```bash
   STITCH_CLIENT_ID=your_client_id
   STITCH_CLIENT_SECRET=your_client_secret
   STITCH_ENVIRONMENT=sandbox # or production
   ```

**OAuth Flow:**
1. User clicks "Connect Bank" button
2. System redirects to Stitch authorization page
3. User authenticates with their bank
4. Stitch redirects back with authorization code
5. System exchanges code for access/refresh tokens
6. Tokens stored encrypted in database
7. Bank accounts and balances fetched automatically

**Data Fetched:**
- Bank account details (name, number, type)
- Current and available balances
- Transaction history (description, amount, date, reference)
- Categorized transactions (revenue, expenses, transfers)

### 2. Xero Integration

**Setup:**
1. Create app at https://developer.xero.com/
2. Configure OAuth 2.0 settings
3. Add credentials to `.env`:
   ```bash
   XERO_CLIENT_ID=your_client_id
   XERO_CLIENT_SECRET=your_client_secret
   ```

**OAuth Flow:**
Similar to Stitch, with Xero-specific authorization URL.

**Data Fetched:**
- Organization details
- Profit & Loss reports (monthly)
- Invoice list (paid/unpaid)
- Cash flow statements
- Revenue and expense breakdown

### 3. Sage Business Cloud Integration

**Setup:**
1. Register at https://developer.sage.com/
2. Create OAuth 2.0 application
3. Add credentials to `.env`:
   ```bash
   SAGE_CLIENT_ID=your_client_id
   SAGE_CLIENT_SECRET=your_client_secret
   ```

**Status:** Implementation template ready, full integration TODO.

### 4. QuickBooks Online Integration

**Setup:**
1. Register at https://developer.intuit.com/
2. Create app with accounting scope
3. Add credentials to `.env`:
   ```bash
   QUICKBOOKS_CLIENT_ID=your_client_id
   QUICKBOOKS_CLIENT_SECRET=your_client_secret
   ```

**Status:** Implementation template ready, full integration TODO.

### 5. Zoho Books Integration

**Setup:**
1. Register at https://www.zoho.com/books/api/
2. Create OAuth client
3. Add credentials to `.env`:
   ```bash
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ```

**Status:** Implementation template ready, full integration TODO.

## API Endpoints

### Integration Endpoints

#### `GET /api/integrations/stitch/connect`
Initiates Stitch OAuth flow.
- **Auth**: Business account required
- **Returns**: `{ authUrl, state }`

#### `GET /api/integrations/stitch/callback`
OAuth callback from Stitch.
- **Params**: `code`, `state`
- **Action**: Exchanges code for tokens, stores connection

#### `GET /api/integrations/accounting/connect?provider=XERO`
Initiates accounting software OAuth flow.
- **Auth**: Business account required
- **Params**: `provider` (XERO, SAGE_BUSINESS_CLOUD, etc.)
- **Returns**: `{ authUrl, state, provider }`

#### `GET /api/integrations/accounting/callback`
OAuth callback for accounting software.
- **Params**: `code`, `state` (includes provider)
- **Action**: Exchanges code for tokens, fetches org info

### Revenue Dashboard Endpoints

#### `GET /api/revenue/connections`
Get all revenue connections for business.
- **Auth**: Business account required
- **Returns**: Array of connections with sync status

#### `GET /api/revenue/records`
Get revenue records (last 12 months).
- **Auth**: Business account required
- **Returns**: Array of revenue records

#### `GET /api/revenue/payouts`
Get payout schedules (last 12 months).
- **Auth**: Business account required
- **Returns**: Array of payout schedules

#### `POST /api/revenue/sync`
Manually trigger revenue sync.
- **Auth**: Business account required
- **Returns**: Sync results for each connection

### Cron Endpoint

#### `GET/POST /api/cron/verify-revenue`
Monthly automated revenue verification.
- **Auth**: Requires `CRON_SECRET` in Authorization header
- **Schedule**: 1st of each month at 2 AM
- **Actions**:
  1. Fetch revenue from all connected sources
  2. Cross-reference bank vs accounting data
  3. Detect discrepancies and flag suspicious data
  4. Calculate revenue-share amounts
  5. Create revenue records
  6. Schedule investor payouts

## Security

### Token Encryption

All OAuth tokens stored encrypted using AES-256-GCM:

```typescript
const encryptedToken = StitchClient.encrypt(accessToken, ENCRYPTION_KEY);
const decryptedToken = StitchClient.decrypt(encryptedToken, ENCRYPTION_KEY);
```

**Generate encryption key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### OAuth State Validation

CSRF protection via state tokens:
1. Generate random 32-byte state token
2. Store in audit log with timestamp
3. Include in OAuth authorization URL
4. Verify on callback within 10-minute window

### Cron Job Protection

Protect cron endpoint from unauthorized access:

```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return 401 Unauthorized;
}
```

## Fraud Detection

### Discrepancy Detection

Compare bank revenue vs accounting revenue:

```typescript
const discrepancyAmount = Math.abs(bankRevenue - accountingRevenue);
const averageRevenue = (bankRevenue + accountingRevenue) / 2;
const discrepancyPercentage = discrepancyAmount / averageRevenue;

if (discrepancyPercentage > 0.10) { // 10% threshold
  status = 'FLAGGED';
  pausePayouts = true;
}
```

### Automatic Actions

When discrepancy detected:
1. ✅ Revenue record status set to `FLAGGED`
2. ✅ Payout automatically paused
3. ✅ Admin notification triggered
4. ✅ Use lower revenue amount (conservative approach)
5. ⏳ Manual admin review required

## Business Dashboard

### Revenue Verification Page

**Location**: `/dashboard/revenue`

**Features:**
- Connection status cards (Bank, Accounting, Manual Upload)
- "Connect Bank" and "Connect Accounting" buttons
- Last sync date and status
- Manual "Sync Now" button
- Revenue history table (last 12 months)
- Payout schedule table
- Visual status indicators (verified, flagged, pending)

**UI Components:**
- Connected accounts with green check or red X
- Revenue records with discrepancy warnings
- Scheduled vs completed payouts
- Download revenue reports (TODO)

## Automated Cron Job

### Schedule
Runs on **1st of each month at 2 AM** via Vercel Cron.

### Process Flow

1. **Fetch Active Deals**
   - Find all deals with status `ACTIVE` or `REPAYING`
   - Include deals with revenue connections

2. **For Each Deal:**
   - Fetch bank feed revenue (if connected)
   - Fetch accounting revenue (if connected)
   - Cross-reference the two sources
   - Detect discrepancies (>10% difference)
   - Calculate verified revenue amount
   - Calculate revenue-share amount

3. **Create Records:**
   - Create `RevenueRecord` with verified amounts
   - Log verification details and discrepancies
   - Update connection sync status

4. **Schedule Payouts:**
   - If verified: Create `PayoutSchedule` for 5th of next month
   - If flagged: Pause payout and notify admin
   - Calculate platform fee (5%)
   - Calculate net payout amount

5. **Generate Report:**
   - Total deals processed
   - Verified count
   - Flagged count
   - Failed count
   - Total revenue-share amount

### Vercel Cron Configuration

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/verify-revenue",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

**Cron Expression**: `0 2 1 * *`
- Minute: 0
- Hour: 2 (2 AM)
- Day: 1 (1st of month)
- Month: * (every month)
- Day of week: * (any day)

## Testing

### Test Bank Connection (Sandbox)

1. Use Stitch sandbox environment
2. Test credentials provided by Stitch
3. Mock bank accounts for testing

### Test Accounting Integration

1. Create Xero demo company
2. Use Xero sandbox OAuth credentials
3. Populate with test invoices and transactions

### Manual Sync Testing

```bash
# Trigger manual sync via API
curl -X POST http://localhost:3000/api/revenue/sync \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Cron Job Testing

```bash
# Trigger cron manually
curl -X POST http://localhost:3000/api/cron/verify-revenue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Deployment Checklist

### Environment Variables

✅ Add all integration credentials to Vercel
✅ Generate and set `ENCRYPTION_KEY` (32 bytes hex)
✅ Generate and set `CRON_SECRET` (32 bytes hex)
✅ Update `STITCH_REDIRECT_URI` to production URL
✅ Update OAuth redirect URIs in all provider dashboards

### Database Migration

```bash
npx prisma migrate dev --name add_revenue_verification
npx prisma generate
```

### Vercel Cron Setup

1. Deploy `vercel.json` with cron configuration
2. Verify cron job in Vercel dashboard
3. Add `CRON_SECRET` to Vercel environment variables
4. Test cron endpoint manually first

### Provider Configurations

For each provider:
1. Update redirect URIs to production domain
2. Move from sandbox to production environment
3. Request production API access (if required)
4. Test OAuth flow in production

## Troubleshooting

### Token Expired Errors

**Problem**: Access token expired during sync.
**Solution**: Automatically refresh using refresh token.

```typescript
if (new Date() >= tokenExpiresAt) {
  const newTokens = await client.refreshAccessToken(refreshToken);
  // Update database with new tokens
}
```

### Connection Failed

**Problem**: OAuth callback returns error.
**Solution**: Check state validation, redirect URI configuration.

### Discrepancy Always Flagged

**Problem**: Bank and accounting data never match exactly.
**Solution**: Adjust `DISCREPANCY_THRESHOLD` (currently 10%).

### Cron Job Not Running

**Problem**: Revenue verification not executing monthly.
**Solution**: 
1. Check Vercel cron logs
2. Verify `vercel.json` deployed
3. Test endpoint manually with `CRON_SECRET`

## Future Enhancements

### TODO List

- [ ] Implement Sage, QuickBooks, Zoho integrations (Xero is done)
- [ ] Add manual document upload with PDF parsing
- [ ] Build admin approval workflow for flagged revenue
- [ ] Add email notifications for sync failures
- [ ] Create investor revenue report PDFs
- [ ] Add revenue forecast based on historical data
- [ ] Implement multi-currency support
- [ ] Add bank feed webhooks for real-time updates
- [ ] Build revenue reconciliation tool for admins
- [ ] Add export to CSV/Excel functionality

## Support

For integration issues:
- **Stitch**: https://stitch.money/support
- **Xero**: https://developer.xero.com/support
- **Sage**: https://developer.sage.com/support

For system issues:
- Check verification logs in database
- Review connection error messages
- Contact Octrivium support team
