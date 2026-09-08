import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            TechStore <span>Pro</span>
          </Link>

          <p className="footer-description">
            Your one-stop shop for premium laptops,
            smartphones, audio devices, wearables,
            and accessories at great prices.
          </p>

          <div className="footer-social">
            <a
              href="https://wa.me/2348188840165"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <FiMessageCircle aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Shop</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-links">
          <h3>Customer Care</h3>
          <a href="mailto:deejayjohnkay@gmail.com">Contact Us</a>
          <a
            href="https://wa.me/2348188840165"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Support
          </a>
          <a href="mailto:deejayjohnkay@gmail.com?subject=TechStore%20Pro%20Privacy%20Question">
            Privacy Questions
          </a>
          <Link to="/products">Browse Products</Link>
        </div>

        <div className="footer-contact">
          <h3>Get In Touch</h3>

          <a
            href="mailto:deejayjohnkay@gmail.com"
            className="footer-contact__item"
          >
            <FiMail aria-hidden="true" />
            <span>
              <strong>Email</strong>
              deejayjohnkay@gmail.com
            </span>
          </a>

          <a
            href="tel:+2348188840165"
            className="footer-contact__item"
          >
            <FiPhone aria-hidden="true" />
            <span>
              <strong>Phone</strong>
              +234 818 884 0165
            </span>
          </a>

          <div className="footer-contact__item">
            <FiMapPin aria-hidden="true" />
            <span>
              <strong>Location</strong>
              Lagos, Nigeria
            </span>
          </div>
        </div>
      </div>

      <div className="container footer-cta">
        <div className="footer-cta__content">
          <div>
            <strong>Need help choosing the right tech?</strong>
            <span>
              Our team is ready to help you find what you need.
            </span>
          </div>

          <a
            href="https://wa.me/2348188840165"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-cta__button"
          >
            Chat on WhatsApp
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__content">
          <p>
            &copy; {currentYear} TechStore Pro.
            All rights reserved.
          </p>
          <p>
            Premium technology. Smarter choices.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
