# 🎉 Octrivium Funding - Quick Setup

Your modern crowdfunding platform is ready! Here's how to get started:

## ✅ What's Been Set Up

- ✨ **Modern UI**: Gradient buttons, animated cards, responsive design
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎨 **6 Fake Deals**: Realistic South African businesses ready for testing
- 👥 **Demo Users**: Investors, businesses, and admin accounts
- 🔐 **Authentication**: Full NextAuth.js integration

## 🚀 Getting Started

### 1. Database Setup (Optional - For Full Functionality)

If you want to test with real data:

```bash
# Update your .env file with a database URL (PostgreSQL)
DATABASE_URL="your-database-url-here"

# Push the schema to your database
npm run db:push

# Seed with fake data
npm run db:seed
```

### 2. Start the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

## 🎭 Demo Login Credentials

Once you've seeded the database:

### Admin Account
- **Email**: admin@octrivium.co.za
- **Password**: admin123

### Investor Account
- **Email**: investor1@email.com
- **Password**: password123

### Business Account
- **Email**: business1@email.com
- **Password**: password123

## 🌟 Features to Explore

### Homepage
- **Modern Hero**: Gradient text, animated badge, stats section
- **6 Feature Cards**: With hover effects and gradient icons
- **Dark Mode Toggle**: Top right corner
- **Fully Responsive**: Try resizing your browser!

### For Investors
- Browse 6 active deals (when database is set up)
- Portfolio analytics dashboard
- Investment tracking
- Wallet management

### For Businesses
- Revenue reporting page
- Investor management dashboard
- Deal creation (structure in place)

### For Admins
- Deal approval system
- KYC verification interface
- Platform monitoring

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

All pages automatically adjust!

## 🌓 Dark Mode

Click the sun/moon icon in the top right navigation to toggle between light and dark themes. Theme preference is saved automatically.

## 📦 Fake Deals Created

When you run `npm run db:seed`, you'll get:

1. **Green Energy Solutions** - R500K solar panel expansion
2. **Cape Town Coffee Co.** - R750K new cafés & online store
3. **Tech Innovators SA** - R1M fintech app development
4. **African Fashion Hub** - R350K flagship store & shipping
5. **Swift Logistics ZA** - R2M electric vehicle fleet
6. **HealthTech Connect** - R600K telemedicine scale-up

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database
npm run db:seed      # Seed database with fake data
npm run db:studio    # Open Prisma Studio (database GUI)
```

## 🎨 Color Scheme

- **Primary**: Blue (600) to Indigo (600)
- **Success**: Emerald/Green
- **Warning**: Orange/Amber
- **Error**: Red/Rose
- **Info**: Cyan/Blue

## 📝 Next Steps

1. Set up a PostgreSQL database (Neon, Supabase, or local)
2. Update `.env` with your DATABASE_URL
3. Run `npm run db:push` and `npm run db:seed`
4. Explore all the pages and features
5. Customize the branding and content to your needs

## 🐛 Troubleshooting

### Dark mode not working?
- Make sure `next-themes` is installed: `npm install next-themes`
- Check that your browser supports `localStorage`

### Database connection errors?
- Verify your DATABASE_URL in `.env`
- Make sure your database is running
- Try `npm run db:push` to create tables

### Build errors?
- Clear `.next` folder: `rm -rf .next` (or delete manually)
- Reinstall dependencies: `npm install --legacy-peer-deps`

---

**Built with ❤️ using Next.js 14, Prisma, NextAuth.js, and Tailwind CSS**
