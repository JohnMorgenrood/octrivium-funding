# Octrivium Funding - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         OCTRIVIUM FUNDING                        │
│                   Revenue-Based Crowdfunding Platform            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + React 18 + TypeScript               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Homepage   │  │    Deals     │  │  Dashboard   │         │
│  │  (Public)    │  │  (Browse)    │  │ (Protected)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Pages   │  │    Wallet    │  │    Admin     │         │
│  │ Login/Register│  │  Management  │  │    Panel     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  UI Components: Radix UI + Tailwind CSS                        │
└─────────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  NextAuth.js                                                     │
│  ├─ JWT Sessions                                                │
│  ├─ Role-Based Access (INVESTOR, BUSINESS, ADMIN)              │
│  ├─ Protected Routes Middleware                                 │
│  └─ Secure Password Hashing (bcrypt)                           │
└─────────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER (Backend)                       │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (RESTful)                                   │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Auth API        │  │  Deals API       │                    │
│  │  /api/auth/*     │  │  /api/deals/*    │                    │
│  │  - Register      │  │  - List deals    │                    │
│  │  - Login         │  │  - Get deal      │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Investment API   │  │  Wallet API      │                    │
│  │ /api/investments │  │  /api/wallet/*   │                    │
│  │ - Create invest  │  │  - Balance       │                    │
│  │ - Get portfolio  │  │  - Deposit       │                    │
│  │                  │  │  - Withdraw      │                    │
│  │                  │  │  - Transactions  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
│  Input Validation: Zod schemas                                  │
│  Business Logic: Transaction processing, calculations           │
└─────────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                      │
│  ├─ Type-safe database access                                   │
│  ├─ Automated migrations                                        │
│  ├─ Transaction support                                         │
│  └─ Connection pooling                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                         │
├─────────────────────────────────────────────────────────────────┤
│  Core Tables:                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    Users    │  │  Businesses │  │    Deals    │            │
│  │  (Auth)     │  │  (Profiles) │  │  (Funding)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Investments │  │   Wallets   │  │Transactions │            │
│  │ (Tracking)  │  │  (Balances) │  │  (Ledger)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Revenue   │  │   Payouts   │  │     KYC     │            │
│  │   Reports   │  │(Distribution)│  │  Documents  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │Notifications│  │  AuditLogs  │                              │
│  │  (Alerts)   │  │ (Security)  │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES (Future)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   PayFast    │  │    Resend    │  │  DocuSign    │         │
│  │  (Payments)  │  │   (Email)    │  │(E-Signature) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User → Registration Form → /api/auth/register
                                    ↓
                            Validate Input (Zod)
                                    ↓
                            Hash Password (bcrypt)
                                    ↓
                            Create User (Prisma)
                                    ↓
                            Create Wallet
                                    ↓
                            Return Success → Redirect to Login
```

### 2. Investment Flow

```
Investor → Browse Deals → Select Deal → Investment Form
                                              ↓
                                    Enter Amount
                                              ↓
                                /api/investments POST
                                              ↓
                          ┌─────────────────────────────┐
                          │   Validation Checks         │
                          ├─────────────────────────────┤
                          │ ✓ User authenticated        │
                          │ ✓ KYC approved             │
                          │ ✓ Deal is active           │
                          │ ✓ Amount valid             │
                          │ ✓ Sufficient wallet balance│
                          └─────────────────────────────┘
                                              ↓
                          ┌─────────────────────────────┐
                          │   Database Transaction      │
                          ├─────────────────────────────┤
                          │ 1. Create Investment        │
                          │ 2. Update Wallet Balance    │
                          │ 3. Lock Funds              │
                          │ 4. Create Transaction Log  │
                          │ 5. Update Deal Funding     │
                          │ 6. Increment Investor Count│
                          └─────────────────────────────┘
                                              ↓
                          Deal Fully Funded?
                          ↓ Yes        ↓ No
                    Calculate          Keep
                    Share %s          Active
                          ↓
                    Send Notification → Dashboard
```

### 3. Monthly Payout Flow (To Be Implemented)

```
Business → Submit Revenue Report → /api/revenue-reports
                                              ↓
                                  Admin Reviews & Verifies
                                              ↓
                                  Calculate Revenue Share
                                  (Revenue × Share %)
                                              ↓
                          ┌─────────────────────────────┐
                          │   For Each Investor         │
                          ├─────────────────────────────┤
                          │ Calculate: Total × Share %  │
                          │ Credit Wallet              │
                          │ Update Investment Total    │
                          │ Create Transaction Log     │
                          │ Send Notification          │
                          └─────────────────────────────┘
                                              ↓
                          Check if Cap Reached (1.7×)
                          ↓ Yes        ↓ No
                    Mark Complete    Continue
```

## User Roles & Permissions

```
┌──────────────────────────────────────────────────────────┐
│                         ROLES                             │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  INVESTOR                                                 │
│  ├─ Browse deals                                         │
│  ├─ Make investments                                     │
│  ├─ View portfolio                                       │
│  ├─ Manage wallet                                        │
│  ├─ Receive payouts                                      │
│  └─ Withdraw funds                                       │
│                                                           │
│  BUSINESS                                                 │
│  ├─ Create profile                                       │
│  ├─ Submit documents                                     │
│  ├─ Create deals                                         │
│  ├─ Report revenue                                       │
│  ├─ View investors                                       │
│  └─ Track payouts                                        │
│                                                           │
│  ADMIN                                                    │
│  ├─ Review deals                                         │
│  ├─ Approve/reject businesses                            │
│  ├─ Verify KYC documents                                 │
│  ├─ Monitor platform                                     │
│  ├─ Verify revenue reports                               │
│  ├─ Manage users                                         │
│  └─ Access audit logs                                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Layer 1: Transport Security                             │
│  └─ HTTPS/TLS (Production)                              │
│                                                           │
│  Layer 2: Authentication                                  │
│  ├─ JWT tokens (httpOnly cookies)                       │
│  ├─ bcrypt password hashing (12 rounds)                 │
│  └─ Session management (NextAuth)                       │
│                                                           │
│  Layer 3: Authorization                                   │
│  ├─ Role-based access control                           │
│  ├─ Route protection (middleware)                       │
│  └─ API endpoint guards                                 │
│                                                           │
│  Layer 4: Input Validation                               │
│  ├─ Zod schemas                                         │
│  ├─ Type checking (TypeScript)                          │
│  └─ Sanitization                                        │
│                                                           │
│  Layer 5: Database Security                              │
│  ├─ Parameterized queries (Prisma)                      │
│  ├─ SQL injection prevention                             │
│  └─ Connection encryption                                │
│                                                           │
│  Layer 6: Audit & Compliance                             │
│  ├─ Audit logs                                          │
│  ├─ KYC/AML verification                                │
│  └─ Transaction trails                                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌──────────────────────────────────────────────────────────┐
│                   TECHNOLOGY STACK                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend                                                 │
│  ├─ Next.js 14 (React Framework)                        │
│  ├─ TypeScript (Type Safety)                            │
│  ├─ Tailwind CSS (Styling)                              │
│  ├─ Radix UI (Components)                               │
│  └─ React Query (State Management)                      │
│                                                           │
│  Backend                                                  │
│  ├─ Next.js API Routes (RESTful)                        │
│  ├─ NextAuth.js (Authentication)                        │
│  ├─ Zod (Validation)                                    │
│  └─ bcrypt (Hashing)                                    │
│                                                           │
│  Database                                                 │
│  ├─ PostgreSQL (Relational DB)                          │
│  ├─ Prisma (ORM)                                        │
│  └─ Migrations (Version Control)                        │
│                                                           │
│  External Services (Ready for Integration)               │
│  ├─ PayFast (Payments)                                  │
│  ├─ Resend (Email)                                      │
│  └─ DocuSign (Signatures)                               │
│                                                           │
│  Development Tools                                        │
│  ├─ ESLint (Linting)                                    │
│  ├─ Prettier (Formatting)                               │
│  └─ Git (Version Control)                               │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌──────────────────────────────────────────────────────────┐
│                   PRODUCTION DEPLOYMENT                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────┐           │
│  │            Vercel / AWS / Azure           │           │
│  │  ┌────────────────────────────────┐      │           │
│  │  │    Next.js Application         │      │           │
│  │  │  (Serverless Functions)        │      │           │
│  │  └────────────────────────────────┘      │           │
│  └──────────────────────────────────────────┘           │
│                      ↕                                    │
│  ┌──────────────────────────────────────────┐           │
│  │         Managed PostgreSQL                │           │
│  │  (AWS RDS / Azure Database / Supabase)   │           │
│  │  - Automatic backups                      │           │
│  │  - High availability                      │           │
│  │  - Encryption at rest                     │           │
│  └──────────────────────────────────────────┘           │
│                      ↕                                    │
│  ┌──────────────────────────────────────────┐           │
│  │         CDN & Static Assets               │           │
│  │  (Vercel Edge Network / CloudFront)       │           │
│  └──────────────────────────────────────────┘           │
│                      ↕                                    │
│  ┌──────────────────────────────────────────┐           │
│  │         External Services                 │           │
│  │  - PayFast (Payments)                     │           │
│  │  - Resend (Email)                         │           │
│  │  - DocuSign (E-Signatures)                │           │
│  │  - AWS S3 (Document Storage)              │           │
│  └──────────────────────────────────────────┘           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Performance
- ✅ Compliance readiness
