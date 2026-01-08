"use client";
import Link from "next/link";
import Image from "next/image";
import CryptoTicker from "../components/layout/CryptoTicker";
import { TrendingUp, Wallet, Zap } from "lucide-react";
import { useState, useEffect, useMemo, memo } from "react";

const cryptoLogos = [
  {
    src: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    size: "w-24 h-24",
    float: "animate-float-1",
  },
  {
    src: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    size: "w-20 h-20",
    float: "animate-float-2",
  },
  {
    src: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    size: "w-20 h-20",
    float: "animate-float-3",
  },
  {
    src: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    size: "w-16 h-16",
    float: "animate-float-4",
  },
  {
    src: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    size: "w-20 h-20",
    float: "animate-float-5",
  },
  {
    src: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    size: "w-18 h-18",
    float: "animate-float-1",
  },
  {
    src: "https://assets.coingecko.com/coins/images/22617/large/astr.png",
    size: "w-20 h-20",
    float: "animate-float-2",
  },
  {
    src: "https://assets.coingecko.com/coins/images/17810/large/asterdex.png",
    size: "w-18 h-18",
    float: "animate-float-3",
  },
  {
    src: "https://assets.coingecko.com/coins/images/69040/standard/_ASTER.png",
    size: "w-20 h-20",
    float: "animate-float-4",
  },
];

// Composant Feature Card mémorisé
const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 dark:bg-[#1C1F26]/60 backdrop-blur-xl border border-white/10 dark:border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#D4AF37]/10 group">
    <div className="p-3 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
      <Icon className="w-8 h-8 text-[#D4AF37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all" />
    </div>
    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
      {description}
    </p>
  </div>
));
FeatureCard.displayName = "FeatureCard";

// Composant Logo Crypto mémorisé
const CryptoLogo = memo(({ src, size, float, style }) => (
  <div className={`absolute ${size} ${float}`} style={style}>
    <Image
      src={src}
      alt="Crypto Logo"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-contain"
      priority={false}
    />
  </div>
));
CryptoLogo.displayName = "CryptoLogo";

export default function Home() {
  const [logoPositions, setLogoPositions] = useState([]);

  useEffect(() => {
    // Fonction pour vérifier si deux positions se chevauchent
    const checkCollision = (pos1, pos2, minDistance = 15) => {
      // Convertir les positions en coordonnées numériques
      const getCoords = (pos) => {
        const x = pos.left ? parseFloat(pos.left) : 100 - parseFloat(pos.right);
        const y = pos.top ? parseFloat(pos.top) : 100 - parseFloat(pos.bottom);
        return { x, y };
      };

      const coord1 = getCoords(pos1);
      const coord2 = getCoords(pos2);

      // Calculer la distance euclidienne
      const distance = Math.sqrt(
        Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
      );

      return distance < minDistance;
    };

    // Générer des positions aléatoires sans collision
    const positions = [];
    const maxAttempts = 100;

    for (let i = 0; i < cryptoLogos.length; i++) {
      let newPosition;
      let hasCollision = true;
      let tryCount = 0;

      while (hasCollision && tryCount < maxAttempts) {
        const side = Math.random() < 0.5 ? "left" : "right";
        const vertical = Math.random() < 0.5 ? "top" : "bottom";
        const horizontalValue = Math.random() * 20 + 5;
        const verticalValue = Math.random() * 30 + 10;

        newPosition = {
          [side]: `${horizontalValue}%`,
          [vertical]: `${verticalValue}%`,
        };

        // Vérifier les collisions avec les positions déjà placées
        hasCollision = positions.some((pos) =>
          checkCollision(pos, newPosition)
        );
        tryCount++;
      }

      positions.push(newPosition);
    }

    setLogoPositions(positions);
  }, []);

  // Mémoriser les features pour éviter les re-renders
  const features = useMemo(
    () => [
      {
        icon: TrendingUp,
        title: "Suivi en temps réel",
        description: "Prix actualisés instantanément",
      },
      {
        icon: Wallet,
        title: "Portfolio complet",
        description: "Gérez tous vos actifs",
      },
      {
        icon: Zap,
        title: "Calcul P&L",
        description: "Analysez vos performances",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Animations CSS pour le flottement */}

      {/* Background amélioré : Grille et Lueurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grille technologique subtile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_60%,transparent_100%)]"></div>

        {/* Lueurs d'ambiance statiques pour le mode sombre */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[100px] rounded-full mix-blend-screen opacity-0 dark:opacity-40 transition-opacity duration-500"></div>
      </div>

      {/* Background pattern crypto avec logos CoinGecko - Opacité réduite pour la lisibilité */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        {logoPositions.length > 0 &&
          cryptoLogos.map((logo, index) => (
            <CryptoLogo
              key={index}
              src={logo.src}
              size={logo.size}
              float={logo.float}
              style={logoPositions[index]}
            />
          ))}
      </div>

      <div className="flex-1 w-full overflow-y-auto z-10 scroll-smooth">
        <main className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-24 relative z-10 w-full max-w-7xl mx-auto space-y-32">
          {/* Section Hero */}
          <div className="text-center max-w-4xl relative">
            {/* Gradient radial sombre derrière le texte pour la lisibilité */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-black/40 blur-3xl -z-10 rounded-full pointer-events-none"></div>

            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-4 tracking-tight animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-[length:200%] animate-gradient">
                CryptoPilot
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
              Votre tableau de bord crypto personnel pour suivre, analyser et
              optimiser vos investissements
            </p>

            {/* Features mini - Glassmorphism renforcé */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 px-4 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link
                href="/register"
                className="px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Commencer gratuitement
              </Link>

              <Link
                href="/login"
                className="px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base bg-white dark:bg-[#1C1F26] text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-[#2A2D35] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 transform hover:shadow-xl"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </main>
      </div>

      <CryptoTicker />
    </div>
  );
}
