import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


import {
  createProduct,
} from "../../api/productApi";


import {
  useToast,
} from "../../context/ToastContext";


import "./CreateProduct.css";



function CreateProduct() {


  const navigate = useNavigate();


  const {
    showToast,
  } = useToast();



  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState({

    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "Laptop",
    brand: "",
    image: "",
    stock: "",
    warranty: "No warranty",

    featured: false,
    bestseller: false,
    newArrival: false,

  });





  const handleChange = (e) => {


    const {
      name,
      value,
      type,
      checked,
    } = e.target;



    setFormData({

      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    });


  };







  const handleSubmit = async (e) => {


    e.preventDefault();



    try {


      setLoading(true);



      const result =
        await createProduct({

          ...formData,

          price:
            Number(formData.price),

          oldPrice:
            Number(formData.oldPrice),

          stock:
            Number(formData.stock),

        });





      if (result.success) {


        showToast(
          "Product created successfully.",
          "success"
        );


        navigate(
          "/admin/products"
        );


      } else {


        showToast(
          result.message ||
          "Failed to create product.",
          "error"
        );


      }



    } catch(error) {


      console.error(
        "Create Product Error:",
        error
      );


      showToast(
        "Error creating product.",
        "error"
      );


    } finally {


      setLoading(false);


    }


  };








  return (


    <section className="create-product-page">


      <div className="container">



        <div className="page-header">


          <h1>
            ➕ Create Product
          </h1>


          <p>
            Add a new product to your store.
          </p>


        </div>







        <form

          onSubmit={handleSubmit}

          className="product-form"


        >




          <input

            type="text"

            name="name"

            placeholder="Product name"

            value={formData.name}

            onChange={handleChange}

            required

          />





          <textarea

            name="description"

            placeholder="Product description"

            value={formData.description}

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

            name="oldPrice"

            placeholder="Old price"

            value={formData.oldPrice}

            onChange={handleChange}

          />








          <select

            name="category"

            value={formData.category}

            onChange={handleChange}

          >

            <option>
              Laptop
            </option>

            <option>
              Phone
            </option>

            <option>
              Accessories
            </option>

            <option>
              Audio
            </option>

            <option>
              Wearables
            </option>

            <option>
              Gaming
            </option>


          </select>








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

            name="image"

            placeholder="Image URL"

            value={formData.image}

            onChange={handleChange}

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

            name="warranty"

            placeholder="Warranty"

            value={formData.warranty}

            onChange={handleChange}

          />









          <div className="checkbox-group">


            <label>

              <input

                type="checkbox"

                name="featured"

                checked={
                  formData.featured
                }

                onChange={handleChange}

              />

              Featured

            </label>





            <label>

              <input

                type="checkbox"

                name="bestseller"

                checked={
                  formData.bestseller
                }

                onChange={handleChange}

              />

              Bestseller

            </label>





            <label>

              <input

                type="checkbox"

                name="newArrival"

                checked={
                  formData.newArrival
                }

                onChange={handleChange}

              />

              New Arrival

            </label>


          </div>









          <button

            type="submit"

            className="btn btn-primary"

            disabled={loading}

          >

            {
              loading
                ? "Creating..."
                : "Create Product"
            }


          </button>





        </form>



      </div>



    </section>


  );

}



export default CreateProduct;