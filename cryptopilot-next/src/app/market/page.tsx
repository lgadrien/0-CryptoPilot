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
} from "lucide-react";

export default function MarketPage() {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Charger les données initiales ou suivantes
  const fetchMarketData = useCallback(
    async (reset = false) => {
      const pageToLoad = reset ? 1 : page;
      if (reset) {
        setLoading(true);
        setCryptos([]);
      } else {
        setLoadingMore(true);
      }

      try {
        const data = await cryptoService.getTopCryptos(pageToLoad, 50);
        if (data.length < 50) setHasMore(false);

        setCryptos((prev) => (reset ? data : [...prev, ...data]));
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [page]
  );

  // Rechercher
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLoading(true);
    try {
      const results = await cryptoService.searchCryptos(searchQuery);
      setCryptos(results);
      setHasMore(false); // Pas de pagination en mode recherche pour l'instant
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  // Reset recherche
  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setHasMore(true);
    fetchMarketData(true);
  };

  useEffect(() => {
    fetchMarketData(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Marché Crypto
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Cours en temps réel, capitalisation et volume.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher (ex: Pepe, Kaspa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-[#2A2D35] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all text-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-[#2A2D35] text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#353942] transition-colors"
            >
              Effacer
            </button>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#F5D76E] transition-colors disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go"}
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#2A2D35]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#15171C] border-b border-gray-100 dark:border-[#2A2D35]">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actif
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h %
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Market Cap
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Volume 24h
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2A2D35]">
              {loading ? (
                // Squelette de chargement
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right hidden lg:table-cell">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : cryptos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                cryptos.map((coin, index) => (
                  <tr
                    key={`${coin.id}-${index}`}
                    className="hover:bg-gray-50 dark:hover:bg-[#252830] transition-colors duration-150 group cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 w-12">
                      {coin.market_cap_rank || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://assets.coingecko.com/coins/images/1/large/bitcoin.png";
                          }}
                        />
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {coin.name}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                              {coin.symbol.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                      $
                      {coin.current_price?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          (coin.price_change_percentage_24h || 0) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {(coin.price_change_percentage_24h || 0) >= 0 ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {Math.abs(
                          coin.price_change_percentage_24h || 0
                        ).toFixed(2)}
                        %
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      ${coin.market_cap?.toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      ${coin.total_volume?.toLocaleString("en-US")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* LOAD MORE BUTTON */}
          {hasMore && !searchQuery && !loading && (
            <div className="p-4 flex justify-center border-t border-gray-100 dark:border-[#2A2D35]">
              <button
                onClick={() => fetchMarketData(false)}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-[#2A2D35] hover:bg-gray-200 dark:hover:bg-[#353942] text-gray-700 dark:text-white rounded-xl transition-all font-semibold disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                Charger plus (Top {page * 50 + 50})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
