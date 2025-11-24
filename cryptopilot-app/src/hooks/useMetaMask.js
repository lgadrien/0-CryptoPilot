import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

export function useMetaMask() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  // Vérifier si MetaMask est installé
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Se connecter à MetaMask
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask n\'est pas installé. Veuillez l\'installer depuis metamask.io');
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Demander l'accès au compte
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('Aucun compte trouvé');
      }

      const account = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Créer un provider ethers
      const provider = new BrowserProvider(window.ethereum);
      
      setAccount(account);
      setChainId(chainId);
      setProvider(provider);

      return { account, chainId, provider };
    } catch (err) {
      console.error('Erreur de connexion MetaMask:', err);
      if (err.code === 4001) {
        setError('Connexion refusée par l\'utilisateur');
      } else {
        setError(err.message || 'Erreur de connexion à MetaMask');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Se déconnecter
  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setError(null);
  }, []);

  // Écouter les changements de compte
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(chainId);
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account, disconnect]);

  // Obtenir le solde en ETH
  const getBalance = useCallback(async (address) => {
    if (!provider) return null;

    try {
      const balance = await provider.getBalance(address || account);
      return balance;
    } catch (err) {
      console.error('Erreur lors de la récupération du solde:', err);
      return null;
    }
  }, [provider, account]);

  // Formater l'adresse (0x1234...5678)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Obtenir le nom du réseau
  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0x38': 'BSC Mainnet',
      '0x61': 'BSC Testnet',
    };
    return networks[chainId] || 'Réseau inconnu';
  };

  return {
    account,
    chainId,
    provider,
    isConnecting,
    error,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectMetaMask,
    disconnect,
    getBalance,
    formatAddress,
    getNetworkName,
    isConnected: !!account,
  };
}
