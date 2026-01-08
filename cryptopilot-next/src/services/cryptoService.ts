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
      // Appel API interne
      const response = await fetch(
        `/api/crypto/price?ids=${coinId}&vs_currencies=usd`
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("Rate limit atteint (backend) pour CoinGecko API");
          if (cached) return cached.data;
        }
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
      if (cached) return cached.data;
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

  // Récupérer le top des cryptomonnaies/Marché (remplace la logique complexe avec l'API interne)
  async getTopCryptos(limit = 20) {
    // NOTE: L'endpoint market-data prend 'ids' pour l'instant.
    // Pour simuler "getTopCryptos" avec l'endpoint générique, il faudrait idéalement passer une liste d'ids
    // ou modifier l'API pour accepter 'per_page' etc.
    // Pour ce refactor, nous allons utiliser l'endpoint proxy pour récupérer les données de marché
    // si nous avons une liste d'IDs, ou sinon il faut adapter l'API pour supporter "Top N".

    // Adaptation : Utilisation directe de l'API CoinGecko via Proxy pour une liste définie (solution MVP)
    // OU appel à notre endpoint si modifié.
    // Le prompt demandait un endpoint proxy. Pour simplifier et respecter la demande du prompt 1 (Proxy API sur mon serveur),
    // je vais adapter l'appel pour utiliser l'endpoint `/api/crypto/market-data`
    // Si l'endpoint ne supporte pas "top N" sans IDs, on passera une liste par défaut pour l'exemple
    // ou on modifiera l'endpoint API pour être plus flexible.

    // Ici, je vais appeler l'API interne avec une liste par défaut de gros coins pour l'exemple MVP
    // ou mieux, modifier l'API route pour supporter le mode "list" sans IDs.
    // Vu l'implémentation de l'API route `market-data` qui exige `ids`, je vais passer une liste "Top 20".

    const top20Ids =
      "bitcoin,ethereum,tether,binancecoin,solana,ripple,usdc,staked-ether,cardano,avalanche-2,dogecoin,polkadot,tron,chainlink,matic-network,toncoin,shiba-inu,litecoin,dai,bitcoin-cash";

    const cacheKey = `top_cryptos_proxy_${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `/api/crypto/market-data?ids=${top20Ids}&vs_currency=usd`
      );

      if (!response.ok) {
        if (response.status === 429) {
          if (cached) return cached.data;
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Limiter le résultat si nécessaire
      const finalData = data.slice(0, limit);

      this.cache.set(cacheKey, {
        data: finalData,
        timestamp: Date.now(),
      });
      return finalData;
    } catch (error) {
      console.error("Erreur getTopCryptos:", error);
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
