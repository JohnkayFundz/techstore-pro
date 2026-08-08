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

    try {
      const response = await getProducts();

      console.log("API Response:", response);

      if (response.success) {
        setProducts(response.products || []);
      } else {
        console.error(response.message);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to TechStore Pro</h1>

        <p>
          Discover premium laptops, phones, and accessories at the best prices.
        </p>

        <Link to="/products">
          <button className="hero-btn">
            Shop Now
          </button>
        </Link>
      </section>

      <section className="products-section">
        <h2>Products ({products.length})</h2>

        <div className="product-controls">
          <SearchBar />
          <CategoryFilter />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
          />
        )}
      </section>
    </div>
  );
}

export default Home;