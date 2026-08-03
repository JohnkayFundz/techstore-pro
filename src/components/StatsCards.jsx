import { FiShoppingCart, FiHeart, FiPackage, FiDollarSign } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function StatsCards() {
  const { cart = [] } = useCart();
  const { wishlist } = useWishlist();

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalSpent = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const stats = [
    {
      title: "Cart Items",
      value: totalItems,
      icon: <FiShoppingCart />,
    },
    {
      title: "Wishlist",
      value: wishlist.length,
      icon: <FiHeart />,
    },
    {
      title: "Orders",
      value: 0,
      icon: <FiPackage />,
    },
    {
      title: "Cart Total",
      value: `$${totalSpent.toFixed(2)}`,
      icon: <FiDollarSign />,
    },
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat) => (
        <div className="dashboard-card" key={stat.title}>
          <div className="dashboard-icon">{stat.icon}</div>

          <h2>{stat.value}</h2>

          <p>{stat.title}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;s