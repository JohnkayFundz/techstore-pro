import "./AdminUsers.css";
import { useEffect, useState } from "react";
import {
  FiTrash2,
  FiUserCheck,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../../api/adminUserApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  /* ==========================================================
     FETCH USERS
  ========================================================== */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await getUsers();

      if (response?.success === false) {
        setUsers([]);
        setMessage(
          response.message || "Failed to load users."
        );
        return;
      }

      /*
       * Backend response:
       *
       * {
       *   success: true,
       *   count: 23,
       *   data: [...]
       * }
       */

      setUsers(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Fetch Users Error:", error);

      setUsers([]);

      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     LOAD USERS
  ========================================================== */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ==========================================================
     UPDATE USER ROLE
  ========================================================== */

  const handleRoleChange = async (id, role) => {
    try {
      setActionLoading(`role-${id}`);
      setMessage("");

      const response = await updateUserRole(id, role);

      if (response?.success === false) {
        setMessage(
          response.message ||
            "Failed to update user role."
        );
        return;
      }

      /*
       * Update the user locally instead of
       * fetching the entire user list again.
       */

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === id
            ? {
                ...user,
                role,
              }
            : user
        )
      );

      setMessage(
        role === "admin"
          ? "User promoted to admin successfully."
          : "User changed to regular user successfully."
      );
    } catch (error) {
      console.error(
        "Update User Role Error:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user role."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     DELETE USER
  ========================================================== */

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user.name || "this user"}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoading(`delete-${user._id}`);
      setMessage("");

      const response = await deleteUser(user._id);

      if (response?.success === false) {
        setMessage(
          response.message ||
            "Failed to delete user."
        );
        return;
      }

      /*
       * Remove the deleted user immediately.
       */

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item._id !== user._id
        )
      );

      setMessage(
        `"${user.name || "User"}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Delete User Error:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     SEARCH USERS
  ========================================================== */

  const filteredUsers = users.filter((user) => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return true;
    }

    return (
      user.name
        ?.toLowerCase()
        .includes(searchValue) ||
      user.email
        ?.toLowerCase()
        .includes(searchValue) ||
      user.role
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  /* ==========================================================
     LOADING STATE
  ========================================================== */

  if (loading) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div>
            <h1>Manage Users</h1>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="admin-users">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="admin-users-header">

        <div>
          <h1>Manage Users</h1>

          <p>
            Manage registered users, roles, and
            account access.
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={fetchUsers}
          disabled={loading}
        >
          <FiRefreshCw />

          <span>Refresh</span>
        </button>

      </div>

      {/* ======================================================
          MESSAGE
      ====================================================== */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {/* ======================================================
          USER SUMMARY
      ====================================================== */}

      <div className="users-summary">

        <div className="users-summary-card">

          <span>Total Users</span>

          <strong>
            {users.length}
          </strong>

        </div>

        <div className="users-summary-card">

          <span>Administrators</span>

          <strong>
            {
              users.filter(
                (user) =>
                  user.role === "admin"
              ).length
            }
          </strong>

        </div>

        <div className="users-summary-card">

          <span>Regular Users</span>

          <strong>
            {
              users.filter(
                (user) =>
                  user.role !== "admin"
              ).length
            }
          </strong>

        </div>

      </div>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="users-toolbar">

        <div className="users-search">

          <FiSearch />

          <input
            type="search"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <span className="users-result-count">
          Showing {filteredUsers.length} of{" "}
          {users.length}
        </span>

      </div>

      {/* ======================================================
          USERS TABLE
      ====================================================== */}

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="empty-users"
                >
                  {search
                    ? "No users match your search."
                    : "No users found."}
                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => {

                const roleLoading =
                  actionLoading ===
                  `role-${user._id}`;

                const deleteLoading =
                  actionLoading ===
                  `delete-${user._id}`;

                return (
                  <tr key={user._id}>

                    {/* NAME */}

                    <td>

                      <div className="user-name">

                        <div className="user-avatar">
                          {(
                            user.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span>
                          {user.name ||
                            "Unnamed User"}
                        </span>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td>
                      {user.email ||
                        "No email"}
                    </td>

                    {/* ROLE */}

                    <td>

                      <select
                        value={
                          user.role ||
                          "user"
                        }
                        disabled={
                          roleLoading ||
                          deleteLoading
                        }
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                      </select>

                    </td>

                    {/* JOINED */}

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="user-actions">

                        {/* ROLE BUTTON */}

                        <button
                          type="button"
                          className="role-btn"
                          title={
                            user.role ===
                            "admin"
                              ? "Change to User"
                              : "Change to Admin"
                          }
                          disabled={
                            roleLoading ||
                            deleteLoading
                          }
                          onClick={() =>
                            handleRoleChange(
                              user._id,
                              user.role ===
                                "admin"
                                ? "user"
                                : "admin"
                            )
                          }
                        >

                          <FiUserCheck />

                        </button>

                        {/* DELETE BUTTON */}

                        <button
                          type="button"
                          className="delete-btn"
                          title="Delete User"
                          disabled={
                            roleLoading ||
                            deleteLoading
                          }
                          onClick={() =>
                            handleDelete(user)
                          }
                        >

                          {deleteLoading ? (
                            "..."
                          ) : (
                            <FiTrash2 />
                          )}

                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminUsers;