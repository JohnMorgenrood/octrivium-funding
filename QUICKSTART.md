# 🚀 Quick Start Guide - Octrivium Funding

Get your Octrivium Funding platform running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### Step 1: Install Dependencies (2 minutes)

Open PowerShell in the project folder:

```powershell
cd C:\Users\VALERIE\Desktop\octrivium
npm install
```

Wait for all packages to install. You'll see a progress bar.

### Step 2: Configure Database (1 minute)

Create your PostgreSQL database:

```powershell
# If you have PostgreSQL CLI tools installed:
createdb octrivium_funding

# Or use pgAdmin GUI to create a database named "octrivium_funding"
```

### Step 3: Set Up Environment Variables (1 minute)

```powershell
# Copy the example file
Copy-Item .env.example .env

# Open .env in notepad
notepad .env
```

**Minimum required changes in .env:**

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/octrivium_funding?schema=public"

NEXTAUTH_SECRET="run-this-command-to-generate: node -e console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_URL="http://localhost:3000"
```

Replace:
- `your_password` with your PostgreSQL password
- Generate the NEXTAUTH_SECRET by running the command shown

### Step 4: Initialize Database (1 minute)

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

This creates all database tables.

### Step 5: Start the Application!

```powershell
npm run dev
```

🎉 **Done!** Open http://localhost:3000 in your browser.

## First Steps in the App

### Create Your First Admin User

Since you need to review/approve deals, create an admin account first.

**Option A: Using Prisma Studio (GUI)**

```powershell
# Open Prisma Studio in a new terminal
npx prisma studio
```

1. Go to http://localhost:5555
2. Click on "User" table
3. Click "Add record"
4. Fill in:
   - email: admin@octrivium.com
   - password: (hash of 'admin123') - See below for hash
   - firstName: Admin
   - lastName: User
   - role: ADMIN
   - kycStatus: APPROVED
5. Save

**To hash password "admin123":**
```powershell
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 12).then(console.log)"
```

**Option B: Create Seed File (Recommended)**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@octrivium.com' },
    update: {},
    create: {
      email: 'admin@octrivium.com',
      password: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      kycStatus: 'APPROVED',
    },
  });

  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  // Test Investor
  const investor = await prisma.user.upsert({
    where: { email: 'investor@test.com' },
    update: {},
    create: {
      email: 'investor@test.com',
      password: await bcrypt.hash('investor123', 12),
      firstName: 'Test',
      lastName: 'Investor',
      role: 'INVESTOR',
      kycStatus: 'APPROVED',
    },
  });

  await prisma.wallet.upsert({
    where: { userId: investor.id },
    update: {},
    create: {
      userId: investor.id,
      balance: 10000,
      availableBalance: 10000,
    },
  });

  // Test Business
  const business = await prisma.user.upsert({
    where: { email: 'business@test.com' },
    update: {},
    create: {
      email: 'business@test.com',
      password: await bcrypt.hash('business123', 12),
      firstName: 'Test',
      lastName: 'Business',
      role: 'BUSINESS',
      kycStatus: 'APPROVED',
    },
  });

  await prisma.wallet.upsert({
    where: { userId: business.id },
    update: {},
    create: { userId: business.id },
  });

  console.log('✅ Seed data created');
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

Then run:

```powershell
npm install -D ts-node @types/node
npx prisma db seed
```

### Test Accounts

After seeding, you can login with:

**Admin Account:**
- Email: admin@octrivium.com
- Password: admin123

**Investor Account:**
- Email: investor@test.com
- Password: investor123
- Wallet Balance: R10,000

**Business Account:**
- Email: business@test.com
- Password: business123

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Run `npm install` again

### Issue: Database connection failed

**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Try: `npx prisma db push`

### Issue: Port 3000 already in use

**Solution:**
```powershell
$env:PORT=3001; npm run dev
```

### Issue: Prisma Client errors

**Solution:**
```powershell
npx prisma generate
```

## Development Workflow

### Daily Development

```powershell
# Start dev server
npm run dev

# In another terminal - watch database
npx prisma studio
```

### Making Database Changes

1. Edit `prisma/schema.prisma`
2. Run migration:
```powershell
npx prisma migrate dev --name your_change_name
```

### View Database

```powershell
npx prisma studio
```

## Project Structure Quick Reference

```
octrivium/
├── app/                    # Pages and API routes
│   ├── api/               # Backend API
│   ├── dashboard/         # Protected pages
│   ├── deals/             # Public deal pages
│   └── page.tsx           # Homepage
├── components/            # Reusable components
├── lib/                   # Utilities
├── prisma/               # Database
└── .env                  # Your config (don't commit!)
```

## Next Actions

After getting it running:

1. ✅ **Explore the homepage** at http://localhost:3000
2. ✅ **Register a new account** (Investor or Business)
3. ✅ **Login and explore the dashboard**
4. ✅ **Check out the wallet page**
5. ✅ **View Prisma Studio** to see database changes

## Development Tips

### Hot Reload
Changes to `.tsx` and `.ts` files auto-reload the browser.

### Database GUI
Keep Prisma Studio open in another tab to watch data changes live.

### Console Logs
Watch the terminal where `npm run dev` is running for API logs.

### TypeScript Errors
Run `npm run lint` to check for TypeScript issues.

## Getting Help

- **Setup Issues:** Check SETUP.md for detailed instructions
- **Feature Questions:** See PROJECT_OVERVIEW.md
- **Documentation:** See README.md

## What to Build Next

1. **Create a test deal** (as business user)
2. **Invest in a deal** (as investor user)
3. **Approve deals** (as admin user)
4. **Add KYC upload** functionality
5. **Build revenue reporting** form

---

**🎊 Congratulations! Your platform is ready for development!**

Happy coding! 🚀
