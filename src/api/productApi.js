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
        "Failed to fetch products.",
      products: [],
    };
  }
};

/* ==========================================================
   GET SINGLE PRODUCT
========================================================== */

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);

    return data;
  } catch (error) {
    console.error("Get Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch product.",
      product: null,
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
    const { data } = await api.delete(`/products/${id}`);

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
    const { data } = await api.get("/products", {
      params: {
        featured: true,
      },
    });

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
      products: [],
    };
  }
};

/* ==========================================================
   SEARCH PRODUCTS
========================================================== */

export const searchProducts = async (
  query,
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products/search",
      {
        params: {
          q: query,
          ...params,
        },
      }
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
      products: [],
    };
  }
};

/* ==========================================================
   GET PRODUCTS BY CATEGORY
========================================================== */

export const getProductsByCategory = async (
  category,
  params = {}
) => {
  try {
    const { data } = await api.get("/products", {
      params: {
        category,
        ...params,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Category Products Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch category products.",
      products: [],
    };
  }
};

/* ==========================================================
   GET BESTSELLERS
========================================================== */

export const getBestSellerProducts = async () => {
  try {
    const { data } = await api.get("/products", {
      params: {
        bestseller: true,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "Best Seller Products Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch bestseller products.",
      products: [],
    };
  }
};

/* ==========================================================
   GET NEW ARRIVALS
========================================================== */

export const getNewArrivalProducts = async () => {
  try {
    const { data } = await api.get("/products", {
      params: {
        newArrival: true,
      },
    });

    return data;
  } catch (error) {
    console.error(
      "New Arrival Products Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch new arrival products.",
      products: [],
    };
  }
};