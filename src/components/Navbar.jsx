import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";

import { MdStorefront } from "react-icons/md";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./Navbar.css";

function Navbar() {

  const {
    user,
    logout,
  } = useAuth();

  const {
    cart = [],
  } = useCart();

  const {
    wishlist = [],
  } = useWishlist();

  const location = useLocation();

  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const username = useMemo(() => {

    return (
      user?.name ||
      user?.displayName ||
      user?.email ||
      "Guest User"
    );

  }, [user]);

  const initials = useMemo(() => {

    return username
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  }, [username]);

  const cartCount = useMemo(() => {

    return cart.reduce(

      (total, item) =>
        total + item.quantity,

      0

    );

  }, [cart]);

  const wishlistCount =
    wishlist.length;

  const navItems = useMemo(() => [

    {
      path: "/",
      label: "Home",
      end: true,
    },

    {
      path: "/products",
      label: "Products",
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

  ], [
    wishlistCount,
    cartCount,
  ]);

  useEffect(() => {

    setMenuOpen(false);

    setMobileOpen(false);

  }, [location]);

  useEffect(() => {

    function handleOutside(event) {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {

        setMenuOpen(false);

      }

    }

    function handleEscape(event) {

      if (event.key === "Escape") {

        setMenuOpen(false);

        setMobileOpen(false);

      }

    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);

  async function handleLogout() {

    try {

      await logout();

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <header className="navbar">

      <div className="navbar-inner">

        {/* ===============================
            Logo
        =============================== */}

        <Link
          to="/"
          className="logo"
          aria-label="TechStore Pro Home"
        >

          <div className="logo-icon">
            <MdStorefront />
          </div>

          <div className="logo-text">
            TechStore <span>Pro</span>
          </div>

        </Link>

        {/* ===============================
            Mobile Menu Button
        =============================== */}

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() =>
            setMobileOpen(prev => !prev)
          }
        >

          {mobileOpen ? <FiX /> : <FiMenu />}

        </button>        {/* ===============================
            Desktop Navigation
        =============================== */}

        <nav
          className={
            mobileOpen
              ? "nav-links open"
              : "nav-links"
          }
        >

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >

              {item.icon && (
                <span className="nav-icon">
                  {item.icon}
                </span>
              )}

              <span>{item.label}</span>

              {item.count > 0 && (
                <span className="badge">
                  {item.count}
                </span>
              )}

            </NavLink>

          ))}

        </nav>




        {/* ===============================
            Profile Menu
        =============================== */}

        <div
          className="nav-actions"
          ref={menuRef}
        >

          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setMenuOpen(prev => !prev)
            }
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >

            <span className="profile-avatar">
              {initials}
            </span>

            <span className="profile-name">
              {username}
            </span>

          </button>





          {menuOpen && (

            <div
              className="profile-dropdown"
              role="menu"
            >

              <p>
                Welcome back
              </p>

              <strong>
                {username}
              </strong>




              <NavLink
                to="/profile"
                className="dropdown-item"
              >

                <FiUser />

                <span>
                  My Account
                </span>

              </NavLink>





              <NavLink
                to="/wishlist"
                className="dropdown-item"
              >

                <FiHeart />

                <span>
                  Wishlist
                </span>

              </NavLink>





              <NavLink
                to="/cart"
                className="dropdown-item"
              >

                <FiShoppingCart />

                <span>
                  Shopping Cart
                </span>

              </NavLink>





              <NavLink
                to="/orders"
                className="dropdown-item"
              >

                <FiPackage />

                <span>
                  My Orders
                </span>

              </NavLink>





              <button
                type="button"
                className="dropdown-item"
              >

                <FiSettings />

                <span>
                  Settings
                </span>

              </button>





              <hr />





              <button
                type="button"
                className="dropdown-item danger"
                onClick={handleLogout}
              >

                <FiLogOut />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>      {/* =====================================
          Mobile Overlay
      ===================================== */}

      {mobileOpen && (
        <div
          className="mobile-overlay show"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =====================================
          Mobile Sidebar
      ===================================== */}

      <aside
        className={
          mobileOpen
            ? "mobile-menu open"
            : "mobile-menu"
        }
      >

        <div className="mobile-header">

          <Link
            to="/"
            className="logo"
            onClick={() => setMobileOpen(false)}
          >

            <div className="logo-icon">
              <MdStorefront />
            </div>

            <div className="logo-text">
              TechStore <span>Pro</span>
            </div>

          </Link>

          <button
            type="button"
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >

            <FiX />

          </button>

        </div>





        {/* =====================================
            Mobile Navigation
        ===================================== */}

        <nav className="mobile-nav-links">

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={() => setMobileOpen(false)}
            >

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                }}
              >

                {item.icon && item.icon}

                {item.label}

              </span>

              {item.count > 0 && (

                <span className="badge">

                  {item.count}

                </span>

              )}

            </NavLink>

          ))}





          {user && (

            <>

              <NavLink
                to="/profile"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >

                <FiUser />

                <span>My Account</span>

              </NavLink>



              <NavLink
                to="/orders"
                className="nav-link"
                onClick={() => setMobileOpen(false)}
              >

                <FiPackage />

                <span>My Orders</span>

              </NavLink>

            </>

          )}

        </nav>






        {/* =====================================
            Mobile Footer
        ===================================== */}

        <div className="mobile-footer">

          {user ? (

            <button
              type="button"
              className="dropdown-item danger"
              onClick={async () => {

                setMobileOpen(false);

                await handleLogout();

              }}
            >

              <FiLogOut />

              <span>Logout</span>

            </button>

          ) : (

            <NavLink
              to="/login"
              className="dropdown-item"
              onClick={() => setMobileOpen(false)}
            >

              <FiUser />

              <span>Login</span>

            </NavLink>

          )}

        </div>

      </aside>

    </header>

  );

}

export default Navbar;