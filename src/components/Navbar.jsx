import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";

import { MdStorefront } from "react-icons/md";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

import "./Navbar.css";
import "./NavbarPremium.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cart = [] } = useCart();
  const { wishlist = [] } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const username = useMemo(
    () => user?.name || user?.displayName || user?.email || "Guest User",
    [user]
  );

  const initials = useMemo(
    () => username.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
    [username]
  );

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
    [cart]
  );

  const navItems = useMemo(
    () => [
      { path: "/", label: "Home", end: true },
      { path: "/products", label: "Products" },
      { path: "/wishlist", label: "Wishlist", icon: <FiHeart />, count: wishlist.length },
      { path: "/cart", label: "Cart", icon: <FiShoppingCart />, count: cartCount },
    ],
    [wishlist.length, cartCount]
  );

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setSearchQuery("");
  }

  function clearSearch() {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }

  async function handleLogout() {
    try {
      await logout();
      setMenuOpen(false);
      setMobileOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }

  function handleSettings() {
    setMenuOpen(false);
    navigate("/account");
  }

  return (
    <>
      <div className="navbar-announcement"><span>🚚 Free shipping on selected orders</span><Link to="/products">Shop now →</Link></div>

      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo" aria-label="TechStore Pro Home">
            <div className="logo-icon"><MdStorefront /></div>
            <div className="logo-text">TechStore <span>Pro</span></div>
          </Link>

          <form className="navbar-search" onSubmit={handleSearch} role="search">
            <FiSearch className="search-icon" aria-hidden="true" />
            <input ref={searchInputRef} type="search" placeholder="Search products..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search products" />
            {searchQuery && <button type="button" className="search-clear" onClick={clearSearch} aria-label="Clear search"><FiX /></button>}
            <button type="submit" className="search-submit" aria-label="Submit search">Search</button>
          </form>

          <nav className="nav-links" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                {item.icon}<span>{item.label}</span>{item.count > 0 && <span className="badge">{item.count}</span>}
              </NavLink>
            ))}
          </nav>

          <button type="button" className="mobile-menu-btn" onClick={() => setMobileOpen((previous) => !previous)} aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>

          <div className="nav-actions" ref={menuRef}>
            <button type="button" className="profile-button" onClick={() => setMenuOpen((previous) => !previous)} aria-expanded={menuOpen} aria-haspopup="menu">
              <span className="profile-avatar">{initials}</span>
              <span className="profile-info"><span className="profile-greeting">Welcome</span><span className="profile-name">{username}</span></span>
              <FiUser className="profile-user-icon" />
            </button>

            {menuOpen && (
              <div className="profile-dropdown" role="menu">
                <div className="profile-dropdown-header"><span className="profile-avatar large">{initials}</span><div><strong>{username}</strong>{user?.email && <p>{user.email}</p>}</div></div>
                <hr />
                <NavLink to="/my-orders" className="dropdown-item" role="menuitem"><FiPackage /><span>My Orders</span></NavLink>
                <NavLink to="/wishlist" className="dropdown-item" role="menuitem"><FiHeart /><span>Wishlist</span>{wishlist.length > 0 && <span className="dropdown-count">{wishlist.length}</span>}</NavLink>
                <NavLink to="/cart" className="dropdown-item" role="menuitem"><FiShoppingCart /><span>Cart</span>{cartCount > 0 && <span className="dropdown-count">{cartCount}</span>}</NavLink>
                <button className="dropdown-item" type="button" onClick={handleSettings} role="menuitem"><FiSettings /><span>Account Settings</span></button>
                <hr />
                <button className="dropdown-item danger" type="button" onClick={handleLogout} role="menuitem"><FiLogOut /><span>Logout</span></button>
              </div>
            )}
          </div>
        </div>

        <div className={mobileOpen ? "mobile-overlay show" : "mobile-overlay"} onClick={() => setMobileOpen(false)} aria-hidden="true" />
        <aside id="mobile-navigation" className={mobileOpen ? "mobile-menu open" : "mobile-menu"} aria-label="Mobile navigation" aria-hidden={!mobileOpen}>
          <div className="mobile-header"><Link to="/" className="logo" onClick={() => setMobileOpen(false)}><div className="logo-icon"><MdStorefront /></div><div className="logo-text">TechStore <span>Pro</span></div></Link><button type="button" className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><FiX /></button></div>
          <form className="mobile-search" onSubmit={handleSearch}><FiSearch /><input type="search" placeholder="Search products..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} aria-label="Search products" /></form>
          <nav className="mobile-nav-links" aria-label="Mobile navigation links">
            {navItems.map((item) => <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}><span className="mobile-nav-label">{item.icon}<span>{item.label}</span></span>{item.count > 0 && <span className="badge">{item.count}</span>}</NavLink>)}
          </nav>
          {user && (
            <div className="mobile-account" aria-label="Account actions">
              <NavLink to="/my-orders" className="dropdown-item" onClick={() => setMobileOpen(false)}><FiPackage /><span>My Orders</span></NavLink>
              <button className="dropdown-item" type="button" onClick={handleSettings}><FiSettings /><span>Account Settings</span></button>
              <button className="dropdown-item danger" type="button" onClick={handleLogout}><FiLogOut /><span>Logout</span></button>
            </div>
          )}
          <div className="mobile-footer"><div className="mobile-cart-summary"><span>Cart total</span><strong>${cartTotal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></div></div>
        </aside>
      </header>
    </>
  );
}

export default Navbar;
