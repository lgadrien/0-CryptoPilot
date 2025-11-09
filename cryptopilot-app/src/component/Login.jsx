import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0D12] px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1F26] rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-yellow-900/10 p-6 sm:p-8 transition-colors duration-300">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-2">Connexion</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Accédez à votre tableau de bord</p>
        </div>

        <form className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 sm:py-3 pr-12 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-colors duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
            <label className="flex items-center text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-[#D4AF37] cursor-pointer"
              />
              Se souvenir de moi
            </label>
            <a href="#" className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-[#0B0D12] px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-[#F5D76E] transition-all shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors font-semibold">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;