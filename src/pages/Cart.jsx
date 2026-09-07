import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

const FALLBACK_IMAGE = "/placeholder-product.png";

function getProductImage(item) {
  return (
    item?.image ||
    item?.images?.[0] ||
    item?.gallery?.[0] ||
    FALLBACK_IMAGE
  );
}

function CartPage() {
  const navigate = useNavigate();

  const {
    cart = [],
    lastAddedId,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <section className="empty-cart container">
        <h1>🛒 Shopping Cart</h1>

        <p>Your cart is empty.</p>

        <Link
          to="/products"
          className="btn-primary"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page container">
      <div className="section-header">
        <h1>🛒 Shopping Cart</h1>

        <button
          type="button"
          className="clear-btn"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item, index) => {
            const itemId =
              item.cartId ||
              item.id ||
              item._id ||
              `${item.name}-${index}`;

            const stock = Number(item.stock);
            const hasStockLimit = Number.isFinite(stock);
            const quantity = Number(item.quantity) || 1;

            return (
              <article
                key={itemId}
                className={
                  item.cartId === lastAddedId
                    ? "cart-item highlight"
                    : "cart-item"
                }
              >
                <div className="cart-product">
                  <Link
                    to={`/products/${item._id || item.id}`}
                    className="cart-image"
                    aria-label={`View ${item.name}`}
                  >
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      loading="lazy"
                      onError={(event) => {
                        if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
                          return;
                        }
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </Link>

                  <div className="cart-details">
                    <h2>{item.name}</h2>

                    {item.brand && <p>{item.brand}</p>}

                    <strong>
                      {formatPrice(item.price)}
                    </strong>
                  </div>
                </div>

                <div className="cart-actions">
                  <div className="quantity-controls" aria-label={`Quantity controls for ${item.name}`}>
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => decreaseQuantity(item.cartId)}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>

                    <span aria-live="polite">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => increaseQuantity(item.cartId)}
                      disabled={hasStockLimit && quantity >= stock}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-subtotal">
                    <span>Subtotal:</span>

                    <strong>
                      {formatPrice(
                        Number(item.price) * quantity
                      )}
                    </strong>
                  </p>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFromCart(item.cartId)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    🗑 Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total Items</span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + Number(item.quantity || 0),
                0
              )}
            </strong>
          </div>

          <div className="summary-row total">
            <span>Total</span>

            <strong>
              {formatPrice(cartTotal)}
            </strong>
          </div>

          <button
            type="button"
            className="btn-primary checkout-btn"
            onClick={handleCheckout}
          >
            💳 Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            className="clear-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;