import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Account() {
  const {
    user,
    loading,
    logout,
    updateUser,
  } = useAuth();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(
      user?.name ||
      user?.displayName ||
      ""
    );
  }, [user]);

  if (loading) {
    return (
      <section className="container page-loader">
        <div className="spinner" aria-hidden="true"></div>
        <p>Loading account...</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleUpdateProfile(event) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      // Keep the profile immediately available across the app.
      // The current backend does not expose a customer profile-update endpoint.
      updateUser({
        ...user,
        name: trimmedName,
        displayName: trimmedName,
      });

      toast.success("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(
        error?.message ||
        "Unable to log out."
      );
    }
  }

  const createdAt =
    user.createdAt ||
    user.metadata?.creationTime;

  const formattedCreatedAt = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "Not available";

  return (
    <section className="account-page">
      <div className="container">
        <div className="account-card">
          <div className="account-header">
            <h1>My Account</h1>
            <p>
              Manage your profile information.
            </p>
          </div>

          <div className="account-avatar" aria-hidden="true">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
              />
            ) : (
              <div className="avatar-placeholder">
                {(user.name || user.displayName || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <form
            className="account-form"
            onSubmit={handleUpdateProfile}
          >
            <div className="form-group">
              <label htmlFor="account-name">
                Full Name
              </label>

              <input
                id="account-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoComplete="name"
                disabled={saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="account-email">
                Email Address
              </label>

              <input
                id="account-email"
                type="email"
                value={user.email || ""}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="account-role">
                Account Role
              </label>

              <input
                id="account-role"
                type="text"
                value={user.role || "customer"}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="account-created">
                Account Created
              </label>

              <input
                id="account-created"
                type="text"
                value={formattedCreatedAt}
                disabled
                readOnly
              />
            </div>

            <div className="account-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Account;