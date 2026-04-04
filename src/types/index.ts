export interface MiningPlan {
  id: string;
  name: string;
  price: number;
  hashrate: number;
  durationDays: number;
  roiPercent: number;
  description?: string | null;
}

export interface DashboardStats {
  balance: number;
  totalEarned: number;
  dailyEarnings: number;
  weeklyEarnings: number;
  hashrate: number;
  activeWorkers: number;
  btcPrice: number;
}

export interface WithdrawalRequest {
  amount: number;
  walletAddress: string;
  currency: string;
}
