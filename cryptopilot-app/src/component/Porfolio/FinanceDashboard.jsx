import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Wallet, Copy, ExternalLink, RefreshCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMetaMask } from '../../hooks/useMetaMask';
import { usePhantom } from '../../hooks/usePhantom';
import cryptoService from '../../services/cryptoService';
import { formatEther } from 'ethers';


function FinanceDashboard() {
  // Contexts
  const { authMethod, walletAddress, account, loginWithMetaMask } = useAuth();
  const { getBalance, formatAddress, getNetworkName, chainId, provider, connectMetaMask, isConnecting: isConnectingMetaMask, error: metaMaskError, isMetaMaskInstalled } = useMetaMask();
  const { account: phantomAccount } = usePhantom();

  // Wallet State
  const [wallet, setWallet] = useState({
    balance: null,
    usd: null,
    priceChange24h: null,
    isLoading: false,
    copied: false,
  });

  // Portfolio State
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    ethBalance: '0',
    ethValue: 0,
    loading: true,
  });


  // Crypto List State
  const [cryptos, setCryptos] = useState([]);
  const [loadingCryptos, setLoadingCryptos] = useState(true);

  // Performance Chart State
  const [performanceData, setPerformanceData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  // Load Performance Chart Data (ETH price history)
  const loadPerformanceData = useCallback(async () => {
    // Désactiver temporairement pour éviter les erreurs CORS
    setLoadingChart(false);
    setPerformanceData([]);
    return;
    
    /* Code désactivé temporairement - erreur CORS 429
    setLoadingChart(true);
    try {
      // Appel direct à l'API CoinGecko (pas besoin de service externe)
      const res = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7');
      const data = await res.json();
      // data.prices = [[timestamp, price], ...]
      const chartData = data.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          date: `${date.getDate()}/${date.getMonth()+1}`,
          price: price,
        };
      });
      setPerformanceData(chartData);
    } catch {
      setPerformanceData([]);
    }
    setLoadingChart(false);
    */
  }, []);


  // Load Wallet Balance
  const loadBalance = useCallback(async () => {
    const address = walletAddress || account;
    if (address && provider) {
      setWallet((prev) => ({ ...prev, isLoading: true }));
      try {
        const bal = await getBalance(address);
        const ethAmount = parseFloat(formatEther(bal));
        let usd = null, priceChange24h = null;
        try {
          const conversion = await cryptoService.convertEthToUsd(ethAmount);
          usd = conversion.usd;
          priceChange24h = conversion.change24h;
        } catch {
          usd = null;
          priceChange24h = null;
        }
        setWallet({
          balance: bal,
          usd,
          priceChange24h,
          isLoading: false,
          copied: false,
        });
      } catch (err) {
        console.error('Erreur de chargement du solde:', err);
        setWallet((prev) => ({ ...prev, balance: null, isLoading: false }));
      }
    }
  }, [walletAddress, account, provider, getBalance]);


  // Load Portfolio Stats
  const loadPortfolioData = useCallback(async () => {
    try {
      setPortfolio((prev) => ({ ...prev, loading: true }));
      const balance = await getBalance();
      const ethBalance = formatEther(balance);
      const priceData = await cryptoService.getPrice('ethereum');
      const ethValue = parseFloat(ethBalance) * priceData.price;
      const change24h = ethValue * (priceData.change24h / 100);
      setPortfolio({
        totalValue: ethValue,
        change24h,
        change24hPercent: priceData.change24h,
        ethBalance,
        ethValue,
        loading: false,
      });
    } catch {
      setPortfolio((prev) => ({ ...prev, loading: false }));
    }
  }, [getBalance]);


  // Load Crypto List
  const loadCryptoData = useCallback(async () => {
    try {
      setLoadingCryptos(true);
      const balance = await getBalance();
      const ethBalance = formatEther(balance);
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
          price: ethPriceData.price,
        },
      ];
      setCryptos(cryptoList.sort((a, b) => b.value - a.value));
      setLoadingCryptos(false);
    } catch {
      setLoadingCryptos(false);
    }
  }, [getBalance]);


  // Synchronise le wallet MetaMask avec le contexte Auth si besoin
  useEffect(() => {
    if (account && (!walletAddress || walletAddress !== account)) {
      loginWithMetaMask(account, chainId);
    }
  }, [account, walletAddress, chainId, loginWithMetaMask]);

  // Initial load
  useEffect(() => {
    console.log('FinanceDashboard - authMethod:', authMethod);
    console.log('FinanceDashboard - walletAddress:', walletAddress);
    console.log('FinanceDashboard - provider:', provider);
    console.log('FinanceDashboard - account:', account);
    
    if (authMethod === 'metamask' && walletAddress && provider) {
      console.log('Chargement des données MetaMask...');
      loadBalance();
      loadPortfolioData();
      loadCryptoData();
      loadPerformanceData();
    } else if (authMethod === 'phantom' && walletAddress) {
      // Pour Phantom, données limitées pour le moment
      console.log('Chargement des données Phantom...');
      // Pas de chargement de données - Phantom/Solana nécessite d'autres APIs
    }
  }, [authMethod, walletAddress, provider, loadBalance, loadPortfolioData, loadCryptoData, loadPerformanceData]);


  // Copy wallet address
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWallet((prev) => ({ ...prev, copied: true }));
      setTimeout(() => setWallet((prev) => ({ ...prev, copied: false })), 2000);
    }
  };

  // Open explorer
  const openInExplorer = () => {
    if (walletAddress) {
      const explorerUrl = chainId === '0x1'
        ? `https://etherscan.io/address/${walletAddress}`
        : `https://sepolia.etherscan.io/address/${walletAddress}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };


  // Si aucun wallet n'est connecté, proposer le bouton de connexion
  if ((authMethod !== 'metamask' && authMethod !== 'phantom') || !walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Connecte ton wallet MetaMask</h2>
        {isMetaMaskInstalled ? (
          <button
            onClick={async () => {
              const result = await connectMetaMask();
              if (result) loginWithMetaMask(result.account, result.chainId);
            }}
            disabled={isConnecting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet className="w-5 h-5" />
            {isConnecting ? 'Connexion...' : 'Se connecter avec MetaMask'}
          </button>
        ) : (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <Wallet className="w-5 h-5" />
            Installer MetaMask
          </a>
        )}
        {metaMaskError && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 text-center">{metaMaskError}</p>
        )}
      </div>
    );
  }


  // --- UI ---
  return (
    <div className="space-y-8">
      {/* Wallet Portfolio Card - Universal */}
      {walletAddress && (
      <section aria-label="Wallet Portfolio" className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${authMethod === 'metamask' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}>
              <Wallet className="w-6 h-6 text-white" aria-label="Wallet Icon" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {authMethod === 'metamask' ? 'Wallet MetaMask' : authMethod === 'phantom' ? 'Wallet Phantom' : 'Mon Wallet'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {authMethod === 'metamask' && chainId ? getNetworkName(chainId) : authMethod === 'phantom' ? 'Solana Network' : ''}
              </p>
            </div>
          </div>
          {authMethod === 'metamask' && (
          <button
            onClick={loadBalance}
            disabled={portfolio.loading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors disabled:opacity-50"
            title="Rafraîchir le solde"
            aria-label="Refresh Balance"
          >
            <RefreshCcw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${portfolio.loading ? 'animate-spin' : ''}`} />
          </button>
          )}
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-800 dark:text-white">{walletAddress ? formatAddress(walletAddress) : '...'}</span>
            <button
              onClick={copyAddress}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
              title="Copier l'adresse"
              aria-label="Copier l'adresse"
            >
              <Copy className={`w-4 h-4 ${wallet.copied ? 'text-green-500' : 'text-gray-400'}`} />
            </button>
            {authMethod === 'metamask' && (
            <button
              onClick={openInExplorer}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
              title="Voir sur Etherscan"
              aria-label="Voir sur Etherscan"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
            )}
            {authMethod === 'phantom' && (
            <button
              onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank', 'noopener,noreferrer')}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
              title="Voir sur Solscan"
              aria-label="Voir sur Solscan"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </button>
            )}
          </div>
        </div>
        <div>
          {authMethod === 'phantom' ? (
            <div>
              <p className="text-3xl font-bold text-[#D4AF37]">$0.00</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Valeur totale du portfolio</p>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">🚧 Intégration Solana en cours</p>
            </div>
          ) : portfolio.loading ? (
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse" />
          ) : (
            <div>
              <p className="text-3xl font-bold text-[#D4AF37]">${portfolio.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Valeur totale du portfolio</p>
              {portfolio.change24hPercent !== null && (
                <p className={`text-sm mt-2 flex items-center gap-1 ${portfolio.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolio.change24hPercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {portfolio.change24hPercent >= 0 ? '+' : ''}{portfolio.change24hPercent.toFixed(2)}% (24h)
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Portfolio Stats - Universal */}
      {walletAddress && (
      <section aria-label="Portfolio Stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Value */}
        <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Portfolio Total</h3>
          {authMethod === 'phantom' ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">En cours...</p>
          ) : portfolio.loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
            </div>
          ) : (
            <>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">${portfolio.totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className={`text-xs sm:text-sm mt-2 ${portfolio.change24hPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{portfolio.change24hPercent >= 0 ? '+' : ''}{portfolio.change24hPercent.toFixed(2)}% (24h)</p>
            </>
          )}
        </div>
        {/* ETH Balance */}
        <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">{authMethod === 'phantom' ? 'Solde SOL' : 'Solde ETH'}</h3>
          {authMethod === 'phantom' ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">En cours...</p>
          ) : portfolio.loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
            </div>
          ) : (
            <>
              <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{parseFloat(portfolio.ethBalance).toFixed(4)} ETH</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-2">≈ ${portfolio.ethValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </>
          )}
        </div>
        {/* 24h Change */}
        <div className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">Gain/Perte 24h</h3>
          {authMethod === 'phantom' ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">En cours...</p>
          ) : portfolio.loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
            </div>
          ) : (
            <>
              <p className={`text-2xl sm:text-3xl font-bold ${portfolio.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{portfolio.change24h >= 0 ? '+' : ''}${Math.abs(portfolio.change24h).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className={`text-xs sm:text-sm mt-2 ${portfolio.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24hPercent.toFixed(2)}%</p>
            </>
          )}
        </div>
      </section>
      )}

      {/* Performance Chart - Universal */}
      {walletAddress && (
      <section aria-label="Performance du wallet" className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300 mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">
          {authMethod === 'phantom' ? 'Performance du wallet (SOL/USD sur 7 jours)' : 'Performance du wallet (ETH/USD sur 7 jours)'}
        </h3>
        {authMethod === 'phantom' ? (
          <div className="h-48 flex items-center justify-center">
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-purple-800 dark:text-purple-300 text-center">
                📊 Graphique de performance Solana en cours de développement
              </p>
            </div>
          </div>
        ) : loadingChart ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ) : performanceData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune donnée de performance disponible</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#D4AF37', fontSize: 12 }} />
              <YAxis tick={{ fill: '#D4AF37', fontSize: 12 }} domain={['auto', 'auto']} />
              <Tooltip formatter={(value) => `$${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} labelStyle={{ color: '#D4AF37' }} />
              <Line type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
      )}

      {/* Crypto List - Universal */}
      {walletAddress && (
      <section aria-label="Crypto List" className="bg-white dark:bg-[#1C1F26] rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
        <h3 className="text-lg sm:text-xl font-bold text-[#D4AF37] mb-4">{authMethod === 'phantom' ? 'Mes Tokens Solana' : 'Mes Cryptomonnaies'}</h3>
        {authMethod === 'phantom' ? (
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              🚧 Liste des tokens SPL Solana en cours de développement
            </p>
          </div>
        ) : loadingCryptos ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0B0D12] rounded-lg">
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
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune cryptomonnaie détectée dans votre wallet</p>
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
                    <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">{crypto.name} ({crypto.symbol})</p>
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" aria-label="Trending Up" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" aria-label="Trending Down" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{crypto.balance.toFixed(6)} {crypto.symbol}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">${crypto.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {crypto.symbol}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm sm:text-base">${crypto.value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className={`text-xs sm:text-sm font-medium ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>

        )}
      </section>
    )}

  </div>
);
}

export default FinanceDashboard;
