import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiHeart,
  FiShoppingCart,
  FiInfo,
  FiPhone,
} from "react-icons/fi";

function NavLinks({
  cartCount,
  wishlistCount,
  onNavigate,
  mobile = false,
}) {
  const links = [
    {
      path: "/",
      label: "Home",
      icon: <FiHome />,
      end: true,
    },
    {
      path: "/products",
      label: "Products",
      icon: <FiGrid />,
    },
    {
      path: "/about",
      label: "About",
      icon: <FiInfo />,
    },
    {
      path: "/contact",
      label: "Contact",
      icon: <FiPhone />,
    },
    {
      path: "/wishlist",
      label: "Wishlist",
      icon: <FiHeart />,
      count: wishlistCount,
    },
    {
      path: "/cart",
      label: "Cart",
      icon: <FiShoppingCart />,
      count: cartCount,
    },
  ];

  return (
    <nav className={mobile ? "mobile-nav-links" : "nav-links"}>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span className="nav-icon">
            {link.icon}
          </span>

          <span>{link.label}</span>

          {link.count > 0 && (
            <span className="badge">
              {link.count}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavLinks;