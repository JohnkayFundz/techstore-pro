import { useEffect, useMemo, useState } from "react";
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
  FiLayers,
} from "react-icons/fi";

import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/products/ProductCard";

import "./Home.css";

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

const getProductImage = (product) => {
  const candidates = [
    product?.image,
    product?.imageUrl,
    ...(Array.isArray(product?.images)
      ? product.images.map((image) =>
          typeof image === "string" ? image : image?.url
        )
      : []),
  ];

  return (
    candidates.find(
      (image) =>
        typeof image === "string" &&
        image.trim() &&
        !image.includes("via.placeholder.com") &&
        !image.startsWith("javascript:") &&
        !image.startsWith("data:") &&
        !image.startsWith("blob:")
    ) || "/placeholder-product.png"
  );
};

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = { page: 1, limit: 10 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (category !== "All") params.category = category;
      fetchProducts(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, category, fetchProducts]);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [products, loading]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
  };

  const currentPage = Number(
    pagination.page ?? pagination.currentPage ?? 1
  );
  const totalPages = Number(
    pagination.pages ?? pagination.totalPages ?? 1
  );
  const totalProducts = Number(
    pagination.total ?? pagination.totalProducts ?? products.length
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = { page, limit: 10 };
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (category !== "All") params.category = category;
    fetchProducts(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featuredProduct = useMemo(() => products[0] || null, [products]);
  const supportingProducts = useMemo(() => products.slice(1, 4), [products]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__ambient" aria-hidden="true" />
        <div className="home-container home-hero__container">
          <div className="home-hero__copy" data-reveal>
            <span className="home-kicker">The new standard in tech</span>
            <h1>Technology, <em>refined.</em></h1>
            <p>
              Carefully selected devices with exceptional design,
              effortless performance and a shopping experience made simple.
            </p>
            <div className="home-hero__actions">
              <Link to="/products" className="home-pill home-pill--dark">
                Shop the collection <FiArrowRight aria-hidden="true" />
              </Link>
              <a href="#featured-products" className="home-text-link">
                Explore products <FiArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="home-hero__visual" data-reveal>
            <div className="home-hero__halo" aria-hidden="true" />
            <div className="home-hero__stage">
              {featuredProduct ? (
                <Link
                  to={`/products/${featuredProduct._id ?? featuredProduct.id}`}
                  className="home-hero__product"
                  aria-label={`View ${featuredProduct.name || "featured product"}`}
                >
                  <img
                    src={getProductImage(featuredProduct)}
                    alt={featuredProduct.name || "Featured technology product"}
                  />
                </Link>
              ) : (
                <div className="home-hero__placeholder" aria-hidden="true">
                  <FiLayers />
                </div>
              )}
            </div>
            <div className="home-hero__caption">
              <span>Featured</span>
              <strong>{featuredProduct?.name || "The latest in technology"}</strong>
              <Link to="/products">Discover <FiArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-value-strip" aria-label="Shopping benefits" data-reveal>
        <div className="home-container home-value-strip__grid">
          <div><FiShield aria-hidden="true" /><span><strong>Secure</strong> checkout</span></div>
          <div><FiTruck aria-hidden="true" /><span><strong>Reliable</strong> delivery</span></div>
          <div><FiAward aria-hidden="true" /><span><strong>Curated</strong> quality</span></div>
          <div><FiHeadphones aria-hidden="true" /><span><strong>Human</strong> support</span></div>
        </div>
      </section>

      {supportingProducts.length > 0 && (
        <section className="home-editorial" data-reveal>
          <div className="home-container home-editorial__grid">
            <div className="home-editorial__intro">
              <span className="home-kicker">Designed around you</span>
              <h2>Less noise.<br /><em>More of what matters.</em></h2>
              <p>
                From the first click to the final delivery, every detail is
                designed to make finding the right device feel effortless.
              </p>
              <Link to="/products" className="home-text-link">
                See everything <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="home-editorial__products">
              {supportingProducts.map((product, index) => (
                <Link
                  key={product._id ?? product.id}
                  to={`/products/${product._id ?? product.id}`}
                  className={`home-editorial-card home-editorial-card--${index + 1}`}
                >
                  <span>{product.category || "Technology"}</span>
                  <img src={getProductImage(product)} alt={product.name || "Product"} />
                  <strong>{product.name}</strong>
                  <span className="home-editorial-card__link">View product <FiArrowRight aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-products" id="featured-products">
        <div className="home-container">
          <div className="home-products__header" data-reveal>
            <div>
              <span className="home-kicker">The collection</span>
              <h2>Find your next favorite.</h2>
              <p>Thoughtfully selected tech for work, play and everything between.</p>
            </div>
            <Link to="/products" className="home-text-link">View all <FiArrowRight aria-hidden="true" /></Link>
          </div>

          <div className="home-products__controls" data-reveal>
            <div className="home-search">
              <FiSearch aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search the collection"
                aria-label="Search products"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} aria-label="Clear search">
                  <FiX aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="home-category-filter" aria-label="Product categories">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {(searchTerm || category !== "All") && (
            <div className="home-active-filter" data-reveal>
              <span>
                Showing results{searchTerm ? ` for “${searchTerm}”` : ""}{category !== "All" ? ` in ${category}` : ""}
              </span>
              <button type="button" onClick={clearFilters}>Clear filters <FiX aria-hidden="true" /></button>
            </div>
          )}

          {error && (
            <div className="home-message" role="alert" data-reveal>
              <strong>Unable to load products</strong>
              <span>{typeof error === "string" ? error : "Something went wrong. Please try again."}</span>
              <button type="button" onClick={() => fetchProducts({ page: currentPage, limit: 10 })}>Try again</button>
            </div>
          )}

          {loading && (
            <div className="home-loading" aria-live="polite" aria-label="Loading products">
              <div className="home-spinner" />
              <span>Curating the collection…</span>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="home-products-grid" data-reveal>
              {products.map((product) => (
                <ProductCard key={product._id ?? product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="home-empty" data-reveal>
              <FiSearch aria-hidden="true" />
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
              <button type="button" onClick={clearFilters}>Clear filters</button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="home-products__footer" data-reveal>
              <span>Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products</span>
              {totalPages > 1 && (
                <nav className="home-pagination" aria-label="Product pagination">
                  <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page"><FiChevronLeft /></button>
                  <span><strong>{currentPage}</strong> / {totalPages}</span>
                  <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page"><FiChevronRight /></button>
                </nav>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="home-closing" data-reveal>
        <div className="home-container">
          <span className="home-kicker">A better way to shop tech</span>
          <h2>Beautiful products.<br /><em>Zero distraction.</em></h2>
          <p>Discover technology that earns its place in your everyday life.</p>
          <Link to="/products" className="home-pill home-pill--dark">Explore TechStore Pro <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
