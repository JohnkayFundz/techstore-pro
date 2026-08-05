import {
  useEffect,
  useMemo,
  useState,
} from "react";

import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import ProductGrid from "../components/products/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import Loading from "../components/Loading";

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
      const items = response.products || [];

      setProducts(items);

      if (items.length > 0) {
        setMaxPrice(
          Math.max(
            ...items.map((product) => product.price)
          )
        );
      }
    } else {
      toast.error(response.message);

      setProducts([]);
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
    Highest Price
  */

  const highestPrice = useMemo(() => {
    if (!products.length) return 5000;

    return Math.max(
      ...products.map((product) => product.price)
    );
  }, [products]);

  /*
    Filter + Sort
  */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) => {
        const keyword = search.toLowerCase();

        return (
          product.name
            ?.toLowerCase()
            .includes(keyword) ||
          product.brand
            ?.toLowerCase()
            .includes(keyword) ||
          product.description
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    result = result.filter(
      (product) => product.price <= maxPrice
    );

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
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
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

    setMaxPrice(highestPrice);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="products-page">
      <section className="products-header">
        <h1>TechStore Products</h1>

        <p>
          Premium laptops, smartphones,
          gaming gear and accessories.
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
            min="0"
            max={highestPrice}
            step="50"
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