import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!expense || expense.userId !== user.id) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const body = await request.json();
    const { date, description, category, amount, vendor, receiptUrl, taxAmount, taxDeductible } = body;

    const updatedExpense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        date: date ? new Date(date) : undefined,
        description,
        category,
        amount,
        vendor,
        receiptUrl,
        taxAmount,
        taxDeductible,
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!expense || expense.userId !== user.id) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
