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
      if (isConnecting) return null; // Prevent double trigger
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
      if (err.code === -32002) {
        // "Already processing eth_requestAccounts"
        setError(
          "Veuillez ouvrir MetaMask pour compléter la demande précédente."
        );
      } else {
        console.error("Erreur connexion MetaMask:", err);
        setError(err.message || "Erreur de connexion");
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setError(null);
  }, []);

  // Gestion des événements et Auto-Connexion (Eager Connect)
  useEffect(() => {
    if (!isMetaMaskInstalled() || !window.ethereum) return;

    const init = async () => {
      try {
        // Vérifier si déjà connecté (sans prompt)
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts && accounts.length > 0) {
          const acc = accounts[0];
          const cId = await window.ethereum.request({ method: "eth_chainId" });
          const prov = new BrowserProvider(window.ethereum);

          setAccount(acc);
          setChainId(cId);
          setProvider(prov);
        }
      } catch (e) {
        console.debug("Eager connect failed", e);
      }
    };

    init();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        // Recréer le provider si nécessaire
        if (window.ethereum) {
          setProvider(new BrowserProvider(window.ethereum));
        }
        window.location.reload();
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
      window.location.reload();
    };

    try {
      if (window.ethereum.on) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }
    } catch (e) {
      console.warn("Event subscription failed", e);
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
  }, [disconnect]); // Removed account dependency to avoid loops

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
