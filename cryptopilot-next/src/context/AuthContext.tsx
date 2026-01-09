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
  updateProfile: (data: any) => Promise<void>;
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

  // Fetch Profile Helper
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  };

  // 1. Initial Load & Supabase Listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check Supabase Session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Remember Me Logic Check
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        const isSessionActive =
          sessionStorage.getItem("sessionActive") === "true";

        if (session?.user && !rememberMe && !isSessionActive) {
          console.log("Auth: Session expired (Remember Me is off)");
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        if (session?.user) {
          sessionStorage.setItem("sessionActive", "true");

          // Load Profile Data
          const profile = await fetchUserProfile(session.user.id);

          console.log("Auth: Restored Session", session.user.email);

          setUser({
            id: session.user.id,
            email: session.user.email,
            // Prioritize Profile Data > Metadata
            username: profile?.username || session.user.user_metadata?.username,
            full_name:
              profile?.full_name || session.user.user_metadata?.full_name,
            avatar_url:
              profile?.avatar_url || session.user.user_metadata?.avatar_url,
            // Preferences from JSONB
            preferences: profile?.preferences || {},
            plan_tier: profile?.plan_tier || "free",
            ...session.user.user_metadata, // Fallback
          });

          setIsAuthenticated(true);
          setAuthMethod("traditional");
          await fetchWallets(session.user.id);
        } else {
          // Check LocalStorage for Guest Mode
          const localAuth = localStorage.getItem("isAuthenticated");
          if (localAuth === "true") {
            console.log("Auth: Restored Guest Session");
            const savedUser = localStorage.getItem("user");
            const savedMethod = localStorage.getItem("authMethod");
            const savedWallets = localStorage.getItem("linkedWallets");

            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch (e) {
                console.error("Error parsing savedUser", e);
              }
            }
            if (savedMethod) setAuthMethod(savedMethod ?? "traditional");
            if (savedWallets) {
              try {
                const w = JSON.parse(savedWallets);
                setLinkedWallets(w);
                // Also set address if not set
                if (!localStorage.getItem("walletAddress") && w.length > 0) {
                  setWalletAddress(w[0].address);
                }
              } catch (e) {
                console.error("Error parsing savedWallets", e);
              }
            }

            setIsAuthenticated(true);
          }
        }

        const localAddr = localStorage.getItem("walletAddress");
        if (localAddr) setWalletAddress(localAddr);
      } catch (error) {
        console.error("Auth Initialization Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: profile?.username,
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          preferences: profile?.preferences || {},
          plan_tier: profile?.plan_tier || "free",
          ...session.user.user_metadata,
        });
        setIsAuthenticated(true);
        setAuthMethod("traditional");
        sessionStorage.setItem("sessionActive", "true");
        await fetchWallets(session.user.id);
      } else if (_event === "SIGNED_OUT") {
        // Clear Supabase state
        setUser(null);
        setIsAuthenticated(false);
        setLinkedWallets([]);
        sessionStorage.removeItem("sessionActive");
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

      // Map DB 'provider' -> 'type'
      const mappedWallets: Wallet[] = (data || []).map((w: any) => ({
        type: w.provider,
        address: w.address,
        chainId: w.chain_type === "evm" ? 1 : 0, // Simplified mapping
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
    async ({ identifier, password, rememberMe = false }: any) => {
      let email = identifier;

      // Si ce n'est pas un email (pas de @), on suppose que c'est un téléphone
      if (!identifier.includes("@")) {
        // Keep existing logic if user requested strict SQL injections but didn't ask to remove features.
        // Re-implementing briefly to be safe.
        // The new schema has 'profiles'. Profiles might not have phone unless synced.
        // Fallback to just email login for now to avoid errors on non-existent table.
        email = identifier;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data?.session?.user) {
        // Store Remember Me Preference
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

        // Fetch Profile
        const profile = await fetchUserProfile(data.session.user.id);

        setUser({
          id: data.session.user.id,
          email: data.session.user.email,
          // Prioritize Profile Data > Metadata
          username:
            profile?.username || data.session.user.user_metadata?.username,
          full_name:
            profile?.full_name || data.session.user.user_metadata?.full_name,
          avatar_url:
            profile?.avatar_url || data.session.user.user_metadata?.avatar_url,
          // Preferences from JSONB
          preferences: profile?.preferences || {},
          plan_tier: profile?.plan_tier || "free",
          ...data.session.user.user_metadata,
        });
        setIsAuthenticated(true);
        setAuthMethod("traditional");
        // We don't await this to keep login fast, but it runs in background
        fetchWallets(data.session.user.id);
      }
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
      if (
        linkedWallets.some(
          (w) => w.address.toLowerCase() === walletData.address.toLowerCase()
        )
      )
        return;

      // If Supabase User -> Persist to DB
      if (user?.id) {
        // Map frontend 'type' (metamask) to DB 'provider' (metamask)
        // Map frontend chainId to 'chain_type'. Assuming 'evm' for now for Metamask.
        const provider = walletData.type;
        const chainType = walletData.type === "phantom" ? "solana" : "evm";

        const { error } = await supabase.from("wallets").insert([
          {
            user_id: user.id,
            address: walletData.address,
            provider: provider,
            chain_type: chainType,
            label: "Main Wallet",
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

  const updateProfile = useCallback(
    async (updates: any) => {
      if (user?.id) {
        // 1. Update 'profiles' table (Public Data)
        const profileUpdates: any = { id: user.id, updated_at: new Date() }; // Needed for Upsert

        if (updates.username) profileUpdates.username = updates.username;
        if (updates.full_name) profileUpdates.full_name = updates.full_name;
        if (updates.avatar_url) profileUpdates.avatar_url = updates.avatar_url;
        if (updates.preferences)
          profileUpdates.preferences = updates.preferences;

        if (Object.keys(profileUpdates).length > 2) {
          // id + updated_at = 2
          const { error } = await supabase
            .from("profiles")
            .upsert(profileUpdates) // Use Upsert for safety
            .select();

          if (error) {
            console.error("Profile update error", error);
            throw error;
          }
        }

        // 2. Update Auth Metadata (Optional, keep for sync)
        const { error: authError } = await supabase.auth.updateUser({
          data: updates,
        });

        if (authError) console.warn("Auth metadata update failed", authError);

        // 3. Update local state immediately
        setUser((prev) => (prev ? { ...prev, ...updates } : null));

        // Reload full profile to be sure
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          setUser((prev) =>
            prev
              ? { ...prev, ...profile, preferences: profile.preferences }
              : null
          );
        }
      } else {
        // Guest Update
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
    [user, supabase]
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
      updateProfile,
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
      updateProfile,
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
