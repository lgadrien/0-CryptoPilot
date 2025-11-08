import { Link } from 'react-router-dom';
import CryptoTicker from '../component/CryptoTicker';

function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Titre principal */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight max-w-4xl">
          Navigue les marchés crypto avec{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]">
            CryptoPilot
          </span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Analyse, stratégie et performance réunies dans une interface élégante et précise.
          Prenez le contrôle de vos investissements.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            to="/register"
            className="group relative px-8 py-4 rounded-2xl font-semibold bg-[#D4AF37] text-[#0B0D12] hover:bg-[#F5D76E] transition-all duration-300 shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50 hover:scale-105"
          >
            Commencer gratuitement
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl font-semibold border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B0D12] transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:scale-105"
          >
            Se connecter
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-3xl w-full">
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform">
              500+
            </div>
            <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Cryptos suivies
            </div>
          </div>
          
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Support actif
            </div>
          </div>
          
          <div className="group">
            <div className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform">
              Real-time
            </div>
            <div className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Données live
            </div>
          </div>
        </div>
      </main>
      
      <CryptoTicker />
    </div>
  );
}

export default Home;
