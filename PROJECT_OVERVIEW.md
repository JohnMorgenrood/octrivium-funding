# Octrivium Funding - Project Overview

## What Has Been Built

This is a comprehensive Next.js 14 application for a revenue-based crowdfunding platform specifically designed for South African small businesses. The platform connects businesses seeking capital with everyday investors through transparent revenue-sharing agreements.

## ✅ Completed Features

### 1. **Core Infrastructure**
- ✅ Next.js 14 with App Router and TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ Tailwind CSS styling with Radix UI components
- ✅ Complete database schema with 14+ tables
- ✅ Comprehensive type definitions
- ✅ Utility functions for formatting and calculations

### 2. **Authentication System**
- ✅ NextAuth.js integration with credentials provider
- ✅ Role-based access control (INVESTOR, BUSINESS, ADMIN)
- ✅ Protected routes with middleware
- ✅ Secure password hashing with bcrypt
- ✅ JWT session management
- ✅ Registration and login pages

### 3. **User Interface**
- ✅ Modern, responsive homepage with hero section
- ✅ Professional navigation and footer
- ✅ Dashboard layout with role-specific sidebars
- ✅ Dark mode support
- ✅ Mobile-responsive design

### 4. **Deal Management**
- ✅ Deal browsing page with filtering
- ✅ Deal detail page with full business information
- ✅ Investment form with calculations
- ✅ Progress tracking and funding status
- ✅ Risk rating display
- ✅ Time remaining countdown

### 5. **Investment System**
- ✅ Investment API with validation
- ✅ Wallet balance checking
- ✅ Share percentage calculations
- ✅ Expected return projections
- ✅ Investment limits enforcement
- ✅ Transaction creation

### 6. **Wallet System**
- ✅ Virtual wallet for each user
- ✅ Balance tracking (total, available, locked)
- ✅ Deposit functionality (demo mode)
- ✅ Withdrawal functionality (demo mode)
- ✅ Transaction history
- ✅ Transaction API endpoints

### 7. **Dashboard**
- ✅ Investor dashboard with portfolio stats
- ✅ Business dashboard with funding metrics
- ✅ Real-time statistics
- ✅ Activity feed placeholder
- ✅ KYC status banner

### 8. **Database Schema**
- ✅ Users with role-based access
- ✅ Businesses with verification
- ✅ Deals with full lifecycle
- ✅ Investments with tracking
- ✅ Wallets and transactions
- ✅ Revenue reports and payouts
- ✅ KYC documents
- ✅ Notifications
- ✅ Audit logs

## 🚧 Features to Implement

### High Priority

1. **Business Onboarding**
   - Multi-step business registration form
   - Document upload functionality
   - Business verification workflow

2. **KYC/AML Verification**
   - Document upload interface
   - Admin verification dashboard
   - Status update notifications

3. **Admin Panel**
   - Deal approval workflow
   - User management
   - Platform analytics
   - Revenue verification

4. **Revenue Reporting**
   - Monthly revenue submission form
   - Supporting document upload
   - Revenue verification process
   - Automated payout calculations

5. **Payout System**
   - Monthly payout distribution
   - Investor payout tracking
   - Payment processing integration

### Medium Priority

6. **Payment Gateway Integration**
   - PayFast integration for deposits
   - Bank account verification
   - Automated withdrawals
   - Payment webhooks

7. **Notification System**
   - Email notifications (Resend)
   - In-app notification center
   - SMS notifications (optional)
   - Notification preferences

8. **Document Generation**
   - Investment agreement PDF
   - Terms and conditions
   - E-signature integration
   - Document storage

9. **Advanced Features**
   - Deal search and filtering
   - Investment portfolio analytics
   - Revenue charts and graphs
   - Business performance metrics

### Lower Priority

10. **Additional Features**
    - User profile management
    - Two-factor authentication
    - API rate limiting
    - Advanced audit logging
    - Platform fees configuration
    - Referral system

## 📁 Project Structure

```
octrivium/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── register/        # User registration
│   │   ├── deals/                # Deal endpoints
│   │   │   └── [id]/            # Single deal
│   │   ├── investments/          # Investment endpoints
│   │   └── wallet/               # Wallet endpoints
│   │       ├── deposit/         
│   │       ├── withdraw/        
│   │       └── transactions/    
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard home
│   │   └── wallet/              # Wallet management
│   ├── deals/                    # Deal pages
│   │   ├── [id]/                # Deal detail
│   │   └── page.tsx             # Browse deals
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React Components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   └── textarea.tsx
│   └── providers.tsx            # Context providers
├── lib/                         # Utilities and config
│   ├── auth.ts                  # NextAuth config
│   ├── prisma.ts                # Prisma client
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Helper functions
├── prisma/                      # Database
│   └── schema.prisma            # Database schema
├── types/                       # Type definitions
│   └── next-auth.d.ts          # NextAuth types
├── middleware.ts                # Route protection
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.mjs             # Next.js config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore
├── README.md                   # Main documentation
└── SETUP.md                    # Setup instructions
```

## 🔑 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **State**: React Query
- **Validation**: Zod
- **Email**: Resend (configured)
- **Payments**: PayFast (ready for integration)

## 🎯 Business Model

### Revenue-Share Structure

1. **Business** needs R100,000 funding
2. **Business** agrees to share 5% of monthly revenue
3. **Investors** collectively fund the R100,000
4. **Each month**, business reports revenue
5. **Platform** calculates 5% of that revenue
6. **Investors** receive payouts proportional to their investment
7. **Payments** continue until 1.7× (R170,000) is repaid

### Example
- Investor contributes R1,000 (1% of R100k)
- Business earns R50,000 in month 1
- Revenue share: R50k × 5% = R2,500
- Investor receives: R2,500 × 1% = R25
- Expected total return: R1,700 (70% profit)

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ SQL injection protection (Prisma)
- ✅ Input validation (Zod)
- ✅ XSS protection
- ✅ CSRF protection (Next.js built-in)

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env`
3. **Configure database**: Update `DATABASE_URL`
4. **Run migrations**: `npx prisma migrate dev`
5. **Start dev server**: `npm run dev`

See `SETUP.md` for detailed instructions.

## 📊 Database Models

### Core Models
- **User**: Authentication and profile
- **Wallet**: Virtual wallet for each user
- **Transaction**: All financial transactions
- **Business**: Business profiles
- **Deal**: Funding campaigns
- **Investment**: User investments in deals
- **RevenueReport**: Monthly revenue submissions
- **RevenuePayout**: Monthly payout distributions
- **InvestorPayout**: Individual investor payouts
- **KYCDocument**: Verification documents
- **BusinessDocument**: Business verification docs
- **Notification**: User notifications
- **AuditLog**: Platform audit trail

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green
- **Warning**: Yellow/Orange
- **Error**: Red
- **Muted**: Gray

### Components
- Buttons (primary, secondary, outline, ghost)
- Cards (with header, content, footer)
- Inputs and textareas
- Progress bars
- Labels
- Responsive navigation

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Deals
- `GET /api/deals/[id]` - Get deal details

### Investments
- `POST /api/investments` - Create investment
- `GET /api/investments` - Get user investments

### Wallet
- `GET /api/wallet` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds

## 🔄 User Flows

### Investor Journey
1. Register as investor
2. Complete KYC verification
3. Deposit funds to wallet
4. Browse available deals
5. Review business details and terms
6. Make investment
7. Track investment performance
8. Receive monthly payouts
9. Withdraw earnings

### Business Journey
1. Register as business
2. Complete business profile
3. Upload verification documents
4. Create funding deal
5. Wait for admin approval
6. Deal goes live
7. Receive funding when goal met
8. Submit monthly revenue reports
9. Platform distributes payouts to investors

### Admin Journey
1. Login as admin
2. Review pending deals
3. Verify business documents
4. Approve or reject deals
5. Monitor platform activity
6. Verify revenue reports
7. Manage user issues

## 📈 Next Steps

To complete the platform:

1. **Implement business onboarding** (multi-step form)
2. **Build admin approval workflow** (deal and KYC verification)
3. **Add file upload** (for documents)
4. **Create revenue reporting** (monthly submission form)
5. **Build payout engine** (automated distribution)
6. **Integrate PayFast** (real payments)
7. **Set up email notifications** (Resend)
8. **Add charts and analytics** (Recharts)
9. **Implement e-signatures** (DocuSign or similar)
10. **Add comprehensive testing** (Jest, Cypress)

## 🤝 Contributing

This is a production-ready foundation. All the core infrastructure is in place:
- Authentication ✅
- Database ✅
- UI Components ✅
- Basic workflows ✅

The remaining work involves building on this foundation to add:
- Business logic
- Admin tools
- Payment integration
- Advanced features

## 📄 License

Proprietary - Octrivium Funding Platform

---

**Built with ❤️ for South African entrepreneurs**
