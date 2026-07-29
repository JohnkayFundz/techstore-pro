import { useMemo, useState, useEffect } from "react";
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

import products from "../data/products";
import ProductGrid from "../components/ProductGrid";
import RatingStars from "../components/RatingStars";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const product = useMemo(
    () => products.find((item) => item.id === Number(id)),
    [id]
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [userRating, setUserRating] = useState(product?.rating || 0);

  useEffect(() => {
    if (!product) return;
    setSelectedImage(product.image);
    setUserRating(product.rating);
    setQuantity(1);
    document.title = `${product.name} | TechStore Pro`;
  }, [product]);

  if (!product) {
    return (
      <main className="product-not-found">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </main>
    );
  }

  const liked = isWishlisted(product.id);

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: product });
    }
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const buyNow = () => {
    addToCart();
    navigate("/cart");
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    toast.success(`You rated ${product.name} ${rating} ★`);
  };

  return (
    <main className="product-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      {/* Top Section */}
      <section className="product-top">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="thumbnail-list">
            {product.gallery?.map((image, index) => (
              <button
                key={index}
                className={selectedImage === image ? "active" : ""}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-brand">
            Brand: <strong>{product.brand}</strong>
          </p>

          <RatingStars
            rating={userRating}
            reviews={product.reviews}
            interactive
            onRate={handleRate}
          />

          <div className="product-price">
            <h2>
              {product.currency}
              {product.price.toLocaleString()}
            </h2>
            <del>
              {product.currency}
              {product.oldPrice.toLocaleString()}
            </del>
            <span className="discount">-{product.discount}%</span>
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock})</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>

          <p className="short-description">{product.description}</p>

          <div className="product-meta">
            <div>
              <FaTruck /> <span>{product.shipping}</span>
            </div>
            <div>
              <FaShieldAlt /> <span>{product.warranty} Warranty</span>
            </div>
          </div>

          <div className="quantity-selector">
            <h4>Quantity</h4>
            <div className="quantity-controls">
              <button onClick={decreaseQty} disabled={quantity <= 1}>
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={increaseQty} disabled={quantity >= product.stock}>
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-cart-btn"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              <FaShoppingCart /> <span>Add to Cart</span>
            </button>
            <button className="wishlist-btn" onClick={() => toggleWishlist(product)}>
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{liked ? "Wishlisted" : "Wishlist"}</span>
            </button>
            <button
              className="buy-now-btn"
              onClick={buyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="product-tabs">
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>

        {product.features?.length > 0 && (
          <div className="product-features">
            <h2>Key Features</h2>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="product-specifications">
          <h2>Specifications</h2>
          <div className="spec-grid">
            <div>
              <strong>Brand</strong>
              <span>{product.brand}</span>
            </div>
            <div>
              <strong>Category</strong>
              <span>{product.category}</span>
            </div>
            <div>
              <strong>SKU</strong>
              <span>{product.sku}</span>
            </div>
            <div>
              <strong>Price</strong>
              <span>
                {product.currency}
                {product.price.toLocaleString()}
              </span>
            </div>
            <div>
              <strong>Warranty</strong>
              <span>{product.warranty}</span>
            </div>
            <div>
              <strong>Shipping</strong>
              <span>{product.shipping}</span>
            </div>
            <div>
              <strong>Stock</strong>
              <span>{product.stock} Units</span>
            </div>
            <div>
              <strong>Rating</strong>
              <span>
                {product.rating} ⭐ ({product.reviews} Reviews)
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
            <p>You may also like these products.</p>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Sticky Action Bar (Mobile Only) */}
      <div className="sticky-action-bar">
        <div className="quantity-controls">
          <button onClick={decreaseQty} disabled={quantity <= 1}>
            <FaMinus />
          </button>
          <span>{quantity}</span>
          <button onClick={increaseQty} disabled={quantity >= product.stock}>
            <FaPlus />
          </button>
        </div>
        <button className="add-cart-btn" onClick={addToCart} disabled={product.stock === 0}>
          <FaShoppingCart /> Add to Cart
        </button>
        <button className="buy-now-btn" onClick={buyNow} disabled={product.stock === 0}>
          Buy Now
        </button>
      </div>
    </main>
  );
}

export default ProductDetails;
