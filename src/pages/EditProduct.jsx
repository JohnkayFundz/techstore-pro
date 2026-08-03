import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProduct,
  updateProduct,
} from "../../api/adminProductApi";


function EditProduct() {


  const {
    id,
  } = useParams();


  const navigate =
    useNavigate();



  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  const [message, setMessage] =
    useState("");


  const [error, setError] =
    useState("");



  const [form, setForm] =
    useState({

      name: "",

      brand: "",

      category: "",

      price: "",

      stock: "",

      description: "",

      image: "",

    });







  useEffect(() => {

    loadProduct();

  }, [id]);







  const loadProduct = async () => {


    try {


      const result =
        await getProduct(id);



      if (result.success) {


        const product =
          result.product;



        setForm({

          name:
            product.name || "",

          brand:
            product.brand || "",

          category:
            product.category || "",

          price:
            product.price || "",

          stock:
            product.stock || "",

          description:
            product.description || "",

          image:
            product.image || "",

        });


      } else {


        setError(
          result.message
        );


      }



    } catch (err) {


      console.error(err);


      setError(
        "Failed to load product."
      );


    } finally {


      setLoading(false);


    }


  };








  const handleChange = (e) => {


    setForm((prev) => ({

      ...prev,

      [e.target.name]:
        e.target.value,

    }));


  };








  const handleSubmit = async (e) => {


    e.preventDefault();



    try {


      setSaving(true);

      setError("");



      const result =
        await updateProduct(
          id,
          {
            ...form,

            price:
              Number(form.price),

            stock:
              Number(form.stock),

          }
        );



      if (result.success) {


        setMessage(
          "✅ Product updated successfully."
        );



        setTimeout(() => {

          navigate(
            "/admin/products"
          );

        }, 1000);



      } else {


        setError(
          result.message
        );


      }




    } catch (err) {


      console.error(err);


      setError(
        "Update failed."
      );


    } finally {


      setSaving(false);


    }


  };







  if (loading) {


    return (

      <section className="container">

        <h2>
          Loading Product...
        </h2>

      </section>

    );


  }







  return (

    <section className="container admin-form-page">


      <h1>
        ✏️ Edit Product
      </h1>





      {message && (

        <div className="message-box">

          {message}

        </div>

      )}





      {error && (

        <div className="error-message">

          {error}

        </div>

      )}







      <form

        className="admin-product-form"

        onSubmit={handleSubmit}

      >


        <label>
          Image URL
        </label>


        <input

          type="text"

          name="image"

          value={form.image}

          onChange={handleChange}

        />



        {form.image && (

          <img

            src={form.image}

            alt={form.name}

            className="product-preview"

          />

        )}






        <label>
          Product Name
        </label>


        <input

          type="text"

          name="name"

          value={form.name}

          onChange={handleChange}

          required

        />







        <label>
          Brand
        </label>


        <input

          type="text"

          name="brand"

          value={form.brand}

          onChange={handleChange}

          required

        />







        <label>
          Category
        </label>


        <select

          name="category"

          value={form.category}

          onChange={handleChange}

          required

        >

          <option value="">
            Select Category
          </option>

          <option value="Laptop">
            Laptop
          </option>

          <option value="Phone">
            Phone
          </option>

          <option value="Accessories">
            Accessories
          </option>

          <option value="Gaming">
            Gaming
          </option>


        </select>







        <label>
          Price
        </label>


        <input

          type="number"

          name="price"

          value={form.price}

          onChange={handleChange}

          required

        />







        <label>
          Stock
        </label>


        <input

          type="number"

          name="stock"

          value={form.stock}

          onChange={handleChange}

          required

        />







        <label>
          Description
        </label>


        <textarea

          name="description"

          rows="5"

          value={form.description}

          onChange={handleChange}

          required

        />







        <button

          className="btn btn-primary"

          disabled={saving}

        >

          {saving
            ? "Updating..."
            : "Update Product"}

        </button>




      </form>



    </section>

  );

}


export default EditProduct;