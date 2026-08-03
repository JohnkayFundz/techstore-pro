import { useEffect, useState } from "react";
import { FiTrash2, FiUserCheck } from "react-icons/fi";

import { getUsers, updateUserRole, deleteUser } from "../../api/userApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();
      setUsers(data.users || []);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);

      setMessage("User role updated successfully");

      fetchUsers();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      setMessage("User deleted successfully");

      fetchUsers();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  };


  if (loading) {
    return <h2>Loading users...</h2>;
  }


  return (
    <div className="admin-users">

      <h1>Manage Users</h1>

      {message && (
        <p className="admin-message">
          {message}
        </p>
      )}


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

            {users.map((user) => (

              <tr key={user._id}>

                <td>
                  {user.name}
                </td>


                <td>
                  {user.email}
                </td>


                <td>

                  <select
                    value={user.role}
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


                <td>
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </td>


                <td>

                  <button
                    className="role-btn"
                    onClick={() =>
                      handleRoleChange(
                        user._id,
                        user.role === "admin"
                          ? "user"
                          : "admin"
                      )
                    }
                  >
                    <FiUserCheck />
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(user._id)
                    }
                  >
                    <FiTrash2 />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminUsers;