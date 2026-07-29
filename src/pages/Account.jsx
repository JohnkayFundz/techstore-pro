import { useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Account() {
  const {
    user,
    loading,
    logout,
    updateUserProfile,
  } = useAuth();

  const [name, setName] = useState(
    user?.displayName || ""
  );

  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <section className="container page-loader">
        <div className="spinner"></div>
        <p>Loading account...</p>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile({
        displayName: trimmedName,
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  }

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

          <div className="account-avatar">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
              />
            ) : (
              <div className="avatar-placeholder">
                {(user.displayName || user.email)
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <form
            className="account-form"
            onSubmit={handleUpdateProfile}
          >
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                value={user.email}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email Verified</label>

              <input
                type="text"
                value={
                  user.emailVerified
                    ? "Verified"
                    : "Not Verified"
                }
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Account Created</label>

              <input
                type="text"
                value={new Date(
                  user.metadata.creationTime
                ).toLocaleDateString()}
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