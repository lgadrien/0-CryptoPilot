"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register({ email, password, name, phone });
      alert("Compte créé avec succès ! Vérifiez votre email pour confirmer.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Erreur: " + error.message);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-gray-50 dark:bg-[#0B0D12] relative py-12 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40 dark:opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 via-transparent to-gray-50 dark:from-[#0B0D12] dark:via-transparent dark:to-[#0B0D12] pointer-events-none opacity-80"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-[#1C1F26]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-8 mx-4 max-h-[95vh] overflow-y-auto transition-colors duration-300">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 tracking-tight">
            Inscription
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Créez votre compte CryptoPilot
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0D12]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors duration-300 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0D12]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors duration-300 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0D12]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors duration-300 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-[#0B0D12]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors duration-300 font-medium"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors p-1"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
              Confirmer
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-[#0B0D12]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors duration-300 font-medium"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors p-1"
                aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 mr-2 rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0B0D12] text-[#D4AF37] focus:ring-[#D4AF37]/20 focus:ring-offset-0 accent-[#D4AF37] flex-shrink-0"
              required
            />
            <label className="text-xs text-gray-500 dark:text-gray-400">
              J'accepte les{" "}
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors"
              >
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#F5D76E] transition-colors"
              >
                politique de confidentialité
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-[#0B0D12] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all shadow-lg mt-2"
          >
            Créer mon compte
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-800/50">
          <p className="text-sm text-gray-500">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-[#D4AF37] hover:text-[#B4941F] dark:hover:text-white font-semibold transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
