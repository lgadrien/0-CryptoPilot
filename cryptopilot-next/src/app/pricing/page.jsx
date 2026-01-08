"use client";
import PricingSection from "../../components/home/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] mt-0 pt-1 md:pt-0 flex flex-col items-center justify-start md:justify-center relative overflow-y-auto md:overflow-hidden bg-white dark:bg-[#0B0D12] transition-colors duration-300">
      {/* Background identique à la home pour la cohérence */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/5 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <div className="relative z-10 w-full md:max-h-full flex flex-col md:flex-row items-center justify-center p-4">
        <PricingSection />
      </div>
    </div>
  );
}
