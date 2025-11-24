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
  const [walletAddress, setWalletAddress] = useState(() => {
    return localStorage.getItem('walletAddress');
  });
  const [authMethod, setAuthMethod] = useState(() => {
    return localStorage.getItem('authMethod') || 'traditional'; // 'traditional' or 'metamask'
  });

  // Sauvegarder dans le localStorage quand l'état change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authMethod', authMethod);
      if (walletAddress) {
        localStorage.setItem('walletAddress', walletAddress);
      }
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('authMethod');
    }
  }, [isAuthenticated, user, walletAddress, authMethod]);

  const login = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setAuthMethod('traditional');
    // TODO: Intégrer avec votre API backend
  }, []);

  const loginWithMetaMask = useCallback((address, chainId) => {
    setIsAuthenticated(true);
    setWalletAddress(address);
    setAuthMethod('metamask');
    setUser({
      address: address,
      chainId: chainId,
      type: 'metamask',
      connectedAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setWalletAddress(null);
    setAuthMethod('traditional');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('authMethod');
    // TODO: Intégrer avec votre API backend
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    walletAddress,
    authMethod,
    login,
    loginWithMetaMask,
    logout
  }), [isAuthenticated, user, walletAddress, authMethod, login, loginWithMetaMask, logout]);

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
