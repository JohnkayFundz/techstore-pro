import { FiX } from "react-icons/fi";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

function MobileMenu({
  open,
  onClose,
  cartCount,
  wishlistCount,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`mobile-menu ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mobile-header">
          <h2>Menu</h2>

          <button
            type="button"
            className="mobile-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <NavLinks
          mobile
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onNavigate={onClose}
        />

        <div className="mobile-footer">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

export default MobileMenu;