import api from "./axios";



/* ==========================================================
   GET ALL ADMIN PRODUCTS
========================================================== */

export const getAdminProducts = async () => {

  try {

    const {
      data,
    } = await api.get(
      "/admin/products"
    );


    return data;


  } catch (error) {


    console.error(
      "Get Admin Products Error:",
      error
    );


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
   GET SINGLE PRODUCT
========================================================== */

export const getProduct = async (id) => {

  try {


    const {
      data,
    } = await api.get(
      `/admin/products/${id}`
    );


    return data;



  } catch (error) {


    console.error(
      "Get Product Error:",
      error
    );


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

export const createProduct = async (
  productData
) => {


  try {


    const {
      data,
    } = await api.post(

      "/admin/products",

      productData

    );


    return data;



  } catch(error) {


    console.error(
      "Create Product Error:",
      error
    );


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


    const {
      data,
    } = await api.put(

      `/admin/products/${id}`,

      productData

    );


    return data;



  } catch(error) {


    console.error(
      "Update Product Error:",
      error
    );


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

export const deleteProduct = async (
  id
) => {


  try {


    const {
      data,
    } = await api.delete(

      `/admin/products/${id}`

    );


    return data;



  } catch(error) {


    console.error(
      "Delete Product Error:",
      error
    );


    return {

      success: false,

      message:
        error.response?.data?.message ||
        "Failed to delete product.",

    };


  }


};




/* ==========================================================
   SEARCH PRODUCTS
========================================================== */

export const searchProducts = async (
  keyword
) => {


  try {


    const {
      data,
    } = await api.get(

      "/products",

      {
        params: {
          keyword,
        },
      }

    );


    return data;



  } catch(error) {


    console.error(
      "Search Product Error:",
      error
    );


    return {

      success: false,

      products: [],

      message:
        "Search failed.",

    };


  }


};