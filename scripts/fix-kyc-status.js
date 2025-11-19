const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixKYCStatus() {
  try {
    // Find users with PENDING status who have no KYC documents
    const usersWithNoDocuments = await prisma.user.findMany({
      where: {
        kycStatus: 'PENDING',
        kycDocuments: {
          none: {}
        }
      },
      select: {
        id: true,
        email: true,
        kycStatus: true,
      }
    });

    console.log(`Found ${usersWithNoDocuments.length} users with PENDING status but no documents`);

    if (usersWithNoDocuments.length > 0) {
      // Update them to NOT_SUBMITTED
      const result = await prisma.user.updateMany({
        where: {
          id: {
            in: usersWithNoDocuments.map(u => u.id)
          }
        },
        data: {
          kycStatus: 'NOT_SUBMITTED'
        }
      });

      console.log(`✅ Updated ${result.count} users to NOT_SUBMITTED status`);
      console.log('\nUpdated users:');
      usersWithNoDocuments.forEach(u => {
        console.log(`  - ${u.email}`);
      });
    } else {
      console.log('✅ All users have correct KYC status');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixKYCStatus();
