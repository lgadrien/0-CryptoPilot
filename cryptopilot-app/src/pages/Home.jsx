import { Link } from 'react-router-dom';
import CryptoTicker from '../component/CryptoTicker';

function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0 -mt-8 sm:-mt-12">
        <div className="text-center max-w-2xl">
          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37]">
              CryptoPilot
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-light mb-4 sm:mb-5 px-4">
            Votre tableau de bord crypto personnel
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <Link
              to="/register"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base bg-[#D4AF37] text-[#0B0D12] hover:bg-[#F5D76E] transition-all duration-300 shadow-lg hover:scale-105"
            >
              Commencer dès maintenant
            </Link>

            <Link
              to="/login"
              className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base bg-white dark:bg-[#1C1F26] text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-[#2A2D35] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
      
      <CryptoTicker />
    </div>
  );
}

export default Home;
