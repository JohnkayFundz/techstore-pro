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

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

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
        !menuRef.current.contains(
          event.target
        )
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

    } catch(error) {

      console.error(error);

    }

  }






  return (

    <header className="navbar">


      <div className="navbar-inner">



        <Link
          to="/"
          className="logo"
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
          className="mobile-menu-btn"
          onClick={() =>
            setMobileOpen(
              previous => !previous
            )
          }
        >

          {
            mobileOpen
              ? <FiX />
              : <FiMenu />
          }

        </button>







        <nav
          className={
            mobileOpen
              ? "nav-links open"
              : "nav-links"
          }
        >

          {
            navItems.map(item => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({isActive}) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >

                {item.icon}

                <span>
                  {item.label}
                </span>


                {
                  item.count > 0 && (

                    <span className="badge">
                      {item.count}
                    </span>

                  )
                }


              </NavLink>

            ))
          }


        </nav>








        <div
          className="nav-actions"
          ref={menuRef}
        >


          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setMenuOpen(
                previous => !previous
              )
            }
          >

            <span className="profile-avatar">
              {initials}
            </span>


            <span className="profile-name">
              {username}
            </span>


          </button>







          {
            menuOpen && (

              <div className="profile-dropdown">


                <strong>
                  {username}
                </strong>



                <NavLink
                  to="/my-orders"
                  className="dropdown-item"
                >

                  <FiPackage />

                  My Orders

                </NavLink>





                <NavLink
                  to="/cart"
                  className="dropdown-item"
                >

                  <FiShoppingCart />

                  Cart

                </NavLink>





                <button
                  className="dropdown-item"
                  type="button"
                >

                  <FiSettings />

                  Settings

                </button>





                <button
                  className="dropdown-item danger"
                  type="button"
                  onClick={handleLogout}
                >

                  <FiLogOut />

                  Logout

                </button>



              </div>

            )
          }



        </div>




      </div>



    </header>

  );

}



export default Navbar;