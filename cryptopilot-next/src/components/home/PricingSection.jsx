"use client";
import { Check, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const FeatureItem = ({ included, text }) => (
  <li className="flex items-center gap-3">
    {included ? (
      <Check className="w-5 h-5 text-green-500 shrink-0" />
    ) : (
      <X className="w-5 h-5 text-gray-400 shrink-0" />
    )}
    <span
      className={
        included
          ? "text-gray-700 dark:text-gray-200"
          : "text-gray-400 dark:text-gray-500 line-through"
      }
    >
      {text}
    </span>
  </li>
);

// Composant Carte Pricing mémorisé
const PricingCard = memo(({ plan, featured = false }) => {
  const {
    name,
    price,
    oldPrice,
    description,
    features,
    cta,
    ctaLink,
    variant,
  } = plan;

  const isDark = variant === "dark";
  const isGhost = variant === "ghost";

  return (
    <div
      className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${
        featured
          ? "bg-white dark:bg-[#1C1F26] border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.2)] dark:shadow-[0_0_40px_rgba(212,175,55,0.4)] md:scale-110 z-10"
          : "bg-white/50 dark:bg-[#0F1115] border border-gray-200 dark:border-white/5 hover:border-[#D4AF37]/30 dark:hover:border-white/10 md:scale-95 opacity-90 hover:opacity-100"
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
          🔥 Choisi par 85% des investisseurs
        </div>
      )}

      <div className="mb-8 text-center feature-header">
        <h3
          className={`text-xl font-bold mb-2 ${
            featured ? "text-[#D4AF37]" : "text-gray-900 dark:text-gray-300"
          }`}
        >
          {name}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          {oldPrice && (
            <span className="text-gray-500 line-through text-lg">
              {oldPrice}
            </span>
          )}
          <span className="text-4xl font-black text-gray-900 dark:text-white">
            {price}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-500">
          {description}
        </p>
      </div>

      <ul className="flex-1 space-y-4 mb-8 text-sm">
        {features.map((feature, idx) => (
          <FeatureItem
            key={idx}
            included={feature.included}
            text={feature.text}
          />
        ))}
      </ul>

      <Link
        href={ctaLink}
        className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
          featured
            ? "bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-1"
            : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-transparent dark:border-white/5"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
});
PricingCard.displayName = "PricingCard";

const plans = [
  {
    name: "DISCOVERY",
    price: "0€",
    description: "Pour découvrir la plateforme.",
    variant: "ghost",
    features: [
      { text: "1 Wallet Maximum", included: true },
      { text: "Rafraîchissement manuel", included: true },
      { text: "Mode Privacy", included: false },
      { text: "Export Fiscal", included: false },
      { text: "Support VIP", included: false },
    ],
    cta: "Essayer (Limité)",
    ctaLink: "/register?plan=free",
  },
  {
    name: "SOVEREIGN",
    price: "12.99€",
    oldPrice: "29€",
    description: "Le toolkit complet pour piloter votre richesse.",
    variant: "primary",
    features: [
      { text: "Wallets Illimités (Ledger, Trezor...)", included: true },
      { text: "Mode Privacy (Anti-espion)", included: true },
      { text: "Export Fiscal complet", included: true },
      { text: "Support VIP WhatsApp", included: true },
      { text: "Net Worth en Temps Réel", included: true },
    ],
    cta: "Sécuriser mon Offre",
    ctaLink: "/register?plan=sovereign",
  },
  {
    name: "WHALE",
    price: "49.99€",
    description: "Pour les fonds d'investissement.",
    variant: "dark",
    features: [
      { text: "Tout du plan Sovereign", included: true },
      { text: "Appels Visio Mensuels", included: true },
      { text: "Accès API Complet", included: true },
      { text: "Manager Dédié", included: true },
      { text: "Onboarding Personnalisé", included: true },
    ],
    cta: "Contacter Sales",
    ctaLink: "/contact",
  },
];

export default function PricingSection() {
  return (
    <section className="py-2 md:py-8 px-4 relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-start md:justify-center md:h-full">
      <div className="text-center mb-4 md:mb-10 shrink-0">
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 md:mb-3">
          Votre Patrimoine mérite l'
          <span className="text-[#D4AF37]">Excellence</span>.
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Des outils de niveau institutionnel pour vos investissements
          personnels. Fini le bricolage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch max-w-6xl mx-auto w-full">
        {/* Tourist */}
        <PricingCard plan={plans[0]} />

        {/* Sovereign (Featured) */}
        <PricingCard plan={plans[1]} featured={true} />

        {/* Whale */}
        <PricingCard plan={plans[2]} />
      </div>

      <div className="mt-8 md:mt-10 text-center shrink-0">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#D4AF37]" />
          <span>
            Satisfait ou Remboursé sous 30 jours. Zéro question posée.
          </span>
        </div>
      </div>
    </section>
  );
}
