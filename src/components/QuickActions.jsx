import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiHeart,
  FiShoppingCart,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";

function QuickActions() {
  const actions = [
    {
      title: "Browse Products",
      icon: <FiShoppingBag />,
      path: "/products",
    },
    {
      title: "Wishlist",
      icon: <FiHeart />,
      path: "/wishlist",
    },
    {
      title: "Shopping Cart",
      icon: <FiShoppingCart />,
      path: "/cart",
    },
    {
      title: "Checkout",
      icon: <FiCreditCard />,
      path: "/checkout",
    },
    {
      title: "My Profile",
      icon: <FiUser />,
      path: "/profile",
    },
  ];

  return (
    <div className="dashboard-panel">
      <h3>Quick Actions</h3>

      <div className="dashboard-actions">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="dashboard-action"
          >
            <span className="dashboard-action-icon">
              {action.icon}
            </span>

            <span>{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;