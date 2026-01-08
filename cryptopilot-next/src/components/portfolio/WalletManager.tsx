"use client";
import React from "react";
import { Wallet, Copy, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMetaMask } from "../../hooks/useMetaMask";
import { usePhantom } from "../../hooks/usePhantom";

export default function WalletManager() {
  const { linkedWallets, addWallet, removeWallet, walletAddress } = useAuth();

  const { formatAddress, connectMetaMask, isMetaMaskInstalled } = useMetaMask();

  const { connectPhantom, isPhantomInstalled } = usePhantom();

  const [copied, setCopied] = React.useState(false);

  // Handler pour lier un nouveau wallet
  const handleLinkMetaMask = async () => {
    try {
      const result = await connectMetaMask();
      if (result) {
        addWallet({
          type: "metamask",
          address: result.account,
          chainId: result.chainId,
          connectedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Erreur link MetaMask", e);
    }
  };

  const handleLinkPhantom = async () => {
    try {
      const result = await connectPhantom();
      if (result) {
        addWallet({
          type: "phantom",
          address: result.account,
          connectedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Erreur link Phantom", e);
    }
  };

  const copyAddress = (addr: string) => {
    if (addr) {
      navigator.clipboard.writeText(addr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-xl p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#D4AF37]" />
            Mes Wallets connectés
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez vos sources de données crypto
          </p>
        </div>

        <div className="flex gap-2">
          {isMetaMaskInstalled && (
            <button
              onClick={handleLinkMetaMask}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500/20 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> MetaMask
            </button>
          )}
          {isPhantomInstalled && (
            <button
              onClick={handleLinkPhantom}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500/20 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Phantom
            </button>
          )}
        </div>
      </div>

      {/* Liste des wallets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {linkedWallets.map((w: any, idx: number) => (
          <div
            key={`${w.type}-${w.address}-${idx}`}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              w.address === walletAddress
                ? "border-[#D4AF37] bg-[#D4AF37]/5"
                : "border-gray-100 dark:border-[#2A2D35] hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    w.type === "metamask"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800 dark:text-white capitalize">
                    {w.type}
                  </p>
                  <button
                    onClick={() => copyAddress(w.address)}
                    className="text-xs text-gray-500 hover:text-[#D4AF37] flex items-center gap-1"
                  >
                    {formatAddress(w.address)} <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeWallet(w.address)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Retirer ce wallet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
