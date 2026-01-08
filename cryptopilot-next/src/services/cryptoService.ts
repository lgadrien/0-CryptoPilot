// Service pour récupérer les prix des cryptomonnaies
class CryptoService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheExpiry: number;
  private requestQueue: any[];
  private isProcessing: boolean;

  constructor() {
    this.baseUrl = "https://api.coingecko.com/api/v3";
    this.cache = new Map();
    this.cacheExpiry = 120000; // 2 minutes pour éviter rate limit
    this.requestQueue = [];
    this.isProcessing = false;
  }

  // Récupérer le prix d'une crypto en USD
  async getPrice(coinId: string) {
    const cacheKey = `price_${coinId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data[coinId]) {
        throw new Error(`Aucune donnée trouvée pour ${coinId}`);
      }

      const result = {
        price: data[coinId].usd,
        change24h: data[coinId].usd_24h_change || 0,
      };

      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error("Erreur getPrice:", error);
      throw error;
    }
  }

  // Convertir ETH en USD
  async convertEthToUsd(ethAmount: number) {
    try {
      const priceData = await this.getPrice("ethereum");

      return {
        usd: ethAmount * priceData.price,
        change24h: priceData.change24h,
      };
    } catch (error) {
      console.error("Erreur convertEthToUsd:", error);
      throw error;
    }
  }

  // Récupérer le top des cryptomonnaies
  async getTopCryptos(limit = 20) {
    const cacheKey = `top_cryptos_${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Rate limit atteint pour CoinGecko API");
          // Retourner les données en cache même si expirées
          if (cached) return cached.data;
          throw new Error("Rate limit atteint, veuillez patienter");
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Erreur getTopCryptos:", error);
      // Retourner les données en cache si disponibles
      if (cached) return cached.data;
      throw error;
    }
  }

  // Nettoyer le cache
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton
const cryptoService = new CryptoService();
export default cryptoService;
