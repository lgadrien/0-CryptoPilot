import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Vue d'ensemble de votre portefeuille crypto et performances.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
