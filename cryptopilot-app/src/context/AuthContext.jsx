import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Récupérer l'état depuis le localStorage au chargement
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sauvegarder dans le localStorage quand l'état change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  const login = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // TODO: Intégrer avec votre API backend
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    // TODO: Intégrer avec votre API backend
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout
  }), [isAuthenticated, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
