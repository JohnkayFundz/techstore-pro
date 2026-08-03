import api from "./axios";


/* ==========================================================
   GET ALL PRODUCTS
========================================================== */

export const getProducts = async () => {
  try {
    const { data } = await api.get("/products");

    return data;

  } catch (error) {

    console.error("Get Products Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch products.",
    };
  }
};



/* ==========================================================
   GET SINGLE PRODUCT
========================================================== */

export const getProductById = async (id) => {

  try {

    const { data } = await api.get(
      `/products/${id}`
    );

    return data;

  } catch (error) {

    console.error("Get Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch product.",
    };
  }
};



/* ==========================================================
   CREATE PRODUCT (ADMIN ONLY)
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
   UPDATE PRODUCT (ADMIN ONLY)
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
   DELETE PRODUCT (ADMIN ONLY)
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



/* ==========================================================
   GET FEATURED PRODUCTS
========================================================== */

export const getFeaturedProducts = async () => {

  try {

    const { data } = await api.get(
      "/products?featured=true"
    );

    return data;

  } catch (error) {

    console.error(
      "Featured Products Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch featured products.",
    };
  }
};



/* ==========================================================
   SEARCH PRODUCTS
========================================================== */

export const searchProducts = async (query) => {

  try {

    const { data } = await api.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );

    return data;

  } catch (error) {

    console.error(
      "Search Products Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to search products.",
    };
  }
};