"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PerformanceChartProps {
  performanceData: any[];
  loading: boolean;
  authMethod: string | null;
  walletAddress: string | null;
}

export default function PerformanceChart({
  performanceData,
  loading,
  authMethod,
  walletAddress,
}: PerformanceChartProps) {
  if (!walletAddress) return null;

  return (
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
      ) : loading ? (
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
            <XAxis dataKey="date" tick={{ fill: "#D4AF37", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#D4AF37", fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value: any) =>
                `$${Number(value).toLocaleString("fr-FR", {
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
  );
}
