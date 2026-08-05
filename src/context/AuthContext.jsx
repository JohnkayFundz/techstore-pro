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

  /* ==========================================================
     RESTORE SESSION
  ========================================================== */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const cachedUser =
          localStorage.getItem("techstore-user");

        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch {
            localStorage.removeItem("techstore-user");
          }
        }

        // Backend returns:
        // {
        //   success: true,
        //   user: {...}
        // }

        const response = await getCurrentUser();

        const currentUser = response.user;

        if (!currentUser) {
          throw new Error("User not found.");
        }

        setUser(currentUser);

        localStorage.setItem(
          "techstore-user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Authentication failed:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("techstore-user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ==========================================================
     LOGIN
  ========================================================== */

  const login = (userData, token) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "techstore-user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  /* ==========================================================
     UPDATE USER
  ========================================================== */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "techstore-user",
      JSON.stringify(updatedUser)
    );
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("techstore-user");

      setUser(null);
    }
  };

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,

    isAuthenticated: !!user,

    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* ==========================================================
   USE AUTH
========================================================== */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}