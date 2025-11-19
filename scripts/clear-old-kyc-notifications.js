const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearOldKYCNotifications() {
  try {
    // Delete old KYC notifications for users who now have NOT_SUBMITTED status
    const result = await prisma.notification.deleteMany({
      where: {
        category: 'KYC',
        user: {
          kycStatus: 'NOT_SUBMITTED',
          kycDocuments: {
            none: {}
          }
        }
      }
    });

    console.log(`✅ Cleared ${result.count} old KYC notifications`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearOldKYCNotifications();
