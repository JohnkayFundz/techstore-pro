import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { state } = useCart();

  const totalItems = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🛒 TechStore Pro</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/products">Products</Link>
        </li>

        <li>
          <Link to="/cart">
            Cart ({totalItems})
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;