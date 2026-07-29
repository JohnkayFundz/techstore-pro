import { useMemo, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function ProfileMenu({
  username,
  open,
  onToggle,
  onClose,
  onLogout,
}) {
  const menuRef = useRef(null);

  const initials = useMemo(() => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [username]);

  useEffect(() => {
    function handleOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="profile-menu"
      ref={menuRef}
    >
      <button
        type="button"
        className="profile-button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="profile-avatar">
          {initials}
        </span>

        <span className="profile-name">
          Account
        </span>
      </button>

      {open && (
        <div
          className="profile-dropdown"
          role="menu"
        >
          <div className="profile-header">
            <span className="profile-avatar large">
              {initials}
            </span>

            <div>
              <strong>{username}</strong>
              <p>Welcome back!</p>
            </div>
          </div>

          <NavLink
            to="/profile"
            className="dropdown-item"
            role="menuitem"
          >
            <FiUser />
            My Profile
          </NavLink>

          <NavLink
            to="/orders"
            className="dropdown-item"
            role="menuitem"
          >
            <FiPackage />
            Orders
          </NavLink>

          <NavLink
            to="/wishlist"
            className="dropdown-item"
            role="menuitem"
          >
            <FiHeart />
            Wishlist
          </NavLink>

          <NavLink
            to="/settings"
            className="dropdown-item"
            role="menuitem"
          >
            <FiSettings />
            Settings
          </NavLink>

          <hr />

          <button
            type="button"
            className="dropdown-item danger"
            onClick={onLogout}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;