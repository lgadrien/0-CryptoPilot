import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://cryptopilot.app"), // Remplacez par votre vrai domaine
  title: {
    default: "CryptoPilot | Dashboard Crypto & Portfolio Tracker",
    template: "%s | CryptoPilot",
  },
  description:
    "Suivez vos cryptomonnaies en temps réel, gérez votre portfolio et analysez vos performances avec CryptoPilot. Compatible avec MetaMask et Phantom.",
  keywords: [
    "crypto",
    "dashboard",
    "portfolio",
    "tracker",
    "bitcoin",
    "ethereum",
    "solana",
    "metamask",
    "phantom",
    "finance",
  ],
  authors: [{ name: "CryptoPilot Team" }],
  creator: "CryptoPilot",
  publisher: "CryptoPilot",
  openGraph: {
    title: "CryptoPilot | Dashboard Crypto & Portfolio Tracker",
    description:
      "La plateforme tout-en-un pour gérer vos investissements crypto.",
    url: "https://cryptopilot.app",
    siteName: "CryptoPilot",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/assets/Logo.png", // Idéalement une image OG dédiée de 1200x630
        width: 800,
        height: 600,
        alt: "CryptoPilot Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoPilot | Dashboard Crypto",
    description: "Suivez et optimisez vos investissements crypto simplement.",
    images: ["/assets/Logo.png"],
  },
  icons: {
    icon: "/assets/LogonoBG.png",
    apple: "/assets/Logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={nunito.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0D12] text-gray-900 dark:text-gray-200 transition-colors duration-300">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
