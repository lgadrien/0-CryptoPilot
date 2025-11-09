import { Link } from 'react-router-dom';
import CryptoTicker from '../component/CryptoTicker';
import { TrendingUp, Wallet, Zap } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Background pattern crypto avec logos CoinGecko */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] pointer-events-none">
        <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" alt="" className="absolute top-10 left-10 w-24 h-24" />
        <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png" alt="" className="absolute top-20 right-20 w-20 h-20" />
        <img src="https://assets.coingecko.com/coins/images/325/large/Tether.png" alt="" className="absolute bottom-20 right-10 w-20 h-20" />
        <img src="https://assets.coingecko.com/coins/images/975/large/cardano.png" alt="" className="absolute top-1/2 left-10 w-16 h-16" />
        <img src="https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png" alt="" className="absolute bottom-40 right-1/3 w-20 h-20" />
        <img src="https://assets.coingecko.com/coins/images/4128/large/solana.png" alt="" className="absolute top-40 left-1/3 w-18 h-18" />
        <img src="https://assets.coingecko.com/coins/images/22617/large/astr.png" alt="" className="absolute bottom-32 left-1/4 w-20 h-20" />
        <img src="https://assets.coingecko.com/coins/images/17810/large/asterdex.png" alt="" className="absolute top-1/3 right-1/4 w-18 h-18" />
      </div>
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0 -mt-8 sm:-mt-12 relative z-10">
        <div className="text-center max-w-4xl">
          {/* Titre */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 tracking-tight animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-[length:200%] animate-gradient">
              CryptoPilot
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
            Votre tableau de bord crypto personnel pour suivre, analyser et optimiser vos investissements
          </p>

          {/* Features mini - Glassmorphism renforcé */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 px-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/20">
              <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
              <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">Suivi en temps réel</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Prix actualisés instantanément</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/20">
              <Wallet className="w-8 h-8 text-[#D4AF37]" />
              <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">Portfolio complet</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gérez tous vos actifs</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/20">
              <Zap className="w-8 h-8 text-[#D4AF37]" />
              <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">Calcul P&L</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Analysez vos performances</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/register"
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0B0D12] hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105 transform animate-pulse-glow"
            >
              Commencer gratuitement
            </Link>

            <Link
              to="/login"
              className="px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base bg-white dark:bg-[#1C1F26] text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-[#2A2D35] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 transform hover:shadow-xl"
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
