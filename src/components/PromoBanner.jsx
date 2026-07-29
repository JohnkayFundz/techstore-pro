import { Link } from "react-router-dom";

function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="container">
        <div className="promo-content">
          <span className="promo-badge">
            🔥 Limited Time Offer
          </span>

          <h2>
            Summer Tech Sale
          </h2>

          <p>
            Save up to <strong>40% OFF</strong> on selected laptops,
            smartphones, gaming accessories, and premium electronics.
            Don't miss out on these incredible deals.
          </p>

          <div className="promo-buttons">
            <Link
              to="/products"
              className="btn"
            >
              Shop Deals
            </Link>

            <Link
              to="/products"
              className="btn btn-outline"
            >
              View Products
            </Link>
          </div>
        </div>

        <div className="promo-image">
          <div className="promo-circle">
            💻📱🎮
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;