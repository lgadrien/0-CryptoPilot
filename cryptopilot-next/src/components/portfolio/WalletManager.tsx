"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Copy } from "lucide-react";
import { formatEther } from "ethers";

/**
 * Composant pour gérer les wallets liés
 * Permet d'ajouter (via CTA ou modal) et de lister les portefeuilles connectés.
 */
import { useAuth } from "../../context/AuthContext";

export default function WalletManager() {
  const { authMethod, walletAddress, linkedWallets, removeWallet } = useAuth();

  // Combine le wallet principal (session) et les wallets liés supplémentaires
  const allWallets = useMemo(() => {
    const wallets = [];

    // 1. Wallet Principal (si connecté via Web3)
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

    // 2. Wallets Liés (si existants)
    if (linkedWallets && linkedWallets.length > 0) {
      wallets.push(...linkedWallets.map((w) => ({ ...w, isPrimary: false })));
    }

    return wallets;
  }, [authMethod, walletAddress, linkedWallets]);

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      // Toast notification could go here
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (allWallets.length === 0) return null;

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

      <div className="space-y-3">
        {allWallets.map((wallet, index) => (
          <div
            key={wallet.id || index}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 hover:border-[#D4AF37]/30 transition-colors group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Icone Wallet */}
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1F26] flex items-center justify-center shrink-0 shadow-sm">
                {/* Simple Icon placeholder based on type */}
                {wallet.type === "metamask" ? (
                  <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                ) : wallet.type === "phantom" ? (
                  <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                ) : (
                  <div className="w-5 h-5 bg-gray-500 rounded-full"></div>
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
              {/* Balance (Simulated via Prop or Fetch if needed, otherwise kept simple) */}
              {!wallet.isPrimary && (
                <button
                  onClick={() =>
                    removeWallet ? removeWallet(wallet.address) : null
                  }
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/10 rounded"
                >
                  Retirer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Wallet Button (Simplified) */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-center">
        <button className="text-sm font-semibold text-[#D4AF37] hover:text-[#C5A028] transition-colors flex items-center gap-2">
          + Connecter un autre wallet
        </button>
      </div>
    </div>
  );
}
