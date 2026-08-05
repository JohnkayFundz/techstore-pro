import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/products/ProductGrid";
import Loading from "../components/Loading";

import { getProducts } from "../api/productApi";

import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);

    const response = await getProducts({
      featured: true,
    });

    if (response.success) {
      setProducts(response.products || []);
    }

    setLoading(false);
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to TechStore Pro</h1>

        <p>
          Discover premium laptops, phones, and accessories at the best prices.
        </p>

        <Link to="/products">
          <button>
            Shop Now
          </button>
        </Link>
      </section>

      {/* Products Section */}
      <section className="products-section">

        <h2>Featured Products</h2>

        <div className="product-controls">
          <SearchBar />
          <CategoryFilter />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <ProductGrid products={products} />
        )}

      </section>

    </div>
  );
}

export default Home;