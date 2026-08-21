import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getProducts } from "../api/productApi";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  /* ========================================================
     FETCH PRODUCTS
  ======================================================== */

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts(params);

      if (!response?.success) {
        setProducts([]);

        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });

        setError(
          response?.message ||
            "Failed to load products."
        );

        return;
      }

      setProducts(
        Array.isArray(response.products)
          ? response.products
          : []
      );

      setPagination({
        currentPage:
          response.currentPage || 1,

        totalPages:
          response.totalPages || 1,

        totalProducts:
          response.totalProducts || 0,

        hasNextPage:
          Boolean(response.hasNextPage),

        hasPreviousPage:
          Boolean(response.hasPreviousPage),
      });
    } catch (error) {
      console.error(
        "ProductContext Error:",
        error
      );

      setProducts([]);

      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      setError(
        error?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ========================================================
     INITIAL LOAD
  ======================================================== */

  useEffect(() => {
    fetchProducts({
      page: 1,
      limit: 10,
    });
  }, [fetchProducts]);

  /* ========================================================
     REFRESH PRODUCTS
  ======================================================== */

  const refreshProducts = useCallback(
    (params = {}) => {
      return fetchProducts(params);
    },
    [fetchProducts]
  );

  /* ========================================================
     CONTEXT VALUE
  ======================================================== */

  const value = {
    products,

    loading,

    error,

    pagination,

    currentPage:
      pagination.currentPage,

    totalPages:
      pagination.totalPages,

    totalProducts:
      pagination.totalProducts,

    hasNextPage:
      pagination.hasNextPage,

    hasPreviousPage:
      pagination.hasPreviousPage,

    fetchProducts,

    refreshProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

/* ==========================================================
   MAIN HOOK
========================================================== */

export function useProducts() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside a ProductProvider"
    );
  }

  return context;
}

/* ==========================================================
   COMPATIBILITY HOOK
========================================================== */

export function useProduct() {
  return useProducts();
}