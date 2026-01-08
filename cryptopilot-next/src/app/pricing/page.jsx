"use client";
import PricingSection from "../../components/home/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background identique à la home pour la cohérence */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      <div className="relative z-10 w-full mt-10">
        <PricingSection />
      </div>
    </div>
  );
}
