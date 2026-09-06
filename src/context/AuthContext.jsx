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

// ==========================================================
// AUTH CONTEXT
// ==========================================================

const AuthContext = createContext(null);

// ==========================================================
// AUTH PROVIDER
// ==========================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================================
  // RESTORE AUTHENTICATED SESSION
  // ========================================================

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        if (mounted) {
          setLoading(true);
        }

        // --------------------------------------------------
        // CHECK STORED TOKEN
        // --------------------------------------------------

        const token =
          localStorage.getItem("token");

        // --------------------------------------------------
        // NO TOKEN
        // --------------------------------------------------
        //
        // Your current backend authentication flow uses the
        // JWT returned by login/register and stored locally.
        //

        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }

          return;
        }

        // --------------------------------------------------
        // LOAD CACHED USER
        // --------------------------------------------------

        const cachedUser =
          localStorage.getItem(
            "techstore-user"
          );

        if (cachedUser) {
          try {
            const parsedUser =
              JSON.parse(cachedUser);

            if (
              mounted &&
              parsedUser
            ) {
              setUser(parsedUser);
            }
          } catch (error) {
            console.warn(
              "⚠️ Invalid cached user. Removing cache."
            );

            localStorage.removeItem(
              "techstore-user"
            );
          }
        }

        // --------------------------------------------------
        // VERIFY SESSION WITH BACKEND
        // --------------------------------------------------

        const response =
          await getCurrentUser();

        // --------------------------------------------------
        // YOUR authController RETURNS:
        //
        // {
        //   success: true,
        //   user: {...}
        // }
        //
        // Axios automatically returns that JSON body as
        // response.data.
        // --------------------------------------------------

        const payload =
          response?.data ?? response;

        const currentUser =
          payload?.user ?? null;

        // --------------------------------------------------
        // USER NOT FOUND
        // --------------------------------------------------

        if (!currentUser) {
          throw new Error(
            payload?.message ||
              "User session could not be restored."
          );
        }

        // --------------------------------------------------
        // SAVE AUTHENTICATED USER
        // --------------------------------------------------

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
          "❌ Session restoration failed:",
          error
        );

        // --------------------------------------------------
        // CLEAR INVALID SESSION
        // --------------------------------------------------

        localStorage.removeItem(
          "token"
        );

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

    restoreSession();

    // ------------------------------------------------------
    // CLEANUP
    // ------------------------------------------------------

    return () => {
      mounted = false;
    };
  }, []);

  // ========================================================
  // LOGIN
  // ========================================================

  const login = (
    userData,
    token
  ) => {
    try {
      // ----------------------------------------------------
      // SAVE JWT
      // ----------------------------------------------------

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      // ----------------------------------------------------
      // SAVE USER
      // ----------------------------------------------------

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

  // ========================================================
  // UPDATE USER
  // ========================================================

  const updateUser = (
    updatedUser
  ) => {
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

  // ========================================================
  // LOGOUT
  // ========================================================

  const logout = async () => {
    try {
      console.log(
        "🚪 Logging out..."
      );

      // ----------------------------------------------------
      // ASK BACKEND TO CLEAR HTTP-ONLY COOKIE
      // ----------------------------------------------------

      await logoutApi();
    } catch (error) {
      console.warn(
        "⚠️ Logout API request failed:",
        error
      );
    } finally {
      // ----------------------------------------------------
      // ALWAYS CLEAR LOCAL AUTHENTICATION
      // ----------------------------------------------------

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "techstore-user"
      );

      setUser(null);

      console.log(
        "✅ User logged out."
      );
    }
  };

  // ========================================================
  // AUTH STATE
  // ========================================================

  const isAuthenticated =
    Boolean(user);

  const isAdmin =
    user?.role === "admin";

  // ========================================================
  // CONTEXT VALUE
  // ========================================================

  const value = {
    user,
    loading,

    login,
    logout,

    updateUser,

    isAuthenticated,
    isAdmin,
  };

  // ========================================================
  // PROVIDER
  // ========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================================
// USE AUTH HOOK
// ==========================================================

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