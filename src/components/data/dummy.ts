// Dummy data untuk akun, kartu, dan e-wallet
export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment';
  currency: string;
  isActive: boolean;
  lastTransaction: string;
  icon: string;
  color: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  cardNumber: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  limit: number;
  used: number;
  available: number;
  dueDate: string;
  minimumPayment: number;
  isActive: boolean;
  color: string;
  icon: string;
}

export interface EWallet {
  id: string;
  name: string;
  provider: string;
  phoneNumber: string;
  balance: number;
  isActive: boolean;
  lastTopUp: string;
  icon: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'mutual_fund' | 'crypto' | 'bonds';
  platform: string;
  currentValue: number;
  totalInvested: number;
  returns: number;
  returnsPercentage: number;
  lastUpdate: string;
  icon: string;
  color: string;
}

// Dummy Bank Accounts
export const dummyBankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    name: 'Rekening Utama',
    bank: 'Bank Central Asia (BCA)',
    accountNumber: '1234567890',
    balance: 15750000,
    type: 'checking',
    currency: 'IDR',
    isActive: true,
    lastTransaction: '2024-01-20',
    icon: '🏦',
    color: '#0066cc'
  },
  {
    id: 'bank-2',
    name: 'Tabungan Haji',
    bank: 'Bank Mandiri',
    accountNumber: '9876543210',
    balance: 25000000,
    type: 'savings',
    currency: 'IDR',
    isActive: true,
    lastTransaction: '2024-01-18',
    icon: '🕌',
    color: '#ff6600'
  },
  {
    id: 'bank-3',
    name: 'Deposito',
    bank: 'Bank Negara Indonesia (BNI)',
    accountNumber: '5555666677',
    balance: 50000000,
    type: 'investment',
    currency: 'IDR',
    isActive: true,
    lastTransaction: '2024-01-15',
    icon: '💎',
    color: '#ff9900'
  },
  {
    id: 'bank-4',
    name: 'Rekening Dollar',
    bank: 'CIMB Niaga',
    accountNumber: 'USD123456',
    balance: 2500, // dalam USD
    type: 'savings',
    currency: 'USD',
    isActive: true,
    lastTransaction: '2024-01-19',
    icon: '💵',
    color: '#cc0066'
  }
];

// Dummy Credit Cards
export const dummyCreditCards: CreditCard[] = [
  {
    id: 'cc-1',
    name: 'BCA Mastercard Gold',
    bank: 'Bank Central Asia',
    cardNumber: '**** **** **** 1234',
    cardType: 'mastercard',
    limit: 20000000,
    used: 3500000,
    available: 16500000,
    dueDate: '2024-02-15',
    minimumPayment: 350000,
    isActive: true,
    color: '#FFD700',
    icon: '💳'
  },
  {
    id: 'cc-2',
    name: 'Mandiri Visa Platinum',
    bank: 'Bank Mandiri',
    cardNumber: '**** **** **** 5678',
    cardType: 'visa',
    limit: 35000000,
    used: 8750000,
    available: 26250000,
    dueDate: '2024-02-20',
    minimumPayment: 875000,
    isActive: true,
    color: '#1A1F71',
    icon: '💎'
  },
  {
    id: 'cc-3',
    name: 'CIMB Niaga American Express',
    bank: 'CIMB Niaga',
    cardNumber: '**** **** **** 9012',
    cardType: 'amex',
    limit: 15000000,
    used: 2250000,
    available: 12750000,
    dueDate: '2024-02-25',
    minimumPayment: 225000,
    isActive: true,
    color: '#006FCF',
    icon: '🏆'
  }
];

// Dummy E-Wallets
export const dummyEWallets: EWallet[] = [
  {
    id: 'ew-1',
    name: 'GoPay',
    provider: 'Gojek',
    phoneNumber: '+62 812-3456-7890',
    balance: 850000,
    isActive: true,
    lastTopUp: '2024-01-19',
    icon: '🟢',
    color: '#00AA13'
  },
  {
    id: 'ew-2',
    name: 'OVO',
    provider: 'OVO',
    phoneNumber: '+62 812-3456-7890',
    balance: 1250000,
    isActive: true,
    lastTopUp: '2024-01-18',
    icon: '🟣',
    color: '#4C3494'
  },
  {
    id: 'ew-3',
    name: 'DANA',
    provider: 'DANA',
    phoneNumber: '+62 812-3456-7890',
    balance: 675000,
    isActive: true,
    lastTopUp: '2024-01-17',
    icon: '🔵',
    color: '#118EEA'
  },
  {
    id: 'ew-4',
    name: 'ShopeePay',
    provider: 'Shopee',
    phoneNumber: '+62 812-3456-7890',
    balance: 425000,
    isActive: true,
    lastTopUp: '2024-01-16',
    icon: '🟠',
    color: '#EE4D2D'
  }
];

// Dummy Investments
export const dummyInvestments: Investment[] = [
  {
    id: 'inv-1',
    name: 'Saham BBCA',
    type: 'stocks',
    platform: 'Stockbit',
    currentValue: 12500000,
    totalInvested: 10000000,
    returns: 2500000,
    returnsPercentage: 25.0,
    lastUpdate: '2024-01-20',
    icon: '📈',
    color: '#00C851'
  },
  {
    id: 'inv-2',
    name: 'Reksadana Pendapatan Tetap',
    type: 'mutual_fund',
    platform: 'Bareksa',
    currentValue: 8750000,
    totalInvested: 8000000,
    returns: 750000,
    returnsPercentage: 9.375,
    lastUpdate: '2024-01-20',
    icon: '📊',
    color: '#33B5E5'
  },
  {
    id: 'inv-3',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    platform: 'Indodax',
    currentValue: 5250000,
    totalInvested: 6000000,
    returns: -750000,
    returnsPercentage: -12.5,
    lastUpdate: '2024-01-20',
    icon: '₿',
    color: '#FF9500'
  },
  {
    id: 'inv-4',
    name: 'Obligasi Negara (SUN)',
    type: 'bonds',
    platform: 'Bareksa',
    currentValue: 15750000,
    totalInvested: 15000000,
    returns: 750000,
    returnsPercentage: 5.0,
    lastUpdate: '2024-01-20',
    icon: '🏛️',
    color: '#AA66CC'
  }
];

// Summary calculations
export const getAccountsSummary = () => {
  const totalBankBalance = dummyBankAccounts.reduce((sum, account) => {
    if (account.currency === 'IDR') {
      return sum + account.balance;
    } else if (account.currency === 'USD') {
      return sum + (account.balance * 15500); // Assuming 1 USD = 15,500 IDR
    }
    return sum;
  }, 0);

  const totalCreditLimit = dummyCreditCards.reduce((sum, card) => sum + card.limit, 0);
  const totalCreditUsed = dummyCreditCards.reduce((sum, card) => sum + card.used, 0);
  const totalCreditAvailable = totalCreditLimit - totalCreditUsed;

  const totalEWalletBalance = dummyEWallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  const totalInvestmentValue = dummyInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvestmentCost = dummyInvestments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalInvestmentReturns = totalInvestmentValue - totalInvestmentCost;

  const totalNetWorth = totalBankBalance + totalEWalletBalance + totalInvestmentValue - totalCreditUsed;

  return {
    totalBankBalance,
    totalCreditLimit,
    totalCreditUsed,
    totalCreditAvailable,
    totalEWalletBalance,
    totalInvestmentValue,
    totalInvestmentCost,
    totalInvestmentReturns,
    totalNetWorth,
    accountsCount: dummyBankAccounts.length,
    cardsCount: dummyCreditCards.length,
    walletsCount: dummyEWallets.length,
    investmentsCount: dummyInvestments.length
  };
};