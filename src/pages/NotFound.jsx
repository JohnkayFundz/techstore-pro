import { Link } from "react-router-dom";
import "./NotFoundPremium.css";

function NotFound() {
  return (
    <section className="container not-found not-found-premium" aria-labelledby="not-found-title">
      <div className="not-found-content">
        <p className="not-found-code" aria-hidden="true">404</p>

        <h1 id="not-found-title">Page Not Found</h1>

        <p>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary" aria-label="Return to homepage">
            Back to Home
          </Link>
          <Link to="/products" className="btn btn-secondary" aria-label="Browse available products">
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;