```jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import ProductGrid from "../components/products/ProductGrid";
import RatingStars from "../components/RatingStars";

import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, loading } = useProduct();
  const { dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = useMemo(() => {
    return products.find(
      (item) =>
        String(item._id) === String(id) ||
        String(item.id) === String(id)
    );
  }, [products, id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!product) return;

    setSelectedImage(
      product.image ||
        product.images?.[0] ||
        ""
    );

    setUserRating(product.rating || 0);
    setQuantity(1);

    document.title = `${product.name} | TechStore Pro`;

    return () => {
      document.title = "TechStore Pro";
    };
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-loading">
          <h2>Loading product...</h2>
          <p>Please wait while we load the product details.</p>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>

          <p>
            Sorry, we couldn't find the product you're
            looking for.
          </p>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/products")}
          >
            <FaArrowLeft />
            <span>Back to Products</span>
          </button>
        </div>
      </main>
    );
  }

  const liked = isWishlisted(product._id || product.id);

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        String(item._id) !== String(product._id)
    )
    .slice(0, 4);

  const stock = Number(product.stock || 0);
  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);

  const currency = product.currency || "$";

  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_TO_CART",
        payload: product,
      });
    }

    toast.success(
      `${quantity} ${product.name}${
        quantity > 1 ? "s" : ""
      } added to cart`
    );
  };

  const buyNow = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart();
    navigate("/cart");
  };

  const handleRate = (rating) => {
    setUserRating(rating);

    toast.success(
      `You rated ${product.name} ${rating} ★`
    );
  };

  const galleryImages =
    product.gallery?.length > 0
      ? product.gallery
      : product.image
        ? [product.image]
        : [];

  return (
    <main className="product-details-page">
      {/* Back Button */}
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {/* Product Top */}
      <section className="product-top">
        {/* Gallery */}
        <div className="product-gallery">
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

          {galleryImages.length > 0 && (
            <div className="thumbnail-list">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={
                    selectedImage === image
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedImage(image)
                  }
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-info">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-brand">
            Brand:{" "}
            <strong>
              {product.brand || "N/A"}
            </strong>
          </p>

          <RatingStars
            rating={userRating}
            reviews={product.reviews || 0}
            interactive
            onRate={handleRate}
          />

          {/* Price */}
          <div className="product-price">
            <h2>
              {currency}
              {price.toLocaleString()}
            </h2>

            {oldPrice > price && (
              <del>
                {currency}
                {oldPrice.toLocaleString()}
              </del>
            )}

            {product.discount > 0 && (
              <span className="discount">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Stock */}
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

          {/* Description */}
          <p className="short-description">
            {product.description}
          </p>

          {/* Shipping / Warranty */}
          <div className="product-meta">
            <div>
              <FaTruck />
              <span>
                {product.shipping ||
                  "Fast Shipping"}
              </span>
            </div>

            <div>
              <FaShieldAlt />
              <span>
                {product.warranty || "1 Year"}{" "}
                Warranty
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-selector">
            <h4>Quantity</h4>

            <div className="quantity-controls">
              <button
                type="button"
                onClick={decreaseQty}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <FaMinus />
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQty}
                disabled={
                  quantity >= stock || stock <= 0
                }
                aria-label="Increase quantity"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Product Actions */}
          <div className="product-actions">
            <button
              type="button"
              className="add-cart-btn"
              onClick={addToCart}
              disabled={stock <= 0}
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              className="wishlist-btn"
              onClick={() =>
                toggleWishlist(product)
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

            <button
              type="button"
              className="buy-now-btn"
              onClick={buyNow}
              disabled={stock <= 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="product-tabs">
        {/* Description */}
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        {/* Features */}
        {product.features?.length > 0 && (
          <div className="product-features">
            <h2>Key Features</h2>

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

        {/* Specifications */}
        <div className="product-specifications">
          <h2>Specifications</h2>

          <div className="spec-grid">
            <div>
              <strong>Brand</strong>
              <span>
                {product.brand || "N/A"}
              </span>
            </div>

            <div>
              <strong>Category</strong>
              <span>
                {product.category || "N/A"}
              </span>
            </div>

            <div>
              <strong>SKU</strong>
              <span>
                {product.sku || "N/A"}
              </span>
            </div>

            <div>
              <strong>Price</strong>
              <span>
                {currency}
                {price.toLocaleString()}
              </span>
            </div>

            <div>
              <strong>Warranty</strong>
              <span>
                {product.warranty || "N/A"}
              </span>
            </div>

            <div>
              <strong>Shipping</strong>
              <span>
                {product.shipping || "N/A"}
              </span>
            </div>

            <div>
              <strong>Stock</strong>
              <span>
                {stock} Units
              </span>
            </div>

            <div>
              <strong>Rating</strong>
              <span>
                {product.rating || 0} ⭐ (
                {product.reviews || 0} Reviews)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="section-title">
            <h2>Related Products</h2>

            <p>
              You may also like these products.
            </p>
          </div>

          <ProductGrid
            products={relatedProducts}
          />
        </section>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="sticky-action-bar">
        <div className="quantity-controls">
          <button
            type="button"
            onClick={decreaseQty}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQty}
            disabled={
              quantity >= stock || stock <= 0
            }
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>
        </div>

        <button
          type="button"
          className="add-cart-btn"
          onClick={addToCart}
          disabled={stock <= 0}
        >
          <FaShoppingCart />
          <span>Add to Cart</span>
        </button>

        <button
          type="button"
          className="buy-now-btn"
          onClick={buyNow}
          disabled={stock <= 0}
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}

export default ProductDetails;
```
