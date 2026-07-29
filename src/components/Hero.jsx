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

          {/* =========================
              LEFT CONTENT
          ========================== */}

          <div className="hero-content">

            <div className="hero-badge">
              <FiStar />
              <span>New Collection 2026</span>
            </div>

            <h1>
              Discover Premium
              <span> Tech Products</span>
            </h1>

            <p>
              Shop the latest laptops, smartphones, gaming gear,
              accessories and premium electronics from the world's
              leading brands at unbeatable prices with secure checkout
              and nationwide delivery.
            </p>

            {/* Buttons */}

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

                  <h3>30+</h3>

                  <span>Products</span>

                </div>

              </div>

              <div className="stat-card">

                <FiStar className="stat-icon" />

                <div>

                  <h3>15+</h3>

                  <span>Brands</span>

                </div>

              </div>

              <div className="stat-card">

                <FiShield className="stat-icon" />

                <div>

                  <h3>24/7</h3>

                  <span>Support</span>

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

                  <h4>Fast Delivery</h4>

                  <p>Quick shipping nationwide</p>

                </div>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  <FiShield />
                </div>

                <div>

                  <h4>Secure Payment</h4>

                  <p>100% protected checkout</p>

                </div>

              </div>

              <div className="feature-card">

                <div className="feature-icon">
                  <FiStar />
                </div>

                <div>

                  <h4>Premium Quality</h4>

                  <p>Trusted global brands</p>

                </div>

              </div>

            </div>

            {/* Trust */}

            <div className="hero-trust">

              <span>⭐ Rated 4.9/5</span>

              <span>🚚 Free Shipping</span>

              <span>🔒 Secure Checkout</span>

            </div>

          </div>

          {/* =========================
              RIGHT CONTENT
          ========================== */}

          <div className="hero-image-wrapper">

            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"
                alt="Premium technology products"
                loading="lazy"
              />

            </div>

            {/* Discount Card */}

            <div className="discount-card">

              <span>UP TO</span>

              <h2>40% OFF</h2>

              <p>Limited Time Offer</p>

            </div>

            {/* Rating Card */}

            <div className="rating-card">

              <div className="rating-stars">

                ★★★★★

              </div>

              <h3>4.9/5</h3>

              <span>Customer Rating</span>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;