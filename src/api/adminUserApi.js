import api from "./axios";

/* ==========================================================
   ADMIN USERS API
========================================================== */

/* ----------------------------------------------------------
   GET ALL USERS
   GET /api/admin/users
---------------------------------------------------------- */

export const getUsers = async () => {
  try {
    const { data } = await api.get("/admin/users");

    return data;
  } catch (error) {
    console.error("Get Users Error:", error);

    return {
      success: false,
      users: [],
      message:
        error.response?.data?.message ||
        "Failed to load users.",
    };
  }
};


/* ----------------------------------------------------------
   GET SINGLE USER
   GET /api/admin/users/:id
---------------------------------------------------------- */

export const getUserById = async (id) => {
  try {
    const { data } = await api.get(
      `/admin/users/${id}`
    );

    return data;
  } catch (error) {
    console.error("Get User By ID Error:", error);

    return {
      success: false,
      user: null,
      message:
        error.response?.data?.message ||
        "Failed to load user.",
    };
  }
};


/* ----------------------------------------------------------
   UPDATE USER ROLE
   PUT /api/admin/users/:id/role
---------------------------------------------------------- */

export const updateUserRole = async (id, role) => {
  try {
    const { data } = await api.put(
      `/admin/users/${id}/role`,
      {
        role,
      }
    );

    return data;
  } catch (error) {
    console.error("Update User Role Error:", error);

    return {
      success: false,
      user: null,
      message:
        error.response?.data?.message ||
        "Failed to update user role.",
    };
  }
};


/* ----------------------------------------------------------
   DELETE USER
   DELETE /api/admin/users/:id
---------------------------------------------------------- */

export const deleteUser = async (id) => {
  try {
    const { data } = await api.delete(
      `/admin/users/${id}`
    );

    return data;
  } catch (error) {
    console.error("Delete User Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete user.",
    };
  }
};