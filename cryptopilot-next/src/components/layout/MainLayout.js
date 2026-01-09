"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // On affiche toujours le Header et le Footer, même sur login/register
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
