"use client";
import React, { useMemo, useState } from "react";
import { Copy, Plus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePhantom } from "../../hooks/usePhantom";

export default function WalletManager() {
  const { authMethod, walletAddress, linkedWallets, removeWallet, addWallet } =
    useAuth();
  const { connectPhantom } = usePhantom();

  const [showConnectMenu, setShowConnectMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper pour trouver le VRAI provider MetaMask
  const getMetaMaskProvider = () => {
    if (typeof window === "undefined") return null;
    const provider = window.ethereum;

    if (!provider) return null;

    // Si plusieurs wallets injectés (ex: Phantom + MetaMask)
    if ((provider as any).providers) {
      const found = (provider as any).providers.find((p: any) => p.isMetaMask);
      return found || provider;
    }

    if (provider.isMetaMask) return provider;

    return provider; // Fallback
  };

  // Combine wallets
  const allWallets = useMemo(() => {
    const wallets = [];
    if (
      (authMethod === "metamask" || authMethod === "phantom") &&
      walletAddress
    ) {
      wallets.push({
        address: walletAddress,
        type: authMethod,
        isPrimary: true,
        id: "primary",
      });
    }
    if (linkedWallets && linkedWallets.length > 0) {
      wallets.push(...linkedWallets.map((w) => ({ ...w, isPrimary: false })));
    }
    return wallets;
  }, [authMethod, walletAddress, linkedWallets]);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const handleConnect = async (type: "metamask" | "phantom") => {
    setShowConnectMenu(false);
    setError(null);
    console.log(`[WalletManager] Tentative de connexion à ${type}...`);

    try {
      let address = "";
      let chainId = "";

      if (type === "metamask") {
        const provider = getMetaMaskProvider();
        if (!provider) {
          throw new Error(
            "MetaMask non détecté. Assurez-vous qu'il est activé."
          );
        }

        // Appel Native Brut sans ethers pour éviter les erreurs de parsing d'extension
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          address = accounts[0];
          try {
            chainId = await provider.request({ method: "eth_chainId" });
          } catch (e) {
            console.warn("Erreur chainId", e);
          }
        } else {
          return; // Refus utilisateur
        }
      } else if (type === "phantom") {
        const result = await connectPhantom();
        if (!result) return;
        address = result.account;
      }

      if (!address) {
        console.error("[WalletManager] Aucune adresse récupérée.");
        return;
      }

      // Check for duplicates
      if (
        allWallets.some(
          (w) => w.address.toLowerCase() === address.toLowerCase()
        )
      ) {
        setError("Ce wallet est déjà connecté.");
        return;
      }

      // Add to Context
      console.log("[WalletManager] Ajout...", { address });
      await addWallet({
        address,
        type,
        chainId,
        connectedAt: new Date().toISOString(),
      });
      console.log("[WalletManager] Succès.");
    } catch (err: any) {
      console.error("[WalletManager] Erreur:", err);
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="bg-white dark:bg-[#15171C] rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Mes Portefeuilles Connectés
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md text-gray-500">
          {allWallets.length} Actif(s)
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {allWallets.map((wallet, index) => (
          <div
            key={wallet.address + index}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Icone Wallet */}
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1F26] flex items-center justify-center shrink-0 shadow-sm border border-gray-100 dark:border-white/5">
                {wallet.type === "metamask" ? (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    MM
                  </div>
                ) : wallet.type === "phantom" ? (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                    PH
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  {wallet.type === "metamask" ? "MetaMask" : "Phantom"}
                  {wallet.isPrimary && (
                    <span className="text-[10px] uppercase bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/20">
                      Principal
                    </span>
                  )}
                </p>
                <p
                  className="text-xs text-gray-500 font-mono truncate flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => copyToClipboard(wallet.address)}
                >
                  {truncateAddress(wallet.address)}
                  <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!wallet.isPrimary && (
                <button
                  onClick={() =>
                    removeWallet ? removeWallet(wallet.address) : null
                  }
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
                >
                  Retirer
                </button>
              )}
            </div>
          </div>
        ))}

        {allWallets.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            Aucun portefeuille connecté.
          </div>
        )}
      </div>

      {/* Add Wallet Section */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
        {!showConnectMenu ? (
          <button
            onClick={() => setShowConnectMenu(true)}
            className="w-full py-2 text-sm font-semibold text-[#D4AF37] hover:text-[#C5A028] hover:bg-[#D4AF37]/5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-dashed border-[#D4AF37]/30"
          >
            <Plus className="w-4 h-4" /> Connecter un autre wallet
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleConnect("metamask")}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                MM
              </div>
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                MetaMask
              </span>
            </button>

            <button
              onClick={() => handleConnect("phantom")}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs">
                PH
              </div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                Phantom
              </span>
            </button>

            <button
              onClick={() => setShowConnectMenu(false)}
              className="col-span-2 text-xs text-gray-400 hover:text-gray-600 mt-1"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
