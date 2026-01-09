"use client";
import { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import cryptoService from "../../services/cryptoService";

// Interface for Ticker Coin Data
interface TickerCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// Constantes
const REFRESH_INTERVAL = 120000; // 2 minutes
const RETRY_DELAY = 10000; // 10 secondes

// Composant pour chaque crypto
const CryptoItem = memo(({ coin }: { coin: TickerCoin }) => (
  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-800 dark:text-white">
    <Image
      src={coin.image}
      alt={coin.name || "coin"}
      width={20}
      height={20}
      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
    />
    <span className="font-semibold text-[#D4AF37]">
      {coin.symbol?.toUpperCase() || ""}
    </span>
    <span className="hidden xs:inline">
      ${coin.current_price?.toLocaleString() || "N/A"}
    </span>
    <span className="inline xs:hidden">
      $
      {coin.current_price?.toLocaleString("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }) || "N/A"}
    </span>
    <span
      className={`text-xs sm:text-sm ${
        (coin.price_change_percentage_24h || 0) >= 0
          ? "text-green-400"
          : "text-red-500"
      }`}
    >
      {(coin.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
    </span>
  </div>
));
CryptoItem.displayName = "CryptoItem";

function CryptoTicker() {
  const [cryptos, setCryptos] = useState<TickerCoin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cryptoService.getTopCryptos(20);

      if (!Array.isArray(data)) {
        throw new Error("Format de réponse inattendu");
      }

      setCryptos(data);
      setError(null);
    } catch (err: any) {
      console.error("Erreur de chargement:", err);

      if (err.message && err.message.includes("Rate limit")) {
        console.warn("Rate limit atteint, nouvelle tentative dans 10s...");
        setTimeout(fetchData, RETRY_DELAY);
        return;
      }

      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (error) {
    return (
      <div className="w-full text-center py-2 sm:py-3 text-xs sm:text-sm text-red-500 dark:text-red-400 font-sans bg-white dark:bg-[#0B0D12] transition-colors duration-300">
        {error}
      </div>
    );
  }

  if (loading || cryptos.length === 0) {
    return (
      <div className="w-full text-center py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-sans bg-white dark:bg-[#0B0D12] transition-colors duration-300">
        Chargement des données crypto...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border-t border-gray-200 dark:border-[#1C1F26] bg-white dark:bg-[#0B0D12] group cursor-pointer font-sans transition-colors duration-300 z-50">
      <div className="relative flex whitespace-nowrap">
        <div className="animate-marquee flex space-x-6 sm:space-x-10 py-2 sm:py-3 px-4 sm:px-6 group-hover:[animation-play-state:paused]">
          {cryptos.map((coin) => (
            <CryptoItem key={coin.id} coin={coin} />
          ))}
        </div>
        <div
          className="animate-marquee flex space-x-6 sm:space-x-10 py-2 sm:py-3 px-4 sm:px-6 group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {cryptos.map((coin) => (
            <CryptoItem key={`${coin.id}-duplicate`} coin={coin} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

export default CryptoTicker;
