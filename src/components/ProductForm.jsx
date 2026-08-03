import { useState, useEffect } from "react";

function ProductForm({
  initialValues,
  onSubmit,
  loading,
  submitText = "Save Product",
}) {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    oldPrice: "",
    stock: "",
    image: "",
    description: "",
    featured: false,
    newArrival: false,
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...form,
        ...initialValues,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="oldPrice"
        placeholder="Old Price"
        value={form.oldPrice}
        onChange={handleChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        required
      />

      <input
        type="url"
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />

      <textarea
        name="description"
        rows="5"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
        />
        Featured Product
      </label>

      <label>
        <input
          type="checkbox"
          name="newArrival"
          checked={form.newArrival}
          onChange={handleChange}
        />
        New Arrival
      </label>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default ProductForm;