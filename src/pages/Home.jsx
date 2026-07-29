import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Brands from "../components/Brands";
import Categories from "../components/Categories";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import ProductSection from "../components/ProductSection";

import products from "../data/products";
import { sortProducts } from "../utils/sortProducts";

import "../styles/Home.css";


function Home() {


  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sortOption, setSortOption] =
    useState("relevance");





  /*
      FILTER + SORT PRODUCTS
  */

  const filteredProducts = useMemo(() => {


    const term =
      search.trim().toLowerCase();



    const filtered =
      products.filter((product) => {


        const matchesCategory =
          category === "All" ||
          product.category === category;



        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(term) ||

          product.brand
            ?.toLowerCase()
            .includes(term) ||

          product.description
            ?.toLowerCase()
            .includes(term);



        return (
          matchesCategory &&
          matchesSearch
        );


      });



    return sortProducts(
      filtered,
      sortOption,
      search
    );


  },[
    search,
    category,
    sortOption
  ]);








  /*
      PRODUCT COLLECTIONS
  */


  const featuredProducts =
    useMemo(
      () =>
        products.filter(
          product =>
            product.featured
        ),
      []
    );



  const newArrivals =
    useMemo(
      () =>
        products.filter(
          product =>
            product.newArrival
        ),
      []
    );



  const bestSellers =
    useMemo(
      () =>
        products.filter(
          product =>
            product.bestseller
        ),
      []
    );



  const trendingProducts =
    useMemo(
      () =>
        products
        .filter(
          product =>
            product.rating >= 4.5
        )
        .slice(0,4),
      []
    );







  const clearFilters = () => {

    setSearch("");

    setCategory("All");

    setSortOption("relevance");

  };








  return (

    <main className="home-page">



      <Hero />


      <Brands />


      <Categories />






      {/* PROMOTION */}


      <section className="promo-banner container">


        <div>


          <h2>
            Upgrade Your Setup 🚀
          </h2>



          <p>
            Discover powerful laptops,
            smartphones and accessories.
          </p>



          <Link to="/products">

            Shop Deals

          </Link>


        </div>


      </section>








      {/* PRODUCT BROWSER */}


      <section className="shop-section container">


        <div className="section-title">


          <h2>
            Browse Products
          </h2>



          <p>
            Discover premium technology
            from global brands.
          </p>


        </div>








        <div className="shop-controls">


          <SearchBar

            search={search}

            setSearch={setSearch}

          />



          <CategoryFilter

            category={category}

            setCategory={setCategory}

          />






          <select

            className="sort-dropdown"

            value={sortOption}

            onChange={
              (e)=>
              setSortOption(
                e.target.value
              )
            }

          >

            <option value="relevance">
              Relevance
            </option>


            <option value="name-asc">
              Name A-Z
            </option>


            <option value="name-desc">
              Name Z-A
            </option>


            <option value="price-low">
              Price Low - High
            </option>


            <option value="price-high">
              Price High - Low
            </option>


            <option value="rating">
              Highest Rated
            </option>


            <option value="popularity">
              Most Popular
            </option>


          </select>


        </div>








        <div className="results-count">


          <strong>
            {filteredProducts.length}
          </strong>


          {" "}


          Product
          {
            filteredProducts.length !== 1 &&
            "s"
          }


          {" "}Found


        </div>









        {
          filteredProducts.length > 0 ?


          (

            <ProductGrid

              products={filteredProducts}

            />

          )


          :


          (

            <div className="empty-state">


              <h2>
                No Products Found
              </h2>



              <p>
                Try another search
                or category.
              </p>




              <button
                onClick={clearFilters}
              >

                Clear Filters

              </button>



            </div>

          )


        }



      </section>









      {
        trendingProducts.length > 0 &&

        <ProductSection

          title="🔥 Trending Now"

          subtitle="Popular products customers love."

          products={trendingProducts}

        />

      }








      {
        featuredProducts.length > 0 &&

        <ProductSection

          title="⭐ Featured Products"

          subtitle="Hand-picked technology products."

          products={featuredProducts}

        />

      }








      {
        newArrivals.length > 0 &&

        <ProductSection

          title="🆕 New Arrivals"

          subtitle="Latest products added to the store."

          products={newArrivals}

        />

      }








      {
        bestSellers.length > 0 &&

        <ProductSection

          title="🔥 Best Sellers"

          subtitle="Customer favourite products."

          products={bestSellers}

        />

      }









      {/* TRUST FEATURES */}


      <section className="trust-section container">


        <div>

          <span>
            🚚
          </span>


          <h3>
            Fast Delivery
          </h3>


          <p>
            Quick and reliable shipping.
          </p>

        </div>





        <div>

          <span>
            🔒
          </span>


          <h3>
            Secure Payment
          </h3>


          <p>
            Safe checkout experience.
          </p>

        </div>






        <div>

          <span>
            💬
          </span>


          <h3>
            Customer Support
          </h3>


          <p>
            We are here to help.
          </p>


        </div>



      </section>






    </main>

  );

}



export default Home;