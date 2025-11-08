import { useEffect, useState } from "react";

function CryptoTicker() {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Utilisation de l'API CoinGecko avec un délai anti-rate-limit
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          // Si rate limit (429), on attend et réessaye
          if (response.status === 429) {
            console.warn("Rate limit atteint, attente de 10 secondes...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            return;
          }
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Format de réponse inattendu");
        }
        
        console.log(`✅ ${data.length} cryptos chargées avec succès`);
        setCryptos(data);
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement des données crypto :", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Rafraîchir les données toutes les 2 minutes (au lieu de 1 minute) pour éviter le rate limit
    const interval = setInterval(fetchData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div
        className="w-full text-center py-2 sm:py-3 text-xs sm:text-sm text-red-400 font-sans bg-gray-100 dark:bg-[#0B0D12] transition-colors duration-300"
      >
        {error}
      </div>
    );
  }

  if (loading || cryptos.length === 0) {
    return (
      <div
        className="w-full text-center py-2 sm:py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-500 font-sans bg-gray-100 dark:bg-[#0B0D12] transition-colors duration-300"
      >
        Chargement des données crypto...
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden border-t border-gray-200 dark:border-[#1C1F26] bg-gray-100 dark:bg-[#0B0D12] group cursor-pointer font-sans transition-colors duration-300"
    >
      <div className="relative flex whitespace-nowrap">
        {/* Bande principale */}
        <div className="animate-marquee flex space-x-6 sm:space-x-10 py-2 sm:py-3 px-4 sm:px-6 group-hover:[animation-play-state:paused]">
          {cryptos.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              <img src={coin.image} alt={coin.name} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-[#D4AF37]">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="hidden xs:inline">${coin.current_price.toLocaleString()}</span>
              <span className="inline xs:hidden">${coin.current_price.toLocaleString('en', { notation: 'compact', maximumFractionDigits: 1 })}</span>
              <span
                className={`text-xs sm:text-sm ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        
        {/* Bande dupliquée pour effet infini */}
        <div
          className="animate-marquee flex space-x-6 sm:space-x-10 py-2 sm:py-3 px-4 sm:px-6 group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {cryptos.map((coin) => (
            <div
              key={`${coin.id}-clone`}
              className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
            >
              <img src={coin.image} alt={coin.name} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-[#D4AF37]">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="hidden xs:inline">${coin.current_price.toLocaleString()}</span>
              <span className="inline xs:hidden">${coin.current_price.toLocaleString('en', { notation: 'compact', maximumFractionDigits: 1 })}</span>
              <span
                className={`text-xs sm:text-sm ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Animation CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
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