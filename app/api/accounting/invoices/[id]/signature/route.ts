import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { invoiceId, signatureData, signerName } = await request.json();

    if (!invoiceId || !signatureData || !signerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        signatureData,
        signerName,
        signedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error('Error saving signature:', error);
    return NextResponse.json(
      { error: 'Failed to save signature' },
      { status: 500 }
    );
  }
}
