export enum View {
  DASHBOARD = 'DASHBOARD',
  CAMPAIGNS = 'CAMPAIGNS',
  WALLET = 'WALLET',
  ANALYTICS = 'ANALYTICS',
  ACCOUNT = 'ACCOUNT',
  BIDDING = 'BIDDING',
}

export enum CampaignStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  ENDED = 'Ended',
  DRAFT = 'Draft',
}

export interface Brand {
  id: string;
  companyName: string;
  email: string;
  passwordHash: string; // In a real app, never store plaintext passwords
  walletBalance: number;
  createdAt: string;
  attentionScore: number;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  message: string;
  category: string;
  bidAmount: number;
  startTime: string;
  endTime: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  targetAudience: string;
  totalSpent: number;
  conversionRate: number;
}

export enum TransactionType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
}

export enum TransactionStatus {
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export interface Transaction {
  id: string;
  brandId: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  campaignId?: string;
  invoiceNumber: string;
}

export interface Slot {
    id: string;
    userId: string; // Belongs to a user in the user app
    slotTime: string; // e.g., "9:00 AM"
}

export interface Bid {
    id: string;
    campaignId: string;
    slotId: string;
    bidAmount: number;
    timestamp: string;
    // For UI purposes, we'll denormalize this data
    campaignTitle: string;
    brandName: string;
    brandId: string;
}