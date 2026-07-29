import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

function DashboardHeader() {
  let user = {
    name: "Guest User",
    email: "guest@example.com",
  };

  try {
    const storedUser = localStorage.getItem("techstore-user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error loading user:", error);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-header">
      <div>
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>{today}</p>
      </div>

      <Link to="/products" className="btn btn-primary">
        <FiShoppingBag />
        <span> Continue Shopping</span>
      </Link>
    </div>
  );
}

export default DashboardHeader;