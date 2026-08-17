import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/products/ProductCard";

import "./Home.css";

function Home() {
  const {
    products,
    loading,
    error,
    pagination,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Laptop",
    "Phone",
    "Accessories",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search);

      const productCategory =
        product.category?.toLowerCase() || "";

      const matchesCategory =
        category === "All" ||
        productCategory.includes(category.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to TechStore Pro</h1>

        <p>
          Discover premium laptops, phones, and accessories
          at the best prices.
        </p>

        <Link to="/products">
          <button className="hero-btn">
            Shop Now
          </button>
        </Link>
      </section>

      {/* PRODUCTS */}
      <section className="products-section">

        <h2>
          Products ({filteredProducts.length})
        </h2>

        {/* CONTROLS */}
        <div className="product-controls">

          <div
            className="search-bar"
            role="search"
            aria-label="Product search"
          >
            <FiSearch className="search-icon" />

            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item ? "active" : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <h3>No products found</h3>

                <p>
                  Try changing your search or category.
                </p>
              </div>
            )}

            {/* PAGINATION INFO */}
            {pagination.totalPages > 1 && (
              <div className="pagination-info">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </div>
            )}
          </>
        )}

      </section>
    </div>
  );
}

export default Home;