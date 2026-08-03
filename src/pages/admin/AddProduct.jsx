import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createProduct } from "../../api/productApi";
import { useToast } from "../../context/ToastContext";


function AddProduct() {

  const navigate = useNavigate();

  const { showToast } = useToast();


  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({

    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",

  });



  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setLoading(true);


      const result = await createProduct({

        ...formData,

        price: Number(formData.price),

        stock: Number(formData.stock),

      });



      if (result.success) {


        showToast(
          "Product created successfully",
          "success"
        );


        navigate("/admin/products");


      } else {


        showToast(

          result.message ||
          "Failed to create product",

          "error"

        );

      }



    } catch (error) {


      console.error(
        "Create Product Error:",
        error
      );


      showToast(
        "Error creating product",
        "error"
      );



    } finally {

      setLoading(false);

    }

  };





  return (

    <section className="admin-product-form">


      <div className="container">


        <h1>
          Add Product
        </h1>



        <form
          onSubmit={handleSubmit}
        >



          <input

            type="text"

            name="name"

            placeholder="Product name"

            value={formData.name}

            onChange={handleChange}

            required

          />




          <input

            type="text"

            name="brand"

            placeholder="Brand"

            value={formData.brand}

            onChange={handleChange}

            required

          />





          <input

            type="text"

            name="category"

            placeholder="Category"

            value={formData.category}

            onChange={handleChange}

            required

          />





          <input

            type="number"

            name="price"

            placeholder="Price"

            value={formData.price}

            onChange={handleChange}

            required

          />





          <input

            type="number"

            name="stock"

            placeholder="Stock quantity"

            value={formData.stock}

            onChange={handleChange}

            required

          />





          <input

            type="text"

            name="image"

            placeholder="Image URL"

            value={formData.image}

            onChange={handleChange}

          />





          <textarea

            name="description"

            placeholder="Product description"

            value={formData.description}

            onChange={handleChange}

            rows="5"

          />





          <button

            type="submit"

            className="btn btn-primary"

            disabled={loading}

          >

            {loading
              ? "Creating..."
              : "Create Product"}

          </button>




        </form>



      </div>


    </section>

  );

}



export default AddProduct;