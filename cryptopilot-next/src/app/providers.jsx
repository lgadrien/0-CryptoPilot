"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { PortfolioProvider } from "../context/PortfolioContext";
import { AuthProvider } from "../context/AuthContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
