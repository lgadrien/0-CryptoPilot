import { useState, useEffect, useCallback } from 'react';

export function usePhantom() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier si Phantom est installé
  const isPhantomInstalled = () => {
    return typeof window.solana !== 'undefined' && window.solana.isPhantom;
  };

  // Se connecter à Phantom
  const connectPhantom = useCallback(async () => {
    if (!isPhantomInstalled()) {
      setError('Phantom n\'est pas installé. Veuillez l\'installer depuis phantom.app');
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Demander l'accès au wallet
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      
      setAccount(publicKey);

      return { account: publicKey };
    } catch (err) {
      console.error('Erreur de connexion Phantom:', err);
      if (err.code === 4001) {
        setError('Connexion refusée par l\'utilisateur');
      } else {
        setError(err.message || 'Erreur de connexion à Phantom');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Se déconnecter
  const disconnect = useCallback(async () => {
    try {
      if (isPhantomInstalled() && window.solana.isConnected) {
        await window.solana.disconnect();
      }
      setAccount(null);
      setError(null);
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
    }
  }, []);

  // Écouter les changements de compte
  useEffect(() => {
    if (!isPhantomInstalled()) return;

    // Réinitialiser l'account si Phantom est déjà connecté
    const initAccount = async () => {
      try {
        if (window.solana.isConnected) {
          const publicKey = window.solana.publicKey.toString();
          setAccount(publicKey);
        }
      } catch (err) {
        console.error('Erreur d\'initialisation de Phantom:', err);
      }
    };

    initAccount();

    const handleAccountChanged = (publicKey) => {
      if (publicKey) {
        setAccount(publicKey.toString());
      } else {
        disconnect();
      }
    };

    const handleDisconnect = () => {
      setAccount(null);
    };

    window.solana.on('accountChanged', handleAccountChanged);
    window.solana.on('disconnect', handleDisconnect);

    return () => {
      if (window.solana.removeListener) {
        window.solana.removeListener('accountChanged', handleAccountChanged);
        window.solana.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [disconnect]);

  return {
    account,
    connectPhantom,
    disconnect,
    isConnecting,
    error,
    isPhantomInstalled: isPhantomInstalled(),
  };
}
