import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/adminProductApi";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const result = await createProduct(formData);

      if (result.success) {
        toast.success("Product created successfully.");

        navigate("/admin/products");
      } else {
        toast.error(
          result.message || "Failed to create product."
        );
      }
    } catch (error) {
      console.error("Create Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page">
      <div className="page-header">
        <h1>Add Product</h1>
        <p>
          Create a new product for your TechStore Pro
          catalog.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Product"
      />
    </section>
  );
}

export default AddProduct;