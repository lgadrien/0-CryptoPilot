"use client";
import { useAuth } from "../../context/AuthContext";
import FinanceDashboard from "../../components/portfolio/FinanceDashboard";

export default function Dashboard() {
  const { authMethod } = useAuth();

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 bg-gray-50 dark:bg-[#0B0D12] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">
            Tableau de bord
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {authMethod === "metamask"
              ? "Gérez votre portfolio crypto avec MetaMask"
              : authMethod === "phantom"
              ? "Gérez votre portfolio Solana avec Phantom"
              : "Bienvenue sur votre espace CryptoPilot"}
          </p>
        </div>

        {/* Finance Dashboard */}
        <FinanceDashboard />
      </div>
    </div>
  );
}
