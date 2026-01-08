export interface Wallet {
  type: "metamask" | "phantom";
  address: string;
  chainId?: string | number | null;
  connectedAt?: string;
}

export interface User {
  id?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  type?: "guest" | "authenticated";
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
