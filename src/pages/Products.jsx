import {
  useEffect,
  useMemo,
  useState,
} from "react";

import debounce from "lodash.debounce";

import ProductGrid from "../components/products/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

import { getProducts } from "../api/productApi";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const [maxPrice, setMaxPrice] = useState(5000);

  const [loading, setLoading] = useState(true);

  /*
    Load Products
  */

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);

    const response = await getProducts();

    if (response.success) {
      setProducts(response.products || []);
    }

    setLoading(false);
  };

  /*
    Debounced Search
  */

  const handleSearch = useMemo(() => {
    return debounce((value) => {
      setSearch(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  /*
    Categories
  */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products.map(
          (product) => product.category
        )
      ),
    ];
  }, [products]);

  /*
    Filter + Sort Products
  */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search

    if (search.trim()) {
      result = result.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          product.brand
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(search.toLowerCase())
        );
      });
    }

    // Category

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // Price

    result = result.filter(
      (product) => product.price <= maxPrice
    );

    // Sorting

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "rating":
        result.sort(
          (a, b) => b.rating - a.rating
        );
        break;

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    category,
    sortBy,
    maxPrice,
  ]);

  /*
    Clear Filters
  */

  const clearFilters = () => {
    setSearch("");

    setCategory("All");

    setSortBy("default");

    setMaxPrice(5000);
  };

  if (loading) {
    return (
      <main className="products-page">
        <section
          style={{
            padding: "80px 0",
            textAlign: "center",
          }}
        >
          <h2>Loading Products...</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="products-page">
      <section className="products-header">
        <h1>TechStore Products</h1>

        <p>
          Premium laptops, phones and
          accessories.
        </p>
      </section>

      <section className="products-controls">
        <SearchBar
          search={search}
          setSearch={handleSearch}
        />

        <CategoryFilter
          category={category}
          setCategory={setCategory}
          categories={categories}
        />

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >
          <option value="default">
            Sort By
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="rating">
            Highest Rating
          </option>

          <option value="name">
            Name A-Z
          </option>
        </select>

        <div className="price-filter">
          <label htmlFor="price-range">
            Max Price: $
            {maxPrice.toLocaleString()}
          </label>

          <input
            id="price-range"
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                Number(e.target.value)
              )
            }
          />
        </div>

        <button
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </section>

      <section className="products-results">
        <div className="products-count">
          Showing{" "}
          <strong>
            {filteredProducts.length}
          </strong>{" "}
          product
          {filteredProducts.length !== 1 &&
            "s"}
        </div>

        <ProductGrid
          products={filteredProducts}
          loading={loading}
        />
      </section>
    </main>
  );
}

export default Products;