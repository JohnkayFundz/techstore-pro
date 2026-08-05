import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiUser, FiLogOut } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./AdminHeader.css";


function AdminHeader() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <header className="admin-header">

      {/* Search */}
      <div className="admin-search">
        <FiSearch />

        <input
          type="text"
          placeholder="Search products, orders..."
        />
      </div>


      {/* Right Section */}
      <div className="admin-header-right">


        {/* Notification */}
        <button className="icon-btn">
          <FiBell />

          <span className="notification-dot"></span>
        </button>


        {/* Profile */}
        <div className="admin-profile">

          <div className="profile-icon">
            <FiUser />
          </div>


          <div className="profile-info">

            <h4>
              {user?.name || "Admin"}
            </h4>

            <span>
              {user?.role || "Administrator"}
            </span>

          </div>

        </div>


        {/* Logout */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <FiLogOut />

          <span>
            Logout
          </span>

        </button>


      </div>

    </header>
  );
}


export default AdminHeader;