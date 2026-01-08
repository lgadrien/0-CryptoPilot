"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMetaMask } from "../../hooks/useMetaMask";
import { usePhantom } from "../../hooks/usePhantom";
import cryptoService from "../../services/cryptoService";
import { formatEther } from "ethers";

// Sub-components
import WalletManager from "./WalletManager";
import PortfolioStats from "./PortfolioStats";
import PerformanceChart from "./PerformanceChart";
import AssetList from "./AssetList";
import HealthScoreCard from "../dashboard/HealthScoreCard";

export default function FinanceDashboard() {
  // Contexts
  const {
    authMethod,
    walletAddress,
    linkedWallets,
    addWallet,
    loginWithMetaMask,
  } = useAuth();

  const {
    getBalance,
    provider,
    connectMetaMask,
    isConnecting: isConnectingMetaMask,
  } = useMetaMask();

  const { connectPhantom } = usePhantom();

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
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loadingCryptos, setLoadingCryptos] = useState(true);

  // Performance Chart State
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Load Performance Chart Data (ETH price history)
  const loadPerformanceData = useCallback(async () => {
    setLoadingChart(false);
    setPerformanceData([]);
    // TODO: Réactiver quand l'API CoinGecko sera stable ou proxyfiée
  }, []);

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
      if (balance === null) {
        throw new Error("Impossible de récupérer le solde");
      }
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
      if (!walletAddress) return;
      setLoadingCryptos(true);
      const balance = await getBalance(walletAddress);

      if (balance === null) {
        setLoadingCryptos(false);
        return;
      }

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
  }, [getBalance, walletAddress]);

  // Handler for linking wallets (CTA for empty state)
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
          address: result.account,
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
      loadPortfolioData();
      loadCryptoData();
      loadPerformanceData();
    }
  }, [
    authMethod,
    walletAddress,
    provider,
    loadPortfolioData,
    loadCryptoData,
    loadPerformanceData,
  ]);

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
      {/* Gestion des Wallets */}
      <WalletManager />

      {/* Portfolio Stats */}
      <PortfolioStats
        portfolio={portfolio}
        authMethod={authMethod}
        walletAddress={walletAddress}
      />

      {/* Wallet Health Score (Gamification) */}
      <HealthScoreCard assets={cryptos} />

      {/* Performance Chart */}
      <PerformanceChart
        performanceData={performanceData}
        loading={loadingChart}
        authMethod={authMethod}
        walletAddress={walletAddress}
      />

      {/* Crypto List */}
      <AssetList
        cryptos={cryptos}
        loading={loadingCryptos}
        authMethod={authMethod}
        walletAddress={walletAddress}
      />
    </div>
  );
}
