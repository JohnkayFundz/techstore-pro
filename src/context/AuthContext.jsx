// ==========================================================
// TECHSTORE PRO
// AUTH CONTEXT
// ==========================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  logout as logoutApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        if (mounted) setLoading(true);

        const data = await getCurrentUser();
        const currentUser = data?.user ?? null;

        if (!currentUser) {
          throw new Error(data?.message || "User session could not be restored.");
        }

        if (mounted) setUser(currentUser);
      } catch (error) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (userData) => {
    if (userData) setUser(userData);
  };

  const updateUser = (updatedUser) => {
    if (updatedUser) setUser(updatedUser);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn("Logout API request failed:", error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
