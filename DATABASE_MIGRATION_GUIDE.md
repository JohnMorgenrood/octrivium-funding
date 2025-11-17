# Database Migration Instructions

## Overview

This migration adds comprehensive revenue verification capabilities to Octrivium Funding, including bank feed integration, accounting software connections, automated verification, and payout scheduling.

## Migration Details

**Migration Name:** `add_revenue_verification`

**Tables Added:** 8 new tables
1. `RevenueConnection` - OAuth connections to banks and accounting software
2. `BankAccount` - Individual bank accounts linked via Stitch
3. `BankTransaction` - Transaction history with categorization
4. `RevenueRecord` - Verified monthly revenue per deal
5. `VerificationLog` - Audit trail of verification events
6. `ManualUpload` - Manual document uploads (fallback)
7. `PayoutSchedule` - Scheduled investor payouts

**Enums Added:** 3 new enums
1. `RevenueSourceType` - BANK_FEED, ACCOUNTING, MANUAL_UPLOAD
2. `AccountingProvider` - SAGE_BUSINESS_CLOUD, XERO, QUICKBOOKS_ONLINE, ZOHO_BOOKS
3. `VerificationStatus` - PENDING, VERIFIED, FLAGGED, FAILED, DISCONNECTED

**Relations Added:**
- `Business.revenueConnections` → `RevenueConnection[]`
- `Deal.revenueRecords` → `RevenueRecord[]`

## Pre-Migration Checklist

- [ ] Backup production database
- [ ] Review schema changes in `prisma/schema.prisma`
- [ ] Ensure no pending migrations
- [ ] Verify database connection

## Running the Migration

### Development Environment

```bash
# Preview migration SQL
npx prisma migrate dev --name add_revenue_verification --create-only

# Review the generated SQL in prisma/migrations/

# Apply migration
npx prisma migrate dev --name add_revenue_verification

# Regenerate Prisma Client
npx prisma generate
```

### Production Environment

```bash
# Deploy migration
npx prisma migrate deploy

# Verify migration applied
npx prisma migrate status
```

## Expected Schema Changes

### New Tables

```sql
-- RevenueConnection
CREATE TABLE "RevenueConnection" (
  "id" TEXT PRIMARY KEY,
  "businessId" TEXT NOT NULL,
  "sourceType" "RevenueSourceType" NOT NULL,
  "provider" "AccountingProvider",
  "isConnected" BOOLEAN DEFAULT false,
  "status" "VerificationStatus" DEFAULT 'PENDING',
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "tokenExpiresAt" TIMESTAMP,
  "accountId" TEXT,
  "accountName" TEXT,
  "lastSyncAt" TIMESTAMP,
  "lastSyncStatus" TEXT,
  "lastError" TEXT,
  "errorCount" INTEGER DEFAULT 0,
  "connectedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP,
  FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE,
  UNIQUE("businessId", "sourceType")
);

-- BankAccount
CREATE TABLE "BankAccount" (
  "id" TEXT PRIMARY KEY,
  "connectionId" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "accountName" TEXT NOT NULL,
  "accountNumber" TEXT,
  "accountType" TEXT,
  "bankName" TEXT NOT NULL,
  "currency" TEXT DEFAULT 'ZAR',
  "currentBalance" DECIMAL(15,2),
  "availableBalance" DECIMAL(15,2),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP,
  FOREIGN KEY ("connectionId") REFERENCES "RevenueConnection"("id") ON DELETE CASCADE,
  UNIQUE("connectionId", "accountId")
);

-- BankTransaction
CREATE TABLE "BankTransaction" (
  "id" TEXT PRIMARY KEY,
  "bankAccountId" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "balance" DECIMAL(15,2),
  "category" TEXT,
  "reference" TEXT,
  "isRevenue" BOOLEAN DEFAULT false,
  "isExpense" BOOLEAN DEFAULT false,
  "isTransfer" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE,
  UNIQUE("bankAccountId", "transactionId")
);

-- RevenueRecord
CREATE TABLE "RevenueRecord" (
  "id" TEXT PRIMARY KEY,
  "dealId" TEXT NOT NULL,
  "connectionId" TEXT NOT NULL,
  "month" TIMESTAMP NOT NULL,
  "year" INTEGER NOT NULL,
  "totalRevenue" DECIMAL(15,2) NOT NULL,
  "verifiedRevenue" DECIMAL(15,2),
  "revenueShareAmount" DECIMAL(15,2) NOT NULL,
  "sourceType" "RevenueSourceType" NOT NULL,
  "sourceData" JSONB,
  "status" "VerificationStatus" DEFAULT 'PENDING',
  "hasDiscrepancy" BOOLEAN DEFAULT false,
  "discrepancyAmount" DECIMAL(15,2),
  "discrepancyNotes" TEXT,
  "payoutScheduled" BOOLEAN DEFAULT false,
  "payoutCompletedAt" TIMESTAMP,
  "verifiedAt" TIMESTAMP,
  "verifiedBy" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP,
  FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE,
  FOREIGN KEY ("connectionId") REFERENCES "RevenueConnection"("id") ON DELETE CASCADE,
  UNIQUE("dealId", "connectionId", "month")
);

-- VerificationLog
CREATE TABLE "VerificationLog" (
  "id" TEXT PRIMARY KEY,
  "connectionId" TEXT NOT NULL,
  "verificationType" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "dataFetched" JSONB,
  "discrepancies" JSONB,
  "message" TEXT,
  "errorDetails" TEXT,
  "duration" INTEGER,
  "recordsProcessed" INTEGER,
  "recordsFailed" INTEGER,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("connectionId") REFERENCES "RevenueConnection"("id") ON DELETE CASCADE
);

-- ManualUpload
CREATE TABLE "ManualUpload" (
  "id" TEXT PRIMARY KEY,
  "businessId" TEXT NOT NULL,
  "dealId" TEXT,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "mimeType" TEXT NOT NULL,
  "uploadType" TEXT NOT NULL,
  "month" TIMESTAMP NOT NULL,
  "extractedRevenue" DECIMAL(15,2),
  "extractedData" JSONB,
  "status" "VerificationStatus" DEFAULT 'PENDING',
  "verifiedAt" TIMESTAMP,
  "verifiedBy" TEXT,
  "rejectionReason" TEXT,
  "businessNotes" TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP
);

-- PayoutSchedule
CREATE TABLE "PayoutSchedule" (
  "id" TEXT PRIMARY KEY,
  "dealId" TEXT NOT NULL,
  "month" TIMESTAMP NOT NULL,
  "totalRevenue" DECIMAL(15,2) NOT NULL,
  "revenueShareAmount" DECIMAL(15,2) NOT NULL,
  "platformFee" DECIMAL(15,2) NOT NULL,
  "netPayoutAmount" DECIMAL(15,2) NOT NULL,
  "status" TEXT DEFAULT 'SCHEDULED',
  "scheduledDate" TIMESTAMP NOT NULL,
  "processedDate" TIMESTAMP,
  "isPaused" BOOLEAN DEFAULT false,
  "pauseReason" TEXT,
  "revenueRecordIds" JSONB NOT NULL,
  "investorCount" INTEGER,
  "metadata" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP,
  UNIQUE("dealId", "month")
);
```

### Indexes Created

```sql
-- RevenueConnection indexes
CREATE INDEX "RevenueConnection_businessId_idx" ON "RevenueConnection"("businessId");
CREATE INDEX "RevenueConnection_sourceType_idx" ON "RevenueConnection"("sourceType");
CREATE INDEX "RevenueConnection_status_idx" ON "RevenueConnection"("status");
CREATE INDEX "RevenueConnection_lastSyncAt_idx" ON "RevenueConnection"("lastSyncAt");

-- BankAccount indexes
CREATE INDEX "BankAccount_connectionId_idx" ON "BankAccount"("connectionId");
CREATE INDEX "BankAccount_accountId_idx" ON "BankAccount"("accountId");

-- BankTransaction indexes
CREATE INDEX "BankTransaction_bankAccountId_idx" ON "BankTransaction"("bankAccountId");
CREATE INDEX "BankTransaction_date_idx" ON "BankTransaction"("date");
CREATE INDEX "BankTransaction_isRevenue_idx" ON "BankTransaction"("isRevenue");

-- RevenueRecord indexes
CREATE INDEX "RevenueRecord_dealId_idx" ON "RevenueRecord"("dealId");
CREATE INDEX "RevenueRecord_connectionId_idx" ON "RevenueRecord"("connectionId");
CREATE INDEX "RevenueRecord_month_idx" ON "RevenueRecord"("month");
CREATE INDEX "RevenueRecord_status_idx" ON "RevenueRecord"("status");

-- VerificationLog indexes
CREATE INDEX "VerificationLog_connectionId_idx" ON "VerificationLog"("connectionId");
CREATE INDEX "VerificationLog_verificationType_idx" ON "VerificationLog"("verificationType");
CREATE INDEX "VerificationLog_status_idx" ON "VerificationLog"("status");
CREATE INDEX "VerificationLog_createdAt_idx" ON "VerificationLog"("createdAt");

-- ManualUpload indexes
CREATE INDEX "ManualUpload_businessId_idx" ON "ManualUpload"("businessId");
CREATE INDEX "ManualUpload_dealId_idx" ON "ManualUpload"("dealId");
CREATE INDEX "ManualUpload_month_idx" ON "ManualUpload"("month");
CREATE INDEX "ManualUpload_status_idx" ON "ManualUpload"("status");

-- PayoutSchedule indexes
CREATE INDEX "PayoutSchedule_dealId_idx" ON "PayoutSchedule"("dealId");
CREATE INDEX "PayoutSchedule_month_idx" ON "PayoutSchedule"("month");
CREATE INDEX "PayoutSchedule_status_idx" ON "PayoutSchedule"("status");
CREATE INDEX "PayoutSchedule_scheduledDate_idx" ON "PayoutSchedule"("scheduledDate");
```

## Post-Migration Verification

### Verify Tables Created

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'RevenueConnection',
    'BankAccount',
    'BankTransaction',
    'RevenueRecord',
    'VerificationLog',
    'ManualUpload',
    'PayoutSchedule'
  );
```

Should return 7 rows.

### Verify Enums Created

```sql
-- Check enums exist
SELECT typname 
FROM pg_type 
WHERE typname IN (
  'RevenueSourceType',
  'AccountingProvider',
  'VerificationStatus'
);
```

Should return 3 rows.

### Verify Foreign Keys

```sql
-- Check foreign key constraints
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN (
    'RevenueConnection',
    'BankAccount',
    'BankTransaction',
    'RevenueRecord',
    'VerificationLog'
  );
```

### Test Insert

```sql
-- Test inserting a revenue connection (will fail without businessId)
INSERT INTO "RevenueConnection" (
  id, 
  "businessId", 
  "sourceType",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  (SELECT id FROM "Business" LIMIT 1),
  'BANK_FEED',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Clean up test data
DELETE FROM "RevenueConnection" WHERE "sourceType" = 'BANK_FEED';
```

## Rollback Instructions

### Development

```bash
# Rollback last migration
npx prisma migrate dev --name rollback_revenue_verification
```

### Production (CAUTION)

```bash
# Create rollback migration manually
npx prisma migrate dev --create-only --name rollback_revenue_verification

# Edit migration file to drop tables
# Then deploy
npx prisma migrate deploy
```

### Manual Rollback SQL

```sql
-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS "VerificationLog";
DROP TABLE IF EXISTS "BankTransaction";
DROP TABLE IF EXISTS "BankAccount";
DROP TABLE IF EXISTS "RevenueRecord";
DROP TABLE IF EXISTS "PayoutSchedule";
DROP TABLE IF EXISTS "ManualUpload";
DROP TABLE IF EXISTS "RevenueConnection";

-- Drop enums
DROP TYPE IF EXISTS "RevenueSourceType";
DROP TYPE IF EXISTS "AccountingProvider";
DROP TYPE IF EXISTS "VerificationStatus";
```

## Known Issues & Solutions

### Issue: Migration hangs on production

**Cause:** Large existing database with heavy load

**Solution:**
1. Run migration during low-traffic period
2. Use database connection pooling
3. Increase migration timeout in Prisma config

### Issue: Unique constraint violation

**Cause:** Existing data conflicts with unique constraints

**Solution:**
1. Check for duplicate business connections
2. Clean up data before migration
3. Adjust unique constraints if needed

### Issue: Enum type already exists

**Cause:** Previous migration attempt failed

**Solution:**
```sql
-- Drop existing enums if migration failed
DROP TYPE IF EXISTS "RevenueSourceType" CASCADE;
DROP TYPE IF EXISTS "AccountingProvider" CASCADE;
DROP TYPE IF EXISTS "VerificationStatus" CASCADE;

-- Re-run migration
npx prisma migrate dev
```

## Performance Impact

**Expected Impact:**
- Migration time: < 5 seconds (empty DB), < 30 seconds (production)
- Storage increase: ~100 MB per 1,000 businesses (with transactions)
- Query performance: No impact on existing queries
- New indexes: May slow down inserts slightly (negligible)

**Optimization:**
- All frequently queried columns indexed
- JSON columns for flexible data storage
- Cascade deletes for data cleanup
- Unique constraints prevent duplicates

## Security Considerations

**Sensitive Data:**
- `accessToken` and `refreshToken` fields store encrypted data
- Never query or log these fields in plain text
- Use application-level encryption (AES-256-GCM)

**Access Control:**
- Business users: Can only access own revenue connections
- Admin users: Can access all connections for verification
- Investors: Cannot access revenue connection details

## Monitoring After Migration

### Day 1-7: High Alert

Monitor:
- [ ] Migration completed successfully
- [ ] No application errors related to new tables
- [ ] Prisma client generated correctly
- [ ] All existing functionality still works

### Day 8-30: Medium Alert

Monitor:
- [ ] Revenue connections being created
- [ ] OAuth flows completing successfully
- [ ] Data syncing correctly
- [ ] No performance degradation

### Day 31+: Normal Monitoring

Track:
- Database size growth
- Query performance
- Error rates
- Sync success rates

## Support

**Migration Issues:**
- Check Prisma migration docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Review Prisma migration logs
- Contact dev team with migration error details

**Schema Questions:**
- Review `REVENUE_VERIFICATION_README.md`
- Check Prisma schema file comments
- Review database ERD diagram (if available)

---

**Migration Status:** Ready for Production ✅

**Last Updated:** 2025-01-17
