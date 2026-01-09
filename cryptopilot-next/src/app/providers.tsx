"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { PortfolioProvider } from "../context/PortfolioContext";
import { AuthProvider } from "../context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
