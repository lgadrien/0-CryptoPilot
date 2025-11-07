import { useEffect, useState } from "react";

function CryptoTicker() {
  const [cryptos, setCryptos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cryptos");

        if (!res.ok) {
          // Gestion d’erreur côté proxy
          const details = await res.text();
          throw new Error(`Erreur HTTP ${res.status}: ${details}`);
        }

        const data = await res.json();

        // Vérifie que c’est bien un tableau
        if (!Array.isArray(data)) {
          throw new Error("Format de réponse inattendu (non-tableau)");
        }

        setCryptos(data);
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement des données crypto :", err);
        setError("Impossible de charger les données depuis le proxy.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div
        className="w-full text-center py-3 text-red-400 font-[Nunito]"
        style={{ backgroundColor: "#0B0D12" }}
      >
        {error}
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div
        className="w-full text-center py-3 text-gray-500 font-[Nunito]"
        style={{ backgroundColor: "#0B0D12" }}
      >
        Chargement des données crypto...
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden border-t border-[#1C1F26] group cursor-pointer font-[Nunito]"
      style={{ backgroundColor: "#0B0D12" }}
    >
      <div className="relative flex whitespace-nowrap">
        {/* Bande principale */}
        <div className="animate-marquee flex space-x-10 py-3 px-6 group-hover:[animation-play-state:paused]">
          {cryptos.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center space-x-2 text-sm text-gray-300"
            >
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="font-semibold text-[#D4AF37]">
                {coin.symbol.toUpperCase()}
              </span>
              <span>${coin.current_price.toLocaleString()}</span>
              <span
                className={`${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Bande dupliquée pour effet infini */}
        <div
          className="animate-marquee flex space-x-10 py-3 px-6 group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {cryptos.map((coin) => (
            <div
              key={`${coin.id}-clone`}
              className="flex items-center space-x-2 text-sm text-gray-300"
            >
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              <span className="font-semibold text-[#D4AF37]">
                {coin.symbol.toUpperCase()}
              </span>
              <span>${coin.current_price.toLocaleString()}</span>
              <span
                className={`${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
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
