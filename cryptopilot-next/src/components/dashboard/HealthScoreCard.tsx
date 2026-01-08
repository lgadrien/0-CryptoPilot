"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Shield, Lock, AlertTriangle, Info } from "lucide-react";

interface Asset {
  symbol: string;
  value: number;
}

interface Recommendation {
  type: "danger" | "warning" | "success" | "info";
  text: string;
}

interface HealthScoreCardProps {
  assets?: Asset[];
  isPremium?: boolean;
}

/**
 * HealthScoreCard Component
 * Analyse la santé du portefeuille et incite à l'upgrade "Sovereign".
 */
export default function HealthScoreCard({
  assets = [],
  isPremium = false,
}: HealthScoreCardProps) {
  // --- 1. LOGIQUE MÉTIER (CALCUL DU SCORE) ---
  const { score, status, color, recommendations } = useMemo(() => {
    let calculatedScore = 0;
    const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
    const recs: Recommendation[] = [];

    if (totalValue === 0) {
      return {
        score: 0,
        status: "Inconnu",
        color: "text-gray-400",
        recommendations: [
          {
            type: "info",
            text: "Ajoutez des actifs pour obtenir votre audit.",
          },
        ] as Recommendation[],
      };
    }

    // A. Calculs des pourcentages
    let blueChipValue = 0; // BTC, ETH
    let stableValue = 0; // USDT, USDC, DAI
    let maxConcentration = 0;
    let maxToken = "";

    assets.forEach((asset) => {
      const val = asset.value || 0;
      const percent = (val / totalValue) * 100;
      const symbol = asset.symbol?.toUpperCase();

      // Concentration max
      if (percent > maxConcentration) {
        maxConcentration = percent;
        maxToken = symbol;
      }

      // Blue Chips
      if (["BTC", "ETH", "WBTC", "WETH"].includes(symbol)) {
        blueChipValue += val;
      }

      // Stablecoins
      if (["USDT", "USDC", "DAI", "FDUSD"].includes(symbol)) {
        stableValue += val;
      }
    });

    const blueChipPct = (blueChipValue / totalValue) * 100;
    const stablePct = (stableValue / totalValue) * 100;

    // B. Application des règles (Gamification)

    // Règle 1 : Socle Solide (Blue Chips) -> +1 pt par %
    calculatedScore += Math.round(blueChipPct);

    // Règle 2 : Gestion du Risque (Stables)
    if (stablePct >= 10) {
      calculatedScore += 10;
    } else {
      recs.push({
        type: "warning",
        text: "Liquidité faible. Sécurisez 10% en Stablecoins.",
      });
    }

    // Règle 3 : Diversification (Malus Concentration)
    if (maxConcentration > 50) {
      calculatedScore -= 20;
      recs.push({
        type: "danger",
        text: `DANGER : Trop exposé sur ${maxToken} (>50%).`,
      });
    }

    // Règle 4 : Bonus de structure (si au moins 3 actifs > 5%)
    const significantAssets = assets.filter(
      (a) => (a.value / totalValue) * 100 > 5
    ).length;
    if (significantAssets < 3) {
      recs.push({
        type: "info",
        text: "Diversifiez : Visez au moins 3 actifs majeurs.",
      });
    } else {
      calculatedScore += 5; // Petit bonus diversification
    }

    // Clamp score 0-100
    calculatedScore = Math.min(100, Math.max(0, calculatedScore));

    // C. Détermination du Status
    let statusText = "";
    let statusColor = "";

    if (calculatedScore >= 80) {
      statusText = "Fortress Grade 🛡️";
      statusColor = "text-green-500";
      if (recs.length === 0)
        recs.push({
          type: "success",
          text: "Portfolio parfaitement optimisé.",
        });
    } else if (calculatedScore >= 50) {
      statusText = "Balanced ⚖️";
      statusColor = "text-yellow-500";
    } else {
      statusText = "High Risk Exposure ⚠️";
      statusColor = "text-red-500";
      // Si pas assez de recs spécifiques, en ajouter une générique
      if (recs.length < 2)
        recs.push({ type: "danger", text: "Risque de perte totale élevé." });
    }

    // Limiter à 3 recs max pour l'affichage
    return {
      score: calculatedScore,
      status: statusText,
      color: statusColor,
      recommendations: recs.slice(0, 3),
    };
  }, [assets]);

  // --- 2. VARIANTS VISUELS (JAUGE CIRCULAIRE) ---
  const radius = 50; // Rayon
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Couleurs dynamiques de la barre
  const strokeColor =
    score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className="bg-white dark:bg-[#15171C] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
      {/* Background Glow Effect */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-${
          score >= 50 ? (score >= 80 ? "green" : "yellow") : "red"
        }-500/10 blur-[50px] rounded-full -mr-16 -mt-16 transition-colors duration-500`}
      ></div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* PARTIE GAUCHE : Jauge Circulaire */}
        <div className="relative w-40 h-40 flex-shrink-0">
          {/* SVG Circle */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-100 dark:text-gray-800"
            />
            {/* Progress Circle */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Score Text Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900 dark:text-white">
              {score}
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              / 100
            </span>
          </div>
        </div>

        {/* PARTIE DROITE : Infos & Recommandations */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="mb-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">
              Wallet Health Score™
            </h3>
            <p
              className={`text-2xl font-bold ${color} transition-colors duration-300`}
            >
              {status}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {score < 50
                ? "Attention : Votre exposition est critique. Diversifiez maintenant."
                : score < 80
                ? "Bon début. Quelques ajustements suffiraient pour sécuriser."
                : "Niveau Institutionnel. Vos actifs sont optimisés."}
            </p>
          </div>

          {/* LISTE DES RECOMMANDATIONS (PAYWALL) */}
          <div className="space-y-3 relative mt-6">
            {recommendations.map((rec, index) => {
              // Logique du flou
              const isLocked = !isPremium && index > 0;

              if (isLocked && index === 1) {
                return (
                  <div
                    key="paywall"
                    className="absolute inset-x-0 bottom-0 top-12 backdrop-blur-sm bg-white/50 dark:bg-[#15171C]/60 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center p-4 z-20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#15171C] opacity-90"></div>
                    <div className="relative z-30 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                        <Lock className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                        2 failles critiques détectées
                      </p>
                      <Link
                        href="/pricing"
                        className="bg-[#D4AF37] hover:bg-[#c5a028] text-black text-xs font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all transform hover:scale-105"
                      >
                        Débloquer l'Audit Complet
                      </Link>
                    </div>
                  </div>
                );
              }

              if (isLocked) return null;

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5"
                >
                  {rec.type === "danger" && (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  {rec.type === "warning" && (
                    <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  )}
                  {rec.type === "success" && (
                    <Shield className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  )}
                  {rec.type === "info" && (
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                    {rec.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
