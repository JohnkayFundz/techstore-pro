// ==========================================================
// ProductDetails.jsx
// ==========================================================

import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaRegHeart,
  FaHeart,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaMinus,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

import { useProduct } from "../context/ProductContext";
import ProductGrid from "../components/products/ProductGrid";
import RatingStars from "../components/RatingStars";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { formatPrice } from "../utils/formatPrice";

import "./ProductDetails.css";


// ==========================================================
// PRODUCT DETAILS COMPONENT
// ==========================================================

function ProductDetails() {
  const { id } = useParams();

  const navigate = useNavigate();


  // ========================================================
  // PRODUCT CONTEXT
  // ========================================================

  const {
    products = [],
    loading = false,
  } = useProduct();


  // ========================================================
  // CART
  // ========================================================

  const { dispatch } = useCart();


  // ========================================================
  // WISHLIST
  // ========================================================

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();


  // ========================================================
  // FIND PRODUCT
  // ========================================================

  const product = useMemo(() => {
    if (!Array.isArray(products)) {
      return null;
    }

    return products.find(
      (item) =>
        String(item?._id) === String(id) ||
        String(item?.id) === String(id)
    );
  }, [products, id]);


  // ========================================================
  // LOCAL STATE
  // ========================================================

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [userRating, setUserRating] =
    useState(0);


  // ========================================================
  // PRODUCT EFFECT
  // ========================================================

  useEffect(() => {
    if (!product) {
      return;
    }


    // ------------------------------------------------------
    // SET PRODUCT IMAGE
    // ------------------------------------------------------

    setSelectedImage(
      product.image ||
        product.images?.[0] ||
        product.gallery?.[0] ||
        ""
    );


    // ------------------------------------------------------
    // SET RATING
    // ------------------------------------------------------

    setUserRating(
      Number(product.rating || 0)
    );


    // ------------------------------------------------------
    // RESET QUANTITY
    // ------------------------------------------------------

    setQuantity(1);


    // ------------------------------------------------------
    // PAGE TITLE
    // ------------------------------------------------------

    document.title =
      `${product.name} | TechStore Pro`;


    // ------------------------------------------------------
    // RESET TITLE WHEN LEAVING PAGE
    // ------------------------------------------------------

    return () => {
      document.title = "TechStore Pro";
    };
  }, [product]);


  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return (
      <main className="product-details-page">

        <div className="product-loading">

          <h2>
            Loading product...
          </h2>

          <p>
            Please wait while we load the
            product details.
          </p>

        </div>

      </main>
    );
  }


  // ========================================================
  // PRODUCT NOT FOUND
  // ========================================================

  if (!product) {
    return (
      <main className="product-details-page">

        <div className="product-not-found">

          <h1>
            Product Not Found
          </h1>

          <p>
            Sorry, we couldn't find the
            product you're looking for.
          </p>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/products")
            }
          >
            <FaArrowLeft />

            <span>
              Back to Products
            </span>
          </button>

        </div>

      </main>
    );
  }


  // ========================================================
  // PRODUCT ID
  // ========================================================

  const productId =
    product._id ||
    product.id;


  // ========================================================
  // WISHLIST STATUS
  // ========================================================

  const liked =
    isWishlisted(productId);


  // ========================================================
  // RELATED PRODUCTS
  // ========================================================

  const relatedProducts =
    Array.isArray(products)
      ? products
          .filter(
            (item) =>
              item?.category ===
                product?.category &&
              String(
                item?._id ||
                item?.id
              ) !==
                String(productId)
          )
          .slice(0, 4)
      : [];


  // ========================================================
  // PRODUCT VALUES
  // ========================================================

  const stock =
    Number(product.stock || 0);

  const price =
    Number(product.price || 0);

  const oldPrice =
    Number(product.oldPrice || 0);

  const rating =
    Number(product.rating || 0);

  const numReviews =
    Number(product.numReviews || 0);


  // ========================================================
  // GALLERY
  // ========================================================

  const galleryImages =
    Array.isArray(product.gallery) &&
    product.gallery.length > 0
      ? product.gallery
      : Array.isArray(product.images) &&
          product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [];


  // ========================================================
  // INCREASE QUANTITY
  // ========================================================

  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity(
        (prev) => prev + 1
      );
    }
  };


  // ========================================================
  // DECREASE QUANTITY
  // ========================================================

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(
        (prev) => prev - 1
      );
    }
  };


  // ========================================================
  // ADD TO CART
  // ========================================================

  const addToCart = () => {

    // ------------------------------------------------------
    // STOCK CHECK
    // ------------------------------------------------------

    if (stock <= 0) {
      toast.error(
        "This product is out of stock."
      );

      return;
    }


    // ------------------------------------------------------
    // ADD PRODUCT
    // ------------------------------------------------------

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      dispatch({
        type: "ADD_TO_CART",
        payload: product,
      });
    }


    // ------------------------------------------------------
    // SUCCESS MESSAGE
    // ------------------------------------------------------

    toast.success(
      `${quantity} ${
        product.name
      }${
        quantity > 1 ? "s" : ""
      } added to cart`
    );
  };


  // ========================================================
  // BUY NOW
  // ========================================================

  const buyNow = () => {

    // ------------------------------------------------------
    // STOCK CHECK
    // ------------------------------------------------------

    if (stock <= 0) {
      toast.error(
        "This product is out of stock."
      );

      return;
    }


    // ------------------------------------------------------
    // ADD TO CART
    // ------------------------------------------------------

    addToCart();


    // ------------------------------------------------------
    // GO TO CART
    // ------------------------------------------------------

    navigate("/cart");
  };


  // ========================================================
  // HANDLE RATING
  // ========================================================

  const handleRate = (ratingValue) => {

    setUserRating(
      ratingValue
    );


    toast.success(
      `You rated ${
        product.name
      } ${ratingValue} ★`
    );
  };


  // ========================================================
  // PRODUCT DETAILS PAGE
  // ========================================================

  return (
    <main className="product-details-page">


      {/* ====================================================
          BACK BUTTON
      ==================================================== */}

      <button
        type="button"
        className="back-btn"
        onClick={() =>
          navigate(-1)
        }
      >

        <FaArrowLeft />

        <span>
          Back
        </span>

      </button>


      {/* ====================================================
          PRODUCT TOP
      ==================================================== */}

      <section className="product-top">


        {/* ==================================================
            PRODUCT GALLERY
        ================================================== */}

        <div className="product-gallery">


          {/* MAIN IMAGE */}

          <div className="main-image">

            {selectedImage ? (

              <img
                src={selectedImage}
                alt={product.name}
              />

            ) : (

              <div className="image-placeholder">
                No Image Available
              </div>

            )}

          </div>


          {/* THUMBNAILS */}

          {galleryImages.length > 0 && (

            <div className="thumbnail-list">

              {galleryImages.map(
                (image, index) => (

                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      selectedImage === image
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                  >

                    <img
                      src={image}
                      alt={`${product.name} ${
                        index + 1
                      }`}
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ==================================================
            PRODUCT INFORMATION
        ================================================== */}

        <div className="product-info">


          {/* CATEGORY */}

          <span className="product-category">
            {product.category}
          </span>


          {/* NAME */}

          <h1>
            {product.name}
          </h1>


          {/* BRAND */}

          <p className="product-brand">

            Brand:{" "}

            <strong>
              {product.brand || "N/A"}
            </strong>

          </p>


          {/* RATING */}

          <RatingStars
            rating={userRating}
            reviews={numReviews}
            interactive
            onRate={handleRate}
          />


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="product-price">

            <h2>
              {formatPrice(price)}
            </h2>


            {oldPrice > price && (

              <del>
                {formatPrice(oldPrice)}
              </del>

            )}


            {product.discount > 0 && (

              <span className="discount">
                -{product.discount}%
              </span>

            )}

          </div>


          {/* =================================================
              STOCK
          ================================================= */}

          <div className="stock-status">

            {stock > 0 ? (

              <span className="in-stock">
                In Stock ({stock})
              </span>

            ) : (

              <span className="out-stock">
                Out of Stock
              </span>

            )}

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="short-description">
            {product.description}
          </p>


          {/* =================================================
              SHIPPING / WARRANTY
          ================================================= */}

          <div className="product-meta">


            {/* SHIPPING */}

            <div>

              <FaTruck />

              <span>
                {product.shipping ||
                  "Fast Shipping"}
              </span>

            </div>


            {/* WARRANTY */}

            <div>

              <FaShieldAlt />

              <span>
                {product.warranty ||
                  "1 Year Warranty"}
              </span>

            </div>

          </div>


          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="quantity-selector">

            <h4>
              Quantity
            </h4>


            <div className="quantity-controls">


              {/* DECREASE */}

              <button
                type="button"
                onClick={decreaseQty}
                disabled={
                  quantity <= 1
                }
                aria-label="Decrease quantity"
              >
                <FaMinus />
              </button>


              {/* CURRENT QUANTITY */}

              <span>
                {quantity}
              </span>


              {/* INCREASE */}

              <button
                type="button"
                onClick={increaseQty}
                disabled={
                  quantity >= stock ||
                  stock <= 0
                }
                aria-label="Increase quantity"
              >
                <FaPlus />
              </button>

            </div>

          </div>


          {/* =================================================
              PRODUCT ACTIONS
          ================================================= */}

          <div className="product-actions">


            {/* ADD TO CART */}

            <button
              type="button"
              className="add-cart-btn"
              onClick={addToCart}
              disabled={
                stock <= 0
              }
            >

              <FaShoppingCart />

              <span>
                Add to Cart
              </span>

            </button>


            {/* WISHLIST */}

            <button
              type="button"
              className="wishlist-btn"
              onClick={() =>
                toggleWishlist(
                  product
                )
              }
            >

              {liked ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}


              <span>

                {liked
                  ? "Wishlisted"
                  : "Wishlist"}

              </span>

            </button>


            {/* BUY NOW */}

            <button
              type="button"
              className="buy-now-btn"
              onClick={buyNow}
              disabled={
                stock <= 0
              }
            >
              Buy Now
            </button>

          </div>

        </div>

      </section>


      {/* ====================================================
          PRODUCT DETAILS
      ==================================================== */}

      <section className="product-tabs">


        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <div className="product-description">

          <h2>
            Description
          </h2>

          <p>
            {product.description}
          </p>

        </div>


        {/* ==================================================
            FEATURES
        ================================================== */}

        {Array.isArray(product.features) &&
          product.features.length > 0 && (

            <div className="product-features">

              <h2>
                Key Features
              </h2>

              <ul>

                {product.features.map(
                  (feature, index) => (

                    <li
                      key={`${feature}-${index}`}
                    >
                      ✓ {feature}
                    </li>

                  )
                )}

              </ul>

            </div>

          )}


        {/* ==================================================
            SPECIFICATIONS
        ================================================== */}

        <div className="product-specifications">

          <h2>
            Specifications
          </h2>


          <div className="spec-grid">


            {/* BRAND */}

            <div>

              <strong>
                Brand
              </strong>

              <span>
                {product.brand ||
                  "N/A"}
              </span>

            </div>


            {/* CATEGORY */}

            <div>

              <strong>
                Category
              </strong>

              <span>
                {product.category ||
                  "N/A"}
              </span>

            </div>


            {/* SKU */}

            <div>

              <strong>
                SKU
              </strong>

              <span>
                {product.sku ||
                  "N/A"}
              </span>

            </div>


            {/* PRICE */}

            <div>

              <strong>
                Price
              </strong>

              <span>
                {formatPrice(price)}
              </span>

            </div>


            {/* WARRANTY */}

            <div>

              <strong>
                Warranty
              </strong>

              <span>
                {product.warranty ||
                  "N/A"}
              </span>

            </div>


            {/* SHIPPING */}

            <div>

              <strong>
                Shipping
              </strong>

              <span>
                {product.shipping ||
                  "N/A"}
              </span>

            </div>


            {/* STOCK */}

            <div>

              <strong>
                Stock
              </strong>

              <span>
                {stock} Units
              </span>

            </div>


            {/* RATING */}

            <div>

              <strong>
                Rating
              </strong>

              <span>

                {rating} ⭐ (
                {numReviews} Reviews)

              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          RELATED PRODUCTS
      ==================================================== */}

      {relatedProducts.length > 0 && (

        <section className="related-products">

          <div className="section-title">

            <h2>
              Related Products
            </h2>

            <p>
              You may also like these
              products.
            </p>

          </div>


          <ProductGrid
            products={
              relatedProducts
            }
          />

        </section>

      )}


      {/* ====================================================
          MOBILE STICKY ACTION BAR
      ==================================================== */}

      <div className="sticky-action-bar">


        {/* QUANTITY */}

        <div className="quantity-controls">

          <button
            type="button"
            onClick={decreaseQty}
            disabled={
              quantity <= 1
            }
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>


          <span>
            {quantity}
          </span>


          <button
            type="button"
            onClick={increaseQty}
            disabled={
              quantity >= stock ||
              stock <= 0
            }
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>

        </div>


        {/* ADD TO CART */}

        <button
          type="button"
          className="add-cart-btn"
          onClick={addToCart}
          disabled={
            stock <= 0
          }
        >

          <FaShoppingCart />

          <span>
            Add to Cart
          </span>

        </button>


        {/* BUY NOW */}

        <button
          type="button"
          className="buy-now-btn"
          onClick={buyNow}
          disabled={
            stock <= 0
          }
        >
          Buy Now
        </button>

      </div>

    </main>
  );
}


// ==========================================================
// EXPORT
// ==========================================================

export default ProductDetails;
