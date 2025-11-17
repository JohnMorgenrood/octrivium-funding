import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency: string = 'ZAR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numAmount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatPercentage(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(decimals)}%`;
}

export function calculateFundingProgress(current: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
}

export function calculateExpectedReturn(investment: number, multiplier: number = 1.7): number {
  return investment * multiplier;
}

export function calculateInvestorShare(investmentAmount: number, totalRaised: number): number {
  if (totalRaised === 0) return 0;
  return (investmentAmount / totalRaised) * 100;
}

export function calculateMonthlyPayout(
  monthlyRevenue: number,
  revenueSharePercentage: number,
  investorSharePercentage: number
): number {
  const totalPayout = monthlyRevenue * (revenueSharePercentage / 100);
  return totalPayout * (investorSharePercentage / 100);
}

export function getRiskLabel(riskRating: number): { label: string; color: string } {
  if (riskRating <= 3) return { label: 'Low Risk', color: 'text-green-600' };
  if (riskRating <= 6) return { label: 'Medium Risk', color: 'text-yellow-600' };
  return { label: 'High Risk', color: 'text-red-600' };
}

export function generateReference(prefix: string = 'TXN'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function validateIdNumber(idNumber: string): boolean {
  // South African ID number validation
  if (!/^\d{13}$/.test(idNumber)) return false;
  
  const date = idNumber.substring(0, 6);
  const year = parseInt(date.substring(0, 2));
  const month = parseInt(date.substring(2, 4));
  const day = parseInt(date.substring(4, 6));
  
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  
  // Luhn algorithm check
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(idNumber[i]);
    if (i % 2 === 0) {
      sum += digit;
    } else {
      digit *= 2;
      sum += digit > 9 ? digit - 9 : digit;
    }
  }
  const checksum = (10 - (sum % 10)) % 10;
  return checksum === parseInt(idNumber[12]);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function calculateDaysRemaining(deadline: Date | string): number {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
