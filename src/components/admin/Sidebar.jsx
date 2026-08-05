import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const menu = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: <FiBox />,
    },
    {
      title: "Add Product",
      path: "/admin/products/new",
      icon: <FiPlusCircle />,
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: <FiShoppingBag />,
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: <FiUsers />,
    },
    {
      title: "Analytics",
      path: "/admin/analytics",
      icon: <FiBarChart2 />,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <FiSettings />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>TechStore Pro</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="logout-btn"
        onClick={handleLogout}
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;