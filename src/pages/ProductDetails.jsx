import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="container">
        <h2>Product not found.</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  };

  return (
    <div className="container">
      <Link to="/">← Back to Products</Link>

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "40px",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "120px" }}>
          {product.image}
        </div>

        <div>
          <h1>{product.name}</h1>

          <p style={{ margin: "15px 0" }}>
            Category: {product.category}
          </p>

          <h2>${product.price}</h2>

          <p style={{ margin: "20px 0" }}>
            This is one of our premium products,
            designed with quality and performance
            in mind.
          </p>

          <button onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;