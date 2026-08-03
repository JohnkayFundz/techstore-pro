import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiCalendar,
  FiUser,
  FiHome,
} from "react-icons/fi";

function DashboardHeader() {
  const defaultUser = {
    name: "Guest User",
    email: "guest@example.com",
  };

  let user = defaultUser;

  try {
    const storedUser = localStorage.getItem("techstore-user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      user = {
        ...defaultUser,
        ...parsedUser,
      };
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <span className="dashboard-badge">
          <FiHome />
          Admin Dashboard
        </span>

        <h1>
          Welcome back,
          <span className="dashboard-user-name"> {user.name}</span> 👋
        </h1>

        <p className="dashboard-subtitle">
          Manage products, customers, orders and monitor your store
          performance from one place.
        </p>

        <div className="dashboard-meta">
          <span>
            <FiCalendar />
            {today}
          </span>

          <span>
            <FiUser />
            {user.email}
          </span>
        </div>
      </div>

      <div className="dashboard-header__right">
        <Link to="/products" className="btn btn-primary">
          <FiShoppingBag />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;