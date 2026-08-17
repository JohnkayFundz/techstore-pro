import { createContext, useContext, useEffect, useState } from "react";
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
  });

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts(params);

      console.log("ProductContext API Response:", response);

      if (response?.success) {
        setProducts(response.products || []);

        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalProducts: response.totalProducts || 0,
        });
      } else {
        setProducts([]);
        setError(response?.message || "Failed to load products");
      }
    } catch (err) {
      console.error("ProductContext Error:", err);

      setProducts([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,

    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalProducts: pagination.totalProducts,

    pagination,

    fetchProducts,
    refreshProducts: fetchProducts,
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
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used inside a ProductProvider"
    );
  }

  return context;
}

/* ==========================================================
   COMPATIBILITY HOOK
   Allows existing components using useProduct()
========================================================== */

export function useProduct() {
  return useProducts();
}