import PropTypes from "prop-types";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

import "./ProductGrid.css";


function ProductGrid({
  products = [],
  loading = false,
}) {


  // Loading State

  if (loading) {

    return (

      <section
        className="product-grid"
        aria-label="Loading products"
      >

        {
          Array.from({
            length: 8
          }).map((_, index) => (

            <ProductCardSkeleton
              key={index}
            />

          ))
        }

      </section>

    );

  }





  // Empty State

  if (!products.length) {

    return (

      <div

        className="empty-products"

        role="status"

        aria-live="polite"

      >

        <div className="empty-icon">

          🔍

        </div>


        <h3>

          No Products Found

        </h3>


        <p>

          Try adjusting your search,
          category, or filters.

        </p>


      </div>

    );

  }







  // Product Grid

  return (

    <section

      className="product-grid"

      aria-label="Product list"

    >

      {
        products.map((product)=>(

          <ProductCard

            key={product.id}

            product={product}

          />

        ))
      }


    </section>

  );

}





ProductGrid.propTypes = {


  products:

    PropTypes.arrayOf(

      PropTypes.shape({

        id:
          PropTypes.number.isRequired,


        name:
          PropTypes.string.isRequired,


        brand:
          PropTypes.string,


        category:
          PropTypes.string,


        image:
          PropTypes.string,


        price:
          PropTypes.number,


        rating:
          PropTypes.number,


        stock:
          PropTypes.number,


      })

    ),



  loading:

    PropTypes.bool,

};





export default ProductGrid;