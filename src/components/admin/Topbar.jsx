import { FiBell, FiSearch, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

import "./Topbar.css";

function Topbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <FiSearch />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="topbar-right">

        <button className="icon-btn">
          <FiBell />
        </button>

        <div className="admin-profile">
          <div className="profile-icon">
            <FiUser />
          </div>

          <div>
            <h4>{user?.name || "Admin"}</h4>

            <small>
              {user?.role || "Administrator"}
            </small>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Topbar;