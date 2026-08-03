import api from "./axios";


/* ==========================================================
   AUTH API
========================================================== */


// Register
export const register = async (userData) => {

  const { data } =
    await api.post(
      "/auth/register",
      userData
    );

  return data;

};



// Login
export const login = async (userData) => {

  const { data } =
    await api.post(
      "/auth/login",
      userData
    );

  return data;

};



// Logout
export const logout = async () => {

  const { data } =
    await api.post(
      "/auth/logout"
    );

  return data;

};



// Get current logged-in user

export const getCurrentUser = async () => {

  const { data } =
    await api.get(
      "/auth/me"
    );

  return data;

};