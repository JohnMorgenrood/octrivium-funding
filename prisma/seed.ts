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
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
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
        name: 'Sarah Thompson',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'VERIFIED',
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
        name: 'Michael Chen',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'VERIFIED',
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
        name: 'Linda Nkosi',
        password: await bcrypt.hash('password123', 12),
        role: 'INVESTOR',
        emailVerified: new Date(),
        kycStatus: 'VERIFIED',
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
      name: 'Green Energy Solutions',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      business: {
        create: {
          registrationNumber: 'REG2020/123456/23',
          industry: 'Renewable Energy',
          description: 'Leading provider of solar panel installations for homes and businesses across Gauteng and Western Cape.',
          website: 'https://greenenergy.co.za',
          employeeCount: 45,
          monthlyRevenue: 850000,
          yearFounded: 2020,
          address: '123 Solar Street, Sandton, Johannesburg',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2196',
          verified: true,
        },
      },
    },
  });

  const coffeeCo = await prisma.user.create({
    data: {
      email: 'business2@email.com',
      name: 'Cape Town Coffee Co.',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      business: {
        create: {
          registrationNumber: 'REG2019/654321/07',
          industry: 'Food & Beverage',
          description: 'Artisan coffee roastery and café chain with 8 locations across Cape Town. Ethically sourced beans from African farmers.',
          website: 'https://ctcoffee.co.za',
          employeeCount: 65,
          monthlyRevenue: 1200000,
          yearFounded: 2019,
          address: '45 Coffee Lane, V&A Waterfront',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          verified: true,
        },
      },
    },
  });

  const techInnovators = await prisma.user.create({
    data: {
      email: 'business3@email.com',
      name: 'Tech Innovators SA',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      business: {
        create: {
          registrationNumber: 'REG2021/789012/23',
          industry: 'Technology',
          description: 'Software development company specializing in fintech solutions for African markets. Award-winning mobile banking apps.',
          website: 'https://techinnovators.co.za',
          employeeCount: 32,
          monthlyRevenue: 950000,
          yearFounded: 2021,
          address: '78 Innovation Drive, Bryanston',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2191',
          verified: true,
        },
      },
    },
  });

  const fashionHub = await prisma.user.create({
    data: {
      email: 'business4@email.com',
      name: 'African Fashion Hub',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      business: {
        create: {
          registrationNumber: 'REG2018/345678/23',
          industry: 'Fashion & Retail',
          description: 'Contemporary African fashion brand with online and retail presence. Celebrating African heritage through modern design.',
          website: 'https://africanfashionhub.co.za',
          employeeCount: 28,
          monthlyRevenue: 680000,
          yearFounded: 2018,
          address: '234 Fashion Avenue, Rosebank',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2196',
          verified: true,
        },
      },
    },
  });

  const logistics = await prisma.user.create({
    data: {
      email: 'business5@email.com',
      name: 'Swift Logistics ZA',
      password: await bcrypt.hash('password123', 12),
      role: 'BUSINESS',
      emailVerified: new Date(),
      kycStatus: 'VERIFIED',
      wallet: {
        create: {
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      },
      business: {
        create: {
          registrationNumber: 'REG2020/567890/23',
          industry: 'Logistics',
          description: 'Last-mile delivery service for e-commerce businesses. Operating in major metros with sustainable electric vehicle fleet.',
          website: 'https://swiftlogistics.co.za',
          employeeCount: 120,
          monthlyRevenue: 1800000,
          yearFounded: 2020,
          address: '567 Logistics Road, Centurion',
          city: 'Centurion',
          province: 'Gauteng',
          postalCode: '0157',
          verified: true,
        },
      },
    },
  });

  const healthTech = await prisma.user.create({
    data: {
      email: 'business6@email.com',
      name: 'HealthTech Connect',
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
      business: {
        create: {
          registrationNumber: 'REG2022/901234/23',
          industry: 'Healthcare Technology',
          description: 'Telemedicine platform connecting patients with doctors. Making healthcare accessible across South Africa.',
          website: 'https://healthtechconnect.co.za',
          employeeCount: 18,
          monthlyRevenue: 420000,
          yearFounded: 2022,
          address: '890 Health Street, Umhlanga',
          city: 'Durban',
          province: 'KwaZulu-Natal',
          postalCode: '4320',
          verified: false,
        },
      },
    },
  });

  // Create Active Deals
  const deal1 = await prisma.deal.create({
    data: {
      businessId: greenEnergy.business!.id,
      title: 'Solar Panel Installation Expansion',
      description: 'Expanding our solar panel installation services to reach more homeowners and businesses. Funding will be used for equipment purchase, training new installers, and marketing campaigns.',
      fundingGoal: 500000,
      fundedAmount: 425000,
      revenueSharePercentage: 5.0,
      repaymentCap: 1.7,
      minimumInvestment: 5000,
      duration: 18,
      status: 'ACTIVE',
      riskLevel: 'MEDIUM',
      useOfFunds: 'Equipment (40%), Staff Training (25%), Marketing (25%), Working Capital (10%)',
      revenueModel: 'Installation fees and maintenance contracts',
      targetMarket: 'Residential and commercial properties in Gauteng',
      competitiveAdvantage: 'Established brand, experienced team, government incentives for solar',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-12-01'),
      expectedReturn: 'R850,000 total (1.7x)',
      projectedMonthlyRevenue: 850000,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      businessId: coffeeCo.business!.id,
      title: 'New Café Locations & Online Store',
      description: 'Opening 3 new café locations in high-traffic areas and launching an e-commerce platform for nationwide coffee bean delivery.',
      fundingGoal: 750000,
      fundedAmount: 580000,
      revenueSharePercentage: 6.0,
      repaymentCap: 1.7,
      minimumInvestment: 10000,
      duration: 24,
      status: 'ACTIVE',
      riskLevel: 'LOW',
      useOfFunds: 'New Locations (60%), E-commerce Platform (25%), Inventory (15%)',
      revenueModel: 'Café sales, online retail, wholesale to restaurants',
      targetMarket: 'Coffee enthusiasts, restaurants, corporate clients',
      competitiveAdvantage: 'Premium quality, ethical sourcing, strong brand loyalty',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2026-04-15'),
      expectedReturn: 'R1,275,000 total (1.7x)',
      projectedMonthlyRevenue: 1200000,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      businessId: techInnovators.business!.id,
      title: 'Fintech App Development & Market Expansion',
      description: 'Developing next-generation mobile banking features and expanding to Kenya and Nigeria. Proven track record with 500K+ users.',
      fundingGoal: 1000000,
      fundedAmount: 340000,
      revenueSharePercentage: 4.5,
      repaymentCap: 1.7,
      minimumInvestment: 25000,
      duration: 18,
      status: 'ACTIVE',
      riskLevel: 'MEDIUM',
      useOfFunds: 'Development (50%), Market Research (15%), Regulatory (20%), Marketing (15%)',
      revenueModel: 'Transaction fees, subscription plans, B2B licensing',
      targetMarket: 'Unbanked and underbanked populations in Africa',
      competitiveAdvantage: 'First-mover advantage, strong tech team, regulatory approvals',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2026-02-01'),
      expectedReturn: 'R1,700,000 total (1.7x)',
      projectedMonthlyRevenue: 950000,
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      businessId: fashionHub.business!.id,
      title: 'Flagship Store & International Shipping',
      description: 'Opening a flagship store in Sandton City and launching international shipping to UK, USA, and Australia. Showcasing African designers globally.',
      fundingGoal: 350000,
      fundedAmount: 285000,
      revenueSharePercentage: 7.0,
      repaymentCap: 1.7,
      minimumInvestment: 5000,
      duration: 15,
      status: 'ACTIVE',
      riskLevel: 'MEDIUM',
      useOfFunds: 'Flagship Store (55%), International Logistics (30%), Marketing (15%)',
      revenueModel: 'Retail sales, online sales, designer collaborations',
      targetMarket: 'Fashion-conscious consumers locally and internationally',
      competitiveAdvantage: 'Unique designs, growing African fashion trend, celebrity endorsements',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-12-01'),
      expectedReturn: 'R595,000 total (1.7x)',
      projectedMonthlyRevenue: 680000,
    },
  });

  const deal5 = await prisma.deal.create({
    data: {
      businessId: logistics.business!.id,
      title: 'Electric Vehicle Fleet Expansion',
      description: 'Purchasing 50 additional electric delivery vehicles to meet growing demand and reduce carbon footprint. Scaling operations to Western Cape.',
      fundingGoal: 2000000,
      fundedAmount: 1250000,
      revenueSharePercentage: 4.0,
      repaymentCap: 1.7,
      minimumInvestment: 50000,
      duration: 24,
      status: 'ACTIVE',
      riskLevel: 'LOW',
      useOfFunds: 'Vehicle Purchase (70%), Charging Infrastructure (15%), Expansion (15%)',
      revenueModel: 'Per-delivery fees, subscription contracts with e-commerce companies',
      targetMarket: 'E-commerce businesses, online retailers, food delivery',
      competitiveAdvantage: 'Sustainable fleet, established contracts, economies of scale',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2026-07-01'),
      expectedReturn: 'R3,400,000 total (1.7x)',
      projectedMonthlyRevenue: 1800000,
    },
  });

  const deal6 = await prisma.deal.create({
    data: {
      businessId: healthTech.business!.id,
      title: 'Telemedicine Platform Scale-Up',
      description: 'Expanding our telemedicine platform to rural areas with mobile clinics and partnerships with provincial health departments.',
      fundingGoal: 600000,
      fundedAmount: 0,
      revenueSharePercentage: 6.5,
      repaymentCap: 1.7,
      minimumInvestment: 10000,
      duration: 20,
      status: 'PENDING',
      riskLevel: 'HIGH',
      useOfFunds: 'Technology (40%), Mobile Clinics (35%), Partnerships (15%), Marketing (10%)',
      revenueModel: 'Consultation fees, government contracts, corporate wellness programs',
      targetMarket: 'Rural communities, corporate clients, provincial health departments',
      competitiveAdvantage: 'Social impact focus, government support, innovative model',
      startDate: null,
      endDate: null,
      expectedReturn: 'R1,020,000 total (1.7x)',
      projectedMonthlyRevenue: 420000,
    },
  });

  console.log('✅ Created users and deals');

  // Create some investments
  await prisma.investment.create({
    data: {
      investorId: investors[0].id,
      dealId: deal1.id,
      amount: 50000,
      sharePercentage: 0.5,
      status: 'ACTIVE',
    },
  });

  await prisma.investment.create({
    data: {
      investorId: investors[1].id,
      dealId: deal1.id,
      amount: 100000,
      sharePercentage: 1.0,
      status: 'ACTIVE',
    },
  });

  await prisma.investment.create({
    data: {
      investorId: investors[2].id,
      dealId: deal2.id,
      amount: 75000,
      sharePercentage: 0.6,
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
