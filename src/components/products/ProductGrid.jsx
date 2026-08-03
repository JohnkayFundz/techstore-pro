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
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </section>
    );
  }


  // Empty State
  if (!products || products.length === 0) {
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

      {products.map((product) => (

        <ProductCard
          key={
            product._id ||
            product.id
          }
          product={product}
        />

      ))}

    </section>
  );
}



ProductGrid.propTypes = {

  products: PropTypes.arrayOf(
    PropTypes.shape({

      _id: PropTypes.string,

      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),


      name: PropTypes.string.isRequired,


      brand: PropTypes.string,


      category: PropTypes.string,


      image: PropTypes.string,


      price: PropTypes.number,


      oldPrice: PropTypes.number,


      discount: PropTypes.number,


      rating: PropTypes.number,


      reviews: PropTypes.number,


      stock: PropTypes.number,


      newArrival: PropTypes.bool,


      bestseller: PropTypes.bool,

    })
  ),


  loading: PropTypes.bool,

};


export default ProductGrid;