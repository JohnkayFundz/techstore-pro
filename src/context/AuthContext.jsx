import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  logout as logoutApi,
} from "../api/authApi";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // Restore user session
  useEffect(() => {

    const loadUser = async () => {

      try {

        const token = localStorage.getItem("token");


        if (!token) {

          setLoading(false);
          return;

        }


        // Load cached user first
        const cachedUser =
          localStorage.getItem("techstore-user");


        if (cachedUser) {

          try {

            setUser(JSON.parse(cachedUser));

          } catch {

            localStorage.removeItem("techstore-user");

          }

        }


        // Verify token with backend
        const response =
          await getCurrentUser(token);


        const currentUser =
          response.data.user;


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

        localStorage.removeItem(
          "techstore-user"
        );


        setUser(null);


      } finally {

        setLoading(false);

      }

    };


    loadUser();


  }, []);



  // Login
  const login = (userData, token) => {

    localStorage.setItem(
      "token",
      token
    );


    localStorage.setItem(
      "techstore-user",
      JSON.stringify(userData)
    );


    setUser(userData);

  };



  // Update user profile
  const updateUser = (updatedUser) => {

    setUser(updatedUser);


    localStorage.setItem(
      "techstore-user",
      JSON.stringify(updatedUser)
    );

  };



  // Logout
  const logout = async () => {

    try {

      await logoutApi();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      localStorage.removeItem(
        "token"
      );


      localStorage.removeItem(
        "techstore-user"
      );


      setUser(null);

    }

  };



  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        login,

        logout,

        updateUser,


        isAuthenticated:
          Boolean(user),


        isAdmin:
          user?.role === "admin",

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}




export function useAuth() {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used within an AuthProvider"
    );

  }


  return context;

}