import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

function Header() {
  return (
    <header className="w-full py-5 bg-white dark:bg-[#0B0D12] border-b border-gray-200 dark:border-[#1C1F26] transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 font-[Nunito]">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/assets/LogonoBG.png"
            alt="CryptoPilot Logo"
            className="w-9 h-9"
          />
          <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wide">
            CryptoPilot
          </h1>
        </Link>

        <nav className="flex items-center space-x-6 text-gray-600 dark:text-gray-300 text-sm font-medium">
          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Accueil
          </Link>
          <Link
            to="/dashboard"
            className="relative transition-all duration-300 hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37]"
          >
            Dashboard
          </Link>
          <ThemeToggle />
          <Link
            to="/login"
            className="bg-[#D4AF37] text-[#0B0D12] px-4 py-2 rounded-lg font-semibold hover:bg-[#F5D76E] transition-all"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
