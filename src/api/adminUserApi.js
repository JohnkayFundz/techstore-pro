import api from "./axios";


/* ==========================================================
   GET ALL USERS (ADMIN)
========================================================== */

export const getUsers = async () => {

  const { data } = await api.get(
    "/users"
  );

  return data;

};





/* ==========================================================
   GET SINGLE USER (ADMIN)
========================================================== */

export const getUserById = async (id) => {

  const { data } = await api.get(
    `/users/${id}`
  );

  return data;

};





/* ==========================================================
   UPDATE USER ROLE (ADMIN)
========================================================== */

export const updateUserRole = async (
  id,
  role
) => {

  const { data } = await api.put(
    `/users/${id}/role`,
    {
      role,
    }
  );

  return data;

};





/* ==========================================================
   DELETE USER (ADMIN)
========================================================== */

export const deleteUser = async (
  id
) => {

  const { data } = await api.delete(
    `/users/${id}`
  );

  return data;

};