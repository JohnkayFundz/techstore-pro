import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
  FiShield,
  FiTruck,
  FiHeadphones,
  FiAward,
} from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/products/ProductCard";

import "./Home.css";

// ==========================================================
// CONSTANTS
// ==========================================================

const CATEGORIES = [
  "All",
  "Laptops",
  "Smartphones",
  "Audio",
  "Wearables",
  "Accessories",
  "Gaming",
  "Tablets",
];

// ==========================================================
// HOME
// ==========================================================

const Home = () => {
  const {
    products = [],
    loading,
    error,
    pagination = {},
    fetchProducts,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  // ========================================================
  // FETCH PRODUCTS
  // ========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        page: 1,
        limit: 10,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (category !== "All") {
        params.category = category;
      }

      fetchProducts(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, category, fetchProducts]);

  // ========================================================
  // CLEAR FILTERS
  // ========================================================

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
  };

  // ========================================================
  // CHANGE CATEGORY
  // ========================================================

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  // ========================================================
  // PAGINATION
  // ========================================================

  const currentPage = Number(
    pagination.page ?? pagination.currentPage ?? 1
  );

  const totalPages = Number(
    pagination.pages ?? pagination.totalPages ?? 1
  );

  const totalProducts = Number(
    pagination.total ??
      pagination.totalProducts ??
      products.length
  );

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
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

    if (category !== "All") {
      params.category = category;
    }

    fetchProducts(params);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main className="home-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="home-hero">
        <div className="home-hero__background" />

        <div className="home-container home-hero__container">

          <div className="home-hero__content">

            <span className="home-hero__badge">
              Premium Technology
            </span>

            <h1>
              Premium Tech.
              <span>Smarter Choices.</span>
            </h1>

            <p>
              Discover laptops, smartphones, audio,
              wearables and accessories built for the
              way you work, play and connect.
            </p>

            <div className="home-hero__actions">

              <Link
                to="/products"
                className="home-btn home-btn--primary"
              >
                Shop Products
                <FiArrowRight aria-hidden="true" />
              </Link>

              <a
                href="#featured-products"
                className="home-btn home-btn--secondary"
              >
                Explore Categories
              </a>

            </div>

            <div className="home-hero__trust">

              <span>
                <FiShield aria-hidden="true" />
                Secure Shopping
              </span>

              <span>
                <FiAward aria-hidden="true" />
                Quality Products
              </span>

              <span>
                <FiTruck aria-hidden="true" />
                Reliable Delivery
              </span>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="home-hero__visual">

            <div className="home-hero__glow" />

            <div className="home-hero__device home-hero__device--large">
              <div className="home-hero__device-screen">
                <span>TECH</span>
                <strong>STORE</strong>
              </div>
            </div>

            <div className="home-hero__device home-hero__device--small">
              <div />
            </div>

            <div className="home-hero__floating-card">

              <FiHeadphones aria-hidden="true" />

              <div>
                <strong>Latest Tech</strong>
                <span>Ready for you</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          FEATURE STRIP
      ================================================== */}

      <section className="home-features">

        <div className="home-container home-features__container">

          {/* SECURE CHECKOUT */}

          <div className="home-feature">

            <div className="home-feature__icon">
              <FiShield aria-hidden="true" />
            </div>

            <div className="home-feature__content">

              <strong className="home-feature__title">
                Secure Checkout
              </strong>

              <span className="home-feature__text">
                Shop with confidence
              </span>

            </div>

          </div>

          {/* RELIABLE DELIVERY */}

          <div className="home-feature">

            <div className="home-feature__icon">
              <FiTruck aria-hidden="true" />
            </div>

            <div className="home-feature__content">

              <strong className="home-feature__title">
                Reliable Delivery
              </strong>

              <span className="home-feature__text">
                Fast &amp; dependable service
              </span>

            </div>

          </div>

          {/* QUALITY PRODUCTS */}

          <div className="home-feature">

            <div className="home-feature__icon">
              <FiAward aria-hidden="true" />
            </div>

            <div className="home-feature__content">

              <strong className="home-feature__title">
                Quality Products
              </strong>

              <span className="home-feature__text">
                Technology you can trust
              </span>

            </div>

          </div>

          {/* CUSTOMER SUPPORT */}

          <div className="home-feature">

            <div className="home-feature__icon">
              <FiHeadphones aria-hidden="true" />
            </div>

            <div className="home-feature__content">

              <strong className="home-feature__title">
                Customer Support
              </strong>

              <span className="home-feature__text">
                We're here to help
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <section
        className="home-products"
        id="featured-products"
      >

        <div className="home-container">

          {/* SECTION HEADER */}

          <div className="home-products__header">

            <div className="home-products__heading">

              <span className="home-products__eyebrow">
                Explore our collection
              </span>

              <h2>
                Featured Products
              </h2>

              <p>
                Find the technology you need,
                all in one place.
              </p>

            </div>

            <Link
              to="/products"
              className="home-view-all"
            >
              View All Products
              <FiArrowRight aria-hidden="true" />
            </Link>

          </div>

          {/* ==================================================
              SEARCH & FILTERS
          ================================================== */}

          <div className="home-products__controls">

            <div className="home-search">

              <FiSearch
                size={19}
                aria-hidden="true"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search products..."
                aria-label="Search products"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="home-search__clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <FiX aria-hidden="true" />
                </button>
              )}

            </div>

            <div
              className="home-category-filter"
              aria-label="Product categories"
            >

              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCategoryChange(item)
                  }
                  aria-pressed={
                    category === item
                  }
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          {/* ==================================================
              ACTIVE FILTER
          ================================================== */}

          {(searchTerm || category !== "All") && (
            <div className="home-active-filter">

              <span>
                Showing results
                {searchTerm &&
                  ` for "${searchTerm}"`}
                {category !== "All" &&
                  ` in ${category}`}
              </span>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear filters
                <FiX aria-hidden="true" />
              </button>

            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="home-message home-message--error"
              role="alert"
            >

              <strong>
                Unable to load products
              </strong>

              <span>
                {typeof error === "string"
                  ? error
                  : "Something went wrong. Please try again."}
              </span>

              <button
                type="button"
                onClick={() =>
                  fetchProducts({
                    page: currentPage,
                    limit: 10,
                  })
                }
              >
                Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div
              className="home-loading"
              aria-live="polite"
              aria-label="Loading products"
            >

              <div className="home-spinner" />

              <span>
                Loading products...
              </span>

            </div>
          )}

          {/* ==================================================
              PRODUCT GRID
          ================================================== */}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="home-products-grid">

                {products.map((product) => (
                  <ProductCard
                    key={
                      product._id ??
                      product.id
                    }
                    product={product}
                  />
                ))}

              </div>
            )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="home-empty">

                <div className="home-empty__icon">
                  <FiSearch aria-hidden="true" />
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  We couldn't find any products
                  matching your search or category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* ==================================================
              RESULTS COUNT
          ================================================== */}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="home-results-count">

                Showing{" "}
                <strong>
                  {products.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalProducts}
                </strong>{" "}
                products

              </div>
            )}

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {!loading &&
            !error &&
            products.length > 0 &&
            totalPages > 1 && (

              <nav
                className="home-pagination"
                aria-label="Product pagination"
              >

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage <= 1
                  }
                  aria-label="Previous page"
                >

                  <FiChevronLeft
                    aria-hidden="true"
                  />

                  <span>
                    Previous
                  </span>

                </button>

                <span className="home-pagination__status">

                  Page{" "}
                  <strong>
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {totalPages}
                  </strong>

                </span>

                <button
                  type="button"
                  onClick={() =>
                    changePage(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage >=
                    totalPages
                  }
                  aria-label="Next page"
                >

                  <span>
                    Next
                  </span>

                  <FiChevronRight
                    aria-hidden="true"
                  />

                </button>

              </nav>
            )}

        </div>

      </section>

    </main>
  );
};

export default Home;