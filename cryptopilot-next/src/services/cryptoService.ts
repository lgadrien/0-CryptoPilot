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
    const res = await this.getPrices([coinId]);
    return res[coinId] || { price: 0, change24h: 0 };
  }

  // Récupérer les prix de PLUSIEURS cryptos en une seule requête (Batching)
  async getPrices(coinIds: string[]) {
    // 1. Check cache for all IDs
    const results: Record<string, any> = {};
    const missingIds: string[] = [];

    coinIds.forEach((id) => {
      const cacheKey = `price_${id}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        results[id] = cached.data;
      } else {
        missingIds.push(id);
      }
    });

    if (missingIds.length === 0) {
      return results;
    }

    // 2. Fetch missing IDs
    try {
      // Chunk requests if too many (CoinGecko allows ~50 ids max per call usually)
      const chunkSize = 50;
      for (let i = 0; i < missingIds.length; i += chunkSize) {
        const chunk = missingIds.slice(i, i + chunkSize);
        const idsParam = chunk.join(",");

        const response = await fetch(
          `/api/crypto/price?ids=${idsParam}&vs_currencies=usd`
        );

        if (!response.ok) {
          if (response.status === 429) {
            console.warn("Rate limit atteint. Utilisation cache si dispo.");
            // Fallback cache périmé éventuel ou zéro
            chunk.forEach((id) => {
              const oldCache = this.cache.get(`price_${id}`);
              if (oldCache) results[id] = oldCache.data;
            });
            continue;
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Update cache & results
        chunk.forEach((id) => {
          if (data[id]) {
            const result = {
              price: data[id].usd,
              change24h: data[id].usd_24h_change || 0,
            };
            this.cache.set(`price_${id}`, {
              data: result,
              timestamp: Date.now(),
            });
            results[id] = result;
          }
        });
      }

      return results;
    } catch (error) {
      console.error("Erreur getPrices batch:", error);
      // Return what we have
      return results;
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

  // Récupérer le top des cryptomonnaies/Marché (Paginé)
  async getTopCryptos(page = 1, limit = 50) {
    const cacheKey = `top_cryptos_p${page}_l${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `/api/crypto/market-data?vs_currency=usd&page=${page}&per_page=${limit}`
      );

      if (!response.ok) {
        if (cached) return cached.data;
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now(),
      });
      return data;
    } catch (error) {
      console.error("Erreur getTopCryptos:", error);
      if (cached) return cached.data;
      return [];
    }
  }

  // Rechercher des cryptos et récupérer leurs données de marché
  async searchCryptos(query: string) {
    try {
      // 1. Search Query
      const searchRes = await fetch(`/api/crypto/search?query=${query}`);
      if (!searchRes.ok) throw new Error("Search failed");
      const searchData = await searchRes.json();

      if (!searchData.coins || searchData.coins.length === 0) return [];

      // 2. Extract IDs (limit to top 20 matches to avoid overload)
      const ids = searchData.coins
        .slice(0, 20)
        .map((c: any) => c.id)
        .join(",");

      // 3. Get Market Data for these IDs
      const marketRes = await fetch(
        `/api/crypto/market-data?vs_currency=usd&ids=${ids}`
      );
      if (!marketRes.ok) throw new Error("Market data fetch failed");

      return await marketRes.json();
    } catch (error) {
      console.error("Erreur searchCryptos:", error);
      return [];
    }
  }

  // Récupérer l'historique des prix (Chart)
  async getMarketChart(coinId: string, days = 7) {
    const cacheKey = `chart:${coinId}:${days}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry)
      return cached.data;

    try {
      const res = await fetch(`/api/crypto/history?id=${coinId}&days=${days}`);
      if (!res.ok) throw new Error("Chart fetch failed");
      const data = await res.json();

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      console.error("Erreur getMarketChart", e);
      return null;
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
