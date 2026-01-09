"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ identifier: email, password });
      // Redirect is handled by useEffect or here
      router.push("/dashboard");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Identifiants incorrects");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center bg-[#0B0D12] relative py-12">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0B0D12] via-transparent to-[#0B0D12] pointer-events-none opacity-80"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1C1F26]/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 tracking-tight">
            Connexion
          </h2>
          <p className="text-gray-400 text-sm">
            Accédez à votre tableau de bord CryptoPilot
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="votre@email.com"
              className="w-full px-4 py-3 bg-[#0B0D12]/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-[#0B0D12]/50 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37] transition-colors p-1"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-4 h-4 mr-2 rounded border-gray-700 bg-[#0B0D12] text-[#D4AF37] focus:ring-[#D4AF37]/20 focus:ring-offset-0 accent-[#D4AF37]"
              />
              Se souvenir de moi
            </label>
            <a
              href="#"
              className="text-[#D4AF37] hover:text-[#F5D76E] font-medium transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-[#0B0D12] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-800/50">
          <p className="text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-[#D4AF37] hover:text-white font-semibold transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
