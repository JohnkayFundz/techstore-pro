import api from "./axios";

export const getAdminProducts = async () => {
  try {
    const { data } = await api.get("/admin/products");
    return data;
  } catch (error) {
    console.error("Get Admin Products Error:", error);

    return {
      success: false,
      products: [],
      message:
        error.response?.data?.message ||
        "Failed to load products.",
    };
  }
};

export const getProduct = async (id) => {
  try {
    const { data } = await api.get(
      `/admin/products/${id}`
    );

    return data;
  } catch (error) {
    console.error("Get Product Error:", error);

    return {
      success: false,
      product: null,
      message:
        error.response?.data?.message ||
        "Failed to load product.",
    };
  }
};

export const createProduct = async (productData) => {
  try {
    const config =
      productData instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

    const { data } = await api.post(
      "/admin/products",
      productData,
      config
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

export const updateProduct = async (
  id,
  productData
) => {
  try {
    const config =
      productData instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

    const { data } = await api.put(
      `/admin/products/${id}`,
      productData,
      config
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

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(
      `/admin/products/${id}`
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

export const restoreProduct = async (id) => {
  try {
    const { data } = await api.put(
      `/admin/products/${id}/restore`
    );

    return data;
  } catch (error) {
    console.error("Restore Product Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to restore product.",
    };
  }
};

export const searchProducts = async (
  keyword = ""
) => {
  try {
    const { data } = await api.get("/products", {
      params: {
        keyword,
      },
    });

    return data;
  } catch (error) {
    console.error("Search Product Error:", error);

    return {
      success: false,
      products: [],
      message:
        error.response?.data?.message ||
        "Search failed.",
    };
  }
};