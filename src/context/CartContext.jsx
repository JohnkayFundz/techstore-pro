import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import PropTypes from "prop-types";

/* ==========================================================
   CART CONTEXT
========================================================== */

const CartContext = createContext(null);

/* ==========================================================
   CREATE UNIQUE CART ID
========================================================== */

const createCartId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
};

/* ==========================================================
   INITIAL STATE
========================================================== */

const getInitialState = () => {
  try {
    const savedCart = localStorage.getItem("cart");

    const cart = savedCart
      ? JSON.parse(savedCart)
      : [];

    return {
      cart: cart.map((item) => ({
        ...item,
        _id: item._id || item.id,
        cartId: item.cartId || createCartId(),
        quantity: Math.max(
          Number(item.quantity) || 1,
          1
        ),
      })),
      lastAddedId: null,
    };
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );

    return {
      cart: [],
      lastAddedId: null,
    };
  }
};

/* ==========================================================
   CART REDUCER
========================================================== */

function cartReducer(state, action) {
  switch (action.type) {    /* ==========================================
       ADD TO CART
    ========================================== */

    case "ADD_TO_CART": {
      const product = action.payload;

      const productId =
        product._id || product.id;

      const existingItem =
        state.cart.find((item) => {
          const itemId =
            item._id || item.id;

          return (
            itemId === productId &&
            item.selectedColor ===
              product.selectedColor &&
            item.selectedSize ===
              product.selectedSize
          );
        });

      if (existingItem) {
        return {
          ...state,

          cart: state.cart.map((item) =>
            item.cartId ===
            existingItem.cartId
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    item.stock ?? Infinity
                  ),
                }
              : item
          ),

          lastAddedId:
            existingItem.cartId,
        };
      }

      const newItem = {
        ...product,

        _id:
          product._id || product.id,

        cartId: createCartId(),

        quantity: Math.max(
          Number(product.quantity) || 1,
          1
        ),
      };

      return {
        ...state,

        cart: [
          ...state.cart,
          newItem,
        ],

        lastAddedId:
          newItem.cartId,
      };
    }

    /* ==========================================
       INCREASE QUANTITY
    ========================================== */

    case "INCREASE": {
      return {
        ...state,

        cart: state.cart.map((item) => {
          if (
            item.cartId !== action.payload
          ) {
            return item;
          }

          return {
            ...item,

            quantity: Math.min(
              item.quantity + 1,
              item.stock ?? Infinity
            ),
          };
        }),
      };
    }    /* ==========================================
       DECREASE QUANTITY
    ========================================== */

    case "DECREASE": {
      return {
        ...state,

        cart: state.cart.map((item) => {
          if (
            item.cartId !== action.payload
          ) {
            return item;
          }

          return {
            ...item,

            quantity: Math.max(
              item.quantity - 1,
              1
            ),
          };
        }),
      };
    }

    /* ==========================================
       UPDATE QUANTITY
    ========================================== */

    case "UPDATE_QUANTITY": {
      const { cartId, quantity } =
        action.payload;

      return {
        ...state,

        cart: state.cart.map((item) => {
          if (item.cartId !== cartId) {
            return item;
          }

          const maxStock =
            item.stock ?? Infinity;

          return {
            ...item,

            quantity: Math.max(
              1,
              Math.min(
                Number(quantity) || 1,
                maxStock
              )
            ),
          };
        }),
      };
    }

    /* ==========================================
       REMOVE ITEM
    ========================================== */

    case "REMOVE_ITEM": {
      return {
        ...state,

        cart: state.cart.filter(
          (item) =>
            item.cartId !==
            action.payload
        ),

        lastAddedId:
          state.lastAddedId ===
          action.payload
            ? null
            : state.lastAddedId,
      };
    }

    /* ==========================================
       CLEAR CART
    ========================================== */

    case "CLEAR_CART":
      return {
        cart: [],
        lastAddedId: null,
      };

    default:
      return state;
  }
}/* ==========================================================
   CART PROVIDER
========================================================== */

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    undefined,
    getInitialState
  );

  /* ==========================================
     SAVE CART
  ========================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(state.cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [state.cart]);

  /* ==========================================
     CART COUNT
  ========================================== */

  const cartCount = useMemo(() => {
    return state.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [state.cart]);

  /* ==========================================
     CART TOTAL
  ========================================== */

  const cartTotal = useMemo(() => {
    return state.cart.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  }, [state.cart]);

  /* ==========================================
     ACTION HELPERS
  ========================================== */

  const addToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  };

  const increaseQuantity = (cartId) => {
    dispatch({
      type: "INCREASE",
      payload: cartId,
    });
  };

  const decreaseQuantity = (cartId) => {
    dispatch({
      type: "DECREASE",
      payload: cartId,
    });
  };

  const updateQuantity = (
    cartId,
    quantity
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        cartId,
        quantity,
      },
    });
  };

  const removeFromCart = (cartId) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: cartId,
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  /* ==========================================
     CONTEXT VALUE
  ========================================== */

  const value = useMemo(
    () => ({
      state,
      cart: state.cart,
      lastAddedId: state.lastAddedId,

      cartCount,
      cartTotal,

      addToCart,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      removeFromCart,
      clearCart,

      dispatch,
    }),
    [state, cartCount, cartTotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};/* ==========================================================
   USE CART HOOK
========================================================== */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
}