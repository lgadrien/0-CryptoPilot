import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoratif */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-20 text-9xl font-bold text-[#D4AF37]">404</div>
        <div className="absolute bottom-20 right-20 text-9xl font-bold text-[#F5D76E]">404</div>
      </div>

      <div className="text-center max-w-2xl relative z-10">
        {/* Code 404 */}
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-[length:200%] animate-gradient">
            404
          </span>
        </h1>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page introuvable
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 px-4">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-bold text-sm sm:text-base bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-[#0B0D12] hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg font-bold text-sm sm:text-base bg-white dark:bg-[#1C1F26] text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-[#2A2D35] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
