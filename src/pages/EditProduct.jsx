import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/Loading";

import {
  getAdminProductById,
  updateProduct,
} from "../../api/productApi";

import { useToast } from "../../context/ToastContext";

import "./AdminProductForm.css";


/* ==========================================================
   INITIAL FORM DATA
========================================================== */

const initialFormData = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "",
  brand: "",
  image: "",
  images: "",
  features: "",
  stock: "",
  rating: "",
  numReviews: "",
  warranty: "",
  featured: false,
  bestseller: false,
  newArrival: true,
  isActive: true,
};


/* ==========================================================
   EDIT PRODUCT
========================================================== */

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();


  /* ========================================================
     STATE
  ======================================================== */

  const [formData, setFormData] =
    useState(initialFormData);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  /* ========================================================
     LOAD PRODUCT
  ======================================================== */

  useEffect(() => {
    if (!id) {
      showToast(
        "Product ID is missing.",
        "error"
      );

      navigate("/admin/products");

      return;
    }

    fetchProduct();
  }, [id]);


  const fetchProduct = async () => {
    try {
      setLoading(true);

      const result =
        await getAdminProductById(id);


      if (!result?.success || !result?.product) {
        showToast(
          result?.message ||
            "Product not found.",
          "error"
        );

        navigate("/admin/products");

        return;
      }


      const product = result.product;


      /* ----------------------------------------------------
         CONVERT ARRAYS TO TEXT FOR TEXTAREAS
      ---------------------------------------------------- */

      setFormData({
        name: product.name || "",

        description:
          product.description || "",

        price:
          product.price ?? "",

        oldPrice:
          product.oldPrice ?? "",

        discount:
          product.discount ?? "",

        category:
          product.category || "",

        brand:
          product.brand || "",

        image:
          product.image || "",

        images:
          Array.isArray(product.images)
            ? product.images.join("\n")
            : "",

        features:
          Array.isArray(product.features)
            ? product.features.join("\n")
            : "",

        stock:
          product.stock ?? "",

        rating:
          product.rating ?? "",

        numReviews:
          product.numReviews ?? "",

        warranty:
          product.warranty || "",

        featured:
          Boolean(product.featured),

        bestseller:
          Boolean(product.bestseller),

        newArrival:
          Boolean(product.newArrival),

        isActive:
          product.isActive !== false,
      });


    } catch (error) {
      console.error(
        "Load Product Error:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load product.",
        "error"
      );

      navigate("/admin/products");


    } finally {
      setLoading(false);
    }
  };


  /* ========================================================
     INPUT CHANGE
  ======================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  /* ========================================================
     VALIDATE FORM
  ======================================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast(
        "Product name is required.",
        "error"
      );

      return false;
    }


    if (!formData.description.trim()) {
      showToast(
        "Product description is required.",
        "error"
      );

      return false;
    }


    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      showToast(
        "Please enter a valid price.",
        "error"
      );

      return false;
    }


    if (!formData.category.trim()) {
      showToast(
        "Product category is required.",
        "error"
      );

      return false;
    }


    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      showToast(
        "Please enter a valid stock quantity.",
        "error"
      );

      return false;
    }


    if (
      formData.discount !== "" &&
      (
        Number(formData.discount) < 0 ||
        Number(formData.discount) > 100
      )
    ) {
      showToast(
        "Discount must be between 0 and 100.",
        "error"
      );

      return false;
    }


    if (
      formData.rating !== "" &&
      (
        Number(formData.rating) < 0 ||
        Number(formData.rating) > 5
      )
    ) {
      showToast(
        "Rating must be between 0 and 5.",
        "error"
      );

      return false;
    }


    return true;
  };


  /* ========================================================
     UPDATE PRODUCT
  ======================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();


    if (!validateForm()) {
      return;
    }


    try {
      setSaving(true);


      /* ----------------------------------------------------
         CONVERT MULTI-LINE VALUES TO ARRAYS
      ---------------------------------------------------- */

      const images = formData.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);


      const features = formData.features
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);


      /* ----------------------------------------------------
         BUILD UPDATE DATA
      ---------------------------------------------------- */

      const productData = {
        name:
          formData.name.trim(),

        description:
          formData.description.trim(),

        price:
          Number(formData.price),

        oldPrice:
          formData.oldPrice === ""
            ? 0
            : Number(formData.oldPrice),

        discount:
          formData.discount === ""
            ? 0
            : Number(formData.discount),

        category:
          formData.category.trim(),

        brand:
          formData.brand.trim(),

        image:
          formData.image.trim(),

        images,

        features,

        stock:
          Number(formData.stock),

        rating:
          formData.rating === ""
            ? 0
            : Number(formData.rating),

        numReviews:
          formData.numReviews === ""
            ? 0
            : Number(formData.numReviews),

        warranty:
          formData.warranty.trim(),

        featured:
          Boolean(formData.featured),

        bestseller:
          Boolean(formData.bestseller),

        newArrival:
          Boolean(formData.newArrival),

        isActive:
          Boolean(formData.isActive),
      };


      console.log(
        "Updating product:",
        productData
      );


      /* ----------------------------------------------------
         API REQUEST
      ---------------------------------------------------- */

      const result =
        await updateProduct(
          id,
          productData
        );


      if (result?.success) {
        showToast(
          "Product updated successfully.",
          "success"
        );


        navigate(
          "/admin/products"
        );

        return;
      }


      showToast(
        result?.message ||
          "Failed to update product.",
        "error"
      );


    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );


      showToast(
        error.response?.data?.message ||
          "Failed to update product.",
        "error"
      );


    } finally {
      setSaving(false);
    }
  };


  /* ========================================================
     CANCEL
  ======================================================== */

  const handleCancel = () => {
    navigate("/admin/products");
  };


  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return <Loading />;
  }


  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <section className="admin-form-page">

      <div className="container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="admin-form-header">

          <div>
            <h1>
              ✏️ Edit Product
            </h1>

            <p>
              Update product information,
              pricing and inventory.
            </p>
          </div>


          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            ← Back to Products
          </button>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="product-form"
        >

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="form-section">

            <h2>
              Basic Information
            </h2>


            <div className="form-grid">

              <div className="form-group full-width">

                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="brand">
                  Brand
                </label>

                <input
                  id="brand"
                  type="text"
                  name="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group full-width">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Product description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              PRICING
          ================================================== */}

          <div className="form-section">

            <h2>
              Pricing
            </h2>


            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="oldPrice">
                  Old Price
                </label>

                <input
                  id="oldPrice"
                  type="number"
                  name="oldPrice"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label htmlFor="discount">
                  Discount (%)
                </label>

                <input
                  id="discount"
                  type="number"
                  name="discount"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.discount}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              INVENTORY
          ================================================== */}

          <div className="form-section">

            <h2>
              Inventory
            </h2>


            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="stock">
                  Stock Quantity
                </label>

                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

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

              </div>

            </div>

          </div>


          {/* ==================================================
              IMAGES
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Images
            </h2>


            <div className="form-group">

              <label htmlFor="image">
                Main Image URL
              </label>

              <input
                id="image"
                type="text"
                name="image"
                placeholder="https://example.com/product.jpg"
                value={formData.image}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label htmlFor="images">
                Gallery Images
              </label>

              <textarea
                id="images"
                name="images"
                placeholder={
                  "Enter one image URL per line"
                }
                value={formData.images}
                onChange={handleChange}
                rows="5"
              />

              <small>
                Enter one image URL per line.
              </small>

            </div>

          </div>


          {/* ==================================================
              FEATURES
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Features
            </h2>


            <div className="form-group">

              <label htmlFor="features">
                Features
              </label>

              <textarea
                id="features"
                name="features"
                placeholder={
                  "Enter one feature per line"
                }
                value={formData.features}
                onChange={handleChange}
                rows="6"
              />

              <small>
                Enter one feature per line.
              </small>

            </div>

          </div>


          {/* ==================================================
              REVIEWS
          ================================================== */}

          <div className="form-section">

            <h2>
              Reviews & Rating
            </h2>


            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="rating">
                  Rating
                </label>

                <input
                  id="rating"
                  type="number"
                  name="rating"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label htmlFor="numReviews">
                  Number of Reviews
                </label>

                <input
                  id="numReviews"
                  type="number"
                  name="numReviews"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={formData.numReviews}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              PRODUCT STATUS
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Status
            </h2>


            <div className="checkbox-grid">

              <label className="checkbox-item">

                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />

                <span>
                  Featured Product
                </span>

              </label>


              <label className="checkbox-item">

                <input
                  type="checkbox"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleChange}
                />

                <span>
                  Bestseller
                </span>

              </label>


              <label className="checkbox-item">

                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                />

                <span>
                  New Arrival
                </span>

              </label>


              <label className="checkbox-item">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />

                <span>
                  Active Product
                </span>

              </label>

            </div>

          </div>


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>

      </div>

    </section>
  );
}


export default EditProduct;