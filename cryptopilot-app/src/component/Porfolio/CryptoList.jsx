import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMetaMask } from '../../hooks/useMetaMask';
import cryptoService from '../../services/cryptoService';
import { formatEther } from 'ethers';
import { TrendingUp, TrendingDown } from 'lucide-react';

function CryptoList() {
  const { authMethod } = useAuth();
  const { account, getBalance } = useMetaMask();
  
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCryptoData = async () => {
    try {
      setLoading(true);
      
      // Récupérer le solde ETH
      const balance = await getBalance();
      const ethBalance = formatEther(balance);
      
      // Récupérer les données de prix pour ETH
      const ethPriceData = await cryptoService.getPrice('ethereum');
      const ethValue = parseFloat(ethBalance) * ethPriceData.price;
      
      const cryptoList = [
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          balance: parseFloat(ethBalance),
          value: ethValue,
          change24h: ethPriceData.change24h,
          price: ethPriceData.price
        }
      ];
      
      // Trier par valeur décroissante
      cryptoList.sort((a, b) => b.value - a.value);
      
      setCryptos(cryptoList);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des cryptos:', error);
      setLoading(false);
    }
  };
    
    if (authMethod === 'metamask' && account) {
      loadCryptoData();
    }
  }, [authMethod, account, getBalance]);

  if (authMethod !== 'metamask' || !account) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
        <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">Mes Cryptomonnaies</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg">
              <div className="flex-1">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
        <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">Mes Cryptomonnaies</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucune cryptomonnaie détectée dans votre wallet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
      <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">Mes Cryptomonnaies</h3>
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <div 
            key={crypto.id} 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.01] gap-2 sm:gap-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </p>
                {crypto.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {crypto.balance.toFixed(6)} {crypto.symbol.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                ${crypto.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {crypto.symbol.toUpperCase()}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                ${crypto.value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-xs sm:text-sm font-medium ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CryptoList;
