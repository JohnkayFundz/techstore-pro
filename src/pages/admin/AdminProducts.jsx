import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";


import Loading from "../../components/Loading";


import {
  getAdminProducts,
  deleteAdminProduct,
} from "../../api/adminApi";


import {
  useToast,
} from "../../context/ToastContext";


import {
  formatPrice,
} from "../../utils/formatPrice";


import "./AdminProducts.css";



function AdminProducts() {


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const {
    showToast,
  } = useToast();






  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = async () => {

    try {

      setLoading(true);

      setError("");



      const result = await getAdminProducts();



      if (result.success) {


        setProducts(
          result.products || []
        );


      } else {


        setError(
          result.message ||
          "Failed to load products."
        );


        showToast(
          result.message ||
          "Failed to load products.",
          "error"
        );

      }



    } catch (error) {


      console.error(
        "Fetch Products Error:",
        error
      );


      setError(
        "Error loading products."
      );


      showToast(
        "Error loading products.",
        "error"
      );



    } finally {


      setLoading(false);


    }

  };







  useEffect(() => {

    fetchProducts();

  }, []);









  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDelete = async (id) => {


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );



    if (!confirmDelete) return;





    try {


      const result =
        await deleteAdminProduct(id);





      if (result.success) {



        setProducts(
          (currentProducts) =>
            currentProducts.filter(
              (product) =>
                product._id !== id
            )
        );



        showToast(
          "Product deleted successfully.",
          "success"
        );



      } else {



        showToast(
          result.message ||
          "Failed to delete product.",
          "error"
        );


      }




    } catch(error) {


      console.error(
        "Delete Product Error:",
        error
      );



      showToast(
        "Error deleting product.",
        "error"
      );


    }


  };









  if (loading) {

    return <Loading />;

  }








  return (

    <section className="admin-products-page">


      <div className="container">







        {/* HEADER */}

        <div className="page-header">


          <div>

            <h1>
              🛒 Products
            </h1>


            <p>
              Manage store products
            </p>

          </div>






          <Link

            to="/admin/products/new"

            className="btn btn-primary"

          >

            Add Product

          </Link>



        </div>









        {error && (

          <div className="alert alert-error">

            {error}

          </div>

        )}









        {products.length === 0 ? (



          <div className="empty-state">


            <p>
              No products found.
            </p>




            <Link

              to="/admin/products/new"

              className="btn btn-primary"

            >

              Create First Product

            </Link>



          </div>



        ) : (



          <div className="products-table">



            <table>



              <thead>


                <tr>

                  <th>
                    Image
                  </th>


                  <th>
                    Name
                  </th>


                  <th>
                    Category
                  </th>


                  <th>
                    Price
                  </th>


                  <th>
                    Stock
                  </th>


                  <th>
                    Actions
                  </th>


                </tr>


              </thead>







              <tbody>


                {

                  products.map(

                    (product) => (


                      <tr

                        key={
                          product._id
                        }

                      >



                        <td>



                          {

                            product.image ? (


                              <img

                                src={
                                  product.image
                                }

                                alt={
                                  product.name
                                }

                                className="product-thumbnail"

                              />


                            ) : (


                              <span>

                                No Image

                              </span>


                            )


                          }



                        </td>







                        <td>

                          {product.name}

                        </td>







                        <td>

                          {product.category}

                        </td>







                        <td>

                          {
                            formatPrice(
                              product.price
                            )
                          }

                        </td>







                        <td>

                          {product.stock}

                        </td>







                        <td>


                          <Link

                            to={
                              `/admin/products/edit/${product._id}`
                            }

                            className="btn btn-small btn-secondary"

                          >

                            Edit

                          </Link>







                          <button

                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }

                            className="btn btn-small btn-danger"

                          >

                            Delete

                          </button>



                        </td>







                      </tr>


                    )

                  )

                }



              </tbody>







            </table>





          </div>



        )}






      </div>



    </section>


  );

}



export default AdminProducts;