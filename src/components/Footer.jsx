import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Brand */}
        <div className="footer-brand">
          <h2>
            TechStore <span>Pro</span>
          </h2>

          <p>
            Your one-stop shop for premium laptops,
            smartphones, and accessories at unbeatable prices.
          </p>

          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Twitter">
              Twitter
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-links">
          <h3>Shop</h3>

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/cart">Cart</Link>

          <Link to="/wishlist">Wishlist</Link>

          <Link to="/checkout">Checkout</Link>
        </div>

        {/* Company */}
        <div className="footer-links">
          <h3>Company</h3>

          <Link to="/about">About Us</Link>

          <Link to="/contact">Contact</Link>

          <Link to="/faq">FAQ</Link>

          <Link to="/privacy">Privacy Policy</Link>
        </div>

        {/* Contact */}
        <div className="footer-links">
          <h3>Contact</h3>

          <p>
            Email:{" "}
            <a href="mailto:deejayjohnkay@gmail.com">
              deejayjohnkay@gmail.com
            </a>
          </p>

          <p>
            Phone:{" "}
            <a href="tel:+2348188840165">
              +234 818 884 0165
            </a>
          </p>

          <p>
            Lagos, Nigeria
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} TechStore Pro.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;