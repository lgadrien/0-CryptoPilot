"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  CreditCard,
  Trash2,
  Shield,
  Coins,
  Bell,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import WalletManager from "../../components/portfolio/WalletManager";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    walletAddress,
    linkedWallets,
    logout,
    authMethod,
    updateProfile,
  } = useAuth();
  const { currency, setCurrency, ghostMode, toggleGhostMode } = usePortfolio();

  // États locaux persistant (préférences utilisateur)
  const [notifications, setNotifications] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // États d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Données Utilisateur Réelles (Derivées du Context)
  const displayName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.username ||
    "Investisseur";
  const displayAddress = user?.user_metadata?.address || user?.address || ""; // Pas d'adresse par défaut
  const displayIdentity = user?.email || walletAddress || "Anonyme";

  const handleStartEdit = () => {
    setEditName(displayName);
    setEditAddress(displayAddress);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault(); // Empêcher reload form
    try {
      await updateProfile({
        username: editName,
        full_name: editName,
        address: editAddress,
      });
      setIsEditing(false);
    } catch (e) {
      alert("Erreur lors de la mise à jour");
      console.error(e);
    }
  };

  // Charger les préférences au montage
  useEffect(() => {
    const savedNotifs = localStorage.getItem("notificationsEnabled");
    if (savedNotifs) setNotifications(savedNotifs === "true");
  }, []);

  // Sauvegarder les préférences lors des changements
  const handleCurrencyToggle = () => {
    const newVal = currency === "EUR" ? "USD" : "EUR";
    setCurrency(newVal); // Updates global context
    // window.dispatchEvent(new Event("currencyChanged")); // Context handles update now
  };

  const handleGhostToggle = () => {
    toggleGhostMode();
  };

  const toggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    localStorage.setItem("notificationsEnabled", String(newVal));
  };

  const handleDeleteData = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible."
      )
    )
      return;

    setIsDeleting(true);

    // 1. Déconnexion
    await logout();

    // 2. Nettoyage LocalStorage complet
    // On garde le theme pour éviter un flashbang blanc
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) localStorage.setItem("theme", theme);

    // 3. Feedback et Redirection
    setTimeout(() => {
      alert("Données locales effacées avec succès.");
      setIsDeleting(false);
      router.push("/");
    }, 1000);
  };

  // Formatage date inscription
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
      })
    : "Récemment";

  // Calcul du Plan
  const walletCount = linkedWallets.length + (walletAddress ? 1 : 0);
  const maxWalletsFree = 1;
  const isPro = false;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#0B0D12] text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 md:p-8">
      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1C1F26] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-[#2A2D35] p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Modifier le Profil</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-[#2A2D35] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse (Optionnel)
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-[#2A2D35] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                  placeholder="Paris, France..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold hover:bg-[#C5A028] shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER: Identity Card (Bento Style) */}
        <div className="relative group rounded-3xl p-6 md:p-8 overflow-hidden bg-white dark:bg-[#15171C] border border-gray-200 dark:border-white/5 shadow-xl transition-all hover:shadow-2xl">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1C1F26] dark:to-[#0F1115] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 group/name">
                  {displayName}
                  <button
                    onClick={handleStartEdit}
                    className="opacity-50 hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-[#D4AF37]"
                    title="Modifier le profil"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </h1>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-mono bg-gray-100 dark:bg-black/20 px-2 py-1 rounded inline-block">
                  {displayIdentity}
                </p>
                {displayAddress && (
                  <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1">
                    📍 {displayAddress}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  Membre depuis {joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#D4AF37]" />
                  {walletCount} Wallet(s) actif(s)
                </span>
              </div>
            </div>

            {/* Status Badge */}
            {!isPro ? (
              <Link href="/pricing" className="shrink-0 mt-4 md:mt-0">
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/10 to-[#F5D76E]/10 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer group/badge hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-3 h-3 fill-current animate-pulse" />
                    Upgrade Plan
                  </span>
                </div>
              </Link>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Sovereign Member 👑
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Wallet Management */}
        <div>
          <WalletManager />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferences */}
          <div className="bg-white/80 dark:bg-[#15171C]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Préférences</h2>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <p className="font-medium text-sm">Devise principale</p>
                <p className="text-xs text-gray-500">EUR / USD</p>
              </div>
              <button
                onClick={handleCurrencyToggle}
                className="relative w-14 h-8 bg-gray-200 dark:bg-gray-800 rounded-full p-1 transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
              >
                <div
                  className={`w-6 h-6 bg-white dark:bg-[#D4AF37] rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] font-bold text-black ${
                    currency === "USD" ? "translate-x-6" : "translate-x-0"
                  }`}
                >
                  {currency === "USD" ? "$" : "€"}
                </div>
              </button>
            </div>

            {/* Ghost Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  Mode Ghost 👻
                </p>
                <p className="text-xs text-gray-500">
                  Masquer solde au démarrage
                </p>
              </div>
              <button
                onClick={handleGhostToggle}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                  ghostMode ? "bg-[#D4AF37]" : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                    ghostMode ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div>
                <p className="font-medium text-sm">Alertes de Prix</p>
                <p className="text-xs text-gray-500">
                  Mouvements &gt; 10% / 24h
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                  notifications
                    ? "bg-[#D4AF37] border-transparent"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {notifications && (
                  <div className="w-3 h-3 bg-white rounded-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white/80 dark:bg-[#15171C]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">Mon Offre</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600 dark:text-gray-400">
                    Slots Wallets
                  </span>
                  <span
                    className={
                      walletCount > maxWalletsFree
                        ? "text-red-500 font-bold"
                        : "text-green-500 font-bold"
                    }
                  >
                    {walletCount} / {isPro ? "∞" : maxWalletsFree}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      walletCount > maxWalletsFree
                        ? "bg-red-500"
                        : "bg-[#D4AF37]"
                    }`}
                    style={{
                      width: `${Math.min(
                        (walletCount / (isPro ? 10 : maxWalletsFree)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {walletCount > maxWalletsFree
                    ? "⚠️ Vous dépassez la limite du plan gratuit."
                    : "Connectez plus de portefeuilles pour un suivi complet."}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/pricing"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
              >
                {isPro
                  ? "Gérer mon abonnement"
                  : "Débloquer l'Illimité (Sovereign)"}
              </Link>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-6 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
          <h3 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5" />
            Zone de Danger (Self-Custody)
          </h3>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-red-800 dark:text-red-300/80 max-w-lg leading-relaxed">
              Cette action effacera <strong>toutes les données locales</strong>{" "}
              (wallets connectés, préférences, cache) de ce navigateur. Comme
              CryptoPilot est "Self-Custody", aucune donnée privée n'est sur nos
              serveurs à part votre email de compte.
            </p>
            <button
              onClick={handleDeleteData}
              disabled={isDeleting}
              className="whitespace-nowrap px-5 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all text-sm shadow-sm"
            >
              {isDeleting
                ? "Nettoyage en cours..."
                : "🗑️  Effacer le Stockage Local"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
