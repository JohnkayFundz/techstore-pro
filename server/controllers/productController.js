import mongoose from "mongoose";
import Product from "../models/Product.js";


/* ==========================================================
   GET ALL PRODUCTS
   GET /api/products
========================================================== */

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      featured,
      bestseller,
      newArrival,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;


    const filter = {
      isActive: true,
    };


    // Search by name or brand
    if (keyword) {
      filter.$or = [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }


    // Filter category
    if (category) {
      filter.category = category;
    }


    // Featured products
    if (featured === "true") {
      filter.featured = true;
    }


    // Best sellers
    if (bestseller === "true") {
      filter.bestseller = true;
    }


    // New arrivals
    if (newArrival === "true") {
      filter.newArrival = true;
    }



    // Sorting
    let sortOption = {
      createdAt: -1,
    };


    switch (sort) {

      case "price-low":
        sortOption = {
          price: 1,
        };
        break;


      case "price-high":
        sortOption = {
          price: -1,
        };
        break;


      case "name":
        sortOption = {
          name: 1,
        };
        break;


      case "rating":
        sortOption = {
          rating: -1,
        };
        break;


      default:
        sortOption = {
          createdAt: -1,
        };
    }



    // Pagination
    const currentPage = Number(page);
    const pageSize = Number(limit);

    const skip =
      (currentPage - 1) * pageSize;



    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);



    const totalProducts =
      await Product.countDocuments(filter);



    res.status(200).json({

      success: true,

      count: products.length,

      totalProducts,

      currentPage,

      totalPages: Math.ceil(
        totalProducts / pageSize
      ),

      products,

    });


  } catch (error) {

    console.error(
      "Get Products Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to fetch products.",

    });

  }
};





/* ==========================================================
   GET SINGLE PRODUCT
   GET /api/products/:id
========================================================== */

export const getProductById = async (
  req,
  res
) => {

  try {


    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid product ID.",

      });

    }



    const product =
      await Product.findOne({

        _id: req.params.id,

        isActive: true,

      });



    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found.",

      });

    }



    res.status(200).json({

      success: true,

      product,

    });



  } catch (error) {


    console.error(
      "Get Product Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to fetch product.",

    });

  }

};






/* ==========================================================
   CREATE PRODUCT
   POST /api/products
   Admin Only
========================================================== */

export const createProduct = async (
  req,
  res
) => {

  try {


    const product =
      await Product.create({

        ...req.body,

        createdBy: req.user._id,

      });



    res.status(201).json({

      success: true,

      message:
        "Product created successfully.",

      product,

    });



  } catch (error) {


    console.error(
      "Create Product Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to create product.",

    });

  }

};






/* ==========================================================
   UPDATE PRODUCT
   PUT /api/products/:id
   Admin Only
========================================================== */

export const updateProduct = async (
  req,
  res
) => {

  try {


    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid product ID.",

      });

    }



    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true,
        }

      );



    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found.",

      });

    }



    res.status(200).json({

      success: true,

      message:
        "Product updated successfully.",

      product,

    });



  } catch (error) {


    console.error(
      "Update Product Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to update product.",

    });

  }

};







/* ==========================================================
   DELETE PRODUCT (SOFT DELETE)
   DELETE /api/products/:id
   Admin Only
========================================================== */

export const deleteProduct = async (
  req,
  res
) => {

  try {


    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid product ID.",

      });

    }



    const product =
      await Product.findById(
        req.params.id
      );



    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found.",

      });

    }



    product.isActive = false;

    await product.save();



    res.status(200).json({

      success: true,

      message:
        "Product deleted successfully.",

    });



  } catch (error) {


    console.error(
      "Delete Product Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to delete product.",

    });

  }

};