"use client";
import { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMetaMask } from "../../hooks/useMetaMask";
import { usePhantom } from "../../hooks/usePhantom";
import cryptoService from "../../services/cryptoService";
import { formatEther } from "ethers";

function FinanceDashboard() {
  // Contexts
  const {
    authMethod,
    walletAddress,
    linkedWallets,
    addWallet,
    removeWallet,
    loginWithMetaMask,
  } = useAuth();

  const {
    getBalance,
    formatAddress,
    getNetworkName,
    chainId,
    provider,
    connectMetaMask,
    isConnecting: isConnectingMetaMask,
    error: metaMaskError,
    isMetaMaskInstalled,
  } = useMetaMask();

  const {
    connectPhantom,
    account: phantomAccount,
    isPhantomInstalled,
  } = usePhantom();

  // Wallet State
  const [wallet, setWallet] = useState({
    balance: null,
    usd: null,
    priceChange24h: null,
    isLoading: false,
    copied: false,
  });

  // Portfolio State
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    ethBalance: "0",
    ethValue: 0,
    loading: true,
  });

  // Crypto List State
  const [cryptos, setCryptos] = useState([]);
  const [loadingCryptos, setLoadingCryptos] = useState(true);

  // Performance Chart State
  const [performanceData, setPerformanceData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Load Performance Chart Data (ETH price history)
  const loadPerformanceData = useCallback(async () => {
    // Désactiver temporairement pour éviter les erreurs CORS
    setLoadingChart(false);
    setPerformanceData([]);
    return; // TODO: Réactiver quand l'API CoinGecko sera stable ou proxyfiée
  }, []);

  // Load Wallet Balance
  const loadBalance = useCallback(async () => {
    const address = walletAddress; // Utilise le wallet actif principal
    if (address && provider) {
      setWallet((prev) => ({ ...prev, isLoading: true }));
      try {
        const bal = await getBalance(address);
        const ethAmount = parseFloat(formatEther(bal));
        let usd = null,
          priceChange24h = null;
        try {
          const conversion = await cryptoService.convertEthToUsd(ethAmount);
          usd = conversion.usd;
          priceChange24h = conversion.change24h;
        } catch {
          usd = null;
          priceChange24h = null;
        }
        setWallet({
          balance: bal,
          usd,
          priceChange24h,
          isLoading: false,
          copied: false,
        });
      } catch (err) {
        console.error("Erreur de chargement du solde:", err);
        setWallet((prev) => ({ ...prev, balance: null, isLoading: false }));
      }
    }
  }, [walletAddress, provider, getBalance]);

  // Load Portfolio Stats
  const loadPortfolioData = useCallback(async () => {
    try {
      setPortfolio((prev) => ({ ...prev, loading: true }));
      // Utiliser l'adresse du wallet actif
      const address = walletAddress;
      if (!address || !provider) {
        setPortfolio((prev) => ({ ...prev, loading: false }));
        return;
      }
      const balance = await getBalance(address);
      const ethBalance = formatEther(balance);
      const priceData = await cryptoService.getPrice("ethereum");
      const ethValue = parseFloat(ethBalance) * priceData.price;
      const change24h = ethValue * (priceData.change24h / 100);
      setPortfolio({
        totalValue: ethValue,
        change24h,
        change24hPercent: priceData.change24h,
        ethBalance,
        ethValue,
        loading: false,
      });
    } catch {
      setPortfolio((prev) => ({ ...prev, loading: false }));
    }
  }, [getBalance, walletAddress, provider]);

  // Load Crypto List
  const loadCryptoData = useCallback(async () => {
    try {
      setLoadingCryptos(true);
      const balance = await getBalance();
      const ethBalance = formatEther(balance);
      const ethPriceData = await cryptoService.getPrice("ethereum");
      const ethValue = parseFloat(ethBalance) * ethPriceData.price;
      const cryptoList = [
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          balance: parseFloat(ethBalance),
          value: ethValue,
          change24h: ethPriceData.change24h,
          price: ethPriceData.price,
        },
      ];
      setCryptos(cryptoList.sort((a, b) => b.value - a.value));
      setLoadingCryptos(false);
    } catch {
      setLoadingCryptos(false);
    }
  }, [getBalance]);

  // Handler pour lier un nouveau wallet
  const handleLinkMetaMask = async () => {
    try {
      const result = await connectMetaMask();
      if (result) {
        addWallet({
          type: "metamask",
          address: result.account,
          chainId: result.chainId,
          connectedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Erreur link MetaMask", e);
    }
  };

  const handleLinkPhantom = async () => {
    try {
      const result = await connectPhantom();
      if (result) {
        addWallet({
          type: "phantom",
          address: result.publicKey.toString(),
          connectedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Erreur link Phantom", e);
    }
  };

  // Initial load
  useEffect(() => {
    if (authMethod === "metamask" && walletAddress && provider) {
      loadBalance();
      loadPortfolioData();
      loadCryptoData();
      loadPerformanceData();
    }
  }, [
    authMethod,
    walletAddress,
    provider,
    loadBalance,
    loadPortfolioData,
    loadCryptoData,
    loadPerformanceData,
  ]);

  // Copy wallet address
  const copyAddress = (addr) => {
    if (addr) {
      navigator.clipboard.writeText(addr);
      setWallet((prev) => ({ ...prev, copied: true }));
      setTimeout(() => setWallet((prev) => ({ ...prev, copied: false })), 2000);
    }
  };

  // --- UI ---
  // Si l'utilisateur est connecté mais n'a PAS de wallet lié
  if (linkedWallets.length === 0 && !walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl transition-colors duration-300">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">
          Bienvenue sur votre Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
          Pour commencer à suivre vos actifs, connectez un ou plusieurs wallets
          à votre compte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLinkMetaMask}
            disabled={isConnectingMetaMask}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Lier MetaMask
          </button>

          <button
            onClick={handleLinkPhantom}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Lier Phantom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gestion des Wallets - CARD d'en-tête */}
      <section className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl p-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[#D4AF37]" />
              Mes Wallets connectés
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gérez vos sources de données crypto
            </p>
          </div>

          <div className="flex gap-2">
            {isMetaMaskInstalled && (
              <button
                onClick={handleLinkMetaMask}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500/20 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> MetaMask
              </button>
            )}
            {isPhantomInstalled && (
              <button
                onClick={handleLinkPhantom}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500/20 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Phantom
              </button>
            )}
          </div>
        </div>

        {/* Liste des wallets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {linkedWallets.map((w, idx) => (
            <div
              key={`${w.type}-${w.address}-${idx}`}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                w.address === walletAddress
                  ? "border-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-gray-100 dark:border-[#2A2D35] hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      w.type === "metamask"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-white capitalize">
                      {w.type}
                    </p>
                    <button
                      onClick={() => copyAddress(w.address)}
                      className="text-xs text-gray-500 hover:text-[#D4AF37] flex items-center gap-1"
                    >
                      {formatAddress(w.address)} <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeWallet(w.address)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Retirer ce wallet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Stats - Universal */}
      {walletAddress && (
        <section
          aria-label="Portfolio Stats"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Total Value */}
          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
              Portfolio Total (Actif : {formatAddress(walletAddress)})
            </h3>
            {authMethod === "phantom" ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En cours...
              </p>
            ) : portfolio.loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                  $
                  {portfolio.totalValue.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-2 ${
                    portfolio.change24hPercent >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {portfolio.change24hPercent >= 0 ? "+" : ""}
                  {portfolio.change24hPercent.toFixed(2)}% (24h)
                </p>
              </>
            )}
          </div>
          {/* ETH Balance */}
          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
              {authMethod === "phantom" ? "Solde SOL" : "Solde ETH"}
            </h3>
            {authMethod === "phantom" ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En cours...
              </p>
            ) : portfolio.loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            ) : (
              <>
                <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
                  {parseFloat(portfolio.ethBalance).toFixed(4)} ETH
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">
                  ≈ $
                  {portfolio.ethValue.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </>
            )}
          </div>
          {/* 24h Change */}
          <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
              Gain/Perte 24h
            </h3>
            {authMethod === "phantom" ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En cours...
              </p>
            ) : portfolio.loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            ) : (
              <>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    portfolio.change24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {portfolio.change24h >= 0 ? "+" : ""}$
                  {Math.abs(portfolio.change24h).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-2 ${
                    portfolio.change24h >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {portfolio.change24h >= 0 ? "+" : ""}
                  {portfolio.change24hPercent.toFixed(2)}%
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* Performance Chart - Universal */}
      {walletAddress && (
        <section
          aria-label="Performance du wallet"
          className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300 mb-8"
        >
          <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">
            {authMethod === "phantom"
              ? "Performance du wallet (SOL/USD sur 7 jours)"
              : "Performance du wallet (ETH/USD sur 7 jours)"}
          </h3>
          {authMethod === "phantom" ? (
            <div className="h-48 flex items-center justify-center">
              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-purple-800 dark:text-purple-300 text-center">
                  📊 Graphique de performance Solana en cours de développement
                </p>
              </div>
            </div>
          ) : loadingChart ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-pulse h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ) : performanceData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune donnée de performance disponible
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#D4AF37", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "#D4AF37", fontSize: 12 }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={(value) =>
                    `$${value.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  labelStyle={{ color: "#D4AF37" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      )}

      {/* Crypto List - Universal */}
      {walletAddress && (
        <section
          aria-label="Crypto List"
          className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300"
        >
          <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">
            {authMethod === "phantom"
              ? "Mes Tokens Solana"
              : "Mes Cryptomonnaies"}
          </h3>
          {authMethod === "phantom" ? (
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                🚧 Liste des tokens SPL Solana en cours de développement
              </p>
            </div>
          ) : loadingCryptos ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : cryptos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Aucune cryptomonnaie détectée dans votre wallet
            </p>
          ) : (
            <div className="space-y-3">
              {cryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.01] gap-2 sm:gap-0"
                  tabIndex={0}
                  aria-label={`Crypto ${crypto.name}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                        {crypto.name} ({crypto.symbol})
                      </p>
                      {crypto.change24h >= 0 ? (
                        <TrendingUp
                          className="w-4 h-4 text-green-400"
                          aria-label="Trending Up"
                        />
                      ) : (
                        <TrendingDown
                          className="w-4 h-4 text-red-400"
                          aria-label="Trending Down"
                        />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {crypto.balance.toFixed(6)} {crypto.symbol}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      $
                      {crypto.price.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      / {crypto.symbol}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                      $
                      {crypto.value.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        crypto.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {crypto.change24h >= 0 ? "+" : ""}
                      {crypto.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default FinanceDashboard;
