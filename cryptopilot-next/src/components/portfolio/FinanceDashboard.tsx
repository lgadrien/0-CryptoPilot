"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { useMetaMask } from "../../hooks/useMetaMask";
import { usePhantom } from "../../hooks/usePhantom";

// Sub-components
import WalletManager from "./WalletManager";
import PortfolioStats from "./PortfolioStats";
import PerformanceChart from "./PerformanceChart";
import AssetList from "./AssetList";
import HealthScoreCard from "../dashboard/HealthScoreCard";

export default function FinanceDashboard() {
  const { authMethod, walletAddress, linkedWallets, addWallet } = useAuth();
  const {
    portfolio,
    cryptos,
    loadingCryptos,
    refreshPortfolio,
    currency,
    ghostMode,
  } = usePortfolio();
  const { connectMetaMask } = useMetaMask();
  const { connectPhantom } = usePhantom();

  const [performanceData, setPerformanceData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Handlers for Wallet Connection
  const handleLinkMetaMask = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts && accounts[0])
          addWallet({
            type: "metamask",
            address: accounts[0],
            connectedAt: new Date().toISOString(),
          });
      } else {
        const res = await connectMetaMask();
        if (res)
          addWallet({
            type: "metamask",
            address: res.account,
            connectedAt: new Date().toISOString(),
          });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkPhantom = async () => {
    try {
      const result = await connectPhantom();
      if (result)
        addWallet({
          type: "phantom",
          address: result.account,
          connectedAt: new Date().toISOString(),
        });
    } catch (e) {
      console.error(e);
    }
  };

  const loadPerformanceData = useCallback(async () => {
    // Stub for performance chart data
    setLoadingChart(false);
    setPerformanceData([]);
  }, []);

  useEffect(() => {
    if (linkedWallets.length > 0) {
      loadPerformanceData();
    }
  }, [linkedWallets, loadPerformanceData]);

  // Empty State
  if (linkedWallets.length === 0 && !walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl transition-colors duration-300">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">
          Bienvenue sur votre Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
          Connectez vos portefeuilles pour une vision multi-chaînes complète.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLinkMetaMask}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" /> Lier MetaMask
          </button>
          <button
            onClick={handleLinkPhantom}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" /> Lier Phantom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WalletManager />
      <PortfolioStats
        portfolio={portfolio}
        authMethod={authMethod}
        walletAddress={walletAddress}
        currency={currency}
        ghostMode={ghostMode}
      />
      <HealthScoreCard assets={cryptos} />
      <PerformanceChart
        performanceData={performanceData}
        loading={loadingChart}
        authMethod={authMethod}
        walletAddress={walletAddress}
      />
      <AssetList
        cryptos={cryptos}
        loading={loadingCryptos}
        authMethod={authMethod}
        walletAddress={walletAddress}
        currency={currency}
        ghostMode={ghostMode}
      />
    </div>
  );
}
