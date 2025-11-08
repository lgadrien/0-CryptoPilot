import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Récupérer la préférence sauvegardée ou utiliser le mode sombre par défaut
    const saved = localStorage.getItem('theme');
    const initialTheme = saved ? saved === 'dark' : true;
    
    // Appliquer immédiatement la classe au chargement
    if (initialTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return initialTheme;
  });

  useEffect(() => {
    // Sauvegarder la préférence
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Appliquer la classe au html
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
