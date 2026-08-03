import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/admin/ProductForm";
import { createProduct } from "../api/adminProductApi";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    try {
      setLoading(true);

      const result = await createProduct(form);

      if (result.success) {
        navigate("/admin/products");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container">
      <h1>Add Product</h1>

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Product"
      />
    </section>
  );
}

export default AddProduct;