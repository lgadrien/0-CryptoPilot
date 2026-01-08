import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
      isMetaMask?: boolean;
    };
  }
}

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  // Vérifier si MetaMask est installé
  const isMetaMaskInstalled = () => {
    if (typeof window === "undefined") return false;
    return typeof window.ethereum !== "undefined";
  };

  // Se connecter à MetaMask (Action Manuelle Uniquement)
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
      setError("MetaMask n'est pas détecté.");
      return null;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("Aucun compte trouvé");
      }

      const account = accounts[0];
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const provider = new BrowserProvider(window.ethereum);

      setAccount(account);
      setChainId(chainId);
      setProvider(provider);

      return { account, chainId, provider };
    } catch (err: any) {
      console.error("Erreur connexion MetaMask:", err);
      setError(err.message || "Erreur de connexion");
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setError(null);
  }, []);

  // Gestion des événements (Passive)
  useEffect(() => {
    if (!isMetaMaskInstalled() || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        // Recréer le provider si nécessaire
        if (window.ethereum) {
          setProvider(new BrowserProvider(window.ethereum));
        }
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      window.location.reload();
    };

    // On s'abonne aux events mais ON NE LANCE PAS d'initProvider automatique
    // pour éviter les conflits d'extensions au chargement de page.
    try {
      if (window.ethereum.on) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }
    } catch (e) {
      console.warn(
        "Impossible de s'abonner aux événements MetaMask (conflit potentiel)",
        e
      );
    }

    return () => {
      try {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      } catch (e) {}
    };
  }, [account, disconnect]);

  // Obtenir le solde (via provider ou RPC public si besoin)
  const getBalance = useCallback(
    async (address: string) => {
      const p = provider || new BrowserProvider(window.ethereum!);
      if (!p) return null;
      try {
        return await p.getBalance(address || account!);
      } catch {
        return null;
      }
    },
    [provider, account]
  );

  // Helper de formatage
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
    formatAddress, // Ajouté back
    isConnected: !!account,
  };
}
