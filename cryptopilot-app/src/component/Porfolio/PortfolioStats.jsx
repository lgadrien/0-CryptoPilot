import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMetaMask } from '../../hooks/useMetaMask';
import cryptoService from '../../services/cryptoService';
import { formatEther } from 'ethers';

function PortfolioStats() {
  const { authMethod } = useAuth();
  const { account, getBalance } = useMetaMask();
  
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    ethBalance: '0',
    ethValue: 0,
    loading: true
  });

  useEffect(() => {
    const loadPortfolioData = async () => {
    try {
      setPortfolioData(prev => ({ ...prev, loading: true }));
      
      // Récupérer le solde ETH
      const balance = await getBalance();
      const ethBalance = formatEther(balance);
      
      // Récupérer le prix ETH et la variation 24h
      const priceData = await cryptoService.getPrice('ethereum');
      const ethValue = parseFloat(ethBalance) * priceData.price;
      
      // Calculer la variation 24h en dollars
      const change24h = ethValue * (priceData.change24h / 100);
      
      setPortfolioData({
        totalValue: ethValue,
        change24h: change24h,
        change24hPercent: priceData.change24h,
        ethBalance: ethBalance,
        ethValue: ethValue,
        loading: false
      });
    } catch (error) {
      console.error('Erreur lors du chargement du portfolio:', error);
      setPortfolioData(prev => ({ ...prev, loading: false }));
    }
  };
    
    if (authMethod === 'metamask' && account) {
      loadPortfolioData();
    }
  }, [authMethod, account, getBalance]);

  if (authMethod !== 'metamask' || !account) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Portfolio Total */}
      <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Portfolio Total</h3>
        {portfolioData.loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
              ${portfolioData.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs sm:text-sm mt-2 ${portfolioData.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.change24hPercent >= 0 ? '+' : ''}{portfolioData.change24hPercent.toFixed(2)}% (24h)
            </p>
          </>
        )}
      </div>

      {/* Solde ETH */}
      <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Solde ETH</h3>
        {portfolioData.loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
              {parseFloat(portfolioData.ethBalance).toFixed(4)} ETH
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">
              ≈ ${portfolioData.ethValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </>
        )}
      </div>

      {/* Gain/Perte 24h */}
      <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300 sm:col-span-2 lg:col-span-1">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Gain/Perte 24h</h3>
        {portfolioData.loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ) : (
          <>
            <p className={`text-2xl sm:text-3xl font-bold ${portfolioData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.change24h >= 0 ? '+' : ''}${Math.abs(portfolioData.change24h).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs sm:text-sm mt-2 ${portfolioData.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {portfolioData.change24hPercent >= 0 ? '+' : ''}{portfolioData.change24hPercent.toFixed(2)}%
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default PortfolioStats;
