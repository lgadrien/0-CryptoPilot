"use client";
import React, { useEffect, useState, useCallback } from "react";
import cryptoService from "../../services/cryptoService";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Périodes disponibles
const TIMEFRAMES = [
  { label: "24h", value: "1" },
  { label: "7j", value: "7" },
  { label: "30j", value: "30" },
  { label: "3m", value: "90" },
  { label: "1a", value: "365" },
  { label: "Max", value: "max" },
];

const MarketChart = ({ coinId, color }: { coinId: string; color: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7"); // Default 7j

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      // Si c'est 24h, l'API renvoie des points toutes les 5min (très lourd),
      // CoinGecko gère ça auto.
      const chartData = await cryptoService.getMarketChart(
        coinId,
        timeframe as any
      );

      if (isMounted && chartData && chartData.prices) {
        const formatted = chartData.prices.map((p: any) => ({
          date:
            timeframe === "1"
              ? new Date(p[0]).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date(p[0]).toLocaleDateString(),
          timestamp: p[0],
          price: p[1],
        }));
        setData(formatted);
      }
      if (isMounted) setLoading(false);
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [coinId, timeframe]);

  return (
    <div className="w-full mt-4 mb-2">
      {/* Timeframe Selector */}
      <div className="flex justify-end gap-2 mb-4">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={(e) => {
              e.stopPropagation();
              setTimeframe(tf.value);
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              timeframe === tf.value
                ? "bg-[#D4AF37] text-white shadow-md"
                : "bg-white dark:bg-[#2A2D35] text-gray-500 hover:bg-gray-100 dark:hover:bg-[#353942]"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : !data.length ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Pas de données graphiques
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id={`gradient-${coinId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1C1F26",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: any) => [
                  `$${Number(value).toLocaleString()}`,
                  "Prix",
                ]}
                labelFormatter={(label) => label}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${coinId})`}
                animationDuration={500}
              />
              <XAxis
                dataKey="date"
                hide={true} // Hide X Axis labels for cleaner look in small rows
              />
              <YAxis domain={["auto", "auto"]} hide={true} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default function MarketPage() {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Charger les données (Pagination Classique)
  const fetchMarketData = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setExpandedId(null); // Close accordion on page change

    try {
      const data = await cryptoService.getTopCryptos(targetPage, 50);
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setCryptos(data); // REPLACE data (No append)
        setPage(targetPage);
        setHasMore(data.length === 50);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // Remonter en haut de page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    fetchMarketData(newPage);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLoading(true);
    setExpandedId(null);
    try {
      const results = await cryptoService.searchCryptos(searchQuery);
      setCryptos(results);
      setHasMore(false);
      setPage(1); // Reset page on search
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setHasMore(true);
    setExpandedId(null);
    fetchMarketData(1);
  };

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCryptos = React.useMemo(() => {
    if (!sortConfig) return cryptos;
    return [...cryptos].sort((a, b) => {
      const valA =
        a[sortConfig.key] !== undefined && a[sortConfig.key] !== null
          ? a[sortConfig.key]
          : -Infinity;
      const valB =
        b[sortConfig.key] !== undefined && b[sortConfig.key] !== null
          ? b[sortConfig.key]
          : -Infinity;
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [cryptos, sortConfig]);

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortConfig?.key !== colKey)
      return <span className="ml-1 text-gray-300 dark:text-gray-600">↕</span>;
    return sortConfig.direction === "asc" ? (
      <span className="ml-1 text-[#D4AF37]">↑</span>
    ) : (
      <span className="ml-1 text-[#D4AF37]">↓</span>
    );
  };

  useEffect(() => {
    fetchMarketData(1);
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marché Crypto
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            Cours en temps réel, capitalisation et volume. Page {page}.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row w-full md:w-auto gap-2"
        >
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher (ex: Pepe)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 md:py-2 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-[#2A2D35] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all text-gray-900 dark:text-white text-base"
            />
            <Search className="absolute left-3 top-3.5 md:top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex-1 px-4 py-3 md:py-2 text-sm bg-gray-100 dark:bg-[#2A2D35] text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#353942] transition-colors"
              >
                Effacer
              </button>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="flex-1 px-4 py-3 md:py-2 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#F5D76E] transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Go"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#2A2D35]">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#15171C] border-b border-gray-100 dark:border-[#2A2D35]">
                <th
                  className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8 md:w-12 hidden sm:table-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("market_cap_rank")}
                >
                  # <SortIcon colKey="market_cap_rank" />
                </th>
                <th
                  className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("name")}
                >
                  Actif <SortIcon colKey="name" />
                </th>
                <th
                  className="px-2 md:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("current_price")}
                >
                  Prix <SortIcon colKey="current_price" />
                </th>
                <th
                  className="px-2 md:px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("price_change_percentage_24h")}
                >
                  24h <SortIcon colKey="price_change_percentage_24h" />
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("market_cap")}
                >
                  Market Cap <SortIcon colKey="market_cap" />
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-[#20232b]"
                  onClick={() => handleSort("total_volume")}
                >
                  Volume 24h <SortIcon colKey="total_volume" />
                </th>
                <th className="w-8 md:w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2A2D35]">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-2 md:px-6 py-4 hidden sm:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </td>
                    <td className="px-2 md:px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                    </td>
                    <td className="px-2 md:px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right hidden lg:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                    </td>
                    <td></td>
                  </tr>
                ))
              ) : sortedCryptos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                sortedCryptos.map((coin, index) => (
                  <React.Fragment key={`${coin.id}-${index}`}>
                    <tr
                      onClick={() => toggleRow(coin.id)}
                      className={`hover:bg-gray-50 dark:hover:bg-[#252830] transition-colors duration-150 group cursor-pointer ${
                        expandedId === coin.id
                          ? "bg-gray-50 dark:bg-[#252830]"
                          : ""
                      }`}
                    >
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-400 w-8 md:w-12 hidden sm:table-cell">
                        {coin.market_cap_rank || "-"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 md:gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://assets.coingecko.com/coins/images/1/large/bitcoin.png";
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                              {coin.name}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                        $
                        {coin.current_price?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm font-semibold">
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            (coin.price_change_percentage_24h || 0) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          <span className="hidden md:inline">
                            {(coin.price_change_percentage_24h || 0) >= 0 ? (
                              <TrendingUp size={14} />
                            ) : (
                              <TrendingDown size={14} />
                            )}
                          </span>
                          {Math.abs(
                            coin.price_change_percentage_24h || 0
                          ).toFixed(1)}
                          %
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        ${coin.market_cap?.toLocaleString("en-US")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        ${coin.total_volume?.toLocaleString("en-US")}
                      </td>
                      <td className="px-2 md:px-6 py-4 text-center w-8 md:w-10">
                        {expandedId === coin.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                    </tr>

                    {expandedId === coin.id && (
                      <tr className="bg-gray-50 dark:bg-[#20232b] animate-fade-in">
                        <td
                          colSpan={7}
                          className="px-2 md:px-6 pb-4 md:pb-6 pt-0"
                        >
                          <div className="border-t border-gray-100 dark:border-[#2A2D35] pt-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                              <h3 className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Prix -{" "}
                                <span className="text-[#D4AF37]">
                                  {coin.name}
                                </span>
                              </h3>
                              {/* Mobile Extra Info */}
                              <div className="md:hidden flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <div>
                                  <span className="font-bold">Mkt Cap:</span> $
                                  {coin.market_cap?.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-bold">Vol 24h:</span> $
                                  {coin.total_volume?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <MarketChart
                              coinId={coin.id}
                              color={
                                (coin.price_change_percentage_24h || 0) >= 0
                                  ? "#10B981"
                                  : "#EF4444"
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION CONTROLS */}
          {!searchQuery && !loading && (
            <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-gray-100 dark:border-[#2A2D35]">
              <div className="flex justify-between w-full sm:w-auto gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex-1 sm:flex-none px-4 py-3 md:py-2 text-sm font-semibold bg-gray-100 dark:bg-[#2A2D35] text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#353942] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Précédent
                </button>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasMore}
                  className="flex-1 sm:flex-none px-4 py-3 md:py-2 text-sm font-semibold bg-gray-100 dark:bg-[#2A2D35] text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#353942] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>

              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Page {page}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
