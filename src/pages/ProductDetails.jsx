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

import { useProduct } from "../context/ProductContext";
import { getProductById } from "../api/productApi";
import ProductGrid from "../components/products/ProductGrid";
import RatingStars from "../components/RatingStars";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/formatPrice";

import "./ProductDetails.css";
import "./ProductDetailsPremium.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [], loading = false } = useProduct();
  const { dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const listedProduct = useMemo(() => {
    if (!Array.isArray(products)) return null;
    return products.find(
      (item) => String(item?._id) === String(id) || String(item?.id) === String(id)
    );
  }, [products, id]);

  const product = listedProduct || fetchedProduct;

  useEffect(() => {
    let cancelled = false;

    setFetchedProduct(null);

    if (!id || loading || listedProduct) {
      setFetchingProduct(false);
      return undefined;
    }

    setFetchingProduct(true);

    getProductById(id)
      .then((response) => {
        if (!cancelled && response?.success && response?.product) {
          setFetchedProduct(response.product);
        }
      })
      .catch((error) => {
        if (!cancelled) console.error("Product details fetch error:", error);
      })
      .finally(() => {
        if (!cancelled) setFetchingProduct(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, loading, listedProduct]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);

  useEffect(() => {
    if (!product) return undefined;
    setSelectedImage(product.image || product.images?.[0] || product.gallery?.[0] || "");
    setUserRating(Number(product.rating || 0));
    setQuantity(1);
    document.title = `${product.name} | TechStore Pro`;
    return () => { document.title = "TechStore Pro"; };
  }, [product]);

  useEffect(() => {
    if (!specsOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSpecsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [specsOpen]);

  useEffect(() => {
    const nodes = document.querySelectorAll(".pp-reveal");
    if (!nodes.length || typeof IntersectionObserver === "undefined") {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [product]);

  if (loading || fetchingProduct) {
    return (
      <main className="product-details-page">
        <div className="product-loading"><h2>Loading product...</h2><p>Please wait while we load the product details.</p></div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Product Not Found</h1>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <button type="button" className="back-btn" onClick={() => navigate("/products")}>
            <FaArrowLeft /><span>Back to Products</span>
          </button>
        </div>
      </main>
    );
  }

  const productId = product._id || product.id;
  const liked = isWishlisted(productId);
  const relatedProducts = Array.isArray(products)
    ? products.filter(
        (item) => item?.category === product?.category && String(item?._id || item?.id) !== String(productId)
      ).slice(0, 4)
    : [];
  const stock = Number(product.stock || 0);
  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  const rating = Number(product.rating || 0);
  const numReviews = Number(product.numReviews || 0);
  const galleryImages = Array.isArray(product.gallery) && product.gallery.length
    ? product.gallery
    : Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image ? [product.image] : [];
  const features = Array.isArray(product.features) ? product.features.filter(Boolean).slice(0, 6) : [];
  const featureCards = features.length
    ? features.slice(0, 3).map((feature, index) => ({
        number: `0${index + 1}`,
        title: feature,
        body: "A defining part of the experience, designed to make everyday use feel simpler and more considered.",
      }))
    : [
        { number: "01", title: "Thoughtful design", body: "A focused product experience built around the details that matter most." },
        { number: "02", title: "Made for everyday", body: "Straightforward technology with an emphasis on usability and confidence." },
        { number: "03", title: "Ready when you are", body: "A polished shopping experience from discovery through purchase." },
      ];

  const addToCart = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    for (let i = 0; i < quantity; i += 1) {
      dispatch({ type: "ADD_TO_CART", payload: product });
    }
    toast.success(`${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to cart`);
  };

  const buyNow = () => {
    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    addToCart();
    navigate("/cart");
  };

  const handleRate = (ratingValue) => {
    setUserRating(ratingValue);
    toast.success(`You rated ${product.name} ${ratingValue} ★`);
  };

  const changeQuantity = (direction) => {
    setQuantity((current) => {
      if (direction === "up") return Math.min(stock, current + 1);
      return Math.max(1, current - 1);
    });
  };

  const specRows = [
    ["Brand", product.brand || "N/A"],
    ["Category", product.category || "N/A"],
    ["SKU", product.sku || "N/A"],
    ["Price", formatPrice(price)],
    ["Warranty", product.warranty || "N/A"],
    ["Shipping", product.shipping || "N/A"],
    ["Stock", `${stock} Units`],
    ["Rating", `${rating} ⭐ (${numReviews} Reviews)`],
  ];

  return (
    <main className="product-details-page premium-product-page">
      <div className="pp-shell">
        <button type="button" className="pp-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <section className="pp-hero">
          <div className="pp-visual pp-reveal">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} />
            ) : (
              <div className="image-placeholder">No Image Available</div>
            )}
          </div>

          <div className="pp-copy pp-reveal">
            <span className="pp-eyebrow">{product.category || "Technology"} · {product.brand || "TechStore Pro"}</span>
            <h1>{product.name}</h1>
            <p className="pp-tagline">{product.description || "Technology, thoughtfully selected for the way you live and work."}</p>

            <div className="pp-buy-card">
              <div className="pp-price-row">
                <span className="pp-price">{formatPrice(price)}</span>
                {oldPrice > price && <del className="pp-old-price">{formatPrice(oldPrice)}</del>}
                {product.discount > 0 && <span className="pp-discount">Save {product.discount}%</span>}
              </div>
              <div className="pp-stock">{stock > 0 ? `${stock} available` : "Currently unavailable"}</div>

              <RatingStars rating={userRating} reviews={numReviews} interactive onRate={handleRate} />

              <div className="pp-actions">
                <div className="pp-quantity" aria-label="Quantity selector">
                  <button type="button" onClick={() => changeQuantity("down")} disabled={quantity <= 1} aria-label="Decrease quantity"><FaMinus /></button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => changeQuantity("up")} disabled={quantity >= stock || stock <= 0} aria-label="Increase quantity"><FaPlus /></button>
                </div>
                <button type="button" className="pp-primary" onClick={addToCart} disabled={stock <= 0}><FaShoppingCart /> Add to Cart</button>
                <button type="button" className="pp-secondary" onClick={() => toggleWishlist(product)} aria-pressed={liked}>{liked ? <FaHeart /> : <FaRegHeart />} {liked ? "Saved" : "Save"}</button>
              </div>
              <button type="button" className="pp-buy" onClick={buyNow} disabled={stock <= 0}>Buy Now</button>
            </div>
          </div>
        </section>

        <div className="pp-trust pp-reveal">
          <div><strong><FaTruck /> {product.shipping || "Fast shipping"}</strong><span>Clear delivery expectations</span></div>
          <div><strong><FaShieldAlt /> {product.warranty || "1 Year Warranty"}</strong><span>Added peace of mind</span></div>
          <div><strong>★ {rating || "—"} rating</strong><span>{numReviews} customer reviews</span></div>
        </div>
      </div>

      <section className="pp-chapter pp-reveal">
        <div className="pp-shell">
          <div className="pp-story">
            <span className="pp-kicker">The big idea</span>
            <h2>Technology, without the noise.</h2>
            <p>{product.description || "Every detail has a purpose. The result is a product experience that feels focused, capable and ready for everyday life."}</p>
          </div>
        </div>
      </section>

      <section className="pp-chapter soft">
        <div className="pp-shell">
          <div className="pp-story pp-reveal">
            <span className="pp-kicker">Designed around the essentials</span>
            <h2>Everything important. Nothing distracting.</h2>
          </div>
          <div className="pp-feature-grid">
            {featureCards.map((feature) => (
              <article className="pp-feature-card pp-reveal" key={feature.number}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-chapter dark">
        <div className="pp-shell">
          <div className="pp-story pp-reveal">
            <span className="pp-kicker">Engineered in layers</span>
            <h2>Built around the experience.</h2>
            <p>From the first touch to the final detail, the product is presented with clarity so you can focus on what it actually does for you.</p>
          </div>
          <div className="pp-feature-grid">
            <article className="pp-feature-card pp-reveal"><span>01 / FORM</span><h3>Design</h3><p>Clean presentation, considered proportions and a visual language that lets the product lead.</p></article>
            <article className="pp-feature-card pp-reveal"><span>02 / FUNCTION</span><h3>Performance</h3><p>{features[0] || "Focused features"} — presented as part of a complete everyday experience.</p></article>
            <article className="pp-feature-card pp-reveal"><span>03 / DETAILS</span><h3>Confidence</h3><p>{product.warranty || "A dependable warranty"} and {product.shipping || "straightforward shipping"} complete the experience.</p></article>
          </div>
        </div>
      </section>

      <section className="pp-chapter">
        <div className="pp-shell">
          <div className="pp-spec-strip pp-reveal">
            <div>
              <span className="pp-kicker">At a glance</span>
              <h2>The details that matter.</h2>
            </div>
            <div>
              <p>Explore the product information in one clean, simplified view — without interrupting the story.</p>
              <button type="button" className="pp-spec-button" onClick={() => setSpecsOpen(true)}>View full specifications →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-chapter soft">
        <div className="pp-shell">
          <div className="pp-story pp-reveal">
            <span className="pp-kicker">Your choice</span>
            <h2>Ready when you are.</h2>
            <p>Bring {product.name} into your setup and make the next step feel effortless.</p>
            <div className="pp-actions">
              <button type="button" className="pp-primary" onClick={buyNow} disabled={stock <= 0}>Buy {product.name}</button>
              <button type="button" className="pp-secondary" onClick={addToCart} disabled={stock <= 0}>Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pp-related">
          <div className="pp-shell">
            <h2 className="pp-reveal">You might also like.</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}

      <div className={`pp-drawer-backdrop ${specsOpen ? "open" : ""}`} onClick={() => setSpecsOpen(false)} aria-hidden="true" />
      <aside className={`pp-drawer ${specsOpen ? "open" : ""}`} aria-hidden={!specsOpen} aria-label="Product specifications">
        <div className="pp-drawer-head">
          <h2>Specifications</h2>
          <button type="button" className="pp-drawer-close" onClick={() => setSpecsOpen(false)} aria-label="Close specifications">×</button>
        </div>
        <div className="pp-drawer-list">
          {specRows.map(([label, value]) => (
            <div className="pp-drawer-row" key={label}><strong>{label}</strong><span>{value}</span></div>
          ))}
        </div>
        {features.length > 0 && (
          <div className="pp-drawer-list">
            <div className="pp-drawer-row"><strong>Features</strong><span>{features.join(" · ")}</span></div>
          </div>
        )}
      </aside>
    </main>
  );
}

export default ProductDetails;
