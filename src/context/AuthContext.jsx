import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const loadUser = async () => {

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("techstore-user");


      if (!token) {
        setLoading(false);
        return;
      }


      // Restore cached user immediately
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }


      try {

        const response = await getCurrentUser(token);

        setUser(response.data.user);

        localStorage.setItem(
          "techstore-user",
          JSON.stringify(response.data.user)
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



  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("techstore-user");

    setUser(null);

  };



  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth() {

  return useContext(AuthContext);

}