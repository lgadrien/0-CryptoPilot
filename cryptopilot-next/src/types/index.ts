export interface Wallet {
  id?: string; // from DB
  type: "metamask" | "phantom";
  address: string;
  label?: string; // from DB
  chainId?: string | number | null;
  connectedAt?: string;
  isPrimary?: boolean; // from DB
}

export interface User {
  id?: string;
  email?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  website?: string; // from DB
  phone?: string;
  type?: "guest" | "authenticated";
  preferences?: {
    currency?: string;
    ghost_mode?: boolean;
    theme?: string;
    notifications?: boolean;
    [key: string]: any;
  };
  plan_tier?: "free" | "sovereign"; // from DB enum
  plan_valid_until?: string; // from DB
  stripe_customer_id?: string; // from DB
  created_at?: string;
  [key: string]: any; // Allow extra metadata
}

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change24h: number;
  price: number;
}

export interface PortfolioData {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  ethBalance: string;
  ethValue: number;
  loading: boolean;
}

export interface PerformanceDataPoint {
  date: string;
  price: number;
}
