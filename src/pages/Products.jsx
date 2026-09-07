// ==========================================================
// TECHSTORE PRO
// PRODUCTS PAGE
// ==========================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";

import ProductCard from "../components/products/ProductCard";
import CategoryFilter from "../components/products/CategoryFilter";

import { getProductsPaginated } from "../api/productApi";

import { formatPrice } from "../utils/formatPrice";

import "./Products.css";
import "./ProductsPremium.css";

/* ==========================================================
   CONSTANTS
========================================================== */

const PRODUCTS_PER_PAGE = 10;
const DEFAULT_MAX_PRICE = 2000;

const CATEGORIES = [
  "All",
  "Accessories",
  "Audio",
  "Gaming",
  "Laptops",
  "Smartphones",
  "Tablets",
  "Wearables",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rating" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { sort, limit: PRODUCTS_PER_PAGE };
      if (category && category !== "All") params.category = category;
      if (maxPrice && Number(maxPrice) > 0) params.maxPrice = Number(maxPrice);

      const trimmedSearch = search.trim();
      if (trimmedSearch) params.search = trimmedSearch;

      const response = await getProductsPaginated(page, PRODUCTS_PER_PAGE, params);

      if (response?.success === false) {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
        setError(response.message || "Failed to load products.");
        return;
      }

      const nextProducts = Array.isArray(response?.products) ? response.products : [];
      setProducts(nextProducts);

      const nextTotalProducts = Number(response?.totalProducts ?? response?.total ?? nextProducts.length);
      setTotalProducts(Number.isFinite(nextTotalProducts) ? nextTotalProducts : nextProducts.length);

      const nextTotalPages = Number(response?.totalPages ?? 0);
      setTotalPages(Number.isFinite(nextTotalPages) ? nextTotalPages : 0);
    } catch (err) {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
      setError(err?.response?.data?.message || err?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [category, maxPrice, page, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetToFirstPage = () => setPage(1);
  const handleCategoryChange = (value) => { setCategory(value); resetToFirstPage(); };
  const handleSortChange = (event) => { setSort(event.target.value); resetToFirstPage(); };
  const handlePriceChange = (event) => { setMaxPrice(Number(event.target.value)); resetToFirstPage(); };
  const handleSearchChange = (event) => { setSearch(event.target.value); resetToFirstPage(); };
  const clearSearch = () => { setSearch(""); resetToFirstPage(); };
  const clearFilters = () => { setCategory("All"); setSort("newest"); setSearch(""); setMaxPrice(DEFAULT_MAX_PRICE); setPage(1); };

  const goToPreviousPage = () => {
    if (page <= 1) return;
    setPage((currentPage) => currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (totalPages <= 0 || page >= totalPages) return;
    setPage((currentPage) => currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === page) return;
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let number = start; number <= end; number += 1) pages.push(number);
    return pages;
  }, [page, totalPages]);

  const hasActiveFilters = category !== "All" || sort !== "newest" || search.trim() !== "" || maxPrice !== DEFAULT_MAX_PRICE;
  const resultsText = loading ? "Loading products..." : `Showing ${products.length} of ${totalProducts} products`;

  return (
    <main className="products-page" id="main-content">
      <section className="products-page__header">
        <div className="products-page__heading">
          <span className="products-page__eyebrow">SHOP</span>
          <h1>TechStore Products</h1>
          <p>Premium laptops, smartphones, gaming gear and accessories.</p>
        </div>

        <div className="products-page__search">
          <FiSearch size={19} aria-hidden="true" />
          <input type="search" value={search} onChange={handleSearchChange} placeholder="Search products..." aria-label="Search products" />
          {search && (
            <button type="button" onClick={clearSearch} aria-label="Clear search" className="products-page__search-clear">
              <FiX size={17} />
            </button>
          )}
        </div>
      </section>

      <button type="button" className="products-page__mobile-filter" onClick={() => setShowFilters((visible) => !visible)} aria-expanded={showFilters}>
        <FiFilter size={18} />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>

      <section className={`products-page__filters ${showFilters ? "products-page__filters--open" : ""}`} aria-label="Product filters">
        <div className="products-page__category-filter">
          <CategoryFilter category={category} setCategory={handleCategoryChange} categories={CATEGORIES} />
        </div>

        <div className="products-page__controls">
          <div className="products-page__control">
            <label htmlFor="product-sort">Sort By</label>
            <select id="product-sort" value={sort} onChange={handleSortChange}>
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>

          <div className="products-page__control products-page__price-control">
            <div className="products-page__price-header">
              <label htmlFor="max-price">Max Price</label>
              <strong>{formatPrice(maxPrice)}</strong>
            </div>
            <input id="max-price" type="range" min="100" max="2000" step="50" value={maxPrice} onChange={handlePriceChange} aria-label="Maximum product price" />
          </div>

          {hasActiveFilters && (
            <button type="button" className="products-page__clear" onClick={clearFilters}>
              <FiX size={16} /><span>Clear Filters</span>
            </button>
          )}
        </div>
      </section>

      <section className="products-page__results-bar">
        <div><span>{resultsText}</span></div>
        {!loading && !error && totalPages > 0 && <span className="products-page__page-info">Page {page} of {totalPages}</span>}
      </section>

      {error && !loading && (
        <section className="products-page__error" role="alert">
          <FiAlertCircle size={26} />
          <div><h2>Unable to load products</h2><p>{error}</p></div>
          <button type="button" onClick={fetchProducts}><FiRefreshCw size={17} /> Try Again</button>
        </section>
      )}

      {loading && (
        <section className="products-page__loading" aria-live="polite" aria-busy="true">
          {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
            <div className="product-skeleton" key={index}>
              <div className="product-skeleton__image" />
              <div className="product-skeleton__content">
                <div className="product-skeleton__line product-skeleton__line--small" />
                <div className="product-skeleton__line" />
                <div className="product-skeleton__line product-skeleton__line--medium" />
                <div className="product-skeleton__line product-skeleton__line--price" />
                <div className="product-skeleton__button" />
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && !error && products.length > 0 && (
        <section className="product-grid" aria-label="Products">
          {products.map((product) => {
            const id = product?._id ?? product?.id;
            if (id === undefined || id === null) return null;
            return <ProductCard key={id} product={product} />;
          })}
        </section>
      )}

      {!loading && !error && products.length === 0 && (
        <section className="empty-products">
          <div className="empty-icon" aria-hidden="true"><FiSearch /></div>
          <h2>No products found</h2>
          <p>Try a different search or clear your filters to explore the full collection.</p>
          <button type="button" className="products-page__empty-button" onClick={clearFilters}>View All Products</button>
        </section>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="products-page__pagination" aria-label="Product pages">
          <button type="button" onClick={goToPreviousPage} disabled={page === 1} aria-label="Previous page"><FiChevronLeft /></button>
          <div className="products-page__page-numbers">
            {pageNumbers.map((pageNumber) => (
              <button key={pageNumber} type="button" className={pageNumber === page ? "active" : ""} onClick={() => goToPage(pageNumber)} aria-current={pageNumber === page ? "page" : undefined}>{pageNumber}</button>
            ))}
          </div>
          <button type="button" onClick={goToNextPage} disabled={page >= totalPages} aria-label="Next page"><FiChevronRight /></button>
        </nav>
      )}
    </main>
  );
};

export default Products;
