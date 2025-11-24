import { useState, useEffect } from 'react';
import { Wallet, Copy, ExternalLink, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMetaMask } from '../../hooks/useMetaMask';
import cryptoService from '../../services/cryptoService';
import { formatEther } from 'ethers';

function WalletPortfolio() {
  const { authMethod, walletAddress } = useAuth();
  const { getBalance, formatAddress, getNetworkName, chainId, provider } = useMetaMask();
  const [balance, setBalance] = useState(null);
  const [balanceUsd, setBalanceUsd] = useState(null);
  const [priceChange24h, setPriceChange24h] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  // Charger le solde
  const loadBalance = async () => {
    if (walletAddress && provider) {
      setIsLoadingBalance(true);
      try {
        const bal = await getBalance(walletAddress);
        setBalance(bal);
        
        // Récupérer le prix en USD
        const ethAmount = parseFloat(formatEther(bal));
        
        try {
          const conversion = await cryptoService.convertEthToUsd(ethAmount);
          setBalanceUsd(conversion.usd);
          setPriceChange24h(conversion.change24h);
        } catch (priceError) {
          console.error('Erreur lors de la récupération du prix:', priceError);
          // Le solde ETH sera quand même affiché
        }
      } catch (error) {
        console.error('Erreur lors du chargement du solde:', error);
        setBalance(null);
      } finally {
        setIsLoadingBalance(false);
      }
    }
  };

  useEffect(() => {
    if (authMethod === 'metamask' && walletAddress && provider) {
      loadBalance();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, authMethod, provider]);

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInExplorer = () => {
    if (walletAddress) {
      const explorerUrl = chainId === '0x1' 
        ? `https://etherscan.io/address/${walletAddress}`
        : `https://sepolia.etherscan.io/address/${walletAddress}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (authMethod !== 'metamask') {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Wallet MetaMask
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chainId && getNetworkName(chainId)}
            </p>
          </div>
        </div>
        <button
          onClick={loadBalance}
          disabled={isLoadingBalance}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors disabled:opacity-50"
          title="Rafraîchir le solde"
        >
          <RefreshCcw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoadingBalance ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Adresse du wallet */}
      <div className="mb-6">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
          Adresse
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 dark:bg-[#0B0D12] px-4 py-3 rounded-xl">
            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
              {walletAddress}
            </p>
          </div>
          <button
            onClick={copyAddress}
            className="p-3 bg-gray-100 dark:bg-[#2A2D35] rounded-xl hover:bg-gray-200 dark:hover:bg-[#3A3D45] transition-colors"
            title={copied ? 'Copié !' : 'Copier l\'adresse'}
          >
            <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`} />
          </button>
          <button
            onClick={openInExplorer}
            className="p-3 bg-gray-100 dark:bg-[#2A2D35] rounded-xl hover:bg-gray-200 dark:hover:bg-[#3A3D45] transition-colors"
            title="Voir sur l'explorateur"
          >
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {formatAddress(walletAddress)}
        </p>
      </div>

      {/* Solde ETH */}
      <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 dark:from-[#D4AF37]/20 dark:to-[#F5D76E]/20 rounded-xl p-6">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2 block">
          Solde
        </label>
        {isLoadingBalance ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400">Chargement...</span>
          </div>
        ) : balance !== null ? (
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {parseFloat(formatEther(balance)).toFixed(6)} ETH
            </p>
            {balanceUsd !== null && (
              <div className="mt-2">
                <p className="text-lg font-semibold text-[#D4AF37]">
                  ≈ ${balanceUsd.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {priceChange24h !== null && (
                  <p className={`text-xs font-medium mt-1 ${
                    priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}% (24h)
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Impossible de charger le solde
          </p>
        )}
      </div>

      {/* Informations supplémentaires */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-[#0B0D12] rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type de compte</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">MetaMask</p>
        </div>
        <div className="bg-gray-50 dark:bg-[#0B0D12] rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Connecté</p>
          </div>
        </div>
      </div>

      {/* Note de sécurité */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          <span className="font-semibold">💡 Astuce :</span> Votre wallet est lié à votre compte MetaMask. 
          Assurez-vous de garder votre phrase de récupération en sécurité.
        </p>
      </div>
    </div>
  );
}

export default WalletPortfolio;
