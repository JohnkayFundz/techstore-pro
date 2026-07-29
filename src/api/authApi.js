import api from "./axios";

export const register = (userData) =>
  api.post("/auth/register", userData);

export const login = (userData) =>
  api.post("/auth/login", userData);

export const logout = () =>
  api.post("/auth/logout");

export const getCurrentUser = (token) =>
  api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });