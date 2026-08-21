import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
  FiImage,
  FiPackage,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiStar,
  FiEye,
} from "react-icons/fi";

import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../../api/adminApi";

import api from "../../api/axios";

import "./ProductManagement.css";

/* ==========================================================
   DEFAULT PRODUCT
========================================================== */

const EMPTY_PRODUCT = {
  name: "",
  brand: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "Laptops",
  description: "",
  image: "",
  images: [],
  features: [],
  stock: "",
  rating: 0,
  numReviews: 0,
  featured: false,
  bestseller: false,
  newArrival: false,
  isActive: true,
};

/* ==========================================================
   CATEGORIES
========================================================== */

const CATEGORIES = [
  "Laptops",
  "Smartphones",
  "Audio",
  "Wearables",
  "Accessories",
  "Gaming",
];

/* ==========================================================
   HELPERS
========================================================== */

const formatPrice = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₦0";
  }

  return `₦${number.toLocaleString("en-NG")}`;
};

const getProductImage = (product) => {
  if (product?.image) {
    return product.image;
  }

  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {
    return product.images[0];
  }

  if (
    Array.isArray(product?.gallery) &&
    product.gallery.length > 0
  ) {
    return product.gallery[0];
  }

  return "";
};

/* ==========================================================
   COMPONENT
========================================================== */

function ProductManagement() {
  /* --------------------------------------------------------
     STATE
  -------------------------------------------------------- */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [productForm, setProductForm] =
    useState(EMPTY_PRODUCT);

  const [featureInput, setFeatureInput] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const fileInputRef = useRef(null);

  /* ========================================================
     LOAD PRODUCTS
  ======================================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProducts();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load products."
        );
      }

      setProducts(
        Array.isArray(response.products)
          ? response.products
          : []
      );
    } catch (err) {
      console.error(
        "❌ Product Management Load Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     INITIAL LOAD
  ======================================================== */

  useEffect(() => {
    loadProducts();
  }, []);

  /* ========================================================
     CLEAR NOTIFICATIONS
  ======================================================== */

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [success]);

  /* ========================================================
     FILTER PRODUCTS
  ======================================================== */

  const filteredProducts = useMemo(() => {
    const searchTerm =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name
          ?.toLowerCase()
          .includes(searchTerm) ||
        product.brand
          ?.toLowerCase()
          .includes(searchTerm) ||
        product.category
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" &&
          product.isActive !== false) ||
        (statusFilter === "Inactive" &&
          product.isActive === false);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  /* ========================================================
     FORM CHANGE
  ======================================================== */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setProductForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ========================================================
     OPEN CREATE MODAL
  ======================================================== */

  const handleCreate = () => {
    setEditingProduct(null);

    setProductForm({
      ...EMPTY_PRODUCT,
      category: "Laptops",
    });

    setFeatureInput("");

    setImagePreview("");

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* ========================================================
     OPEN EDIT MODAL
  ======================================================== */

  const handleEdit = (product) => {
    setEditingProduct(product);

    const existingImages =
      Array.isArray(product.images)
        ? product.images
        : [];

    setProductForm({
      ...EMPTY_PRODUCT,
      ...product,

      price:
        product.price ?? "",

      oldPrice:
        product.oldPrice ?? "",

      discount:
        product.discount ?? "",

      stock:
        product.stock ?? "",

      rating:
        product.rating ?? 0,

      numReviews:
        product.numReviews ?? 0,

      image:
        product.image ||
        existingImages[0] ||
        "",

      images: existingImages,

      features:
        Array.isArray(product.features)
          ? product.features
          : [],

      featured:
        Boolean(product.featured),

      bestseller:
        Boolean(product.bestseller),

      newArrival:
        Boolean(product.newArrival),

      isActive:
        product.isActive !== false,
    });

    setFeatureInput("");

    setImagePreview(
      product.image ||
        existingImages[0] ||
        ""
    );

    setError("");

    setSuccess("");

    setShowModal(true);
  };

  /* ========================================================
     CLOSE MODAL
  ======================================================== */

  const closeModal = () => {
    if (saving || uploading) {
      return;
    }

    setShowModal(false);

    setEditingProduct(null);

    setProductForm(EMPTY_PRODUCT);

    setFeatureInput("");

    setImagePreview("");

    setError("");
  };

  /* ========================================================
     ADD FEATURE
  ======================================================== */

  const addFeature = () => {
    const feature =
      featureInput.trim();

    if (!feature) {
      return;
    }

    setProductForm((previous) => ({
      ...previous,

      features: [
        ...(Array.isArray(
          previous.features
        )
          ? previous.features
          : []),
        feature,
      ],
    }));

    setFeatureInput("");
  };

  /* ========================================================
     FEATURE KEY PRESS
  ======================================================== */

  const handleFeatureKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addFeature();
    }
  };

  /* ========================================================
     REMOVE FEATURE
  ======================================================== */

  const removeFeature = (index) => {
    setProductForm((previous) => ({
      ...previous,

      features: previous.features.filter(
        (_, featureIndex) =>
          featureIndex !== index
      ),
    }));
  };

  /* ========================================================
     UPLOAD IMAGE
  ======================================================== */

  const handleImageUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /* ------------------------------------------------------
       VALIDATE FILE
    ------------------------------------------------------ */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, PNG, and WEBP images are allowed."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must not exceed 5MB."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploading(true);

      setError("");

      /* ----------------------------------------------------
         LOCAL PREVIEW
      ---------------------------------------------------- */

      const localPreview =
        URL.createObjectURL(file);

      setImagePreview(localPreview);

      /* ----------------------------------------------------
         FORM DATA
      ---------------------------------------------------- */

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      /* ----------------------------------------------------
         UPLOAD TO CLOUDINARY
      ---------------------------------------------------- */

      const response =
        await api.post(
          "/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      if (
        !response.data?.success ||
        !response.data?.image?.url
      ) {
        throw new Error(
          response.data?.message ||
            "Image upload failed."
        );
      }

      const imageUrl =
        response.data.image.url;

      setProductForm(
        (previous) => ({
          ...previous,

          image: imageUrl,

          images: [
            imageUrl,
          ],
        })
      );

      setImagePreview(
        imageUrl
      );

      setSuccess(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "❌ Image Upload Error:",
        err
      );

      setImagePreview("");

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* ========================================================
     REMOVE IMAGE
  ======================================================== */

  const removeImage = () => {
    setProductForm(
      (previous) => ({
        ...previous,

        image: "",

        images: [],
      })
    );

    setImagePreview("");
  };

  /* ========================================================
     VALIDATE FORM
  ======================================================== */

  const validateForm = () => {
    if (
      !productForm.name.trim()
    ) {
      return "Product name is required.";
    }

    if (
      productForm.price === "" ||
      !Number.isFinite(
        Number(productForm.price)
      )
    ) {
      return "A valid product price is required.";
    }

    if (
      !productForm.description.trim()
    ) {
      return "Product description is required.";
    }

    if (
      !productForm.category
    ) {
      return "Product category is required.";
    }

    if (
      productForm.stock !== "" &&
      Number(productForm.stock) < 0
    ) {
      return "Stock cannot be negative.";
    }

    if (
      productForm.discount !== "" &&
      Number(productForm.discount) < 0
    ) {
      return "Discount cannot be negative.";
    }

    if (
      productForm.discount !== "" &&
      Number(productForm.discount) > 100
    ) {
      return "Discount cannot exceed 100%.";
    }

    if (
      productForm.rating !== "" &&
      (Number(productForm.rating) < 0 ||
        Number(productForm.rating) > 5)
    ) {
      return "Rating must be between 0 and 5.";
    }

    return null;
  };

  /* ========================================================
     PREPARE PAYLOAD
  ======================================================== */

  const preparePayload = () => {
    const payload = {
      name:
        productForm.name.trim(),

      brand:
        productForm.brand?.trim() ||
        "",

      price:
        Number(productForm.price),

      oldPrice:
        productForm.oldPrice === ""
          ? undefined
          : Number(
              productForm.oldPrice
            ),

      discount:
        productForm.discount === ""
          ? 0
          : Number(
              productForm.discount
            ),

      category:
        productForm.category,

      description:
        productForm.description.trim(),

      image:
        productForm.image || "",

      images:
        Array.isArray(
          productForm.images
        )
          ? productForm.images
          : [],

      features:
        Array.isArray(
          productForm.features
        )
          ? productForm.features
          : [],

      stock:
        productForm.stock === ""
          ? 0
          : Number(
              productForm.stock
            ),

      rating:
        productForm.rating === ""
          ? 0
          : Number(
              productForm.rating
            ),

      numReviews:
        productForm.numReviews === ""
          ? 0
          : Number(
              productForm.numReviews
            ),

      featured:
        Boolean(
          productForm.featured
        ),

      bestseller:
        Boolean(
          productForm.bestseller
        ),

      newArrival:
        Boolean(
          productForm.newArrival
        ),

      isActive:
        Boolean(
          productForm.isActive
        ),
    };

    /* ------------------------------------------------------
       Remove undefined values
    ------------------------------------------------------ */

    Object.keys(payload).forEach(
      (key) => {
        if (
          payload[key] ===
          undefined
        ) {
          delete payload[key];
        }
      }
    );

    return payload;
  };

  /* ========================================================
     SAVE PRODUCT
  ======================================================== */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setSaving(true);

      const payload =
        preparePayload();

      let response;

      /* ----------------------------------------------------
         UPDATE
      ---------------------------------------------------- */

      if (editingProduct) {
        response =
          await updateAdminProduct(
            editingProduct._id,
            payload
          );
      }

      /* ----------------------------------------------------
         CREATE
      ---------------------------------------------------- */

      else {
        response =
          await createAdminProduct(
            payload
          );
      }

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save product."
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );

      setShowModal(false);

      setEditingProduct(null);

      setProductForm(
        EMPTY_PRODUCT
      );

      setFeatureInput("");

      setImagePreview("");

      await loadProducts();
    } catch (err) {
      console.error(
        "❌ Save Product Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ========================================================
     DELETE PRODUCT
  ======================================================== */

  const handleDelete = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        product._id
      );

      setError("");

      setSuccess("");

      const response =
        await deleteAdminProduct(
          product._id
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to delete product."
        );
      }

      setProducts(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              product._id
          )
      );

      setSuccess(
        "Product deleted successfully."
      );
    } catch (err) {
      console.error(
        "❌ Delete Product Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="product-management">
      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="product-management-header">
        <div>
          <h1>
            Product Management
          </h1>

          <p>
            Create, edit, manage and
            monitor your store products.
          </p>
        </div>

        <div className="product-header-actions">
          <button
            type="button"
            className="product-refresh-btn"
            onClick={loadProducts}
            disabled={loading}
          >
            <FiRefreshCw
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="product-add-btn"
            onClick={handleCreate}
          >
            <FiPlus />

            Add Product
          </button>
        </div>
      </div>

      {/* ====================================================
          NOTIFICATIONS
      ==================================================== */}

      {success && (
        <div className="product-alert success">
          <FiCheckCircle />

          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {error && !showModal && (
        <div className="product-alert error">
          <FiAlertCircle />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <FiX />
          </button>
        </div>
      )}

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <div className="product-summary-grid">
        <div className="product-summary-card">
          <div className="summary-icon">
            <FiPackage />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="summary-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>
              Active Products
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.isActive !==
                    false
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="summary-icon">
            <FiAlertCircle />
          </div>

          <div>
            <span>
              Out of Stock
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    Number(
                      product.stock
                    ) <= 0
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="product-summary-card">
          <div className="summary-icon">
            <FiStar />
          </div>

          <div>
            <span>
              Featured
            </span>

            <strong>
              {
                products.filter(
                  (product) =>
                    product.featured
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <div className="product-filters">
        <div className="product-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              <FiX />
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Categories
          </option>

          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>
      </div>

      {/* ====================================================
          PRODUCT TABLE
      ==================================================== */}

      <div className="products-table-container">
        {loading ? (
          <div className="product-loading">
            <FiRefreshCw className="spin" />

            <p>
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="product-empty">
            <FiPackage />

            <h3>
              No products found
            </h3>

            <p>
              Try changing your
              search or filters, or
              create a new product.
            </p>

            <button
              type="button"
              onClick={handleCreate}
            >
              <FiPlus />

              Add Product
            </button>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(
                  (product) => {
                    const image =
                      getProductImage(
                        product
                      );

                    const stock =
                      Number(
                        product.stock
                      );

                    return (
                      <tr
                        key={
                          product._id
                        }
                      >
                        {/* PRODUCT */}
                        <td>
                          <div className="product-table-info">
                            <div className="product-table-image">
                              {image ? (
                                <img
                                  src={
                                    image
                                  }
                                  alt={
                                    product.name
                                  }
                                />
                              ) : (
                                <FiImage />
                              )}
                            </div>

                            <div>
                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              {product.brand && (
                                <span>
                                  {
                                    product.brand
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td>
                          <span className="category-badge">
                            {
                              product.category ||
                              "Uncategorized"
                            }
                          </span>
                        </td>

                        {/* PRICE */}
                        <td>
                          <div className="price-cell">
                            <strong>
                              {formatPrice(
                                product.price
                              )}
                            </strong>

                            {product.oldPrice && (
                              <del>
                                {formatPrice(
                                  product.oldPrice
                                )}
                              </del>
                            )}
                          </div>
                        </td>

                        {/* STOCK */}
                        <td>
                          <span
                            className={`stock-badge ${
                              stock <= 0
                                ? "out"
                                : stock <=
                                    5
                                  ? "low"
                                  : "good"
                            }`}
                          >
                            {stock <=
                            0
                              ? "Out of stock"
                              : stock}
                          </span>
                        </td>

                        {/* RATING */}
                        <td>
                          <div className="rating-cell">
                            <FiStar />

                            <span>
                              {Number(
                                product.rating ||
                                  0
                              ).toFixed(
                                1
                              )}
                            </span>

                            <small>
                              (
                              {product.numReviews ||
                                0}
                              )
                            </small>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`status-badge ${
                              product.isActive !==
                              false
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {product.isActive !==
                            false
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="product-actions">
                            <button
                              type="button"
                              className="view-btn"
                              title="View / Edit"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              <FiEye />
                            </button>

                            <button
                              type="button"
                              className="edit-btn"
                              title="Edit product"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              title="Delete product"
                              disabled={
                                deletingId ===
                                product._id
                              }
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                            >
                              {deletingId ===
                              product._id ? (
                                <FiRefreshCw className="spin" />
                              ) : (
                                <FiTrash2 />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================================================
          MODAL
      ==================================================== */}

      {showModal && (
        <div
          className="product-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="product-modal">
            {/* MODAL HEADER */}

            <div className="product-modal-header">
              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information."
                    : "Add a new product to your store."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeModal
                }
                disabled={
                  saving ||
                  uploading
                }
              >
                <FiX />
              </button>
            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="modal-error">
                <FiAlertCircle />

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* FORM */}

            <form
              className="product-form"
              onSubmit={
                handleSubmit
              }
            >
              <div className="product-form-grid">
                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="form-section">
                  <div className="form-section-title">
                    <h3>
                      Basic Information
                    </h3>

                    <span>
                      Product details
                    </span>
                  </div>

                  {/* NAME */}

                  <div className="form-group">
                    <label>
                      Product Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        productForm.name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. MacBook Pro M4"
                      required
                    />
                  </div>

                  {/* BRAND */}

                  <div className="form-group">
                    <label>
                      Brand
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={
                        productForm.brand
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Apple"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div className="form-group">
                    <label>
                      Category *
                    </label>

                    <select
                      name="category"
                      value={
                        productForm.category
                      }
                      onChange={
                        handleChange
                      }
                      required
                    >
                      {CATEGORIES.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category
                            }
                            value={
                              category
                            }
                          >
                            {
                              category
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="form-group">
                    <label>
                      Description *
                    </label>

                    <textarea
                      name="description"
                      value={
                        productForm.description
                      }
                      onChange={
                        handleChange
                      }
                      rows="5"
                      placeholder="Enter a detailed product description..."
                      required
                    />
                  </div>
                </div>

                {/* =================================================
                    PRICING & STOCK
                ================================================= */}

                <div className="form-section">
                  <div className="form-section-title">
                    <h3>
                      Pricing & Stock
                    </h3>

                    <span>
                      Inventory information
                    </span>
                  </div>

                  <div className="two-column">
                    {/* PRICE */}

                    <div className="form-group">
                      <label>
                        Price (₦) *
                      </label>

                      <input
                        type="number"
                        name="price"
                        value={
                          productForm.price
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="0.01"
                        placeholder="150000"
                        required
                      />
                    </div>

                    {/* OLD PRICE */}

                    <div className="form-group">
                      <label>
                        Old Price (₦)
                      </label>

                      <input
                        type="number"
                        name="oldPrice"
                        value={
                          productForm.oldPrice
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="0.01"
                        placeholder="180000"
                      />
                    </div>
                  </div>

                  <div className="two-column">
                    {/* DISCOUNT */}

                    <div className="form-group">
                      <label>
                        Discount (%)
                      </label>

                      <input
                        type="number"
                        name="discount"
                        value={
                          productForm.discount
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        max="100"
                        step="1"
                        placeholder="10"
                      />
                    </div>

                    {/* STOCK */}

                    <div className="form-group">
                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        name="stock"
                        value={
                          productForm.stock
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="1"
                        placeholder="25"
                      />
                    </div>
                  </div>

                  <div className="two-column">
                    {/* RATING */}

                    <div className="form-group">
                      <label>
                        Rating
                      </label>

                      <input
                        type="number"
                        name="rating"
                        value={
                          productForm.rating
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="4.5"
                      />
                    </div>

                    {/* REVIEWS */}

                    <div className="form-group">
                      <label>
                        Number of Reviews
                      </label>

                      <input
                        type="number"
                        name="numReviews"
                        value={
                          productForm.numReviews
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        step="1"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="form-section image-section">
                  <div className="form-section-title">
                    <h3>
                      Product Image
                    </h3>

                    <span>
                      JPG, PNG or WEBP ·
                      Max 5MB
                    </span>
                  </div>

                  <div className="image-upload-area">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img
                          src={
                            imagePreview
                          }
                          alt="Product preview"
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={
                            removeImage
                          }
                          disabled={
                            uploading
                          }
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className="image-placeholder">
                        <FiImage />

                        <span>
                          No image selected
                        </span>
                      </div>
                    )}

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageUpload
                      }
                      hidden
                    />

                    <button
                      type="button"
                      className="upload-image-btn"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        uploading
                      }
                    >
                      {uploading ? (
                        <>
                          <FiRefreshCw className="spin" />

                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload />

                          {imagePreview
                            ? "Change Image"
                            : "Upload Image"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* IMAGE URL FALLBACK */}

                  <div className="form-group image-url-group">
                    <label>
                      Or enter image URL
                    </label>

                    <input
                      type="url"
                      name="image"
                      value={
                        productForm.image
                      }
                      onChange={(event) => {
                        handleChange(
                          event
                        );

                        setImagePreview(
                          event
                            .target
                            .value
                        );
                      }}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* =================================================
                    FEATURES
                ================================================= */}

                <div className="form-section">
                  <div className="form-section-title">
                    <h3>
                      Product Features
                    </h3>

                    <span>
                      Add key features
                    </span>
                  </div>

                  <div className="feature-input">
                    <input
                      type="text"
                      value={
                        featureInput
                      }
                      onChange={(event) =>
                        setFeatureInput(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleFeatureKeyDown
                      }
                      placeholder="e.g. 16GB RAM"
                    />

                    <button
                      type="button"
                      onClick={
                        addFeature
                      }
                    >
                      <FiPlus />

                      Add
                    </button>
                  </div>

                  {productForm.features
                    ?.length >
                    0 && (
                    <div className="features-list">
                      {productForm.features.map(
                        (
                          feature,
                          index
                        ) => (
                          <div
                            className="feature-tag"
                            key={`${feature}-${index}`}
                          >
                            <span>
                              {
                                feature
                              }
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeFeature(
                                  index
                                )
                              }
                            >
                              <FiX />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    PRODUCT OPTIONS
                ================================================= */}

                <div className="form-section">
                  <div className="form-section-title">
                    <h3>
                      Product Options
                    </h3>

                    <span>
                      Store visibility
                    </span>
                  </div>

                  <div className="checkbox-grid">
                    <label className="checkbox-card">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={
                          Boolean(
                            productForm.featured
                          )
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        <strong>
                          Featured
                        </strong>

                        <small>
                          Show in featured products
                        </small>
                      </span>
                    </label>

                    <label className="checkbox-card">
                      <input
                        type="checkbox"
                        name="bestseller"
                        checked={
                          Boolean(
                            productForm.bestseller
                          )
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        <strong>
                          Bestseller
                        </strong>

                        <small>
                          Mark as bestseller
                        </small>
                      </span>
                    </label>

                    <label className="checkbox-card">
                      <input
                        type="checkbox"
                        name="newArrival"
                        checked={
                          Boolean(
                            productForm.newArrival
                          )
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        <strong>
                          New Arrival
                        </strong>

                        <small>
                          Mark as new arrival
                        </small>
                      </span>
                    </label>

                    <label className="checkbox-card">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={
                          Boolean(
                            productForm.isActive
                          )
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        <strong>
                          Active
                        </strong>

                        <small>
                          Visible in store
                        </small>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORM ACTIONS
              ================================================= */}

              <div className="product-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving ||
                    uploading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={
                    saving ||
                    uploading
                  }
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="spin" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />

                      {editingProduct
                        ? "Update Product"
                        : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;