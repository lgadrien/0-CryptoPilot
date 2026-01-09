"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import cryptoService from "../services/cryptoService";
import { formatEther, JsonRpcProvider, Contract, formatUnits } from "ethers";

// --- CONSTANTS ---
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const EXLORER_CHAINS = {
  base: "https://base.blockscout.com",
  optimism: "https://optimism.blockscout.com",
  arbitrum: "https://arbitrum.blockscout.com",
  polygon: "https://polygon.blockscout.com",
  zksync: "https://zksync.blockscout.com",
};

const RPC_CHAINS = [
  {
    name: "Binance Smart Chain",
    id: "binancecoin",
    symbol: "BNB",
    rpc: "https://binance.llamarpc.com",
    tokens: [
      {
        address: "0x55d398326f99059ff775485246999027b3197955",
        symbol: "USDT",
        decimals: 18,
        id: "tether",
      },
      {
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        symbol: "USDC",
        decimals: 18,
        id: "usd-coin",
      },
      {
        address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        symbol: "BUSD",
        decimals: 18,
        id: "binance-usd",
      },
      {
        address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        symbol: "CAKE",
        decimals: 18,
        id: "pancakeswap-token",
      },
      {
        address: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        symbol: "BTCB",
        decimals: 18,
        id: "bitcoin",
      },
      {
        address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        symbol: "ETH",
        decimals: 18,
        id: "ethereum",
      },
    ],
  },
  {
    name: "Avalanche",
    id: "avalanche-2",
    symbol: "AVAX",
    rpc: "https://avalanche.llamarpc.com",
    tokens: [
      {
        address: "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7",
        symbol: "USDt",
        decimals: 6,
        id: "tether",
      },
      {
        address: "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
        symbol: "USDC",
        decimals: 6,
        id: "usd-coin",
      },
      {
        address: "0x152b9d0fdc40c096757f570a51e494bd4b943e50",
        symbol: "BTC.b",
        decimals: 8,
        id: "bitcoin",
      },
      {
        address: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
        symbol: "WETH.e",
        decimals: 18,
        id: "ethereum",
      },
    ],
  },
];

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const { linkedWallets } = useAuth();

  // Settings State
  const [currency, setCurrency] = useState("usd");
  const [ghostMode, setGhostMode] = useState(false);

  // Portfolio State
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    ethBalance: "0",
    ethValue: 0,
    loading: true,
  });

  const [cryptos, setCryptos] = useState([]);
  const [loadingCryptos, setLoadingCryptos] = useState(true);

  // Load Settings on Mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferredCurrency");
    const savedGhost = localStorage.getItem("ghostMode");

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedGhost) setGhostMode(savedGhost === "true");
  }, []);

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency);
  };

  const toggleGhostMode = () => {
    setGhostMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("ghostMode", String(newVal));
      return newVal;
    });
  };

  // --- 1. SCAN ETHEREUM (ETHPLORER) ---
  const scanEthereumFull = async (address) => {
    try {
      const response = await fetch(
        `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
      );
      const data = await response.json();
      if (!data || !data.address) return [];
      const assets = [];

      if (data.ETH && data.ETH.balance > 0) {
        assets.push({
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          balance: data.ETH.balance,
          price: 0, // Force refresh via Coingecko for currency support
          change24h: 0,
          value: 0,
          chain: "Ethereum",
          contractAddress: null,
        });
      }
      if (data.tokens) {
        data.tokens.forEach((t) => {
          const decimals =
            t.tokenInfo.decimals !== undefined
              ? Number(t.tokenInfo.decimals)
              : 18;
          const balance = Number(t.balance) / Math.pow(10, decimals);
          if (balance > 0) {
            assets.push({
              id: t.tokenInfo.coingecko || t.tokenInfo.symbol.toLowerCase(),
              name: t.tokenInfo.name,
              symbol: t.tokenInfo.symbol,
              balance: balance,
              price: 0, // Force refresh
              change24h: 0,
              value: 0,
              chain: "Ethereum",
              contractAddress: t.tokenInfo.address,
            });
          }
        });
      }
      return assets;
    } catch (err) {
      return [];
    }
  };

  // --- 2. SCAN BLOCKSCOUT (EVM CHAINS FULL) ---
  const scanBlockscoutFull = async (chainKey, baseUrl, address) => {
    try {
      const response = await fetch(
        `${baseUrl}/api?module=account&action=tokenlist&address=${address}`
      );
      const data = await response.json();
      if (!data || !data.result || !Array.isArray(data.result)) return [];

      const assets = [];
      const chainCapitalized =
        chainKey.charAt(0).toUpperCase() + chainKey.slice(1);

      data.result.forEach((t) => {
        if (t.balance && t.balance > 0) {
          const decimals = t.decimals ? Number(t.decimals) : 18;
          const balance = Number(t.balance) / Math.pow(10, decimals);

          if (balance > 0 && (t.type === "ERC-20" || t.type === "coin")) {
            assets.push({
              id: t.symbol ? t.symbol.toLowerCase() : "unknown",
              name: t.name || t.symbol,
              symbol: t.symbol,
              balance: balance,
              contractAddress: t.contractAddress,
              chain: chainCapitalized,
            });
          }
        }
      });
      return assets;
    } catch (err) {
      return [];
    }
  };

  // --- 3. SCAN RPC (FALLBACK CHAIN) ---
  const scanRpcChain = async (chain, address) => {
    const assets = [];
    const provider = new JsonRpcProvider(chain.rpc);
    try {
      const bal = await provider.getBalance(address);
      if (bal > BigInt(0)) {
        let priceId = chain.id;
        if (chain.symbol === "ETH") priceId = "ethereum";
        if (chain.symbol === "BNB") priceId = "binancecoin";
        if (chain.symbol === "MATIC") priceId = "matic-network";
        if (chain.symbol === "AVAX") priceId = "avalanche-2";
        assets.push({
          id: priceId,
          name: chain.name + " Native",
          symbol: chain.symbol,
          balance: parseFloat(formatEther(bal)),
          chain: chain.name,
          contractAddress: null,
        });
      }
    } catch (e) {}

    if (chain.tokens) {
      const promises = chain.tokens.map(async (token) => {
        try {
          const contract = new Contract(token.address, ERC20_ABI, provider);
          const bal = await contract.balanceOf(address);
          if (bal > BigInt(0)) {
            return {
              id: token.id,
              name: token.symbol,
              symbol: token.symbol,
              balance: parseFloat(formatUnits(bal, token.decimals)),
              contractAddress: token.address,
              chain: chain.name,
            };
          }
        } catch (e) {}
        return null;
      });
      const tokens = await Promise.all(promises);
      assets.push(...tokens.filter((t) => t !== null));
    }
    return assets;
  };

  // --- 4. SCAN SOLANA ---
  const scanSolanaFull = async (address) => {
    try {
      const assets = [];
      const solRpc = "https://api.mainnet-beta.solana.com";
      // Native
      const solRes = await fetch(solRpc, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
        headers: { "Content-Type": "application/json" },
      });
      const solData = await solRes.json();
      if (solData.result?.value > 0)
        assets.push({
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          balance: solData.result.value / 1e9,
          chain: "Solana",
          contractAddress: null,
        });

      // SPL
      const splRes = await fetch(solRpc, {
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            address,
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" },
          ],
        }),
        headers: { "Content-Type": "application/json" },
      });
      const splData = await splRes.json();
      if (splData.result?.value) {
        for (const account of splData.result.value) {
          const info = account.account.data.parsed.info;
          const amount = info.tokenAmount.uiAmount;
          const mint = info.mint;
          if (amount > 0) {
            let id = null;
            let symbol = "UNKNOWN";
            // Mapping rapide des tops
            if (mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
              id = "usd-coin";
              symbol = "USDC";
            } else if (
              mint === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
            ) {
              id = "tether";
              symbol = "USDT";
            } else if (
              mint === "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            ) {
              id = "bonk";
              symbol = "BONK";
            } else if (
              mint === "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"
            ) {
              id = "dogwifhat";
              symbol = "WIF";
            } else if (
              mint === "JUPyiwrYJFskUPiHa7hkeR8VUtkMwNSIKG5534c905F2"
            ) {
              id = "jupiter-exchange-solana";
              symbol = "JUP";
            } else if (
              mint === "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
            ) {
              id = "raydium";
              symbol = "RAY";
            }

            if (id)
              assets.push({
                id,
                name: symbol,
                symbol,
                balance: amount,
                chain: "Solana",
                contractAddress: mint,
              });
          }
        }
      }
      return assets;
    } catch (e) {
      return [];
    }
  };

  const loadPortfolioData = useCallback(async () => {
    if (!linkedWallets || linkedWallets.length === 0) {
      setPortfolio((prev) => ({ ...prev, loading: false }));
      setCryptos([]);
      return;
    }

    setPortfolio((prev) => ({ ...prev, loading: true }));
    setLoadingCryptos(true);

    let totalVal = 0;
    let aggregatedAssets = [];
    const assetsNeedingPrices = [];

    try {
      for (const w of linkedWallets) {
        if (w.type === "metamask") {
          // 1. Ethereum
          const ethAssets = await scanEthereumFull(w.address);
          aggregatedAssets.push(...ethAssets);
          ethAssets.forEach((a) => assetsNeedingPrices.push(a)); // Force pricing

          // 2. Blockscout Chains
          for (const [key, url] of Object.entries(EXLORER_CHAINS)) {
            const bsAssets = await scanBlockscoutFull(key, url, w.address);
            bsAssets.forEach((a) => assetsNeedingPrices.push(a));
            aggregatedAssets.push(...bsAssets);
          }

          // 3. RPC Chains (BSC, Avax)
          const rpcPromises = RPC_CHAINS.map((chain) =>
            scanRpcChain(chain, w.address)
          );
          const rpcResults = await Promise.all(rpcPromises);
          rpcResults.flat().forEach((a) => assetsNeedingPrices.push(a));
          aggregatedAssets.push(...rpcResults.flat());
        } else if (w.type === "phantom") {
          const solAssets = await scanSolanaFull(w.address);
          solAssets.forEach((a) => assetsNeedingPrices.push(a));
          aggregatedAssets.push(...solAssets);
        }
      }

      // --- INTELLIGENT PRICING MAPPING ---
      assetsNeedingPrices.forEach((a) => {
        const sym = a.symbol.toUpperCase();
        if (sym === "ETH" || sym === "WETH") a.id = "ethereum";
        else if (sym === "BTC" || sym === "WBTC") a.id = "bitcoin";
        else if (sym === "USDT") a.id = "tether";
        else if (sym === "USDC") a.id = "usd-coin";
        else if (sym === "DAI") a.id = "dai";
        else if (sym === "MATIC") a.id = "matic-network";
        else if (sym === "AVAX") a.id = "avalanche-2";
        else if (sym === "BNB") a.id = "binancecoin";
        else if (sym === "ARB") a.id = "arbitrum";
        else if (sym === "OP") a.id = "optimism";
        else if (!a.id) a.id = sym.toLowerCase();
      });

      const assetIds = [
        ...new Set(
          aggregatedAssets
            .filter((a) => !a.price || a.price === 0)
            .map((a) => a.id)
        ),
      ];

      if (assetIds.length > 0) {
        try {
          // Pass Currency Here
          const pricesMap = await cryptoService.getPrices(assetIds, currency);
          aggregatedAssets.forEach((a) => {
            if (pricesMap[a.id]) {
              a.price = pricesMap[a.id].price;
              a.change24h = pricesMap[a.id].change24h;
              a.value = a.balance * a.price;
            }
          });
        } catch (e) {}
      }

      // Filter dust & sort
      const finalList = aggregatedAssets.filter(
        (a) =>
          (a.value && a.value > 0.01) ||
          a.chain === "Solana" ||
          a.chain === "Ethereum"
      );
      finalList.sort((a, b) => (b.value || 0) - (a.value || 0));

      finalList.forEach((a) => {
        if (a.value) totalVal += a.value;
      });

      let weightedChange = 0;
      if (totalVal > 0)
        weightedChange =
          finalList.reduce(
            (acc, a) => acc + (a.value || 0) * (a.change24h || 0),
            0
          ) / totalVal;

      setPortfolio({
        totalValue: totalVal,
        change24h: totalVal * (weightedChange / 100),
        change24hPercent: weightedChange,
        ethBalance: "N/A",
        ethValue: totalVal,
        loading: false,
      });

      setCryptos(finalList);
    } catch (e) {
      console.error("Full Scan Err", e);
    } finally {
      setPortfolio((prev) => ({ ...prev, loading: false }));
      setLoadingCryptos(false);
    }
  }, [linkedWallets, currency]); // Add currency dependency

  // Reload when wallets or currency change
  useEffect(() => {
    loadPortfolioData();
  }, [linkedWallets, currency, loadPortfolioData]);

  const value = useMemo(
    () => ({
      portfolio,
      cryptos,
      loadingCryptos,
      refreshPortfolio: loadPortfolioData,
      currency,
      setCurrency: updateCurrency,
      ghostMode,
      toggleGhostMode,
    }),
    [portfolio, cryptos, loadingCryptos, loadPortfolioData, currency, ghostMode]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
