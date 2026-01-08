"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useMetaMask } from "../../hooks/useMetaMask";
import { usePhantom } from "../../hooks/usePhantom";
import {
  User,
  LogOut,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Bell,
  Wallet,
} from "lucide-react";

// Composant NavLink mémorisé
const NavLink = memo(
  ({ to, onClick, icon: Icon, children, className = "" }) => (
    <Link href={to} onClick={onClick} className={className}>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Link>
  )
);
NavLink.displayName = "NavLink";

function Header() {
  const { isAuthenticated, user, logout, authMethod, walletAddress } =
    useAuth();
  const { formatAddress } = useMetaMask();
  const { account: phantomAccount } = usePhantom();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);

  const notificationCount = 3;

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [logout, router]);

  const closeMobileMenu = useCallback(() => setShowMobileMenu(false), []);
  const toggleUserMenu = useCallback(
    () => setShowUserMenu((prev) => !prev),
    []
  );
  const toggleMobileMenu = useCallback(
    () => setShowMobileMenu((prev) => !prev),
    []
  );

  // Fermer les menus si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showMobileMenu || showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu, showUserMenu]);

  return (
    <header
      ref={headerRef}
      className="w-full bg-white dark:bg-[#0B0D12] border-b border-gray-200 dark:border-[#1C1F26] transition-colors duration-300 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 h-16 md:h-20 font-[Nunito]">
        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            onClick={closeMobileMenu}
            className="group flex items-center space-x-2 md:space-x-3 flex-shrink-0"
          >
            <Image
              src="/assets/LogonoBG.png"
              alt="CryptoPilot"
              width={36}
              height={36}
              className="w-8 h-8 md:w-9 md:h-9 transition-all duration-300 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
              priority
            />
            <h1 className="text-lg md:text-2xl font-bold text-[#D4AF37] tracking-wide transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              CryptoPilot
            </h1>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation (Pushed to Right via ml-auto) */}
        <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
          {/* Navigation is contextual: If guest, show Home/Pricing. If Auth, show Dashboard/Pricing */}
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#D4AF37] transition-colors"
              >
                Home
              </NavLink>
              <NavLink
                to="/pricing"
                className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#D4AF37] transition-colors"
              >
                Tarifs
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                icon={LayoutDashboard}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold hover:text-[#D4AF37] transition-colors"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/pricing"
                className="text-gray-500 dark:text-gray-400 font-medium hover:text-[#D4AF37] transition-colors"
              >
                💎 Offres
              </NavLink>
            </>
          )}
        </nav>

        {/* RIGHT: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification Badge */}
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-gray-200 dark:border-[#2A2D35] hover:border-[#D4AF37] transition-all bg-gray-50 dark:bg-[#15171C]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center text-white shadow-sm">
                    {authMethod === "metamask" || authMethod === "phantom" ? (
                      <Wallet className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate mr-2">
                    {authMethod === "metamask" && walletAddress
                      ? formatAddress(walletAddress)
                      : authMethod === "phantom" && walletAddress
                      ? formatAddress(walletAddress)
                      : user?.username || user?.full_name || "Profil"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1C1F26] rounded-xl shadow-2xl border border-gray-100 dark:border-[#2A2D35] overflow-hidden animate-slide-down origin-top-right">
                    <div className="p-4 border-b border-gray-100 dark:border-[#2A2D35] bg-gray-50/50 dark:bg-[#15171C]/50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Connecté via{" "}
                        {authMethod === "traditional" ? "Email" : authMethod}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user?.email || walletAddress}
                      </p>
                    </div>

                    <div className="p-1">
                      <NavLink
                        to="/dashboard"
                        onClick={toggleUserMenu}
                        icon={LayoutDashboard}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
                      >
                        Mon Dashboard
                      </NavLink>
                      <NavLink
                        to="/pricing"
                        onClick={toggleUserMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2D35] transition-colors"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          💎
                        </span>
                        Gérer mon offre
                      </NavLink>
                    </div>

                    <div className="p-1 border-t border-gray-100 dark:border-[#2A2D35]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 font-semibold hover:text-[#D4AF37] px-3 py-2 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-[#D4AF37] text-[#0B0D12] px-5 py-2.5 rounded-lg font-bold hover:bg-[#F5D76E] shadow-lg shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5"
              >
                Démarrer
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {showMobileMenu && (
        <div className="fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#0B0D12] md:hidden z-50 overflow-y-auto animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-[#1C1F26] pb-4"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-[#1C1F26] pb-4"
                >
                  Tarifs
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-[#1C1F26] pb-4"
                  icon={LayoutDashboard}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/pricing"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-[#1C1F26] pb-4"
                  icon={null}
                >
                  💎 Offres
                </NavLink>
              </>
            )}

            {isAuthenticated ? (
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-[#1C1F26] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0B0D12]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user?.username || "Crypto Investor"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || walletAddress}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-xl font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 rounded-xl border border-gray-200 dark:border-[#2A2D35] text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="w-full text-center py-3 rounded-xl bg-[#D4AF37] text-[#0B0D12] font-bold shadow-lg"
                >
                  Commencer
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
