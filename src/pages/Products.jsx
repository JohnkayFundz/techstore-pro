import {
  useMemo,
  useState,
  useEffect,
} from "react";

import debounce from "lodash.debounce";

import ProductGrid from "../components/ProductGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";

import productsData from "../data/products.js";


function Products() {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const [maxPrice, setMaxPrice] = useState(5000);

  const [loading, setLoading] = useState(false);



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
        productsData.map(
          (product) => product.category
        )
      ),
    ];

  }, []);







  /*
    Filter + Sort Products
  */

  const filteredProducts = useMemo(() => {

    let result = [
      ...productsData
    ];



    // Search

    if (search.trim()) {

      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }




    // Category Filter

    if (category !== "All") {

      result = result.filter(
        (product) =>
          product.category === category
      );

    }




    // Price Filter

    result = result.filter(
      (product) =>
        product.price <= maxPrice
    );






    // Sorting

    const sortFunctions = {

      "price-low": (a, b) =>
        a.price - b.price,


      "price-high": (a, b) =>
        b.price - a.price,


      rating: (a, b) =>
        b.rating - a.rating,


      name: (a, b) =>
        a.name.localeCompare(b.name),

    };




    if (sortBy !== "default") {

      result.sort(
        sortFunctions[sortBy]
      );

    }




    return result;


  }, [
    search,
    category,
    sortBy,
    maxPrice,
  ]);







  /*
    Loading Animation
  */

  useEffect(() => {

    setLoading(true);


    const timer = setTimeout(() => {

      setLoading(false);

    }, 500);



    return () => {

      clearTimeout(timer);

    };


  }, [
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







  return (

    <main className="products-page">

      <section className="products-header">

        <h1>
          TechStore Products
        </h1>


        <p>
          Premium laptops, phones and accessories.
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

          value={sortBy}

          onChange={(e) =>
            setSortBy(e.target.value)
          }

          className="sort-select"

          aria-label="Sort products"

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
            Name
          </option>


        </select>








        <div className="price-filter">

          <label htmlFor="price-range">

            Max Price: ${maxPrice}

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
          </strong>

          {" "}products


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