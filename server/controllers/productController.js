import mongoose from "mongoose";
import Product from "../models/Product.js";



/* ==========================================================
   GET ALL ACTIVE PRODUCTS
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



    // Search
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



    // Category
    if (category) {

      filter.category = category;

    }



    // Featured
    if (featured === "true") {

      filter.featured = true;

    }



    // Bestseller
    if (bestseller === "true") {

      filter.bestseller = true;

    }



    // New arrival
    if (newArrival === "true") {

      filter.newArrival = true;

    }




    let sortOption = {
      createdAt: -1,
    };


    switch(sort){

      case "price-low":

        sortOption = {
          price:1,
        };

        break;


      case "price-high":

        sortOption = {
          price:-1,
        };

        break;


      case "name":

        sortOption = {
          name:1,
        };

        break;


      case "rating":

        sortOption = {
          rating:-1,
        };

        break;


      default:

        sortOption = {
          createdAt:-1,
        };

    }



    const currentPage = Number(page);

    const pageSize = Number(limit);



    const skip =
      (currentPage - 1) * pageSize;




    const products =
      await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);



    const totalProducts =
      await Product.countDocuments(filter);



    res.status(200).json({

      success:true,

      count:products.length,

      totalProducts,

      currentPage,

      totalPages:
        Math.ceil(
          totalProducts / pageSize
        ),

      products,

    });



  } catch(error){


    console.error(
      "Get Products Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to fetch products",

    });


  }

};







/* ==========================================================
   GET ADMIN PRODUCTS
   GET /api/admin/products
========================================================== */

export const getAdminProducts = async (
  req,
  res
) => {


  try {


    const products =
      await Product.find({})
      .sort({
        createdAt:-1,
      });



    res.status(200).json({

      success:true,

      count:
        products.length,

      products,

    });



  } catch(error){


    console.error(
      "Admin Products Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to fetch admin products",

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
)=>{


  try{


    if(
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ){

      return res.status(400).json({

        success:false,

        message:
          "Invalid product ID",

      });

    }



    const product =
      await Product.findOne({

        _id:req.params.id,

        isActive:true,

      });



    if(!product){

      return res.status(404).json({

        success:false,

        message:
          "Product not found",

      });

    }



    res.status(200).json({

      success:true,

      product,

    });



  }catch(error){


    console.error(
      "Get Product Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to fetch product",

    });


  }


};









/* ==========================================================
   CREATE PRODUCT
   POST /api/products
   ADMIN
========================================================== */


export const createProduct = async (
  req,
  res
)=>{


 try{


  const product =
    await Product.create({

      ...req.body,

      createdBy:
        req.user._id,

    });



  res.status(201).json({

    success:true,

    message:
      "Product created successfully",

    product,

  });



 }catch(error){


  console.error(
    "Create Product Error:",
    error
  );


  res.status(500).json({

    success:false,

    message:
      "Failed to create product",

  });


 }


};










/* ==========================================================
   UPDATE PRODUCT
   PUT /api/products/:id
   ADMIN
========================================================== */


export const updateProduct = async (
 req,
 res
)=>{


try{


 const product =
  await Product.findByIdAndUpdate(

    req.params.id,

    req.body,

    {
      new:true,
      runValidators:true,
    }

  );



 if(!product){

  return res.status(404).json({

    success:false,

    message:
      "Product not found",

  });

 }



 res.status(200).json({

  success:true,

  message:
    "Product updated successfully",

  product,

 });



}catch(error){


 console.error(
  "Update Product Error:",
  error
 );


 res.status(500).json({

  success:false,

  message:
    "Failed to update product",

 });


}


};










/* ==========================================================
   DELETE PRODUCT (SOFT DELETE)
   DELETE /api/products/:id
   ADMIN
========================================================== */


export const deleteProduct = async (
 req,
 res
)=>{


try{


 const product =
  await Product.findById(
    req.params.id
  );



 if(!product){

  return res.status(404).json({

   success:false,

   message:
    "Product not found",

  });

 }



 product.isActive = false;


 await product.save();




 res.status(200).json({

  success:true,

  message:
   "Product deleted successfully",

 });



}catch(error){


 console.error(
  "Delete Product Error:",
  error
 );


 res.status(500).json({

  success:false,

  message:
   "Failed to delete product",

 });


}


};









/* ==========================================================
   RESTORE PRODUCT
   PUT /api/products/:id/restore
   ADMIN
========================================================== */


export const restoreProduct = async (
 req,
 res
)=>{


try{


 const product =
  await Product.findById(
    req.params.id
  );



 if(!product){

  return res.status(404).json({

   success:false,

   message:
    "Product not found",

  });

 }



 product.isActive = true;


 await product.save();



 res.status(200).json({

  success:true,

  message:
   "Product restored successfully",

  product,

 });



}catch(error){


 console.error(
  "Restore Product Error:",
  error
 );


 res.status(500).json({

  success:false,

  message:
   "Failed to restore product",

 });


}


};