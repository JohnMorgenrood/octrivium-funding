import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox';

    let emails: any[] = [];

    if (folder === 'sent') {
      emails = await prisma.email.findMany({
        where: {
          senderId: session.user.id,
          isSent: true,
          isDeleted: false,
        },
        orderBy: { sentAt: 'desc' },
      });
    } else if (folder === 'starred') {
      emails = await prisma.email.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
          isStarred: true,
          isDeleted: false,
        },
        orderBy: { sentAt: 'desc' },
      });
    } else if (folder === 'trash') {
      emails = await prisma.email.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
          isDeleted: true,
        },
        orderBy: { sentAt: 'desc' },
      });
    } else if (folder === 'drafts') {
      // Drafts implementation can be added later
      emails = [];
    } else {
      // Inbox - received emails
      emails = await prisma.email.findMany({
        where: {
          receiverId: session.user.id,
          isSent: false,
          isDeleted: false,
          folder: 'inbox',
        },
        orderBy: { receivedAt: 'desc' },
      });
    }

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
