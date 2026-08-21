import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import debounce from "lodash.debounce";
import { toast } from "react-toastify";

import ProductGrid from "../components/products/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import Loading from "../components/Loading";

import { getProducts } from "../api/productApi";


function Products() {
  /* ==========================================================
     URL SEARCH PARAMETERS
  ========================================================== */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /* ==========================================================
     STATE
  ========================================================== */

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    search,
    setSearch,
  ] = useState(
    searchParams.get("search") || ""
  );


  const [
    category,
    setCategory,
  ] = useState("All");


  const [
    sortBy,
    setSortBy,
  ] = useState("default");


  const [
    maxPrice,
    setMaxPrice,
  ] = useState(5000);


  const [
    loading,
    setLoading,
  ] = useState(true);


  /* ==========================================================
     LOAD PRODUCTS
  ========================================================== */

  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {
    try {
      setLoading(true);

      const response =
        await getProducts();


      if (response.success) {
        const items =
          response.products || [];


        setProducts(items);


        if (items.length > 0) {
          setMaxPrice(
            Math.max(
              ...items.map(
                (product) =>
                  Number(product.price) || 0
              )
            )
          );
        }
      } else {
        toast.error(
          response.message ||
            "Failed to load products."
        );

        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Products Page Error:",
        error
      );

      toast.error(
        "Failed to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  /* ==========================================================
     SYNC SEARCH WITH URL
  ========================================================== */

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") || "";


    setSearch(urlSearch);
  }, [searchParams]);


  /* ==========================================================
     DEBOUNCED SEARCH
  ========================================================== */

  const handleSearch = useMemo(() => {
    return debounce((value) => {
      setSearch(value);

      const trimmedValue =
        value.trim();


      if (trimmedValue) {
        setSearchParams({
          search: trimmedValue,
        });
      } else {
        setSearchParams({});
      }
    }, 300);
  }, [setSearchParams]);


  /* ==========================================================
     CLEANUP DEBOUNCE
  ========================================================== */

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);


  /* ==========================================================
     CATEGORIES
  ========================================================== */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];
  }, [products]);


  /* ==========================================================
     HIGHEST PRODUCT PRICE
  ========================================================== */

  const highestPrice = useMemo(() => {
    if (!products.length) {
      return 5000;
    }


    return Math.max(
      ...products.map(
        (product) =>
          Number(product.price) || 0
      )
    );
  }, [products]);


  /* ==========================================================
     FILTER + SORT PRODUCTS
  ========================================================== */

  const filteredProducts =
    useMemo(() => {
      let result = [...products];


      /* ------------------------------------------------------
         SEARCH
      ------------------------------------------------------ */

      if (search.trim()) {
        const keyword =
          search
            .trim()
            .toLowerCase();


        result =
          result.filter(
            (product) => {
              return (
                product.name
                  ?.toLowerCase()
                  .includes(keyword) ||

                product.brand
                  ?.toLowerCase()
                  .includes(keyword) ||

                product.description
                  ?.toLowerCase()
                  .includes(keyword) ||

                product.category
                  ?.toLowerCase()
                  .includes(keyword)
              );
            }
          );
      }


      /* ------------------------------------------------------
         CATEGORY
      ------------------------------------------------------ */

      if (category !== "All") {
        result =
          result.filter(
            (product) =>
              product.category ===
              category
          );
      }


      /* ------------------------------------------------------
         MAX PRICE
      ------------------------------------------------------ */

      result =
        result.filter(
          (product) =>
            Number(product.price) <=
            maxPrice
        );


      /* ------------------------------------------------------
         SORT
      ------------------------------------------------------ */

      switch (sortBy) {
        case "price-low":
          result.sort(
            (a, b) =>
              Number(a.price) -
              Number(b.price)
          );
          break;


        case "price-high":
          result.sort(
            (a, b) =>
              Number(b.price) -
              Number(a.price)
          );
          break;


        case "rating":
          result.sort(
            (a, b) =>
              (Number(b.rating) || 0) -
              (Number(a.rating) || 0)
          );
          break;


        case "name":
          result.sort(
            (a, b) =>
              (a.name || "").localeCompare(
                b.name || ""
              )
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


  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  const clearFilters = () => {
    setSearch("");

    setCategory("All");

    setSortBy("default");

    setMaxPrice(highestPrice);

    setSearchParams({});
  };


  /* ==========================================================
     LOADING STATE
  ========================================================== */

  if (loading) {
    return <Loading />;
  }


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="products-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="products-header">

        <h1>
          TechStore Products
        </h1>

        <p>
          Premium laptops,
          smartphones, gaming gear
          and accessories.
        </p>

      </section>


      {/* ======================================================
          CONTROLS
      ====================================================== */}

      <section className="products-controls">

        {/* SEARCH */}

        <SearchBar
          search={search}
          setSearch={handleSearch}
        />


        {/* CATEGORY */}

        <CategoryFilter
          category={category}
          setCategory={setCategory}
          categories={categories}
        />


        {/* SORT */}

        <select
          className="sort-select"
          value={sortBy}
          onChange={(event) =>
            setSortBy(
              event.target.value
            )
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


        {/* PRICE FILTER */}

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
            onChange={(event) =>
              setMaxPrice(
                Number(
                  event.target.value
                )
              )
            }
          />

        </div>


        {/* CLEAR FILTERS */}

        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </section>


      {/* ======================================================
          RESULTS
      ====================================================== */}

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