// ==========================================================
// WishlistContext.jsx
// ==========================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ==========================================================
// CONTEXT
// ==========================================================

const WishlistContext = createContext(null);

// ==========================================================
// STORAGE KEY
// ==========================================================

const WISHLIST_STORAGE_KEY = "techstore_wishlist";

// ==========================================================
// HELPERS
// ==========================================================

export function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  // String
  if (typeof value === "string") {
    return value.trim();
  }

  // Number
  if (typeof value === "number") {
    return String(value).trim();
  }

  // Object
  if (typeof value === "object") {
    return String(
      value._id ??
        value.id ??
        value.productId ??
        ""
    ).trim();
  }

  return "";
}

// ==========================================================
// GET PRODUCT ID
// ==========================================================

export function getProductId(product) {
  return normalizeId(product);
}

// ==========================================================
// LOAD WISHLIST FROM LOCAL STORAGE
// ==========================================================

function getInitialWishlist() {
  try {
    const saved = localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    // Make sure stored data is an array
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Normalize IDs
    const normalized = parsed
      .map(normalizeId)
      .filter(Boolean);

    // Remove duplicates
    return [...new Set(normalized)];
  } catch (error) {
    console.error(
      "❌ Failed to load wishlist:",
      error
    );

    return [];
  }
}

// ==========================================================
// PROVIDER
// ==========================================================

export function WishlistProvider({
  children,
}) {
  // ========================================================
  // STATE
  // ========================================================

  const [wishlist, setWishlist] = useState(
    getInitialWishlist
  );

  // ========================================================
  // SAVE TO LOCAL STORAGE
  // ========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      );

      console.log(
        "❤️ Wishlist saved:",
        wishlist
      );
    } catch (error) {
      console.error(
        "❌ Failed to save wishlist:",
        error
      );
    }
  }, [wishlist]);

  // ========================================================
  // CHECK IF PRODUCT IS WISHLISTED
  // ========================================================

  const isWishlisted = useCallback(
    (productOrId) => {
      const productId =
        getProductId(productOrId);

      if (!productId) {
        return false;
      }

      return wishlist.includes(productId);
    },
    [wishlist]
  );

  // ========================================================
  // COMPATIBILITY ALIAS
  //
  // ProductCard currently uses:
  // isInWishlist(productId)
  //
  // Other components may use:
  // isWishlisted(productId)
  // ========================================================

  const isInWishlist = isWishlisted;

  // ========================================================
  // ADD TO WISHLIST
  // ========================================================

  const addToWishlist = useCallback(
    (productOrId) => {
      const productId =
        getProductId(productOrId);

      if (!productId) {
        console.warn(
          "⚠️ Cannot add product without ID."
        );

        return false;
      }

      setWishlist(
        (currentWishlist) => {
          // Already exists
          if (
            currentWishlist.includes(
              productId
            )
          ) {
            return currentWishlist;
          }

          return [
            ...currentWishlist,
            productId,
          ];
        }
      );

      return true;
    },
    []
  );

  // ========================================================
  // REMOVE FROM WISHLIST
  // ========================================================

  const removeFromWishlist =
    useCallback(
      (productOrId) => {
        const productId =
          getProductId(productOrId);

        if (!productId) {
          console.warn(
            "⚠️ Cannot remove product without ID."
          );

          return false;
        }

        setWishlist(
          (currentWishlist) =>
            currentWishlist.filter(
              (id) => id !== productId
            )
        );

        return true;
      },
      []
    );

  // ========================================================
  // TOGGLE WISHLIST
  // ========================================================

  const toggleWishlist = useCallback(
    (productOrId) => {
      const productId =
        getProductId(productOrId);

      if (!productId) {
        console.warn(
          "⚠️ Cannot toggle wishlist without product ID."
        );

        return false;
      }

      setWishlist(
        (currentWishlist) => {
          // ------------------------------------------------
          // REMOVE
          // ------------------------------------------------

          if (
            currentWishlist.includes(
              productId
            )
          ) {
            return currentWishlist.filter(
              (id) => id !== productId
            );
          }

          // ------------------------------------------------
          // ADD
          // ------------------------------------------------

          return [
            ...currentWishlist,
            productId,
          ];
        }
      );

      return true;
    },
    []
  );

  // ========================================================
  // CLEAR WISHLIST
  // ========================================================

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // ========================================================
  // COUNT
  // ========================================================

  const wishlistCount =
    wishlist.length;

  // ========================================================
  // ALIASES
  //
  // Keeps compatibility with existing components.
  // ========================================================

  const addWishlist =
    addToWishlist;

  const removeWishlist =
    removeFromWishlist;

  // ========================================================
  // MEMOIZED CONTEXT VALUE
  // ========================================================

  const value = useMemo(
    () => ({
      // ----------------------------------------------------
      // Main wishlist
      // ----------------------------------------------------

      wishlist,

      // ----------------------------------------------------
      // Count
      // ----------------------------------------------------

      wishlistCount,

      // ----------------------------------------------------
      // Check wishlist
      // ----------------------------------------------------

      isWishlisted,

      // ProductCard compatibility
      isInWishlist,

      // ----------------------------------------------------
      // Add
      // ----------------------------------------------------

      addToWishlist,
      addWishlist,

      // ----------------------------------------------------
      // Remove
      // ----------------------------------------------------

      removeFromWishlist,
      removeWishlist,

      // ----------------------------------------------------
      // Toggle
      // ----------------------------------------------------

      toggleWishlist,

      // ----------------------------------------------------
      // Clear
      // ----------------------------------------------------

      clearWishlist,

      // ----------------------------------------------------
      // Utilities
      // ----------------------------------------------------

      normalizeId,
      getProductId,
    }),
    [
      wishlist,
      wishlistCount,
      isWishlisted,
      isInWishlist,
      addToWishlist,
      addWishlist,
      removeFromWishlist,
      removeWishlist,
      toggleWishlist,
      clearWishlist,
    ]
  );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ==========================================================
// CUSTOM HOOK
// ==========================================================

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
}

// ==========================================================
// DEFAULT EXPORT
// ==========================================================

export default WishlistContext;