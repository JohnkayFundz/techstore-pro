import { Link } from "react-router-dom";
import {
  FiPlusCircle,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

const actions = [
  {
    id: 1,
    title: "Add Product",
    description: "Create a new product",
    icon: FiPlusCircle,
    link: "/admin/products/add",
  },
  {
    id: 2,
    title: "Manage Products",
    description: "View, edit and delete products",
    icon: FiPackage,
    link: "/admin/products",
  },
  {
    id: 3,
    title: "Orders",
    description: "Manage customer orders",
    icon: FiShoppingCart,
    link: "/admin/orders",
  },
  {
    id: 4,
    title: "Users",
    description: "Manage registered users",
    icon: FiUsers,
    link: "/admin/users",
  },
  {
    id: 5,
    title: "Analytics",
    description: "View sales reports and statistics",
    icon: FiBarChart2,
    link: "/admin/analytics",
  },
];

function QuickActions() {
  return (
    <section className="quick-actions">
      <div className="section-header">
        <div>
          <h2>Quick Actions</h2>
          <p>Manage your TechStore Pro efficiently.</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              to={action.link}
              className="quick-action-card"
            >
              <div className="quick-action-icon">
                <Icon size={28} />
              </div>

              <div className="quick-action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;