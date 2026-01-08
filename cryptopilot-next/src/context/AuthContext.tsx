"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { createClient } from "../lib/supabase";
import { Wallet, User } from "../types";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  walletAddress: string | null;
  authMethod: string;
  linkedWallets: Wallet[];
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  addWallet: (wallet: Wallet) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  loginWithMetaMask: (address: string, chainId: string) => void;
  loginWithPhantom: (address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Supabase Client
  const supabase = createClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Supabase User or Guest Object
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Active viewing wallet
  const [authMethod, setAuthMethod] = useState("traditional");
  const [linkedWallets, setLinkedWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load & Supabase Listener
  useEffect(() => {
    const initAuth = async () => {
      // Check Supabase Session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Authenticated with Supabase
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...(session.user.user_metadata as any),
        });
        setIsAuthenticated(true);
        setAuthMethod("traditional");
        await fetchWallets(session.user.id);
      } else {
        // Check LocalStorage for Guest Mode
        const localAuth = localStorage.getItem("isAuthenticated");
        if (localAuth === "true") {
          const savedUser = localStorage.getItem("user");
          const savedMethod = localStorage.getItem("authMethod");
          const savedWallets = localStorage.getItem("linkedWallets");

          if (savedUser) setUser(JSON.parse(savedUser));
          if (savedMethod) setAuthMethod(savedMethod ?? "traditional");
          if (savedWallets) setLinkedWallets(JSON.parse(savedWallets));

          setIsAuthenticated(true);
        }
      }
      setWalletAddress(localStorage.getItem("walletAddress"));
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          ...(session.user.user_metadata as any),
        });
        setIsAuthenticated(true);
        setAuthMethod("traditional");
        await fetchWallets(session.user.id);
      } else if (_event === "SIGNED_OUT") {
        // Clear Supabase state
        setUser(null);
        setIsAuthenticated(false);
        setLinkedWallets([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Wallets helper
  const fetchWallets = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      // Map Supabase response to Wallet type if necessary
      const mappedWallets: Wallet[] = (data || []).map((w: any) => ({
        type: w.type,
        address: w.address,
        chainId: w.chain_id,
        connectedAt: w.created_at,
      }));

      setLinkedWallets(mappedWallets);

      // Set primary wallet if none selected locally
      if (data && data.length > 0 && !localStorage.getItem("walletAddress")) {
        setWalletAddress(data[0].address);
        localStorage.setItem("walletAddress", data[0].address);
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
    }
  };

  // 2. Auth Methods
  const login = useCallback(
    async ({ identifier, password }: any) => {
      let email = identifier;

      // Si ce n'est pas un email (pas de @), on suppose que c'est un téléphone
      if (!identifier.includes("@")) {
        const { data, error: lookupError } = await supabase
          .from("users")
          .select("email")
          .eq("phone", identifier)
          .single();

        if (lookupError || !data) {
          throw new Error("Aucun compte trouvé avec ce numéro de téléphone.");
        }
        email = data.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [supabase]
  );

  const register = useCallback(
    async ({ email, password, name, phone }: any) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
        },
      });
      if (error) throw error;
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear guest data too
    setIsAuthenticated(false);
    setUser(null);
    setWalletAddress(null);
    setLinkedWallets([]);
    setAuthMethod("traditional");
  }, []);

  // 3. Wallet Management (Hybrid Stub)
  const addWallet = useCallback(
    async (walletData: Wallet) => {
      // Check if duplicate locally first
      if (linkedWallets.some((w) => w.address === walletData.address)) return;

      // If Supabase User -> Persist to DB
      if (user?.id) {
        const { error } = await supabase.from("wallets").insert([
          {
            user_id: user.id,
            address: walletData.address,
            type: walletData.type,
            chain_id: walletData.chainId ? String(walletData.chainId) : null,
          },
        ]);

        if (error) {
          console.error("Error adding wallet to DB:", error);
          alert("Erreur lors de la sauvegarde du wallet");
          return;
        }
        // Fetch again to ensure sync
        await fetchWallets(user.id);
      } else {
        // Guest Mode -> LocalStorage
        const newWallets = [...linkedWallets, walletData];
        setLinkedWallets(newWallets);
        localStorage.setItem("linkedWallets", JSON.stringify(newWallets));

        // Update User object for Guest
        if (!user?.id) {
          // Only if not Supabase user
          const guestUser: User = { ...walletData, type: "guest" };
          setUser(guestUser);
          localStorage.setItem("user", JSON.stringify(guestUser));
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
        }
      }

      // Auto-select if first
      if (!walletAddress) {
        setWalletAddress(walletData.address);
        localStorage.setItem("walletAddress", walletData.address);
      }
    },
    [user, linkedWallets, walletAddress]
  );

  const removeWallet = useCallback(
    async (address: string) => {
      if (user?.id) {
        const { error } = await supabase
          .from("wallets")
          .delete()
          .eq("user_id", user.id)
          .eq("address", address);

        if (error) {
          console.error("Error deleting wallet:", error);
          return;
        }
        await fetchWallets(user.id);
      } else {
        // Guest Mode
        const newWallets = linkedWallets.filter((w) => w.address !== address);
        setLinkedWallets(newWallets);
        localStorage.setItem("linkedWallets", JSON.stringify(newWallets));
      }

      if (walletAddress === address) {
        setWalletAddress(null);
        localStorage.removeItem("walletAddress");
      }
    },
    [user, linkedWallets, walletAddress]
  );

  // Legacy/Shortcut wrappers
  const loginWithMetaMask = useCallback(
    (address: string, chainId: string) => {
      const wallet: Wallet = {
        address,
        chainId,
        type: "metamask",
        connectedAt: new Date().toISOString(),
      };
      addWallet(wallet);
      setAuthMethod("metamask");
      localStorage.setItem("authMethod", "metamask");
    },
    [addWallet]
  );

  const loginWithPhantom = useCallback(
    (address: string) => {
      const wallet: Wallet = {
        address,
        type: "phantom",
        connectedAt: new Date().toISOString(),
      };
      addWallet(wallet);
      setAuthMethod("phantom");
      localStorage.setItem("authMethod", "phantom");
    },
    [addWallet]
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      walletAddress,
      authMethod,
      linkedWallets,
      loading,
      login,
      register, // Exposed new method
      logout,
      addWallet,
      removeWallet,
      loginWithMetaMask,
      loginWithPhantom,
    }),
    [
      isAuthenticated,
      user,
      walletAddress,
      authMethod,
      linkedWallets,
      loading,
      login,
      register,
      logout,
      addWallet,
      removeWallet,
      loginWithMetaMask,
      loginWithPhantom,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
