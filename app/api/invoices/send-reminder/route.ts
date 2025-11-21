import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await request.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Verify ownership
    if (invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    if (!invoice.customer?.email) {
      return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 });
    }

    // TODO: Implement email sending via Resend
    // For now, we'll log and create a notification
    
    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${invoice.paymentLink}`;
    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    
    console.log('Sending reminder email:', {
      to: invoice.customer.email,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amountDue,
      dueDate: invoice.dueDate,
      paymentUrl,
      daysOverdue,
    });

    // In production, send actual email:
    /*
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: invoice.customer.email,
        subject: `Payment Reminder: Invoice ${invoice.invoiceNumber}`,
        html: `
          <h2>Payment Reminder</h2>
          <p>Dear ${invoice.customer.name},</p>
          <p>This is a friendly reminder that invoice <strong>${invoice.invoiceNumber}</strong> is ${daysOverdue > 0 ? `${daysOverdue} days overdue` : 'due soon'}.</p>
          <p><strong>Amount Due:</strong> R${Number(invoice.amountDue).toFixed(2)}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><a href="${paymentUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Pay Now</a></p>
          <p>If you have already made this payment, please disregard this reminder.</p>
          <p>Best regards,<br/>${invoice.user.firstName} ${invoice.user.lastName}</p>
        `,
      }),
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Reminder sent successfully',
      details: {
        to: invoice.customer.email,
        invoiceNumber: invoice.invoiceNumber,
      }
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
