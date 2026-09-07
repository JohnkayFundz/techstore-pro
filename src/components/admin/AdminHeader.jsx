import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiSearch,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email ||
    "Admin";

  const displayRole =
    user?.role || "Administrator";

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      navigate("/admin/products");
      return;
    }

    navigate(
      `/admin/products?search=${encodeURIComponent(query)}`
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-header">
      <form
        className="admin-search"
        onSubmit={handleSearch}
        role="search"
      >
        <FiSearch aria-hidden="true" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          placeholder="Search products, orders..."
          aria-label="Search admin products and orders"
        />
      </form>

      <div className="admin-header-right">
        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <FiBell aria-hidden="true" />
          <span
            className="notification-dot"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          className="admin-profile"
          onClick={() => navigate("/admin/settings")}
          aria-label="Open admin settings"
        >
          <span className="profile-icon">
            <FiUser aria-hidden="true" />
          </span>

          <span className="profile-info">
            <strong>{displayName}</strong>
            <span>{displayRole}</span>
          </span>
        </button>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
