import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
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

        {/* ==================================================
            BRAND
        ================================================== */}

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
              href="#"
              aria-label="Facebook"
              title="Facebook"
            >
              <FiFacebook aria-hidden="true" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              title="Instagram"
            >
              <FiInstagram aria-hidden="true" />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              title="Twitter"
            >
              <FiTwitter aria-hidden="true" />
            </a>

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

        {/* ==================================================
            SHOP
        ================================================== */}

        <div className="footer-links">

          <h3>Shop</h3>

          <Link to="/">Home</Link>

          <Link to="/products">Products</Link>

          <Link to="/cart">Cart</Link>

          <Link to="/wishlist">Wishlist</Link>

          <Link to="/checkout">Checkout</Link>

        </div>

        {/* ==================================================
            CUSTOMER CARE
        ================================================== */}

        <div className="footer-links">

          <h3>Customer Care</h3>

          <Link to="/contact">Contact Us</Link>

          <Link to="/faq">FAQs</Link>

          <Link to="/privacy">Privacy Policy</Link>

          <Link to="/about">About Us</Link>

        </div>

        {/* ==================================================
            CONTACT
        ================================================== */}

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

      {/* ==================================================
          FOOTER CTA
      ================================================== */}

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

      {/* ==================================================
          FOOTER BOTTOM
      ================================================== */}

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