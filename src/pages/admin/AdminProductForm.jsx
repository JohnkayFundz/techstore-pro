import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { uploadImage } from "../../api/uploadApi";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../api/adminProductApi";

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const categories = [
    "Laptop",
    "Phone",
    "Accessories",
    "Gaming",
    "Tablet",
    "Monitor",
    "Audio",
  ];

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);

      const result = await getProduct(id);

      if (result.success) {
        setForm({
          name: result.product.name || "",
          brand: result.product.brand || "",
          category: result.product.category || "",
          price: result.product.price || "",
          stock: result.product.stock || "",
          description: result.product.description || "",
          image: result.product.image || "",
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);

      const result = await uploadImage(file);

      if (result.success) {
        setForm((prev) => ({
          ...prev,
          image:
            result.image?.url ||
            result.url ||
            "",
        }));

        toast.success("Image uploaded successfully.");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const product = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const result = isEditing
        ? await updateProduct(id, product)
        : await createProduct(product);

      if (result.success) {
        toast.success(
          isEditing
            ? "Product updated successfully."
            : "Product created successfully."
        );

        navigate("/admin/products");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container admin-product-page">
      <h1>
        {isEditing
          ? "Edit Product"
          : "Add Product"}
      </h1>

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >
        <label>Product Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {uploading && (
          <p>Uploading image...</p>
        )}

        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="product-preview"
            style={{
              width: 180,
              borderRadius: 8,
              marginBottom: 20,
            }}
          />
        )}

        <label>Product Name</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Brand</label>

        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          required
        />

        <label>Category</label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        <label>Price</label>

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <label>Stock</label>

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          min="0"
          required
        />

        <label>Description</label>

        <textarea
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || uploading}
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Product"
            : "Create Product"}
        </button>
      </form>
    </section>
  );
}

export default AdminProductForm;