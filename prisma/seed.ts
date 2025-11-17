import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.investment.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.business.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@octrivium.co.za',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
    },
  });

  // Create Investor Users
  const investors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'investor1@email.com',
        firstName: 'Sarah',
        lastName: 'Thompson',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'APPROVED',
        wallet: {
          create: {
            balance: 250000,
            availableBalance: 250000,
            lockedBalance: 0,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'investor2@email.com',
        firstName: 'Michael',
        lastName: 'Chen',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'APPROVED',
        wallet: {
          create: {
            balance: 500000,
            availableBalance: 500000,
            lockedBalance: 0,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'investor3@email.com',
        firstName: 'Linda',
        lastName: 'Nkosi',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'APPROVED',
        wallet: {
          create: {
            balance: 150000,
            availableBalance: 150000,
            lockedBalance: 0,
          },
        },
      },
    }),
  ]);

  // Create Business Users with Deals
  const greenEnergy = await prisma.user.create({
    data: {
      email: 'business1@email.com',
      firstName: 'Green Energy',
      lastName: 'Solutions',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2020/123456/23',
          tradingName: 'GreenEnergy Solutions',
          legalName: 'GreenEnergy Solutions (Pty) Ltd',
          industry: 'Renewable Energy',
          description: 'Leading provider of solar panel installations for homes and businesses across Gauteng and Western Cape.',
          website: 'https://greenenergy.co.za',
          address: '123 Solar Street, Sandton, Johannesburg',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2196',
          verified: true,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  const coffeeCo = await prisma.user.create({
    data: {
      email: 'business2@email.com',
      firstName: 'Cape Town',
      lastName: 'Coffee Co.',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2019/654321/07',
          tradingName: 'Cape Town Coffee Co',
          legalName: 'Cape Town Coffee Company (Pty) Ltd',
          industry: 'Food & Beverage',
          description: 'Artisan coffee roastery and café chain with 8 locations across Cape Town. Ethically sourced beans from African farmers.',
          website: 'https://ctcoffee.co.za',
          address: '45 Coffee Lane, V&A Waterfront',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          verified: true,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  const techInnovators = await prisma.user.create({
    data: {
      email: 'business3@email.com',
      firstName: 'Tech Innovators',
      lastName: 'SA',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2021/789012/23',
          tradingName: 'Tech Innovators SA',
          legalName: 'Tech Innovators South Africa (Pty) Ltd',
          industry: 'Technology',
          description: 'Software development company specializing in fintech solutions for African markets. Award-winning mobile banking apps.',
          website: 'https://techinnovators.co.za',
          address: '78 Innovation Drive, Bryanston',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2191',
          verified: true,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  const fashionHub = await prisma.user.create({
    data: {
      email: 'business4@email.com',
      firstName: 'African Fashion',
      lastName: 'Hub',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2018/345678/23',
          tradingName: 'African Fashion Hub',
          legalName: 'African Fashion Hub (Pty) Ltd',
          industry: 'Fashion & Retail',
          description: 'Contemporary African fashion brand with online and retail presence. Celebrating African heritage through modern design.',
          website: 'https://africanfashionhub.co.za',
          address: '234 Fashion Avenue, Rosebank',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2196',
          verified: true,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  const logistics = await prisma.user.create({
    data: {
      email: 'business5@email.com',
      firstName: 'Swift Logistics',
      lastName: 'ZA',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'APPROVED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2020/567890/23',
          tradingName: 'Swift Logistics ZA',
          legalName: 'Swift Logistics South Africa (Pty) Ltd',
          industry: 'Logistics',
          description: 'Last-mile delivery service for e-commerce businesses. Operating in major metros with sustainable electric vehicle fleet.',
          website: 'https://swiftlogistics.co.za',
          address: '567 Logistics Road, Centurion',
          city: 'Centurion',
          province: 'Gauteng',
          postalCode: '0157',
          verified: true,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  const healthTech = await prisma.user.create({
    data: {
      email: 'business6@email.com',
      firstName: 'HealthTech',
      lastName: 'Connect',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'PENDING',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      businesses: {
        create: [{
          registrationNumber: 'REG2022/901234/23',
          tradingName: 'HealthTech Connect',
          legalName: 'HealthTech Connect (Pty) Ltd',
          industry: 'Healthcare Technology',
          description: 'Telemedicine platform connecting patients with doctors. Making healthcare accessible across South Africa.',
          website: 'https://healthtechconnect.co.za',
          address: '890 Health Street, Umhlanga',
          city: 'Durban',
          province: 'KwaZulu-Natal',
          postalCode: '4320',
          verified: false,
        }],
      },
    },
    include: {
      businesses: true,
    },
  });

  // Create Active Deals
  const deal1 = await prisma.deal.create({
    data: {
      businessId: greenEnergy.businesses[0].id,
      title: 'Solar Panel Installation Expansion',
      description: 'Expanding our solar panel installation services to reach more homeowners and businesses. Funding will be used for equipment purchase, training new installers, and marketing campaigns.',
      fundingGoal: 500000,
      currentFunding: 425000,
      revenueSharePercentage: 5.0,
      repaymentCap: 1.6,
      minInvestment: 5000,
      status: 'ACTIVE',
      riskRating: 5,
      fundingDeadline: new Date('2025-12-01'),
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-12-01'),
      projectedMonthlyRevenue: 850000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 5% of monthly revenue up to 1.6x return. Minimum investment R5,000. 18-month investment period.',
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      businessId: coffeeCo.businesses[0].id,
      title: 'New Café Locations & Online Store',
      description: 'Opening 3 new café locations in high-traffic areas and launching an e-commerce platform for nationwide coffee bean delivery.',
      fundingGoal: 750000,
      currentFunding: 580000,
      revenueSharePercentage: 6.0,
      repaymentCap: 1.7,
      minInvestment: 10000,
      status: 'ACTIVE',
      riskRating: 3,
      fundingDeadline: new Date('2025-06-15'),
      startDate: new Date('2024-04-15'),
      endDate: new Date('2026-04-15'),
      projectedMonthlyRevenue: 1200000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 6% of monthly revenue up to 1.7x return. Minimum investment R10,000. 24-month investment period.',
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      businessId: techInnovators.businesses[0].id,
      title: 'Fintech App Development & Market Expansion',
      description: 'Developing next-generation mobile banking features and expanding to Kenya and Nigeria. Proven track record with 500K+ users.',
      fundingGoal: 1000000,
      currentFunding: 340000,
      revenueSharePercentage: 4.5,
      repaymentCap: 1.8,
      minInvestment: 25000,
      status: 'ACTIVE',
      riskRating: 5,
      fundingDeadline: new Date('2025-08-01'),
      startDate: new Date('2024-08-01'),
      endDate: new Date('2026-02-01'),
      projectedMonthlyRevenue: 950000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 4.5% of monthly revenue up to 1.8x return. Minimum investment R25,000. 18-month investment period.',
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      businessId: fashionHub.businesses[0].id,
      title: 'Flagship Store & International Shipping',
      description: 'Opening a flagship store in Sandton City and launching international shipping to UK, USA, and Australia. Showcasing African designers globally.',
      fundingGoal: 350000,
      currentFunding: 285000,
      revenueSharePercentage: 7.0,
      repaymentCap: 1.7,
      minInvestment: 5000,
      status: 'ACTIVE',
      riskRating: 5,
      fundingDeadline: new Date('2025-03-01'),
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-12-01'),
      projectedMonthlyRevenue: 680000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 7% of monthly revenue up to 1.7x return. Minimum investment R5,000. 15-month investment period.',
    },
  });

  const deal5 = await prisma.deal.create({
    data: {
      businessId: logistics.businesses[0].id,
      title: 'Electric Vehicle Fleet Expansion',
      description: 'Purchasing 50 additional electric delivery vehicles to meet growing demand and reduce carbon footprint. Scaling operations to Western Cape.',
      fundingGoal: 2000000,
      currentFunding: 1250000,
      revenueSharePercentage: 4.0,
      repaymentCap: 1.7,
      minInvestment: 50000,
      status: 'ACTIVE',
      riskRating: 3,
      fundingDeadline: new Date('2025-10-01'),
      startDate: new Date('2024-07-01'),
      endDate: new Date('2026-07-01'),
      projectedMonthlyRevenue: 1800000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 4% of monthly revenue up to 1.7x return. Minimum investment R50,000. 24-month investment period.',
    },
  });

  const deal6 = await prisma.deal.create({
    data: {
      businessId: healthTech.businesses[0].id,
      title: 'Telemedicine Platform Scale-Up',
      description: 'Expanding our telemedicine platform to rural areas with mobile clinics and partnerships with provincial health departments.',
      fundingGoal: 600000,
      currentFunding: 0,
      revenueSharePercentage: 6.5,
      repaymentCap: 1.7,
      minInvestment: 10000,
      status: 'PENDING_APPROVAL',
      riskRating: 7,
      fundingDeadline: new Date('2026-06-01'),
      startDate: null,
      endDate: null,
      projectedMonthlyRevenue: 420000,
      termsAndConditions: 'Standard revenue share agreement. Investors receive 6.5% of monthly revenue up to 1.7x return. Minimum investment R10,000. 20-month investment period. Subject to regulatory approval.',
    },
  });

  console.log('✅ Created users and deals');

  // Create some investments
  await prisma.investment.create({
    data: {
      userId: investors[0].id,
      dealId: deal1.id,
      amount: 50000,
      sharePercentage: 0.5,
      expectedReturn: 50000 * 1.7, // amount * repaymentCap
      status: 'ACTIVE',
    },
  });

  await prisma.investment.create({
    data: {
      userId: investors[1].id,
      dealId: deal1.id,
      amount: 100000,
      sharePercentage: 1.0,
      expectedReturn: 100000 * 1.7,
      status: 'ACTIVE',
    },
  });

  await prisma.investment.create({
    data: {
      userId: investors[2].id,
      dealId: deal2.id,
      amount: 75000,
      sharePercentage: 0.6,
      expectedReturn: 75000 * 1.7,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created investments');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Login credentials:');
  console.log('Admin: admin@octrivium.co.za / admin123');
  console.log('Investor: investor1@email.com / password123');
  console.log('Business: business1@email.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });











