import { Brand, Campaign, Transaction, CampaignStatus, TransactionType, TransactionStatus, Slot, Bid } from '../types';

// --- MOCK DATABASE ---
let brands: Brand[] = [
  { id: 'brand-1', companyName: 'Starlight Inc.', email: 'contact@starlight.co', passwordHash: 'pass123', walletBalance: 7500.50, createdAt: '2023-01-15', attentionScore: 88 },
  { id: 'brand-2', companyName: 'QuantumLeap Tech', email: 'hello@quantumleap.tech', passwordHash: 'password', walletBalance: 12340.00, createdAt: '2023-03-22', attentionScore: 92 },
  { id: 'brand-3', companyName: 'Evergreen Goods', email: 'support@evergreen.com', passwordHash: 'green', walletBalance: 4200.75, createdAt: '2023-05-10', attentionScore: 85 },
];

let campaigns: Campaign[] = [
    { id: 'camp-1', brandId: 'brand-1', title: 'Summer Sale Kickoff', message: 'Get up to 50% off on all summer essentials!', category: 'Retail', bidAmount: 0.75, startTime: '2024-06-01', endTime: '2024-08-30', status: CampaignStatus.ACTIVE, impressions: 150000, clicks: 7500, targetAudience: 'Ages 18-35, fashion', totalSpent: 2250.00, conversionRate: 0.05 },
    { id: 'camp-2', brandId: 'brand-1', title: 'New Gadget Launch', message: 'Introducing the new AstroPod Max. Pre-order now!', category: 'Electronics', bidAmount: 1.20, startTime: '2024-07-01', endTime: '2024-07-15', status: CampaignStatus.PENDING, impressions: 0, clicks: 0, targetAudience: 'Tech enthusiasts', totalSpent: 0, conversionRate: 0 },
    { id: 'camp-3', brandId: 'brand-2', title: 'AI Conference 2024', message: 'Join the brightest minds in AI. Tickets available.', category: 'Tech', bidAmount: 2.50, startTime: '2024-05-10', endTime: '2024-05-25', status: CampaignStatus.ENDED, impressions: 80000, clicks: 3200, targetAudience: 'AI/ML Developers', totalSpent: 4000.00, conversionRate: 0.02 },
    { id: 'camp-4', brandId: 'brand-1', title: 'Holiday Special Draft', message: 'Secret holiday message here.', category: 'Retail', bidAmount: 1.00, startTime: '2024-12-01', endTime: '2024-12-25', status: CampaignStatus.DRAFT, impressions: 0, clicks: 0, targetAudience: 'All Customers', totalSpent: 0, conversionRate: 0 },
    { id: 'camp-5', brandId: 'brand-3', title: 'Organic Produce Box', message: 'Fresh, organic vegetables delivered to your door.', category: 'Groceries', bidAmount: 0.60, startTime: '2024-06-15', endTime: '2024-07-15', status: CampaignStatus.ACTIVE, impressions: 45000, clicks: 4500, targetAudience: 'Health-conscious families', totalSpent: 900.00, conversionRate: 0.10 },
];

let transactions: Transaction[] = [
    { id: 'tx-1', brandId: 'brand-1', date: '2024-06-01', description: 'Campaign Spend: Summer Sale', amount: 150.00, type: TransactionType.DEBIT, status: TransactionStatus.COMPLETED, campaignId: 'camp-1', invoiceNumber: 'INV-20240601-001' },
    { id: 'tx-2', brandId: 'brand-1', date: '2024-05-28', description: 'Wallet Deposit', amount: 5000.00, type: TransactionType.CREDIT, status: TransactionStatus.COMPLETED, invoiceNumber: 'INV-20240528-001' },
    { id: 'tx-3', brandId: 'brand-2', date: '2024-05-15', description: 'Campaign Spend: AI Conference', amount: 2500.00, type: TransactionType.DEBIT, status: TransactionStatus.COMPLETED, campaignId: 'camp-3', invoiceNumber: 'INV-20240515-001' },
    { id: 'tx-4', brandId: 'brand-1', date: '2024-06-02', description: 'Campaign Spend: Summer Sale', amount: 175.50, type: TransactionType.DEBIT, status: TransactionStatus.COMPLETED, campaignId: 'camp-1', invoiceNumber: 'INV-20240602-001' },
    { id: 'tx-5', brandId: 'brand-3', date: '2024-06-15', description: 'Initial Deposit', amount: 6000.00, type: TransactionType.CREDIT, status: TransactionStatus.COMPLETED, invoiceNumber: 'INV-20240615-001' },
];

let slots: Slot[] = [
    { id: 'slot-1', userId: 'user-a', slotTime: '9:00 AM' },
    { id: 'slot-2', userId: 'user-b', slotTime: '1:00 PM' },
    { id: 'slot-3', userId: 'user-c', slotTime: '7:00 PM' },
    { id: 'slot-4', userId: 'user-d', slotTime: '8:30 AM' },
    { id: 'slot-5', userId: 'user-e', slotTime: '5:00 PM' },
];


// --- API FUNCTIONS ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper to generate invoice numbers
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `INV-${year}${month}${day}-${randomSuffix}`;
};


export const login = async (email: string, passwordHash: string): Promise<Brand> => {
  await simulateDelay(500);
  const user = brands.find(b => b.email.toLowerCase() === email.toLowerCase() && b.passwordHash === passwordHash);
  if (user) {
    return { ...user };
  }
  throw new Error('Invalid email or password.');
};

export const signup = async (companyName: string, email: string, passwordHash: string): Promise<Brand> => {
  await simulateDelay(700);
  if (brands.some(b => b.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const newUser: Brand = {
    id: `brand-${Date.now()}`,
    companyName,
    email,
    passwordHash,
    walletBalance: 0,
    createdAt: new Date().toISOString().split('T')[0],
    attentionScore: 75, // Default starting score
  };
  brands.push(newUser);
  return { ...newUser };
};

export const getCampaignsByBrandId = async (brandId: string): Promise<Campaign[]> => {
    await simulateDelay(800);
    return JSON.parse(JSON.stringify(campaigns.filter(c => c.brandId === brandId)));
};

export const getTransactionsByBrandId = async (brandId: string): Promise<Transaction[]> => {
    await simulateDelay(600);
    return JSON.parse(JSON.stringify(transactions.filter(t => t.brandId === brandId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())));
};

export const saveCampaign = async (campaignData: Campaign): Promise<Campaign> => {
    await simulateDelay(500);
    if (campaignData.id) { // Update existing
        const index = campaigns.findIndex(c => c.id === campaignData.id);
        if (index > -1) {
            campaigns[index] = { ...campaigns[index], ...campaignData };
            return { ...campaigns[index] };
        }
        throw new Error("Campaign not found for update");
    } else { // Create new
        const newCampaign = { ...campaignData, id: `camp-${Date.now()}` };
        campaigns.push(newCampaign);
        return { ...newCampaign };
    }
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
    await simulateDelay(400);
    campaigns = campaigns.filter(c => c.id !== campaignId);
};

export const addFundsToBrand = async (brandId: string, amount: number): Promise<Brand> => {
    await simulateDelay(600);
    const brandIndex = brands.findIndex(b => b.id === brandId);
    if (brandIndex === -1) {
        throw new Error("Brand not found");
    }
    brands[brandIndex].walletBalance += amount;

    const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        brandId,
        date: new Date().toISOString().split('T')[0],
        description: 'Wallet Deposit',
        amount,
        type: TransactionType.CREDIT,
        status: TransactionStatus.COMPLETED,
        invoiceNumber: generateInvoiceNumber(),
    };
    transactions.push(newTransaction);
    
    return { ...brands[brandIndex] };
};

export const updateBrand = async (brandData: Partial<Brand> & { id: string }): Promise<Brand> => {
    await simulateDelay(500);
    const brandIndex = brands.findIndex(b => b.id === brandData.id);
    if (brandIndex === -1) {
        throw new Error("Brand not found");
    }
    brands[brandIndex] = { ...brands[brandIndex], ...brandData };
    return { ...brands[brandIndex] };
};

// New function for the Bidding Platform
export const getLiveAuctionResults = async (): Promise<Bid[]> => {
    await simulateDelay(300);
    // Simulate a few new winning bids
    const results: Bid[] = [];
    const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE);

    if (activeCampaigns.length === 0) return [];

    const numberOfResults = Math.floor(Math.random() * 3) + 1; // 1 to 3 new results each time

    for (let i = 0; i < numberOfResults; i++) {
        const randomCampaign = activeCampaigns[Math.floor(Math.random() * activeCampaigns.length)];
        const randomSlot = slots[Math.floor(Math.random() * slots.length)];
        const winnerBrand = brands.find(b => b.id === randomCampaign.brandId);

        if (randomCampaign && randomSlot && winnerBrand) {
            results.push({
                id: `bid-${Date.now()}-${i}`,
                campaignId: randomCampaign.id,
                slotId: randomSlot.id,
                bidAmount: randomCampaign.bidAmount * (1 + (Math.random() - 0.5) * 0.1), // a slight variation
                timestamp: new Date().toISOString(),
                campaignTitle: randomCampaign.title,
                brandName: winnerBrand.companyName,
                brandId: winnerBrand.id,
            });
        }
    }
    return results;
};