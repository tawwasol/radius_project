export interface Router {
  id: string;
  name: string;
  ipAddress: string;
  dnsName?: string;
  radiusSecret: string;
  apiPort: number;
  apiUser: string;
  apiPass: string;
  status: 'online' | 'offline';
  location: string;
  model: string;
  activeUsers: number;
  cpuUsage: number;
  ramUsage: number;
  uptime: string;
}

export interface SpeedProfile {
  id: string;
  name: string;
  downloadLimit: string; // e.g., 5M
  uploadLimit: string;   // e.g., 2M
  rateLimitString: string; // Mikrotik-Rate-Limit: 2M/5M
  price: number; // in Local Currency (e.g., EGP / SAR / USD)
  validityDays: number;
  quotaLimitGb?: number; // Zero or null for unlimited
}

export interface Voucher {
  id: string;
  code: string;
  password?: string;
  profileId: string;
  profileName: string;
  serialNumber: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  price: number;
}

export interface Subscriber {
  id: string;
  username: string;
  phone: string;
  profileId: string;
  profileName: string;
  type: 'pppoe' | 'hotspot';
  macAddress?: string;
  ipAddress?: string;
  status: 'active' | 'expired' | 'suspended';
  expirationDate: string;
  notes?: string;
  totalDataUsedGb: number;
}

export interface ActiveSession {
  id: string;
  username: string;
  callerId: string; // MAC or Phone
  ipAddress: string;
  nasIpAddress: string;
  uptime: string;
  downloadBytes: number;
  uploadBytes: number;
  rateLimit: string;
}

export interface SaasPlan {
  id: string;
  name: string;
  maxRouters: number;
  maxActiveUsers: number;
  priceMonthly: number;
  features: string[];
}

export interface SaasSubscriber {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  planId: string;
  status: 'active' | 'pending' | 'expired';
  signupDate: string;
  routersCount: number;
  activeUsersCount: number;
}
