"use client";
import React from "react";
import { useMetaMask } from "../../hooks/useMetaMask";

interface PortfolioStatsProps {
  portfolio: {
    totalValue: number;
    change24h: number;
    change24hPercent: number;
    ethBalance: string;
    ethValue: number;
    loading: boolean;
  };
  authMethod: string | null;
  walletAddress: string | null;
  currency: string;
  ghostMode: boolean;
}

export default function PortfolioStats({
  portfolio,
  authMethod,
  walletAddress,
  currency = "USD",
  ghostMode = false,
}: PortfolioStatsProps) {
  const { formatAddress } = useMetaMask();

  if (!walletAddress) return null;

  return (
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
              {ghostMode ? (
                "*******"
              ) : (
                <>
                  {currency === "USD" ? "$" : "€"}
                  {portfolio.totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </>
              )}
            </p>
            {!ghostMode && (
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
            )}
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
              {ghostMode
                ? "***"
                : `${parseFloat(portfolio.ethBalance).toFixed(4)} ETH`}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">
              ≈ {currency === "USD" ? "$" : "€"}
              {ghostMode
                ? "***"
                : portfolio.ethValue.toLocaleString("en-US", {
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
              {ghostMode ? (
                "*******"
              ) : (
                <>
                  {portfolio.change24h >= 0 ? "+" : ""}
                  {currency === "USD" ? "$" : "€"}
                  {Math.abs(portfolio.change24h).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </>
              )}
            </p>
            {!ghostMode && (
              <p
                className={`text-xs sm:text-sm mt-2 ${
                  portfolio.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {portfolio.change24h >= 0 ? "+" : ""}
                {portfolio.change24hPercent.toFixed(2)}%
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
