import { Link } from "react-router-dom";
import { FiMail, FiMapPin } from "react-icons/fi";

function Footer() {
 const currentYear = new Date().getFullYear();
 return <footer className="footer"><div className="container footer-grid">
  <div className="footer-brand"><Link to="/" className="footer-logo">TechStore <span>Pro</span></Link><p className="footer-description">Demo storefront template. Add your own business description, contact details and policies before launch.</p></div>
  <div className="footer-links"><h3>Shop</h3><Link to="/">Home</Link><Link to="/products">Products</Link><Link to="/cart">Cart</Link><Link to="/wishlist">Wishlist</Link><Link to="/checkout">Checkout</Link></div>
  <div className="footer-links"><h3>Store information</h3><Link to="/products">Browse demo catalog</Link><span>Configure privacy and return policies</span><span>Configure customer support</span></div>
  <div className="footer-contact"><h3>Business contact</h3><div className="footer-contact__item"><FiMail aria-hidden="true"/><span><strong>Email</strong>Replace with your support email</span></div><div className="footer-contact__item"><FiMapPin aria-hidden="true"/><span><strong>Location</strong>Set your business location</span></div></div>
 </div><div className="container footer-cta"><div className="footer-cta__content"><div><strong>Make this storefront yours</strong><span>Replace demo text, products, policies and support information before launch.</span></div><Link to="/products" className="footer-cta__button">Explore demo catalog</Link></div></div><div className="footer-bottom"><div className="container footer-bottom__content"><p>&copy; {currentYear} TechStore Pro. Demo template.</p><p>Replace with your store tagline.</p></div></div></footer>;
}
export default Footer;
