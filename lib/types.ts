export type UserRole = 'INVESTOR' | 'BUSINESS' | 'ADMIN';

export type KYCStatus = 'PENDING' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type DealStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'FUNDED' 
  | 'REPAYING' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type TransactionType = 
  | 'DEPOSIT' 
  | 'WITHDRAWAL' 
  | 'INVESTMENT' 
  | 'REVENUE_PAYOUT' 
  | 'REFUND' 
  | 'FEE';

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  idNumber?: string;
  avatar?: string;
  emailVerified?: Date;
  kycStatus: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  userId: string;
  registrationNumber: string;
  tradingName: string;
  legalName: string;
  industry: string;
  description: string;
  website?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  logo?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankBranchCode?: string;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  businessId: string;
  business?: Business;
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  maxInvestment?: number;
  revenueSharePercentage: number;
  repaymentCap: number;
  status: DealStatus;
  riskRating: number;
  fundingDeadline: Date;
  startDate?: Date;
  endDate?: Date;
  projectedMonthlyRevenue?: number;
  actualMonthlyRevenue: number;
  totalRepaid: number;
  investorCount: number;
  featuredImage?: string;
  documents?: any;
  termsAndConditions: string;
  adminNotes?: string;
  approvedAt?: Date;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  dealId: string;
  deal?: Deal;
  amount: number;
  sharePercentage: number;
  totalReceived: number;
  expectedReturn: number;
  status: string;
  agreementSigned: boolean;
  agreementUrl?: string;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fee: number;
  netAmount: number;
  currency: string;
  reference?: string;
  description?: string;
  metadata?: any;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueReport {
  id: string;
  dealId: string;
  reportingMonth: Date;
  revenue: number;
  shareableAmount: number;
  supportingDocs?: any;
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenuePayout {
  id: string;
  dealId: string;
  revenueReportId: string;
  totalAmount: number;
  platformFee: number;
  netAmount: number;
  payoutMonth: Date;
  status: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  category: string;
  title: string;
  message: string;
  metadata?: any;
  read: boolean;
  readAt?: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalInvested?: number;
  totalReturns?: number;
  activeInvestments?: number;
  portfolioValue?: number;
  monthlyRevenue?: number;
  totalRaised?: number;
  activeDeals?: number;
  investorCount?: number;
}
