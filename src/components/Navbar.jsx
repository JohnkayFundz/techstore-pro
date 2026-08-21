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


function Navbar() {

  /* ==========================================================
     CONTEXT
  ========================================================== */

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


  /* ==========================================================
     ROUTER
  ========================================================== */

  const location = useLocation();

  const navigate = useNavigate();


  /* ==========================================================
     REFS
  ========================================================== */

  const menuRef = useRef(null);

  const searchInputRef = useRef(null);


  /* ==========================================================
     STATE
  ========================================================== */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  /* ==========================================================
     USERNAME
  ========================================================== */

  const username = useMemo(() => {
    return (
      user?.name ||
      user?.displayName ||
      user?.email ||
      "Guest User"
    );
  }, [user]);


  /* ==========================================================
     USER INITIALS
  ========================================================== */

  const initials = useMemo(() => {

    const value =
      username || "Guest User";


    return value
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  }, [username]);


  /* ==========================================================
     CART COUNT
  ========================================================== */

  const cartCount = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    );

  }, [cart]);


  /* ==========================================================
     CART TOTAL
  ========================================================== */

  const cartTotal = useMemo(() => {

    return cart.reduce(
      (total, item) =>
        total +
        (
          Number(item.price) || 0
        ) *
        (
          Number(item.quantity) || 0
        ),
      0
    );

  }, [cart]);


  /* ==========================================================
     NAVIGATION ITEMS
  ========================================================== */

  const navItems = useMemo(
    () => [
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
        count: wishlist.length,
      },

      {
        path: "/cart",
        label: "Cart",
        icon: <FiShoppingCart />,
        count: cartCount,
      },
    ],
    [
      wishlist.length,
      cartCount,
    ]
  );


  /* ==========================================================
     CLOSE MENUS WHEN ROUTE CHANGES
  ========================================================== */

  useEffect(() => {

    setMenuOpen(false);

    setMobileOpen(false);

  }, [location]);


  /* ==========================================================
     OUTSIDE CLICK + ESCAPE KEY
  ========================================================== */

  useEffect(() => {

    function handleOutsideClick(
      event
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setMenuOpen(false);
      }

    }


    function handleEscape(
      event
    ) {

      if (
        event.key === "Escape"
      ) {

        setMenuOpen(false);

        setMobileOpen(false);

        searchInputRef.current?.blur();

      }

    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );


      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  /* ==========================================================
     SEARCH
  ========================================================== */

  function handleSearch(
    event
  ) {

    event.preventDefault();


    const query =
      searchQuery.trim();


    if (!query) {

      navigate("/products");

      return;

    }


    navigate(
      `/products?search=${encodeURIComponent(
        query
      )}`
    );


    setSearchQuery("");

  }


  /* ==========================================================
     CLEAR SEARCH
  ========================================================== */

  function clearSearch() {

    setSearchQuery("");

    searchInputRef.current?.focus();

  }


  /* ==========================================================
     LOGOUT
  ========================================================== */

  async function handleLogout() {

    try {

      await logout();

      setMenuOpen(false);

      setMobileOpen(false);

    } catch (error) {

      console.error(
        "Logout Error:",
        error
      );

    }

  }


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <>

      {/* ======================================================
          ANNOUNCEMENT BAR
      ====================================================== */}

      <div className="navbar-announcement">

        <span>
          🚚 Free shipping on selected orders
        </span>

        <Link to="/products">
          Shop now →
        </Link>

      </div>


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="navbar">

        <div className="navbar-inner">


          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            className="logo"
            aria-label="TechStore Pro Home"
          >

            <div className="logo-icon">
              <MdStorefront />
            </div>


            <div className="logo-text">
              TechStore{" "}
              <span>Pro</span>
            </div>

          </Link>


          {/* ==================================================
              SEARCH
          ================================================== */}

          <form
            className="navbar-search"
            onSubmit={handleSearch}
            role="search"
          >

            <FiSearch
              className="search-icon"
            />


            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              aria-label="Search products"
            />


            {searchQuery && (

              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >

                <FiX />

              </button>

            )}


            <button
              type="submit"
              className="search-submit"
              aria-label="Submit search"
            >

              Search

            </button>

          </form>


          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="nav-links"
            aria-label="Main navigation"
          >

            {navItems.map(
              (item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >

                  {item.icon}


                  <span>
                    {item.label}
                  </span>


                  {item.count > 0 && (

                    <span className="badge">
                      {item.count}
                    </span>

                  )}

                </NavLink>

              )
            )}

          </nav>


          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMobileOpen(
                (previous) =>
                  !previous
              )
            }
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              mobileOpen
            }
          >

            {mobileOpen ? (
              <FiX />
            ) : (
              <FiMenu />
            )}

          </button>


          {/* ==================================================
              PROFILE
          ================================================== */}

          <div
            className="nav-actions"
            ref={menuRef}
          >

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setMenuOpen(
                  (previous) =>
                    !previous
                )
              }
              aria-expanded={
                menuOpen
              }
              aria-haspopup="menu"
            >

              <span className="profile-avatar">
                {initials}
              </span>


              <span className="profile-info">

                <span className="profile-greeting">
                  Welcome
                </span>

                <span className="profile-name">
                  {username}
                </span>

              </span>

              <FiUser className="profile-user-icon" />

            </button>


            {/* ==================================================
                PROFILE DROPDOWN
            ================================================== */}

            {menuOpen && (

              <div
                className="profile-dropdown"
                role="menu"
              >

                <div className="profile-dropdown-header">

                  <span className="profile-avatar large">
                    {initials}
                  </span>


                  <div>

                    <strong>
                      {username}
                    </strong>


                    {user?.email && (

                      <p>
                        {user.email}
                      </p>

                    )}

                  </div>

                </div>


                <hr />


                <NavLink
                  to="/my-orders"
                  className="dropdown-item"
                  role="menuitem"
                >

                  <FiPackage />

                  <span>
                    My Orders
                  </span>

                </NavLink>


                <NavLink
                  to="/wishlist"
                  className="dropdown-item"
                  role="menuitem"
                >

                  <FiHeart />

                  <span>
                    Wishlist
                  </span>

                  {wishlist.length > 0 && (

                    <span className="dropdown-count">
                      {wishlist.length}
                    </span>

                  )}

                </NavLink>


                <NavLink
                  to="/cart"
                  className="dropdown-item"
                  role="menuitem"
                >

                  <FiShoppingCart />

                  <span>
                    Cart
                  </span>

                  {cartCount > 0 && (

                    <span className="dropdown-count">
                      {cartCount}
                    </span>

                  )}

                </NavLink>


                <button
                  className="dropdown-item"
                  type="button"
                  role="menuitem"
                >

                  <FiSettings />

                  <span>
                    Settings
                  </span>

                </button>


                <hr />


                <button
                  className="dropdown-item danger"
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                >

                  <FiLogOut />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>

        </div>


        {/* ====================================================
            MOBILE DRAWER
        ==================================================== */}

        <div
          className={
            mobileOpen
              ? "mobile-overlay show"
              : "mobile-overlay"
          }
          onClick={() =>
            setMobileOpen(false)
          }
          aria-hidden="true"
        />


        <aside
          className={
            mobileOpen
              ? "mobile-menu open"
              : "mobile-menu"
          }
          aria-label="Mobile navigation"
        >

          <div className="mobile-header">

            <Link
              to="/"
              className="logo"
              onClick={() =>
                setMobileOpen(false)
              }
            >

              <div className="logo-icon">
                <MdStorefront />
              </div>


              <div className="logo-text">
                TechStore{" "}
                <span>Pro</span>
              </div>

            </Link>


            <button
              type="button"
              className="mobile-close"
              onClick={() =>
                setMobileOpen(false)
              }
              aria-label="Close menu"
            >

              <FiX />

            </button>

          </div>


          {/* MOBILE SEARCH */}

          <form
            className="mobile-search"
            onSubmit={handleSearch}
          >

            <FiSearch />

            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
            />

          </form>


          {/* MOBILE LINKS */}

          <nav
            className="mobile-nav-links"
            aria-label="Mobile navigation links"
          >

            {navItems.map(
              (item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >

                  <span className="mobile-nav-label">

                    {item.icon}

                    <span>
                      {item.label}
                    </span>

                  </span>


                  {item.count > 0 && (

                    <span className="badge">
                      {item.count}
                    </span>

                  )}

                </NavLink>

              )
            )}

          </nav>


          {/* MOBILE FOOTER */}

          <div className="mobile-footer">

            <div className="mobile-cart-summary">

              <span>
                Cart total
              </span>

              <strong>
                ${cartTotal.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

          </div>

        </aside>

      </header>

    </>

  );

}


export default Navbar;