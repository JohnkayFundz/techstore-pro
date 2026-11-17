import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiBox,
} from "react-icons/fi";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container hero-container">
          {/* Left Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <FiStar />
              <span>Demo Storefront</span>
            </div>

            <h1>
              Discover Premium <span>Tech Products</span>
            </h1>

            <p>
              Explore this sample electronics storefront. Replace the demo catalog,
              prices, delivery terms, payment setup, and support details before
              launching your own store.
            </p>

            {/* Action Buttons */}
            <div className="hero-buttons">
              <Link
                to="/products"
                className="btn btn-primary"
                aria-label="Browse all products"
              >
                Shop Now
                <FiArrowRight />
              </Link>

              <Link
                to="/products"
                className="btn btn-outline"
                aria-label="Explore product catalog"
              >
                <FiShoppingBag />
                Explore Products
              </Link>
            </div>

            {/* Statistics */}
            <div className="hero-stats">
              <div className="stat-card">
                <FiBox className="stat-icon" />
                <div>
                  <h3>Demo</h3>
                  <span>Sample Catalog</span>
                </div>
              </div>

              <div className="stat-card">
                <FiStar className="stat-icon" />
                <div>
                  <h3>Demo</h3>
                  <span>Brand Content</span>
                </div>
              </div>

              <div className="stat-card">
                <FiShield className="stat-icon" />
                <div>
                  <h3>You</h3>
                  <span>Set Support Hours</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="hero-features">
              <div className="feature-card">
                <div className="feature-icon">
                  <FiTruck />
                </div>

                <div>
                  <h4>Delivery Policy</h4>
                  <p>Configure your own shipping terms</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FiShield />
                </div>

                <div>
                  <h4>Payment Setup</h4>
                  <p>Connect and verify a payment provider</p>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FiStar />
                </div>

                <div>
                  <h4>Your Store Content</h4>
                  <p>Use product details and media you can verify</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="hero-trust">
              <span>Demo catalog — replace before launch</span>
              <span>Shipping terms set by seller</span>
              <span>Card payments require integration</span>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero-image-wrapper">
            <div className="hero-image">
              <img
                src="/techstore-hero.svg"
                alt="Original abstract illustration of connected technology devices"
                loading="lazy"
              />
            </div>

            {/* Discount Card */}
            <div className="discount-card">
              <span>DEMO</span>
              <h2>OFFER</h2>
              <p>Set your own promotion</p>
            </div>

            {/* Rating Card */}
            <div className="rating-card">
              <div className="rating-stars">DEMO</div>
              <h3>Demo</h3>
              <span>Replace with verified reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;