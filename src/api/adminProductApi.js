import api from "./axios";

/* ==========================================================
   GET ALL PRODUCTS
========================================================== */
export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/products", {
      params,
    });

    return data;
  } catch (error) {
    console.error("Get Products Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to load products.",
      products: [],
    };
  }
};

/* ==========================================================
   GET PRODUCT BY ID
========================================================== */
export const getProduct = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);

    return data;
  } catch (error) {
    console.error("Get Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to load product.",
      product: null,
    };
  }
};

/* ==========================================================
   CREATE PRODUCT
========================================================== */
export const createProduct = async (productData) => {
  try {
    const { data } = await api.post(
      "/products",
      productData
    );

    return data;
  } catch (error) {
    console.error("Create Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to create product.",
    };
  }
};

/* ==========================================================
   UPDATE PRODUCT
========================================================== */
export const updateProduct = async (
  id,
  productData
) => {
  try {
    const { data } = await api.put(
      `/products/${id}`,
      productData
    );

    return data;
  } catch (error) {
    console.error("Update Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to update product.",
    };
  }
};

/* ==========================================================
   DELETE PRODUCT
========================================================== */
export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(
      `/products/${id}`
    );

    return data;
  } catch (error) {
    console.error("Delete Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete product.",
    };
  }
};