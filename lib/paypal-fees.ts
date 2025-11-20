// PayPal fee calculator utility

export const PAYPAL_PERCENTAGE_FEE = 0.039; // 3.9%
export const PAYPAL_FIXED_FEE_USD = 0.30; // $0.30

/**
 * Calculate the amount customer needs to pay to cover PayPal fees
 * Formula: To receive X, customer must pay: (X + fixed_fee) / (1 - percentage_fee)
 */
export function calculateAmountWithFees(desiredAmount: number, isUSD: boolean = false): number {
  if (isUSD) {
    // For USD amounts
    const amountWithFees = (desiredAmount + PAYPAL_FIXED_FEE_USD) / (1 - PAYPAL_PERCENTAGE_FEE);
    return Math.ceil(amountWithFees * 100) / 100; // Round up to nearest cent
  } else {
    // For ZAR amounts - we'll convert, add fees, then convert back
    // This will be done in the component with exchange rate
    return desiredAmount;
  }
}

/**
 * Calculate PayPal fees on a given amount
 */
export function calculatePayPalFees(amount: number): number {
  return (amount * PAYPAL_PERCENTAGE_FEE) + PAYPAL_FIXED_FEE_USD;
}

/**
 * Calculate amount you'll receive after PayPal fees
 */
export function calculateAmountAfterFees(amount: number): number {
  return amount - calculatePayPalFees(amount);
}
