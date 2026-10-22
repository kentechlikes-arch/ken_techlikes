export type PlatformId = 
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'twitter'
  | 'telegram'
  | 'whatsapp'
  | 'spotify'
  | 'soundcloud'
  | 'google'
  | 'traffic'
  | 'linkedin';

export type Currency = 'KES' | 'USD' | 'EUR' | 'NGN';

export type ServiceType = 
  | 'followers' 
  | 'likes' 
  | 'views' 
  | 'comments' 
  | 'shares' 
  | 'monetization' 
  | 'traffic' 
  | 'subscribers'
  | 'members'
  | 'reviews'
  | 'reactions'
  | 'custom';

export interface ServiceItem {
  id: string;
  name: string;
  category: PlatformId;
  categoryName: string;
  subCategory?: string;
  type: ServiceType;
  ratePer1000: number; // in KES
  packagePrice?: number; // exact package price in KES
  fixedQuantity?: number; // preset package quantity
  minQuantity: number;
  maxQuantity: number;
  speed: string;
  refill: string;
  description: string;
  badge?: 'HOT' | 'BESTSELLER' | 'CHEAPEST' | 'INSTANT' | 'VIP' | 'POPULAR' | 'FAST' | 'CRITICAL' | 'OFFICIAL' | 'PRO' | 'EXPERT';
  linkPlaceholder: string;
  linkExample: string;
  averageTime: string;
  disabled?: boolean;
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Delivering' | 'Completed' | 'Canceled';

export interface OrderRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  platform: PlatformId;
  link: string;
  quantity: number;
  charge: number; // in KES
  currency: Currency;
  status: OrderStatus;
  startCount: number;
  currentCount: number;
  targetCount: number;
  createdAt: string;
  mpesaRef?: string;
  refillEligible: boolean;
  notes?: string;
}

export interface UserWallet {
  balance: number; // in KES
  totalSpent: number; // in KES
  ordersCount: number;
  accountTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Agency';
  userName: string;
  phoneNumber: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  accountTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Agency' | 'Administrator';
  createdAt: string;
  apiKey?: string;
  isAdmin?: boolean;
  role?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'deposit' | 'order' | 'refund' | 'bonus';
  amount: number; // in KES
  method: 'M-PESA STK Push' | 'M-PESA Paybill' | 'Card' | 'Crypto (USDT)' | 'Wallet Balance';
  reference: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
}

export type ThemePreset = 'emerald-obsidian' | 'sapphire-cyber' | 'sunset-gold' | 'sleek-slate';

export interface SystemSettings {
  broadcastNotice: string;
  paymentPhone: string;
  paybill: string;
  supportEmail: string;
  supportPhone: string;
  promoBonusPercent: number;
  ordersAlert?: string;
  maintenanceMode?: boolean;
}
