import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";

import "./CreateProduct.css";

function CreateProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "Laptops",
    price: "",
    oldPrice: "",
    stock: "",
    description: "",
    warranty: "No warranty",
    featured: false,
    bestseller: false,
    newArrival: false,
  });

  const [imageFile, setImageFile] = useState(null);

  /* ==========================================================
     HANDLE TEXT / CHECKBOX CHANGES
  ========================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ==========================================================
     HANDLE IMAGE SELECTION
  ========================================================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    /* --------------------------------------------------------
       CHECK FILE TYPE
    -------------------------------------------------------- */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast(
        "Only JPG, PNG, and WEBP images are allowed.",
        "error"
      );

      e.target.value = "";
      setImageFile(null);
      setImagePreview("");

      return;
    }

    /* --------------------------------------------------------
       CHECK FILE SIZE
       Backend limit = 5 MB
    -------------------------------------------------------- */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      showToast(
        "Image must be smaller than 5 MB.",
        "error"
      );

      e.target.value = "";
      setImageFile(null);
      setImagePreview("");

      return;
    }

    /* --------------------------------------------------------
       SAVE FILE
    -------------------------------------------------------- */

    setImageFile(file);

    /* --------------------------------------------------------
       CREATE PREVIEW
    -------------------------------------------------------- */

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /* ==========================================================
     REMOVE SELECTED IMAGE
  ========================================================== */

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");

    const imageInput =
      document.getElementById("product-image");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  /* ==========================================================
     FORM SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* --------------------------------------------------------
       VALIDATION
    -------------------------------------------------------- */

    if (!formData.name.trim()) {
      showToast(
        "Product name is required.",
        "error"
      );
      return;
    }

    if (!formData.sku.trim()) {
      showToast(
        "SKU is required.",
        "error"
      );
      return;
    }

    if (!formData.category.trim()) {
      showToast(
        "Category is required.",
        "error"
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      showToast(
        "Please enter a valid price.",
        "error"
      );
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      showToast(
        "Please enter a valid stock quantity.",
        "error"
      );
      return;
    }

    if (!formData.description.trim()) {
      showToast(
        "Product description is required.",
        "error"
      );
      return;
    }

    /* --------------------------------------------------------
       IMAGE REQUIRED
    -------------------------------------------------------- */

    if (!imageFile) {
      showToast(
        "Please select a product image.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      /* ======================================================
         CREATE FORMDATA
      ====================================================== */

      const productData = new FormData();

      productData.append(
        "name",
        formData.name.trim()
      );

      productData.append(
        "sku",
        formData.sku.trim().toUpperCase()
      );

      productData.append(
        "brand",
        formData.brand.trim()
      );

      productData.append(
        "category",
        formData.category.trim()
      );

      productData.append(
        "price",
        Number(formData.price)
      );

      productData.append(
        "oldPrice",
        formData.oldPrice
          ? Number(formData.oldPrice)
          : 0
      );

      productData.append(
        "stock",
        Number(formData.stock)
      );

      productData.append(
        "description",
        formData.description.trim()
      );

      productData.append(
        "warranty",
        formData.warranty.trim()
      );

      productData.append(
        "featured",
        formData.featured
      );

      productData.append(
        "bestseller",
        formData.bestseller
      );

      productData.append(
        "newArrival",
        formData.newArrival
      );

      /* ------------------------------------------------------
         IMAGE FILE

         IMPORTANT:
         This name MUST match:

         upload.single("image")
      ------------------------------------------------------ */

      productData.append(
        "image",
        imageFile
      );

      console.log(
        "Creating product with image:",
        imageFile.name
      );

      /* ======================================================
         SEND TO API
      ====================================================== */

      const result =
        await createProduct(productData);

      console.log(
        "Create product response:",
        result
      );

      /* ======================================================
         SUCCESS
      ====================================================== */

      if (result.success) {
        showToast(
          "Product created successfully.",
          "success"
        );

        navigate("/admin/products");

        return;
      }

      /* ======================================================
         API ERROR
      ====================================================== */

      showToast(
        result.message ||
          "Failed to create product.",
        "error"
      );
    } catch (error) {
      console.error(
        "Create Product Error:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="admin-form-page">
      <div className="container">

        {/* ====================================================
           PAGE HEADER
        ==================================================== */}

        <div className="page-header">
          <h1>➕ Create Product</h1>

          <p>
            Add a new product to your TechStore Pro store.
          </p>
        </div>

        {/* ====================================================
           PRODUCT FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="product-form"
        >

          {/* ==================================================
             PRODUCT NAME
          ================================================== */}

          <label htmlFor="name">
            Product Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g. MacBook Pro M4"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* ==================================================
             SKU
          ================================================== */}

          <label htmlFor="sku">
            SKU
          </label>

          <input
            id="sku"
            type="text"
            name="sku"
            placeholder="e.g. APP-MBP-M4-16"
            value={formData.sku}
            onChange={handleChange}
            required
          />

          {/* ==================================================
             BRAND
          ================================================== */}

          <label htmlFor="brand">
            Brand
          </label>

          <input
            id="brand"
            type="text"
            name="brand"
            placeholder="e.g. Apple"
            value={formData.brand}
            onChange={handleChange}
          />

          {/* ==================================================
             CATEGORY
          ================================================== */}

          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Laptops">
              Laptops
            </option>

            <option value="Smartphones">
              Smartphones
            </option>

            <option value="Audio">
              Audio
            </option>

            <option value="Wearables">
              Wearables
            </option>

            <option value="Accessories">
              Accessories
            </option>

            <option value="Gaming">
              Gaming
            </option>
          </select>

          {/* ==================================================
             PRICE
          ================================================== */}

          <label htmlFor="price">
            Price
          </label>

          <input
            id="price"
            type="number"
            name="price"
            placeholder="e.g. 1299"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />

          {/* ==================================================
             OLD PRICE
          ================================================== */}

          <label htmlFor="oldPrice">
            Old Price
          </label>

          <input
            id="oldPrice"
            type="number"
            name="oldPrice"
            placeholder="Optional"
            min="0"
            step="0.01"
            value={formData.oldPrice}
            onChange={handleChange}
          />

          {/* ==================================================
             STOCK
          ================================================== */}

          <label htmlFor="stock">
            Stock Quantity
          </label>

          <input
            id="stock"
            type="number"
            name="stock"
            placeholder="e.g. 25"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          {/* ==================================================
             IMAGE UPLOAD
          ================================================== */}

          <label htmlFor="product-image">
            Product Image
          </label>

          <input
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            required
          />

          <small>
            JPG, PNG or WEBP. Maximum size: 5 MB.
          </small>

          {/* ==================================================
             IMAGE PREVIEW
          ================================================== */}

          {imagePreview && (
            <div className="image-preview">

              <img
                src={imagePreview}
                alt="Product preview"
              />

              <button
                type="button"
                onClick={removeImage}
                className="btn btn-secondary"
              >
                Remove Image
              </button>

            </div>
          )}

          {/* ==================================================
             DESCRIPTION
          ================================================== */}

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            placeholder="Describe the product..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />

          {/* ==================================================
             WARRANTY
          ================================================== */}

          <label htmlFor="warranty">
            Warranty
          </label>

          <input
            id="warranty"
            type="text"
            name="warranty"
            placeholder="e.g. 1 Year Warranty"
            value={formData.warranty}
            onChange={handleChange}
          />

          {/* ==================================================
             FLAGS
          ================================================== */}

          <div className="checkbox-group">

            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />

              Featured
            </label>

            <label>
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
              />

              Bestseller
            </label>

            <label>
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />

              New Arrival
            </label>

          </div>

          {/* ==================================================
             SUBMIT
          ================================================== */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Uploading & Creating..."
              : "Create Product"}
          </button>

        </form>

      </div>
    </section>
  );
}

export default CreateProduct;