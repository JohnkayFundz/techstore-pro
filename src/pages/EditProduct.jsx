```jsx
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
  getProduct,
  updateProduct,
} from "../../api/adminProductApi";

import {
  useToast,
} from "../../context/ToastContext";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    oldPrice: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================================
  // LOAD PRODUCT
  // ==========================================================

  useEffect(() => {
    if (!id) {
      showToast("Product ID is missing.", "error");
      navigate("/admin/products");
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const result = await getProduct(id);

      if (result.success && result.product) {
        const product = result.product;

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          category: product.category || "",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          stock: product.stock ?? "",
          image: product.image || "",
          description: product.description || "",
        });
      } else {
        showToast(
          result.message || "Product not found.",
          "error"
        );

        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Load Product Error:", error);

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

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // UPDATE PRODUCT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      showToast("Product ID is missing.", "error");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice:
          formData.oldPrice === ""
            ? 0
            : Number(formData.oldPrice),
        stock: Number(formData.stock),
      };

      const result = await updateProduct(
        id,
        productData
      );

      if (result.success) {
        showToast(
          "Product updated successfully.",
          "success"
        );

        navigate("/admin/products");
      } else {
        showToast(
          result.message || "Update failed.",
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
          "Failed to update product.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <Loading />;
  }

  // ==========================================================
  // FORM
  // ==========================================================

  return (
    <section className="admin-form-page">
      <div className="container">
        <h1>✏️ Edit Product</h1>

        <form
          onSubmit={handleSubmit}
          className="product-form"
        >
          {/* PRODUCT NAME */}

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* BRAND */}

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
          />

          {/* CATEGORY */}

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          {/* OLD PRICE */}

          <input
            type="number"
            name="oldPrice"
            placeholder="Old Price"
            value={formData.oldPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

          {/* STOCK */}

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />

          {/* IMAGE */}

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
          />

          {/* BUTTON */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditProduct;
```
