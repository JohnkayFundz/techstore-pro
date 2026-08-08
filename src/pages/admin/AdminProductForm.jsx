import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  uploadImage,
} from "../../api/uploadApi";

import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../api/adminProductApi";

import "./AdminProductForm.css";


function AdminProductForm() {


  const navigate = useNavigate();

  const {
    id,
  } = useParams();


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

    featured: false,

    bestseller: false,

    newArrival: false,

  });



  const categories = [

    "Laptop",

    "Phone",

    "Accessories",

    "Gaming",

    "Tablet",

    "Monitor",

    "Audio",

    "Wearables",

  ];





  /* ==========================================================
     LOAD PRODUCT FOR EDIT
  ========================================================== */


  useEffect(() => {

    if (isEditing) {

      fetchProduct();

    }

  }, [id]);





  async function fetchProduct() {

    try {

      setLoading(true);


      const result =
        await getProduct(id);



      if (result.success) {


        const product =
          result.product;



        setForm({

          name: product.name || "",

          brand: product.brand || "",

          category: product.category || "",

          price: product.price || "",

          stock: product.stock || "",

          description:
            product.description || "",

          image:
            product.image || "",

          featured:
            product.featured || false,

          bestseller:
            product.bestseller || false,

          newArrival:
            product.newArrival || false,

        });


      } else {


        toast.error(
          result.message ||
          "Product not found."
        );


      }



    } catch (error) {


      console.error(
        "Load Product Error:",
        error
      );


      toast.error(
        "Failed to load product."
      );


    } finally {


      setLoading(false);


    }

  }





  /* ==========================================================
     INPUT CHANGE
  ========================================================== */


  function handleChange(e) {


    const {
      name,
      value,
      type,
      checked,
    } = e.target;



    setForm((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  }







  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */


  async function handleImageUpload(e) {


    const file =
      e.target.files[0];



    if (!file) return;




    if (
      !file.type.startsWith("image/")
    ) {

      toast.error(
        "Please select an image file."
      );

      return;

    }




    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Image must be below 5MB."
      );

      return;

    }





    try {


      setUploading(true);



      const result =
        await uploadImage(file);




      if (result.success) {


        setForm((prev) => ({

          ...prev,

          image:
            result.url ||
            result.image?.url ||
            "",

        }));


        toast.success(
          "Image uploaded."
        );


      } else {


        toast.error(
          result.message ||
          "Upload failed."
        );


      }



    } catch(error) {


      console.error(
        "Upload Error:",
        error
      );


      toast.error(
        "Image upload failed."
      );


    } finally {


      setUploading(false);


    }


  }







  /* ==========================================================
     SUBMIT FORM
  ========================================================== */


  async function handleSubmit(e) {


    e.preventDefault();



    try {


      setLoading(true);



      const productData = {


        ...form,


        price:
          Number(form.price),


        stock:
          Number(form.stock),


      };





      const result =
        isEditing

          ? await updateProduct(
              id,
              productData
            )

          : await createProduct(
              productData
            );







      if (result.success) {


        toast.success(

          isEditing

            ? "Product updated successfully."

            : "Product created successfully."

        );



        navigate(
          "/admin/products"
        );



      } else {


        toast.error(

          result.message ||
          "Operation failed."

        );


      }




    } catch(error) {


      console.error(
        "Save Product Error:",
        error
      );


      toast.error(
        "Something went wrong."
      );


    } finally {


      setLoading(false);


    }


  }







  return (


    <section className="admin-product-form-page">


      <div className="container">



        <div className="page-header">


          <h1>

            {isEditing

              ? "Edit Product"

              : "Add Product"

            }

          </h1>


        </div>





        <form

          className="admin-product-form"

          onSubmit={handleSubmit}

        >





          <label>
            Product Image
          </label>



          <input

            type="file"

            accept="image/*"

            onChange={handleImageUpload}

          />





          {uploading && (

            <p>
              Uploading image...
            </p>

          )}






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

            name="name"

            value={form.name}

            onChange={handleChange}

            required

          />






          <label>
            Brand
          </label>


          <input

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


            {categories.map((item)=>(

              <option

                key={item}

                value={item}

              >

                {item}

              </option>

            ))}


          </select>








          <label>
            Price
          </label>


          <input

            type="number"

            name="price"

            value={form.price}

            onChange={handleChange}

            min="0"

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

            min="0"

            required

          />







          <label>
            Description
          </label>


          <textarea

            name="description"

            value={form.description}

            onChange={handleChange}

            rows="5"

            required

          />







          <div className="checkbox-group">


            <label>

              <input

                type="checkbox"

                name="featured"

                checked={form.featured}

                onChange={handleChange}

              />

              Featured

            </label>





            <label>

              <input

                type="checkbox"

                name="bestseller"

                checked={form.bestseller}

                onChange={handleChange}

              />

              Bestseller

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


          </div>








          <button

            className="btn btn-primary"

            disabled={
              loading ||
              uploading
            }

          >


            {loading

              ? "Saving..."

              : isEditing

              ? "Update Product"

              : "Create Product"

            }


          </button>






        </form>



      </div>


    </section>


  );

}



export default AdminProductForm;