# Octrivium Funding Platform

A comprehensive revenue-based crowdfunding platform for South African small businesses.

## Features

- **User Authentication**: Secure login/registration with role-based access (Investor, Business, Admin)
- **Business Onboarding**: Multi-step verification with KYC/AML compliance
- **Deal Management**: Create and manage revenue-share funding campaigns
- **Investment System**: Browse deals, invest, and track portfolio performance
- **Virtual Wallet**: Integrated wallet system with transaction history
- **Revenue Distribution**: Automated monthly payout calculations
- **Admin Panel**: Complete oversight and approval workflows
- **Real-time Updates**: Live funding progress and revenue tracking
- **Document Management**: Secure upload and verification of business documents
- **Notifications**: Email and in-app notifications for key events

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query
- **Payment Gateway**: PayFast (South African)
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```powershell
npm install
```

2. Set up your environment variables:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your actual credentials:
- Database connection string
- NextAuth secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- Email service API key (Resend)
- Payment gateway credentials (PayFast)

3. Set up the database:

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

4. (Optional) Seed the database with sample data:

```powershell
npx prisma db seed
```

5. Run the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
octrivium/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── deals/                # Deal browsing and details
│   ├── login/                # Authentication pages
│   └── register/
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   └── providers.tsx         # Context providers
├── lib/                      # Utility functions
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Prisma client
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions
├── prisma/                   # Database schema and migrations
│   └── schema.prisma
└── public/                   # Static assets
```

## Key Workflows

### For Investors

1. Register and complete KYC verification
2. Browse available deals with risk ratings
3. Invest amounts starting from R100
4. Track portfolio and monthly payouts
5. Receive automated revenue-share distributions

### For Businesses

1. Register and submit verification documents
2. Create funding deal with terms
3. Wait for admin approval
4. Receive funding when goal is met
5. Report monthly revenue
6. Automatic distribution to investors

### For Admins

1. Review business applications
2. Verify KYC/AML documents
3. Approve or reject deals
4. Monitor platform activity
5. Manage compliance

## Revenue-Share Model

- Business sets funding goal and revenue-share percentage (e.g., 5%)
- Investors fund the deal proportionally
- Business reports monthly revenue
- Platform calculates investor payouts: `Monthly Revenue × Share % × Investor %`
- Payouts continue until repayment cap is reached (typically 1.7× investment)

## Security

- Passwords hashed with bcrypt
- JWT-based session management
- Role-based access control
- SQL injection protection via Prisma
- HTTPS required in production
- Audit logging for all transactions

## Compliance

- KYC (Know Your Customer) verification
- AML (Anti-Money Laundering) checks
- Document verification workflow
- Transaction audit trails
- POPIA compliance ready

## Payment Integration

The platform is configured for PayFast, South Africa's leading payment gateway:
- Deposits via card or EFT
- Automated payout distribution
- Webhook handling for transaction updates
- Sandbox mode for testing

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for session encryption
- `RESEND_API_KEY`: Email service API key
- `PAYFAST_*`: Payment gateway credentials

## Development

```powershell
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the server: `npm start`

## License

Proprietary - Octrivium Funding Platform

## Support

For support and inquiries, contact: support@octriviumfunding.com
