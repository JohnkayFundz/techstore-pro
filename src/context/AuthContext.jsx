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

/* ==========================================================
   AUTH CONTEXT
========================================================== */

const AuthContext = createContext(null);

/* ==========================================================
   AUTH PROVIDER
========================================================== */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ========================================================
     RESTORE SESSION
  ======================================================== */

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);

        /* --------------------------------------------------
           CHECK TOKEN
        -------------------------------------------------- */

        const token = localStorage.getItem("token");

        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }

          return;
        }

        /* --------------------------------------------------
           LOAD CACHED USER FIRST
        -------------------------------------------------- */

        const cachedUser =
          localStorage.getItem("techstore-user");

        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);

            if (mounted && parsedUser) {
              setUser(parsedUser);
            }
          } catch (error) {
            console.warn(
              "⚠️ Invalid cached user. Removing it."
            );

            localStorage.removeItem(
              "techstore-user"
            );
          }
        }

        /* --------------------------------------------------
           VERIFY SESSION WITH BACKEND
        -------------------------------------------------- */

        console.log(
          "🔐 Checking authenticated user..."
        );

        const response = await getCurrentUser();

        console.log(
          "👤 Current user API response:",
          response
        );

        /* --------------------------------------------------
           SUPPORT BOTH AXIOS RESPONSE FORMATS

           Format 1:
           response.data.user

           Format 2:
           response.user
        -------------------------------------------------- */

        const payload =
          response?.data ?? response;

        console.log(
          "📋 Current user payload:",
          payload
        );

        const currentUser =
          payload?.user ??
          payload?.data?.user ??
          null;

        /* --------------------------------------------------
           USER NOT FOUND
        -------------------------------------------------- */

        if (!currentUser) {
          throw new Error(
            payload?.message ||
              "User not found."
          );
        }

        /* --------------------------------------------------
           SAVE CURRENT USER
        -------------------------------------------------- */

        if (mounted) {
          setUser(currentUser);
        }

        localStorage.setItem(
          "techstore-user",
          JSON.stringify(currentUser)
        );

        console.log(
          "✅ User session restored:",
          currentUser
        );

      } catch (error) {
        console.error(
          "❌ Authentication failed:",
          error
        );

        /* --------------------------------------------------
           INVALID / EXPIRED SESSION
        -------------------------------------------------- */

        localStorage.removeItem("token");

        localStorage.removeItem(
          "techstore-user"
        );

        if (mounted) {
          setUser(null);
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    /* ------------------------------------------------------
       CLEANUP
    ------------------------------------------------------ */

    return () => {
      mounted = false;
    };
  }, []);

  /* ========================================================
     LOGIN
  ======================================================== */

  const login = (userData, token) => {
    try {
      /* --------------------------------------------------
         SAVE TOKEN
      -------------------------------------------------- */

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      /* --------------------------------------------------
         SAVE USER
      -------------------------------------------------- */

      if (userData) {
        localStorage.setItem(
          "techstore-user",
          JSON.stringify(userData)
        );

        setUser(userData);
      }

      console.log(
        "✅ User logged in:",
        userData
      );

    } catch (error) {
      console.error(
        "❌ Login context error:",
        error
      );
    }
  };

  /* ========================================================
     UPDATE USER
  ======================================================== */

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setUser(updatedUser);

    localStorage.setItem(
      "techstore-user",
      JSON.stringify(updatedUser)
    );

    console.log(
      "✅ User updated:",
      updatedUser
    );
  };

  /* ========================================================
     LOGOUT
  ======================================================== */

  const logout = async () => {
    try {
      console.log(
        "🚪 Logging out..."
      );

      await logoutApi();

    } catch (error) {
      console.error(
        "⚠️ Logout API error:",
        error
      );

    } finally {
      /* --------------------------------------------------
         ALWAYS CLEAR LOCAL SESSION
      -------------------------------------------------- */

      localStorage.removeItem("token");

      localStorage.removeItem(
        "techstore-user"
      );

      setUser(null);

      console.log(
        "✅ User logged out."
      );
    }
  };

  /* ========================================================
     AUTH STATE
  ======================================================== */

  const isAuthenticated =
    Boolean(user);

  const isAdmin =
    user?.role === "admin";

  /* ========================================================
     CONTEXT VALUE
  ======================================================== */

  const value = {
    user,

    loading,

    login,

    logout,

    updateUser,

    isAuthenticated,

    isAdmin,
  };

  /* ========================================================
     PROVIDER
  ======================================================== */

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ==========================================================
   USE AUTH HOOK
========================================================== */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}