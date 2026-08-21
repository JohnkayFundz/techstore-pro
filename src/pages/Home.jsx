import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/products/ProductCard";

import "./Home.css";

function Home() {
  const {
    products = [],
    loading,
    error,
    pagination = {},
    fetchProducts,
  } = useProducts();

  /* ==========================================================
     STATE
  ========================================================== */

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Laptops",
    "Smartphones",
    "Audio",
    "Wearables",
    "Accessories",
    "Gaming",
    "Tablets",
  ];

  /* ==========================================================
     LOAD PRODUCTS FROM BACKEND
  ========================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        page: 1,
        limit: 10,
      };

      /* ------------------------------------------------------
         SEARCH
      ------------------------------------------------------ */

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      /* ------------------------------------------------------
         CATEGORY
      ------------------------------------------------------ */

      if (
        category &&
        category !== "All"
      ) {
        params.category = category;
      }

      fetchProducts(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    category,
    fetchProducts,
  ]);

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
  };

  /* ==========================================================
     CHANGE PAGE
  ========================================================== */

  const changePage = (page) => {
    if (
      page < 1 ||
      page > (pagination.totalPages || 1)
    ) {
      return;
    }

    const params = {
      page,
      limit: 10,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (
      category &&
      category !== "All"
    ) {
      params.category = category;
    }

    fetchProducts(params);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="home">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            Premium Technology
          </span>

          <h1>
            Welcome to TechStore Pro
          </h1>

          <p>
            Discover premium laptops,
            smartphones, audio devices,
            gaming gear, and accessories
            at competitive prices.
          </p>

          <Link to="/products">
            <button
              type="button"
              className="hero-btn"
            >
              Shop Now
            </button>
          </Link>

        </div>
      </section>

      {/* ======================================================
          PRODUCTS SECTION
      ====================================================== */}

      <section className="products-section">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="products-header">

          <div>
            <h2>
              Featured Products
            </h2>

            {!loading && !error && (
              <p>
                {pagination.totalProducts || 0}{" "}
                {pagination.totalProducts === 1
                  ? "product"
                  : "products"}{" "}
                available
              </p>
            )}
          </div>

          <Link
            to="/products"
            className="view-all-link"
          >
            View All Products →
          </Link>

        </div>

        {/* ====================================================
            CONTROLS
        ==================================================== */}

        <div className="product-controls">

          {/* SEARCH */}

          <div
            className="search-bar"
            role="search"
            aria-label="Product search"
          >

            <FiSearch
              className="search-icon"
              aria-hidden="true"
            />

            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearchTerm("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          {/* CATEGORY */}

          <div
            className="category-filter"
            aria-label="Product categories"
          >

            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {/* ====================================================
            ACTIVE FILTER
        ==================================================== */}

        {(searchTerm ||
          category !== "All") && (
          <div className="active-filter">

            <span>

              {searchTerm && (
                <>
                  Search: "
                  {searchTerm}
                  "
                </>
              )}

              {searchTerm &&
                category !== "All" && (
                  <> • </>
                )}

              {category !== "All" && (
                <>
                  Category: {category}
                </>
              )}

            </span>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>

          </div>
        )}

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div
            className="error-message"
            role="alert"
          >

            <h3>
              Unable to load products
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                fetchProducts({
                  page: 1,
                  limit: 10,
                })
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div
            className="loading-screen"
            aria-live="polite"
          >

            <div className="spinner"></div>

            <p>
              Loading products...
            </p>

          </div>
        )}

        {/* ====================================================
            PRODUCTS
        ==================================================== */}

        {!loading && !error && (
          <>

            {products.length > 0 ? (
              <div className="products-grid">

                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>
            ) : (
              <div className="empty-products">

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing your search
                  or category.
                </p>

                {(searchTerm ||
                  category !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {pagination.totalPages > 1 && (
              <div className="pagination">

                <button
                  type="button"
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    changePage(
                      pagination.currentPage - 1
                    )
                  }
                >
                  ← Previous
                </button>

                <span>
                  Page{" "}
                  {pagination.currentPage}{" "}
                  of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    changePage(
                      pagination.currentPage + 1
                    )
                  }
                >
                  Next →
                </button>

              </div>
            )}

          </>
        )}

      </section>

    </div>
  );
}

export default Home;