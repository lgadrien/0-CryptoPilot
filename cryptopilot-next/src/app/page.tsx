"use client";
import Link from "next/link";
import Image from "next/image";
import CryptoTicker from "../components/layout/CryptoTicker";
import { TrendingUp, Wallet, Zap, LucideIcon } from "lucide-react";
import { useState, useEffect, useMemo, memo, CSSProperties } from "react";

// Interface for FeatureCard
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Composant Feature Card mémorisé
const FeatureCard = memo(
  ({ icon: Icon, title, description }: FeatureCardProps) => (
    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 dark:bg-[#1C1F26]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#D4AF37]/10 group">
      <div className="p-3 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
        <Icon className="w-8 h-8 text-[#D4AF37] group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all" />
      </div>
      <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  )
);
FeatureCard.displayName = "FeatureCard";

// Interface for CryptoLogo
interface CryptoLogoProps {
  src: string;
  size: string;
  float: string;
  style: CSSProperties;
}

// Composant Logo Crypto mémorisé
const CryptoLogo = memo(({ src, size, float, style }: CryptoLogoProps) => (
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

interface LogoPosition {
  [key: string]: string; // left, right, top, bottom
}

interface CryptoLogoData {
  src: string;
  size: string;
  float: string;
}

export default function Home() {
  const [logoPositions, setLogoPositions] = useState<LogoPosition[]>([]);
  const [cryptoLogos, setCryptoLogos] = useState<CryptoLogoData[]>([]);

  useEffect(() => {
    // Fetch Trending Coins
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/crypto/trending");
        if (res.ok) {
          const data = await res.json();
          setCryptoLogos(data);
          generatePositions(data);
        }
      } catch (e) {
        console.error("Failed to load trending logos", e);
      }
    };

    fetchTrending();
  }, []);

  // Générer des positions aléatoires sans collision
  const generatePositions = (logos: CryptoLogoData[]) => {
    // Fonction pour vérifier si deux positions se chevauchent
    const checkCollision = (
      pos1: LogoPosition,
      pos2: LogoPosition,
      minDistance = 15
    ) => {
      // Convertir les positions en coordonnées numériques
      const getCoords = (pos: LogoPosition) => {
        const x = pos.left
          ? parseFloat(pos.left)
          : 100 - parseFloat(pos.right!);
        const y = pos.top ? parseFloat(pos.top) : 100 - parseFloat(pos.bottom!);
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

    const positions: LogoPosition[] = [];
    const maxAttempts = 100;

    for (let i = 0; i < logos.length; i++) {
      let newPosition: LogoPosition = {};
      // Initializer as empty object or let TS handle it.
      // We know it will be assigned.
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

      // If we exit loop, newPosition is set (or at least initialized in last iteration)
      // To satisfy TS better we initialize newPosition properly before loop or type it.
      // But 'newPosition' logic above is sound. If tryCount >= maxAttempts it might have collision but we push anyway?
      // Original logic pushed anyway.

      if (Object.keys(newPosition).length > 0) {
        positions.push(newPosition);
      }
    }

    setLogoPositions(positions);
  };

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
              style={logoPositions[index] as CSSProperties}
            />
          ))}
      </div>

      <div className="flex-1 w-full overflow-y-auto z-10 scroll-smooth">
        <main className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-24 relative z-10 w-full max-w-7xl mx-auto space-y-16 sm:space-y-32">
          {/* Section Hero */}
          <div className="text-center max-w-4xl relative">
            {/* Gradient radial sombre derrière le texte pour la lisibilité */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/80 dark:bg-black/40 blur-3xl -z-10 rounded-full pointer-events-none transition-colors duration-300"></div>

            {/* Titre */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-3 sm:mb-4 tracking-tight animate-fade-in">
              Maîtrisez vos investissements crypto avec{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] bg-[length:200%] animate-gradient">
                précision
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
              Suivez, analysez et optimisez votre portefeuille en temps réel. La
              plateforme tout-en-un pour les investisseurs exigeants.
            </p>

            {/* Features mini - Glassmorphism renforcé */}
            <section aria-label="Fonctionnalités principales">
              <h2 className="sr-only">Nos fonctionnalités principales</h2>
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
            </section>

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
