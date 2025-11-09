import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Menu, X, Home, LayoutDashboard, Bell } from 'lucide-react';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Nombre de notifications (exemple)
  const notificationCount = 3;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu, showUserMenu]);

  return (
    <header ref={headerRef} className="w-full bg-white dark:bg-[#0B0D12] border-b border-gray-200 dark:border-[#1C1F26] transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 h-16 md:h-20 font-[Nunito]">
        {/* Logo avec hover glow */}
        <Link to="/" onClick={closeMobileMenu} className="group flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          <img
            src="/assets/LogonoBG.png"
            alt="CryptoPilot"
            className="w-8 h-8 md:w-9 md:h-9 transition-all duration-300 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          />
          <h1 className="text-lg md:text-2xl font-bold text-[#D4AF37] tracking-wide transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
            CryptoPilot
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-colors duration-400 group-hover:text-[#D4AF37]" />
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] bg-clip-text transition-all duration-400 text-gray-600 dark:text-gray-300 group-hover:text-transparent">
              Home
            </span>
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="group flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-colors duration-400 group-hover:text-[#D4AF37]" />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] bg-clip-text transition-all duration-400 text-gray-600 dark:text-gray-300 group-hover:text-transparent">
                Dashboard
              </span>
            </Link>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification Badge */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0D12] px-4 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user?.username || 'Profil'}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1C1F26] rounded-lg shadow-xl border border-gray-200 dark:border-[#2A2D35] overflow-hidden animate-slide-down">
                    <div className="p-3 border-b border-gray-200 dark:border-[#2A2D35]">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.username || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0B0D12] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#0B0D12] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#D4AF37] text-[#0B0D12] px-5 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
            >
              Connexion
            </Link>
          )}
        </nav>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Menu"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {showMobileMenu && (
        <div className="fixed top-16 left-0 right-0 bg-white dark:bg-[#1C1F26] border-b border-gray-200 dark:border-[#2A2D35] md:hidden z-50 shadow-xl animate-slide-down">
          <nav className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0B0D12] px-4 py-3 rounded-lg transition-colors font-medium"
              >
                <Home className="w-5 h-5 text-[#D4AF37]" />
                Home
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0B0D12] px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
                  Dashboard
                </Link>
              )}

              <div className="border-t border-gray-200 dark:border-[#2A2D35] my-2" />

              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300">
                    <User className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-semibold">{user?.name || 'Utilisateur'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B0D12] px-4 py-3 rounded-lg font-bold hover:bg-[#F5D76E] transition-all"
                >
                  <User className="w-5 h-5" />
                  Connexion
                </Link>
              )}
            </nav>
          </div>
      )}
    </header>
  );
}

export default Header;
