# Octrivium Funding - Setup Instructions

## Quick Start Guide

Follow these steps to get the Octrivium Funding platform running on your local machine.

### 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including:
- Next.js 14 with React 18
- TypeScript
- Prisma ORM
- NextAuth.js for authentication
- Tailwind CSS for styling
- Radix UI components
- React Query for data fetching
- And many more dependencies

### 2. Set Up Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Now edit the `.env` file and fill in your actual values:

#### Database Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/octrivium_funding?schema=public"
```

Replace `username`, `password`, `localhost`, and `5432` with your PostgreSQL credentials.

#### NextAuth Configuration
Generate a secure secret:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add it to your `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### Email Service (Resend)
Sign up at https://resend.com and get your API key:
```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@octriviumfunding.com"
```

#### Payment Gateway (PayFast)
Sign up at https://www.payfast.co.za and get your credentials:
```env
PAYFAST_MERCHANT_ID="your-merchant-id"
PAYFAST_MERCHANT_KEY="your-merchant-key"
PAYFAST_PASSPHRASE="your-passphrase"
PAYFAST_MODE="sandbox"
```

### 3. Set Up PostgreSQL Database

Make sure PostgreSQL is installed and running on your machine.

Create a new database:
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE octrivium_funding;

# Exit
\q
```

### 4. Run Database Migrations

Generate Prisma client and create database tables:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

This will:
- Generate the Prisma Client based on your schema
- Create all database tables
- Set up relationships and indexes

### 5. (Optional) Seed the Database

You can create a seed script to add sample data. Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@octrivium.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      kycStatus: 'APPROVED',
    },
  });

  await prisma.wallet.create({
    data: { userId: admin.id },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run the seed:
```powershell
npm install -D ts-node
npx prisma db seed
```

### 6. Run the Development Server

Start the Next.js development server:

```powershell
npm run dev
```

Open your browser and navigate to:
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

### 7. Test the Application

1. **Create an Investor Account**:
   - Go to http://localhost:3000/register?role=investor
   - Fill in the registration form
   - Login with your credentials

2. **Create a Business Account**:
   - Go to http://localhost:3000/register?role=business
   - Fill in the registration form
   - Login with your credentials

3. **Login as Admin** (if you seeded the database):
   - Email: admin@octrivium.com
   - Password: admin123

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Make sure PostgreSQL is running:
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
```

2. Verify your `DATABASE_URL` in `.env` is correct

3. Test the connection:
```powershell
npx prisma db pull
```

### Port Already in Use

If port 3000 is already in use:

```powershell
# Run on a different port
$env:PORT=3001; npm run dev
```

### TypeScript Errors

The TypeScript errors you see are expected until you run `npm install`. After installing dependencies, most errors should resolve.

To check for remaining errors:
```powershell
npm run lint
```

### Prisma Client Not Generated

If you get "Cannot find module '@prisma/client'" errors:

```powershell
npx prisma generate
```

## Development Tools

### Prisma Studio (Database GUI)

View and edit your database:
```powershell
npx prisma studio
```

This opens a web interface at http://localhost:5555

### View Logs

Check the terminal where you ran `npm run dev` for:
- API request logs
- Database queries (in development mode)
- Error messages

## Next Steps

After setting up:

1. **Complete KYC Flow**: Implement document upload and verification
2. **Wallet System**: Add deposit/withdrawal functionality
3. **Payment Integration**: Connect PayFast payment gateway
4. **Email Notifications**: Set up Resend email templates
5. **Admin Panel**: Build approval and monitoring dashboards
6. **Revenue Reporting**: Create business revenue submission forms
7. **Payout System**: Implement automated monthly distributions

## Additional Configuration

### Tailwind CSS Animations

If animations aren't working, install:
```powershell
npm install -D tailwindcss-animate
```

### File Uploads

For document uploads, create the uploads directory:
```powershell
New-Item -ItemType Directory -Force -Path public/uploads
```

### Production Build

To test a production build locally:
```powershell
npm run build
npm start
```

## Support

If you encounter issues:
1. Check the console for error messages
2. Review the README.md for detailed documentation
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL is running and accessible
5. Check that all dependencies are installed

## Environment Checklist

Before starting development, ensure:
- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed and running
- ✅ All dependencies installed (`npm install`)
- ✅ Environment variables configured (`.env`)
- ✅ Database migrated (`npx prisma migrate dev`)
- ✅ Prisma client generated (`npx prisma generate`)

Now you're ready to build on the Octrivium Funding platform! 🚀
