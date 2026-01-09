"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // const isAuthPage = pathname === "/login" || pathname === "/register"; // Unused but kept logic if needed

  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
