import api from "./axios";

/* ==========================================================
   ADMIN USERS API
========================================================== */


/* ==========================================================
   GET ALL USERS

   GET /api/admin/users
========================================================== */

export const getUsers = async () => {
  try {
    const { data } = await api.get(
      "/admin/users"
    );

    return data;
  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    /*
     * Do not hide the Axios error.
     *
     * AdminUsers.jsx already has try/catch
     * handling for displaying errors.
     */

    throw error;
  }
};


/* ==========================================================
   GET SINGLE USER

   GET /api/admin/users/:id
========================================================== */

export const getUserById = async (id) => {
  try {
    const { data } = await api.get(
      `/admin/users/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Get User By ID Error:",
      error
    );

    throw error;
  }
};


/* ==========================================================
   UPDATE USER ROLE

   PUT /api/admin/users/:id/role
========================================================== */

export const updateUserRole = async (
  id,
  role
) => {
  try {
    const { data } = await api.put(
      `/admin/users/${id}/role`,
      {
        role,
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    throw error;
  }
};


/* ==========================================================
   DELETE USER

   DELETE /api/admin/users/:id
========================================================== */

export const deleteUser = async (id) => {
  try {
    const { data } = await api.delete(
      `/admin/users/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    throw error;
  }
};