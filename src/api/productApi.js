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
   EMPTY PRODUCTS RESPONSE
========================================================== */

const emptyProductsResponse = (
  message = "Failed to fetch products.",
  page = 1
) => ({
  success: false,
  message,
  products: [],
  count: 0,
  totalProducts: 0,
  currentPage: page,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

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

    return emptyProductsResponse(
      getErrorMessage(
        error,
        "Failed to fetch products."
      )
    );
  }
};

/* ==========================================================
   GET SINGLE PUBLIC PRODUCT
   GET /api/products/:id
========================================================== */

export const getProductById = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        product: null,
      };
    }

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
      count: 0,
    };
  }
};

/* ==========================================================
   GET ADMIN PRODUCT BY ID
   GET /api/products/admin/:id
========================================================== */

export const getAdminProductById = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        product: null,
      };
    }

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
   - JSON
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
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        product: null,
      };
    }

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
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
      };
    }

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
    if (!id) {
      return {
        success: false,
        message: "Product ID is required.",
        product: null,
      };
    }

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
  return getProducts({
    ...params,
    featured: true,
  });
};

/* ==========================================================
   GET BESTSELLER PRODUCTS
   GET /api/products?bestseller=true
========================================================== */

export const getBestSellerProducts = async (
  params = {}
) => {
  return getProducts({
    ...params,
    bestseller: true,
  });
};

/* ==========================================================
   GET NEW ARRIVAL PRODUCTS
   GET /api/products?newArrival=true
========================================================== */

export const getNewArrivalProducts = async (
  params = {}
) => {
  return getProducts({
    ...params,
    newArrival: true,
  });
};

/* ==========================================================
   SEARCH PRODUCTS
   GET /api/products/search?q=...
========================================================== */

export const searchProducts = async (
  query = "",
  params = {}
) => {
  try {
    const { data } = await api.get(
      "/products/search",
      {
        params: {
          ...params,
          q: String(query).trim(),
        },
      }
    );

    return data;
  } catch (error) {
    console.error(
      "Search Products Error:",
      error
    );

    return emptyProductsResponse(
      getErrorMessage(
        error,
        "Failed to search products."
      )
    );
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
  return getProducts({
    ...params,
    category,
  });
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
  return getProducts({
    ...params,
    page,
    limit,
  });
};

/* ==========================================================
   SORT PRODUCTS
   GET /api/products?sort=...
========================================================== */

export const getSortedProducts = async (
  sort = "newest",
  params = {}
) => {
  return getProducts({
    ...params,
    sort,
  });
};

/* ==========================================================
   FILTER PRODUCTS
   GET /api/products
========================================================== */

export const filterProducts = async (
  filters = {}
) => {
  return getProducts(filters);
};