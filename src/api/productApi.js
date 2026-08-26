import api from "./axios";

/* ==========================================================
   ERROR HELPER
========================================================== */

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

/* ==========================================================
   GET ALL PRODUCTS
   GET /api/products
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
      message: getErrorMessage(
        error,
        "Failed to fetch products."
      ),
      products: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }
};

/* ==========================================================
   GET SINGLE PUBLIC PRODUCT
   GET /api/products/:id
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
      message: getErrorMessage(
        error,
        "Failed to fetch product."
      ),
      product: null,
    };
  }
};

/* ==========================================================
   GET ALL ADMIN PRODUCTS
   GET /api/products/admin
========================================================== */

export const getAdminProducts = async () => {
  try {
    const { data } = await api.get(
      "/products/admin"
    );

    return data;
  } catch (error) {
    console.error(
      "Get Admin Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch admin products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   GET ADMIN PRODUCT BY ID
   GET /api/products/admin/:id
========================================================== */

export const getAdminProductById = async (id) => {
  try {
    const { data } = await api.get(
      `/products/admin/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Get Admin Product By ID Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch product."
      ),
      product: null,
    };
  }
};

/* ==========================================================
   CREATE PRODUCT
   POST /api/products
   ADMIN ONLY

   Supports:
   - FormData
   - Cloudinary image upload
========================================================== */

export const createProduct = async (productData) => {
  try {
    const { data } = await api.post(
      "/products",
      productData
    );

    return data;
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to create product."
      ),
      product: null,
    };
  }
};

/* ==========================================================
   UPDATE PRODUCT
   PUT /api/products/:id
   ADMIN ONLY
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
    console.error(
      "Update Product Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to update product."
      ),
      product: null,
    };
  }
};

/* ==========================================================
   DELETE PRODUCT
   DELETE /api/products/:id
   SOFT DELETE
   ADMIN ONLY
========================================================== */

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(
      `/products/${id}`
    );

    return data;
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to delete product."
      ),
    };
  }
};

/* ==========================================================
   RESTORE PRODUCT
   PUT /api/products/:id/restore
   ADMIN ONLY
========================================================== */

export const restoreProduct = async (id) => {
  try {
    const { data } = await api.put(
      `/products/${id}/restore`
    );

    return data;
  } catch (error) {
    console.error(
      "Restore Product Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to restore product."
      ),
      product: null,
    };
  }
};

/* ==========================================================
   GET FEATURED PRODUCTS
   GET /api/products?featured=true
========================================================== */

export const getFeaturedProducts = async (
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          featured: true,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Featured Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch featured products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   GET BESTSELLER PRODUCTS
   GET /api/products?bestseller=true
========================================================== */

export const getBestSellerProducts = async (
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          bestseller: true,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Best Seller Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch bestseller products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   GET NEW ARRIVAL PRODUCTS
   GET /api/products?newArrival=true
========================================================== */

export const getNewArrivalProducts = async (
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          newArrival: true,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "New Arrival Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch new arrival products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   SEARCH PRODUCTS
   GET /api/products/search?q=...
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
          ...params,
          q: query,
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
      message: getErrorMessage(
        error,
        "Failed to search products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   GET PRODUCTS BY CATEGORY
   GET /api/products?category=...
========================================================== */

export const getProductsByCategory = async (
  category,
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          category,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Category Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch category products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   GET PRODUCTS WITH PAGINATION
   GET /api/products?page=&limit=
========================================================== */

export const getProductsPaginated = async (
  page = 1,
  limit = 10,
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          page,
          limit,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Paginated Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to fetch products."
      ),
      products: [],
      totalProducts: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
};

/* ==========================================================
   SORT PRODUCTS
   GET /api/products?sort=...

   Supported:
   newest
   oldest
   price-low
   price-high
   name
   name-asc
   name-desc
   rating
========================================================== */

export const getSortedProducts = async (
  sort = "newest",
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: {
          ...params,
          sort,
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Sorted Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to sort products."
      ),
      products: [],
    };
  }
};

/* ==========================================================
   FILTER PRODUCTS
   GET /api/products
========================================================== */

export const filterProducts = async (
  filters = {}
) => {
  try {
    const { data } = await api.get(
      "/products",
      {
        params: filters,
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Filter Products Error:",
      error
    );

    return {
      success: false,
      message: getErrorMessage(
        error,
        "Failed to filter products."
      ),
      products: [],
    };
  }
};