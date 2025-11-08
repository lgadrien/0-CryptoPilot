import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0D12] px-4 py-8 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1F26] rounded-2xl shadow-2xl shadow-gray-200/50 dark:shadow-yellow-900/10 p-6 sm:p-8 transition-colors duration-300">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-2">Inscription</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Créez votre compte CryptoPilot</p>
        </div>

        <form className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#0B0D12] border border-gray-300 dark:border-[#2A2D35] rounded-xl text-sm sm:text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
              required
            />
          </div>

          <div className="flex items-start text-xs sm:text-sm">
            <input
              type="checkbox"
              className="mr-2 mt-1 accent-[#D4AF37] flex-shrink-0"
              required
            />
            <label className="text-gray-600 dark:text-gray-400">
              J'accepte les{' '}
              <a href="#" className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors">
                politique de confidentialité
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-[#0B0D12] px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-[#F5D76E] transition-all shadow-lg shadow-yellow-900/30"
          >
            Créer mon compte
          </button>
        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors font-semibold">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;