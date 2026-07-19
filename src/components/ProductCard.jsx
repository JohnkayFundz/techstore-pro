import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    console.log("Adding product:", product);

    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  };

  return (
    <div className="product-card">
      <div className="emoji">{product.image}</div>

      <h3>{product.name}</h3>

      <p>{product.category}</p>

      <h2>${product.price}</h2>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;