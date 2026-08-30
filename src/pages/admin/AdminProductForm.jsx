import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { uploadImage } from "../../api/uploadApi";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../api/adminProductApi";

import "./AdminProductForm.css";

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
  "Tablets",
];

/* ==========================================================
   EMPTY FORM
========================================================== */

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "Laptops",
  price: "",
  stock: "",
  description: "",
  image: "",
  featured: false,
  bestseller: false,
  newArrival: false,
};

/* ==========================================================
   COMPONENT
========================================================== */

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  /* ========================================================
     LOAD PRODUCT
  ======================================================== */

  useEffect(() => {
    if (!isEditing) {
      setForm(EMPTY_FORM);
      return;
    }

    fetchProduct();
  }, [id, isEditing]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProduct(id);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to load product."
        );
      }

      const product = response.product;

      setForm({
        name: product?.name || "",
        brand: product?.brand || "",
        category: CATEGORIES.includes(product?.category)
          ? product.category
          : "Laptops",
        price: product?.price ?? "",
        stock: product?.stock ?? "",
        description: product?.description || "",
        image: product?.image || "",
        featured: Boolean(product?.featured),
        bestseller: Boolean(product?.bestseller),
        newArrival: Boolean(product?.newArrival),
      });
    } catch (error) {
      console.error("Product Load Error:", error);

      toast.error(
        error.message || "Failed to load product."
      );

      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     HANDLE CHANGE
  ======================================================== */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ========================================================
     IMAGE UPLOAD
  ======================================================== */

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, PNG, and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must not exceed 5MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const response = await uploadImage(file);

      if (
        !response?.success ||
        !response?.image?.url
      ) {
        throw new Error(
          response?.message ||
            "Image upload failed."
        );
      }

      setForm((previous) => ({
        ...previous,
        image: response.image.url,
      }));

      toast.success(
        "Image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Image Upload Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  /* ========================================================
     VALIDATE FORM
  ======================================================== */

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      return "Please enter a valid product price.";
    }

    if (
      form.stock !== "" &&
      (!Number.isFinite(Number(form.stock)) ||
        Number(form.stock) < 0)
    ) {
      return "Stock cannot be negative.";
    }

    if (!form.category) {
      return "Product category is required.";
    }

    if (!form.description.trim()) {
      return "Product description is required.";
    }

    return null;
  };

  /* ========================================================
     SUBMIT
  ======================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        price: Number(form.price),
        stock:
          form.stock === ""
            ? 0
            : Number(form.stock),
        description: form.description.trim(),
        image: form.image || "",
        featured: Boolean(form.featured),
        bestseller: Boolean(form.bestseller),
        newArrival: Boolean(form.newArrival),
      };

      let response;

      if (isEditing) {
        response = await updateProduct(id, payload);
      } else {
        response = await createProduct(payload);
      }

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save product."
        );
      }

      toast.success(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully."
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Save Product Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading && isEditing && !form.name) {
    return (
      <div className="admin-product-form">
        <div className="form-loading">
          Loading product...
        </div>
      </div>
    );
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="admin-product-form">
      <div className="admin-product-form-header">
        <div>
          <h1>
            {isEditing
              ? "Edit Product"
              : "Create Product"}
          </h1>

          <p>
            {isEditing
              ? "Update product information."
              : "Add a new product to your store."}
          </p>
        </div>
      </div>

      <form
        className="admin-product-form-content"
        onSubmit={handleSubmit}
      >
        {/* ==================================================
            BASIC INFORMATION
        ================================================== */}

        <section className="form-card">
          <div className="form-card-header">
            <h2>Basic Information</h2>

            <p>
              Enter the main product details.
            </p>
          </div>

          <div className="form-grid">
            {/* NAME */}

            <div className="form-group">
              <label htmlFor="name">
                Product Name *
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. MacBook Pro M4"
                required
              />
            </div>

            {/* BRAND */}

            <div className="form-group">
              <label htmlFor="brand">
                Brand
              </label>

              <input
                id="brand"
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Apple"
              />
            </div>

            {/* CATEGORY */}

            <div className="form-group">
              <label htmlFor="category">
                Category *
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label htmlFor="price">
                Price (USD) *
              </label>

              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="1500"
                required
              />
            </div>

            {/* STOCK */}

            <div className="form-group">
              <label htmlFor="stock">
                Stock
              </label>

              <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="25"
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              placeholder="Enter a detailed product description..."
              required
            />
          </div>
        </section>

        {/* ==================================================
            PRODUCT IMAGE
        ================================================== */}

        <section className="form-card">
          <div className="form-card-header">
            <h2>Product Image</h2>

            <p>
              Upload a product image to Cloudinary.
            </p>
          </div>

          <div className="image-upload-container">
            {form.image ? (
              <div className="image-preview">
                <img
                  src={form.image}
                  alt={
                    form.name ||
                    "Product preview"
                  }
                />
              </div>
            ) : (
              <div className="image-empty">
                No image selected
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              hidden
            />

            <button
              type="button"
              className="upload-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : form.image
                  ? "Change Image"
                  : "Upload Image"}
            </button>
          </div>

          {/* IMAGE URL */}

          <div className="form-group">
            <label htmlFor="image">
              Or enter image URL
            </label>

            <input
              id="image"
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </section>

        {/* ==================================================
            PRODUCT OPTIONS
        ================================================== */}

        <section className="form-card">
          <div className="form-card-header">
            <h2>Product Options</h2>

            <p>
              Configure how this product appears
              in the store.
            </p>
          </div>

          <div className="checkbox-grid">
            {/* FEATURED */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="featured"
                checked={Boolean(
                  form.featured
                )}
                onChange={handleChange}
              />

              <span>
                <strong>Featured</strong>

                <small>
                  Show in featured products
                </small>
              </span>
            </label>

            {/* BESTSELLER */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="bestseller"
                checked={Boolean(
                  form.bestseller
                )}
                onChange={handleChange}
              />

              <span>
                <strong>Bestseller</strong>

                <small>
                  Mark as bestseller
                </small>
              </span>
            </label>

            {/* NEW ARRIVAL */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="newArrival"
                checked={Boolean(
                  form.newArrival
                )}
                onChange={handleChange}
              />

              <span>
                <strong>New Arrival</strong>

                <small>
                  Mark as new arrival
                </small>
              </span>
            </label>
          </div>
        </section>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate("/admin/products")
            }
            disabled={
              loading || uploading
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={
              loading || uploading
            }
          >
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;