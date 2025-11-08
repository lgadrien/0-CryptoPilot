import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="w-full py-4 md:py-5 bg-white dark:bg-[#0B0D12] border-b border-gray-200 dark:border-[#1C1F26] transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 font-[Nunito]">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 md:space-x-3">
          <img
            src="/assets/LogonoBG.png"
            alt="CryptoPilot Logo"
            className="w-7 h-7 md:w-9 md:h-9"
          />
          <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-wide">
            CryptoPilot
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-600 dark:text-gray-300 text-sm font-medium">
          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Accueil
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
            >
              Dashboard
            </Link>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-[#D4AF37] text-[#0B0D12] px-4 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
              >
                <User className="w-4 h-4" />
                <span>{user?.name || 'Profil'}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-[#2A2D35] rounded-lg shadow-xl py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-[#0B0D12] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#D4AF37] text-[#0B0D12] px-4 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
            >
              Connexion
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-gray-600 dark:text-gray-300 p-2"
            aria-label="Menu"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-white dark:bg-[#1C1F26] border-t border-gray-200 dark:border-[#2A2D35] transition-colors duration-300">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors py-2 font-medium"
            >
              Accueil
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-[#D4AF37] transition-colors py-2 font-medium"
              >
                Dashboard
              </Link>
            )}

            <div className="border-t border-gray-200 dark:border-[#2A2D35] pt-3 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">{user?.name || 'Profil'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-red-500 hover:bg-gray-100 dark:hover:bg-[#0B0D12] transition-colors py-2 px-2 rounded-lg mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-center bg-[#D4AF37] text-[#0B0D12] px-4 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
