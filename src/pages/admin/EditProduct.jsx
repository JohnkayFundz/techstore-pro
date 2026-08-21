import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Loading from "../../components/Loading";

import {
  getProductById,
  updateProduct,
} from "../../api/productApi";

import {
  useToast,
} from "../../context/ToastContext";


/* ==========================================================
   EDIT PRODUCT
========================================================== */

function EditProduct() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();


  /* ==========================================================
     FORM STATE
  ========================================================== */

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    brand: "",
    image: "",
    stock: "",
    rating: "",
    numReviews: "",
    warranty: "",
    featured: false,
    bestseller: false,
    newArrival: false,
    isActive: true,
  });


  /* ==========================================================
     UI STATE
  ========================================================== */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  /* ==========================================================
     LOAD PRODUCT
  ========================================================== */

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);


  const fetchProduct = async () => {
    try {
      setLoading(true);

      const result = await getProductById(id);

      console.log("Edit Product Response:", result);


      if (result?.success && result?.product) {
        const product = result.product;

        setFormData({
          name: product.name || "",

          description: product.description || "",

          price:
            product.price !== undefined &&
            product.price !== null
              ? product.price
              : "",

          oldPrice:
            product.oldPrice !== undefined &&
            product.oldPrice !== null
              ? product.oldPrice
              : "",

          discount:
            product.discount !== undefined &&
            product.discount !== null
              ? product.discount
              : "",

          category: product.category || "",

          brand: product.brand || "",

          image: product.image || "",

          stock:
            product.stock !== undefined &&
            product.stock !== null
              ? product.stock
              : "",

          rating:
            product.rating !== undefined &&
            product.rating !== null
              ? product.rating
              : "",

          numReviews:
            product.numReviews !== undefined &&
            product.numReviews !== null
              ? product.numReviews
              : "",

          warranty: product.warranty || "",

          featured: Boolean(product.featured),

          bestseller: Boolean(product.bestseller),

          newArrival: Boolean(product.newArrival),

          isActive:
            product.isActive !== undefined
              ? Boolean(product.isActive)
              : true,
        });
      } else {
        showToast(
          result?.message || "Product not found.",
          "error"
        );

        navigate("/admin/products");
      }
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


  /* ==========================================================
     HANDLE INPUT CHANGE
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
     HANDLE SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();


    /* --------------------------------------------------------
       BASIC VALIDATION
    -------------------------------------------------------- */

    if (!formData.name.trim()) {
      showToast(
        "Product name is required.",
        "error"
      );

      return;
    }


    if (!formData.category.trim()) {
      showToast(
        "Product category is required.",
        "error"
      );

      return;
    }


    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      showToast(
        "Please enter a valid product price.",
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


    try {
      setSaving(true);


      /* ------------------------------------------------------
         PREPARE PRODUCT DATA
      ------------------------------------------------------ */

      const productData = {
        name: formData.name.trim(),

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
          formData.brand.trim() ||
          "TechStore Pro",

        image:
          formData.image.trim(),

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
          formData.warranty.trim() ||
          "No warranty",

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
        "Updating Product:",
        productData
      );


      /* ------------------------------------------------------
         API REQUEST
      ------------------------------------------------------ */

      const result = await updateProduct(
        id,
        productData
      );


      console.log(
        "Update Product Response:",
        result
      );


      /* ------------------------------------------------------
         SUCCESS
      ------------------------------------------------------ */

      if (result?.success) {
        showToast(
          "Product updated successfully.",
          "success"
        );

        navigate("/admin/products");
      }


      /* ------------------------------------------------------
         API ERROR
      ------------------------------------------------------ */

      else {
        showToast(
          result?.message ||
            "Failed to update product.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );

      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return <Loading />;
  }


  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <section className="admin-form-page">

      <div className="container">

        {/* ----------------------------------------------------
            HEADER
        ---------------------------------------------------- */}

        <div className="admin-form-header">

          <div>
            <h1>
              ✏️ Edit Product
            </h1>

            <p>
              Update product information,
              pricing, inventory and status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate("/admin/products")
            }
            disabled={saving}
          >
            ← Back to Products
          </button>

        </div>


        {/* ----------------------------------------------------
            FORM
        ---------------------------------------------------- */}

        <form
          onSubmit={handleSubmit}
          className="product-form"
        >


          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Information
            </h2>


            {/* PRODUCT NAME */}

            <div className="form-group">

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
                disabled={saving}
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
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                disabled={saving}
              />

            </div>


            {/* CATEGORY */}

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
                disabled={saving}
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

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
                disabled={saving}
              />

            </div>

          </div>


          {/* ==================================================
              PRICING
          ================================================== */}

          <div className="form-section">

            <h2>
              Pricing
            </h2>


            <div className="form-row">


              {/* PRICE */}

              <div className="form-group">

                <label htmlFor="price">
                  Price (₦)
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="150000"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={saving}
                />

              </div>


              {/* OLD PRICE */}

              <div className="form-group">

                <label htmlFor="oldPrice">
                  Old Price (₦)
                </label>

                <input
                  id="oldPrice"
                  type="number"
                  name="oldPrice"
                  placeholder="180000"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={saving}
                />

              </div>


              {/* DISCOUNT */}

              <div className="form-group">

                <label htmlFor="discount">
                  Discount (%)
                </label>

                <input
                  id="discount"
                  type="number"
                  name="discount"
                  placeholder="10"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="1"
                  disabled={saving}
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


            <div className="form-row">


              {/* STOCK */}

              <div className="form-group">

                <label htmlFor="stock">
                  Stock Quantity
                </label>

                <input
                  id="stock"
                  type="number"
                  name="stock"
                  placeholder="10"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  disabled={saving}
                />

              </div>


              {/* WARRANTY */}

              <div className="form-group">

                <label htmlFor="warranty">
                  Warranty
                </label>

                <input
                  id="warranty"
                  type="text"
                  name="warranty"
                  placeholder="1 Year Warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  disabled={saving}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Image
            </h2>


            <div className="form-group">

              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                type="text"
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
                disabled={saving}
              />

            </div>


            {/* IMAGE PREVIEW */}

            {formData.image && (
              <div className="product-image-preview">

                <img
                  src={formData.image}
                  alt={
                    formData.name ||
                    "Product preview"
                  }
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

          </div>


          {/* ==================================================
              PRODUCT STATUS
          ================================================== */}

          <div className="form-section">

            <h2>
              Product Status
            </h2>


            <div className="checkbox-grid">


              {/* FEATURED */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="featured"
                  checked={
                    formData.featured
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  ⭐ Featured Product
                </span>

              </label>


              {/* BESTSELLER */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="bestseller"
                  checked={
                    formData.bestseller
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  🔥 Bestseller
                </span>

              </label>


              {/* NEW ARRIVAL */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="newArrival"
                  checked={
                    formData.newArrival
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  🆕 New Arrival
                </span>

              </label>


              {/* ACTIVE */}

              <label className="checkbox-label">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    formData.isActive
                  }
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  ✅ Product Active
                </span>

              </label>

            </div>

          </div>


          {/* ==================================================
              RATING INFORMATION
          ================================================== */}

          <div className="form-section">

            <h2>
              Rating Information
            </h2>

            <p className="form-help">
              Ratings and review counts are normally
              generated by customer reviews. Edit these
              only when necessary.
            </p>


            <div className="form-row">


              {/* RATING */}

              <div className="form-group">

                <label htmlFor="rating">
                  Rating
                </label>

                <input
                  id="rating"
                  type="number"
                  name="rating"
                  placeholder="0"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  disabled={saving}
                />

              </div>


              {/* NUMBER OF REVIEWS */}

              <div className="form-group">

                <label htmlFor="numReviews">
                  Number of Reviews
                </label>

                <input
                  id="numReviews"
                  type="number"
                  name="numReviews"
                  placeholder="0"
                  value={formData.numReviews}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  disabled={saving}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="form-actions">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate("/admin/products")
              }
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
                ? "⏳ Updating..."
                : "💾 Update Product"}

            </button>

          </div>

        </form>

      </div>

    </section>
  );
}


export default EditProduct;