// ==========================================================
// TECHSTORE PRO
// PRODUCT CONTROLLER
// ==========================================================

import mongoose from "mongoose";
import Product from "../models/Product.js";

// ==========================================================
// HELPERS
// ==========================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ----------------------------------------------------------
// Escape special regex characters safely
// ----------------------------------------------------------

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================================
// SEARCH FILTER
// ==========================================================

const buildSearchFilter = (searchTerm = "") => {
  const term = String(searchTerm).trim();

  if (!term) {
    return null;
  }

  const safeSearch = escapeRegex(term);

  return {
    $or: [
      {
        name: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        category: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        sku: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ],
  };
};

// ==========================================================
// SORT
// ==========================================================

const buildSortOption = (sort = "newest") => {
  switch (String(sort).trim().toLowerCase()) {
    case "price-low":
    case "price_asc":
    case "price-low-to-high":
      return {
        price: 1,
      };

    case "price-high":
    case "price_desc":
    case "price-high-to-low":
      return {
        price: -1,
      };

    case "name":
    case "name-asc":
      return {
        name: 1,
      };

    case "name-desc":
      return {
        name: -1,
      };

    case "rating":
      return {
        rating: -1,
      };

    case "oldest":
      return {
        createdAt: 1,
      };

    case "newest":
    default:
      return {
        createdAt: -1,
      };
  }
};

// ==========================================================
// PAGINATION
// ==========================================================

const getPagination = (page, limit) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage = Math.max(
    Number.isFinite(parsedPage)
      ? Math.floor(parsedPage)
      : 1,
    1
  );

  const pageSize = Math.min(
    Math.max(
      Number.isFinite(parsedLimit)
        ? Math.floor(parsedLimit)
        : 10,
      1
    ),
    100
  );

  const skip = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    skip,
  };
};

// ==========================================================
// PRICE FILTER
// ==========================================================

const buildPriceFilter = (minPrice, maxPrice) => {
  const parsedMinPrice = Number(minPrice);
  const parsedMaxPrice = Number(maxPrice);

  const hasMinPrice =
    minPrice !== undefined &&
    minPrice !== null &&
    minPrice !== "" &&
    Number.isFinite(parsedMinPrice);

  const hasMaxPrice =
    maxPrice !== undefined &&
    maxPrice !== null &&
    maxPrice !== "" &&
    Number.isFinite(parsedMaxPrice);

  if (
    hasMinPrice &&
    hasMaxPrice &&
    parsedMinPrice > parsedMaxPrice
  ) {
    return {
      error:
        "Minimum price cannot be greater than maximum price.",
    };
  }

  if (!hasMinPrice && !hasMaxPrice) {
    return {
      filter: null,
    };
  }

  const priceFilter = {};

  if (hasMinPrice) {
    priceFilter.$gte = Math.max(parsedMinPrice, 0);
  }

  if (hasMaxPrice) {
    priceFilter.$lte = Math.max(parsedMaxPrice, 0);
  }

  return {
    filter: priceFilter,
  };
};

// ==========================================================
// VALIDATION ERROR MESSAGE
// ==========================================================

const getValidationMessage = (error) => {
  if (error?.name === "ValidationError") {
    return Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
  }

  return null;
};

// ==========================================================
// NORMALIZE IMAGE DATA
// ==========================================================

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images
      .map((image) => String(image || "").trim())
      .filter(Boolean);
  }

  if (
    typeof images === "string" &&
    images.trim()
  ) {
    return [images.trim()];
  }

  return [];
};

// ==========================================================
// NORMALIZE BOOLEAN
// ==========================================================

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return value;
};

// ==========================================================
// NORMALIZE NUMBER
// ==========================================================

const normalizeNumber = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return value;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : value;
};

// ==========================================================
// GET ALL ACTIVE PRODUCTS
// GET /api/products
// PUBLIC
// ==========================================================

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      search,
      category,
      featured,
      bestseller,
      newArrival,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    // --------------------------------------------------------
    // BASE FILTER
    // --------------------------------------------------------

    const filter = {
      isActive: true,
    };

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    const searchTerm = String(
      search || keyword || ""
    ).trim();

    const searchFilter =
      buildSearchFilter(searchTerm);

    if (searchFilter) {
      Object.assign(filter, searchFilter);
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (
      category &&
      String(category).trim() &&
      String(category).trim().toLowerCase() !== "all"
    ) {
      filter.category = String(category).trim();
    }

    // --------------------------------------------------------
    // FEATURED
    // --------------------------------------------------------

    if (featured === "true") {
      filter.featured = true;
    }

    // --------------------------------------------------------
    // BESTSELLER
    // --------------------------------------------------------

    if (bestseller === "true") {
      filter.bestseller = true;
    }

    // --------------------------------------------------------
    // NEW ARRIVAL
    // --------------------------------------------------------

    if (newArrival === "true") {
      filter.newArrival = true;
    }

    // --------------------------------------------------------
    // PRICE FILTER
    // --------------------------------------------------------

    const priceResult = buildPriceFilter(
      minPrice,
      maxPrice
    );

    if (priceResult.error) {
      return res.status(400).json({
        success: false,
        message: priceResult.error,
        products: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 0,
      });
    }

    if (priceResult.filter) {
      filter.price = priceResult.filter;
    }

    // --------------------------------------------------------
    // SORT
    // --------------------------------------------------------

    const sortOption = buildSortOption(sort);

    // --------------------------------------------------------
    // PAGINATION
    // --------------------------------------------------------

    const {
      currentPage,
      pageSize,
      skip,
    } = getPagination(page, limit);

    // --------------------------------------------------------
    // DATABASE QUERY
    // --------------------------------------------------------

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),

      Product.countDocuments(filter),
    ]);

    // --------------------------------------------------------
    // TOTAL PAGES
    // --------------------------------------------------------

    const totalPages =
      Math.ceil(totalProducts / pageSize);

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      products: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 0,
    });
  }
};

// ==========================================================
// GET ADMIN PRODUCTS
// GET /api/products/admin
// ADMIN
// ==========================================================

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Admin Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin products.",
      products: [],
    });
  }
};

// ==========================================================
// SEARCH PRODUCTS
// GET /api/products/search
// PUBLIC
// ==========================================================

export const searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      search = "",
      keyword = "",
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    // ------------------------------------------------------
    // SEARCH TERM
    // ------------------------------------------------------

    const searchTerm = String(
      q || search || keyword || ""
    ).trim();

    // ------------------------------------------------------
    // BASE FILTER
    // ------------------------------------------------------

    const filter = {
      isActive: true,
    };

    // ------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------

    const searchFilter =
      buildSearchFilter(searchTerm);

    if (searchFilter) {
      Object.assign(filter, searchFilter);
    }

    // ------------------------------------------------------
    // CATEGORY
    // ------------------------------------------------------

    if (
      category &&
      String(category).trim() &&
      String(category).trim().toLowerCase() !== "all"
    ) {
      filter.category = String(category).trim();
    }

    // ------------------------------------------------------
    // PRICE
    // ------------------------------------------------------

    const priceResult = buildPriceFilter(
      minPrice,
      maxPrice
    );

    if (priceResult.error) {
      return res.status(400).json({
        success: false,
        message: priceResult.error,
        products: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 0,
      });
    }

    if (priceResult.filter) {
      filter.price = priceResult.filter;
    }

    // ------------------------------------------------------
    // SORT
    // ------------------------------------------------------

    const sortOption = buildSortOption(sort);

    // ------------------------------------------------------
    // PAGINATION
    // ------------------------------------------------------

    const {
      currentPage,
      pageSize,
      skip,
    } = getPagination(page, limit);

    // ------------------------------------------------------
    // DATABASE
    // ------------------------------------------------------

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),

      Product.countDocuments(filter),
    ]);

    const totalPages =
      Math.ceil(totalProducts / pageSize);

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      products,
    });
  } catch (error) {
    console.error("Search Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search products.",
      products: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 0,
    });
  }
};

// ==========================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// PUBLIC
// ==========================================================

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------------------
    // VALIDATE ID
    // ------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // ------------------------------------------------------
    // FIND ACTIVE PRODUCT
    // ------------------------------------------------------

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

// ==========================================================
// GET ADMIN PRODUCT BY ID
// GET /api/products/admin/:id
// ADMIN
// ==========================================================

export const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------------------
    // VALIDATE ID
    // ------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get Admin Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

// ==========================================================
// CREATE PRODUCT
// POST /api/products
// ADMIN
//
// Supports:
// - JSON
// - FormData
// - Cloudinary image upload
// ==========================================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      currency,
      category,
      brand,
      sku,
      image,
      images,
      features,
      stock,
      shipping,
      rating,
      numReviews,
      warranty,
      featured,
      bestseller,
      newArrival,
      isActive,
    } = req.body;

    // ------------------------------------------------------
    // CLOUDINARY IMAGE
    // ------------------------------------------------------

    const uploadedImage =
      req.file?.path ||
      req.file?.secure_url ||
      "";

    const primaryImage =
      uploadedImage ||
      String(image || "").trim();

    // ------------------------------------------------------
    // ADDITIONAL IMAGES
    // ------------------------------------------------------

    const additionalImages =
      normalizeImages(images);

    // ------------------------------------------------------
    // REQUIRED VALIDATION
    // ------------------------------------------------------

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (
      !description ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required.",
      });
    }

    if (
      !category ||
      !String(category).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    if (!sku || !String(sku).trim()) {
      return res.status(400).json({
        success: false,
        message: "SKU is required.",
      });
    }

    if (!primaryImage) {
      return res.status(400).json({
        success: false,
        message: "Product image is required.",
      });
    }

    // ------------------------------------------------------
    // NORMALIZE SKU
    // ------------------------------------------------------

    const normalizedSku = String(sku)
      .trim()
      .toUpperCase();

    // ------------------------------------------------------
    // CHECK DUPLICATE SKU
    // ------------------------------------------------------

    const existingProduct =
      await Product.findOne({
        sku: normalizedSku,
      }).lean();

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this SKU already exists.",
      });
    }

    // ------------------------------------------------------
    // CREATE PRODUCT
    // ------------------------------------------------------

    const product = await Product.create({
      name: String(name).trim(),

      description: String(description).trim(),

      price: normalizeNumber(price),

      oldPrice: normalizeNumber(oldPrice),

      discount: normalizeNumber(discount),

      currency: currency || "USD",

      category: String(category).trim(),

      brand: brand
        ? String(brand).trim()
        : "TechStore Pro",

      sku: normalizedSku,

      image: primaryImage,

      images: additionalImages,

      features,

      stock: normalizeNumber(stock),

      shipping,

      rating: normalizeNumber(rating),

      numReviews: normalizeNumber(numReviews),

      warranty,

      featured: normalizeBoolean(featured),

      bestseller: normalizeBoolean(bestseller),

      newArrival: normalizeBoolean(newArrival),

      isActive:
        isActive === undefined
          ? true
          : normalizeBoolean(isActive),

      createdBy: req.user?._id || null,
    });

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    // ------------------------------------------------------
    // DUPLICATE KEY
    // ------------------------------------------------------

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this SKU already exists.",
      });
    }

    // ------------------------------------------------------
    // VALIDATION ERROR
    // ------------------------------------------------------

    const validationMessage =
      getValidationMessage(error);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    // ------------------------------------------------------
    // SERVER ERROR
    // ------------------------------------------------------

    return res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

// ==========================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ADMIN
// ==========================================================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------------------
    // VALIDATE ID
    // ------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // ------------------------------------------------------
    // ALLOWED FIELDS
    // ------------------------------------------------------

    const allowedFields = [
      "name",
      "description",
      "price",
      "oldPrice",
      "discount",
      "currency",
      "category",
      "brand",
      "sku",
      "image",
      "images",
      "features",
      "stock",
      "shipping",
      "rating",
      "numReviews",
      "warranty",
      "featured",
      "bestseller",
      "newArrival",
      "isActive",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updateData[field] = req.body[field];
      }
    });

    // ------------------------------------------------------
    // CLOUDINARY IMAGE UPDATE
    // ------------------------------------------------------

    if (req.file) {
      updateData.image =
        req.file.path ||
        req.file.secure_url ||
        "";
    }

    // ------------------------------------------------------
    // NORMALIZE IMAGE ARRAY
    // ------------------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        updateData,
        "images"
      )
    ) {
      updateData.images =
        normalizeImages(updateData.images);
    }

    // ------------------------------------------------------
    // NORMALIZE NUMBERS
    // ------------------------------------------------------

    [
      "price",
      "oldPrice",
      "discount",
      "stock",
      "rating",
      "numReviews",
    ].forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          updateData,
          field
        )
      ) {
        updateData[field] =
          normalizeNumber(updateData[field]);
      }
    });

    // ------------------------------------------------------
    // NORMALIZE BOOLEANS
    // ------------------------------------------------------

    [
      "featured",
      "bestseller",
      "newArrival",
      "isActive",
    ].forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          updateData,
          field
        )
      ) {
        updateData[field] =
          normalizeBoolean(updateData[field]);
      }
    });

    // ------------------------------------------------------
    // NORMALIZE TEXT
    // ------------------------------------------------------

    [
      "name",
      "description",
      "category",
      "brand",
      "currency",
    ].forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          updateData,
          field
        ) &&
        updateData[field] !== undefined &&
        updateData[field] !== null
      ) {
        updateData[field] =
          String(updateData[field]).trim();
      }
    });

    // ------------------------------------------------------
    // PREVENT EMPTY UPDATE
    // ------------------------------------------------------

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid product fields provided for update.",
      });
    }

    // ------------------------------------------------------
    // NORMALIZE SKU
    // ------------------------------------------------------

    if (
      Object.prototype.hasOwnProperty.call(
        updateData,
        "sku"
      )
    ) {
      if (
        !updateData.sku ||
        !String(updateData.sku).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "SKU cannot be empty.",
        });
      }

      updateData.sku = String(updateData.sku)
        .trim()
        .toUpperCase();

      // ----------------------------------------------------
      // CHECK DUPLICATE SKU
      // ----------------------------------------------------

      const duplicateSku =
        await Product.findOne({
          sku: updateData.sku,
          _id: {
            $ne: id,
          },
        }).lean();

      if (duplicateSku) {
        return res.status(409).json({
          success: false,
          message:
            "Another product with this SKU already exists.",
        });
      }
    }

    // ------------------------------------------------------
    // UPDATE PRODUCT
    // ------------------------------------------------------

    const product =
      await Product.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
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

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    // ------------------------------------------------------
    // DUPLICATE KEY
    // ------------------------------------------------------

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this SKU already exists.",
      });
    }

    // ------------------------------------------------------
    // VALIDATION ERROR
    // ------------------------------------------------------

    const validationMessage =
      getValidationMessage(error);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    // ------------------------------------------------------
    // SERVER ERROR
    // ------------------------------------------------------

    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

// ==========================================================
// DELETE PRODUCT
// SOFT DELETE
//
// DELETE /api/products/:id
// ADMIN
// ==========================================================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------------------
    // VALIDATE ID
    // ------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ------------------------------------------------------
    // SOFT DELETE
    // ------------------------------------------------------

    product.isActive = false;

    await product.save();

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};

// ==========================================================
// RESTORE PRODUCT
//
// PUT /api/products/:id/restore
// ADMIN
// ==========================================================

export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ------------------------------------------------------
    // VALIDATE ID
    // ------------------------------------------------------

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // ------------------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------------------

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // ------------------------------------------------------
    // RESTORE
    // ------------------------------------------------------

    product.isActive = true;

    await product.save();

    // ------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Product restored successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Restore Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to restore product.",
    });
  }
};
