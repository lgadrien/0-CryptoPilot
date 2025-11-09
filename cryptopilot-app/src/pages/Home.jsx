import { Link } from 'react-router-dom';
import CryptoTicker from '../component/CryptoTicker';
import { TrendingUp, Wallet, Zap } from 'lucide-react';
import { useState, useEffect, useMemo, memo } from 'react';

const cryptoLogos = [
  { src: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', size: 'w-24 h-24', float: 'float-1' },
  { src: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', size: 'w-20 h-20', float: 'float-2' },
  { src: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', size: 'w-20 h-20', float: 'float-3' },
  { src: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', size: 'w-16 h-16', float: 'float-4' },
  { src: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', size: 'w-20 h-20', float: 'float-5' },
  { src: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', size: 'w-18 h-18', float: 'float-1' },
  { src: 'https://assets.coingecko.com/coins/images/22617/large/astr.png', size: 'w-20 h-20', float: 'float-2' },
  { src: 'https://assets.coingecko.com/coins/images/17810/large/asterdex.png', size: 'w-18 h-18', float: 'float-3' },
  { src: 'https://assets.coingecko.com/coins/images/69040/standard/_ASTER.png', size: 'w-20 h-20', float: 'float-4' }
];

// Composant Feature Card mémorisé
const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 dark:bg-[#1C1F26]/70 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/20">
    <Icon className="w-8 h-8 text-[#D4AF37]" />
    <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">{title}</h3>
    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

// Composant Logo Crypto mémorisé
const CryptoLogo = memo(({ src, size, float, style }) => (
  <img 
    src={src} 
    alt="" 
    className={`absolute ${size} ${float}`}
    style={style}
    loading="lazy"
  />
));
CryptoLogo.displayName = 'CryptoLogo';

function Home() {
  const [logoPositions, setLogoPositions] = useState([]);

  useEffect(() => {
    // Fonction pour vérifier si deux positions se chevauchent
    const checkCollision = (pos1, pos2, minDistance = 15) => {
      // Convertir les positions en coordonnées numériques
      const getCoords = (pos) => {
        const x = pos.left ? parseFloat(pos.left) : (100 - parseFloat(pos.right));
        const y = pos.top ? parseFloat(pos.top) : (100 - parseFloat(pos.bottom));
        return { x, y };
      };

      const coord1 = getCoords(pos1);
      const coord2 = getCoords(pos2);

      // Calculer la distance euclidienne
      const distance = Math.sqrt(
        Math.pow(coord1.x - coord2.x, 2) + 
        Math.pow(coord1.y - coord2.y, 2)
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
        const side = Math.random() < 0.5 ? 'left' : 'right';
        const vertical = Math.random() < 0.5 ? 'top' : 'bottom';
        const horizontalValue = Math.random() * 20 + 5;
        const verticalValue = Math.random() * 30 + 10;

        newPosition = {
          [side]: `${horizontalValue}%`,
          [vertical]: `${verticalValue}%`
        };

        // Vérifier les collisions avec les positions déjà placées
        hasCollision = positions.some(pos => checkCollision(pos, newPosition));
        tryCount++;
      }

      positions.push(newPosition);
    }

    setLogoPositions(positions);
  }, []);

  // Mémoriser les features pour éviter les re-renders
  const features = useMemo(() => [
    { icon: TrendingUp, title: "Suivi en temps réel", description: "Prix actualisés instantanément" },
    { icon: Wallet, title: "Portfolio complet", description: "Gérez tous vos actifs" },
    { icon: Zap, title: "Calcul P&L", description: "Analysez vos performances" }
  ], []);

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Animations CSS pour le flottement */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes float5 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-1 { animation: float1 8s ease-in-out infinite; }
        .float-2 { animation: float2 10s ease-in-out infinite; }
        .float-3 { animation: float3 7s ease-in-out infinite; }
        .float-4 { animation: float4 9s ease-in-out infinite; }
        .float-5 { animation: float5 11s ease-in-out infinite; }
      `}</style>

      {/* Background pattern crypto avec logos CoinGecko */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] pointer-events-none">
        {logoPositions.length > 0 && cryptoLogos.map((logo, index) => (
          <CryptoLogo
            key={index}
            src={logo.src}
            size={logo.size}
            float={logo.float}
            style={logoPositions[index]}
          />
        ))}
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
