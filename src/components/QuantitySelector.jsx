import PropTypes from "prop-types";

import "./QuantitySelector.css";

function QuantitySelector({
  quantity,
  setQuantity,
  stock = 1,
  min = 1,
}) {
  function decrease() {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  }

  function increase() {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  }

  function handleInput(e) {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) return;

    if (value < min) {
      setQuantity(min);
      return;
    }

    if (value > stock) {
      setQuantity(stock);
      return;
    }

    setQuantity(value);
  }

  return (
    <div className="quantity-selector">
      <button
        type="button"
        className="quantity-btn"
        onClick={decrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <input
        type="number"
        className="quantity-input"
        value={quantity}
        min={min}
        max={stock}
        onChange={handleInput}
        aria-label="Product quantity"
      />

      <button
        type="button"
        className="quantity-btn"
        onClick={increase}
        disabled={quantity >= stock}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  stock: PropTypes.number,
  min: PropTypes.number,
};

export default QuantitySelector;