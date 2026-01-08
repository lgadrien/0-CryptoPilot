"use client";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetListProps {
  cryptos: any[];
  loading: boolean;
  authMethod: string | null;
  walletAddress: string | null;
}

export default function AssetList({
  cryptos,
  loading,
  authMethod,
  walletAddress,
}: AssetListProps) {
  if (!walletAddress) return null;

  return (
    <section
      aria-label="Crypto List"
      className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300"
    >
      <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">
        {authMethod === "phantom" ? "Mes Tokens Solana" : "Mes Cryptomonnaies"}
      </h3>
      {authMethod === "phantom" ? (
        <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            🚧 Liste des tokens SPL Solana en cours de développement
          </p>
        </div>
      ) : loading ? (
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
                    crypto.change24h >= 0 ? "text-green-400" : "text-red-400"
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
  );
}
