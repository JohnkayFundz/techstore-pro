// ==========================================================
// TECHSTORE PRO
// ADMIN PRODUCTS PAGE
// ==========================================================

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
  deleteProduct,
  restoreProduct,
} from "../../api/adminProductApi";

import {
  useToast,
} from "../../context/ToastContext";

import {
  formatPrice,
} from "../../utils/formatPrice";

import "./AdminProducts.css";


// ==========================================================
// COMPONENT
// ==========================================================

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

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

      const result =
        await getAdminProducts();

      console.log(
        "Admin Products Response:",
        result
      );


      if (result.success) {
        const productList =
          result.data ||
          result.products ||
          [];

        setProducts(productList);

      } else {
        const message =
          result.message ||
          "Failed to load products.";

        setError(message);

        showToast(
          message,
          "error"
        );
      }

    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );

      const message =
        "Error loading products.";

      setError(message);

      showToast(
        message,
        "error"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

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

    if (!confirmDelete) {
      return;
    }


    try {
      setActionLoading(id);

      const result =
        await deleteProduct(id);


      if (result.success) {
        /*
         * IMPORTANT:
         *
         * This is a SOFT DELETE.
         *
         * We do NOT remove the product
         * from the admin list.
         *
         * Instead, we update isActive
         * to false so the admin can
         * restore it later.
         */

        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product._id === id
                  ? {
                      ...product,
                      isActive: false,
                    }
                  : product
            )
        );

        showToast(
          result.message ||
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

    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      showToast(
        "Error deleting product.",
        "error"
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================================
  // RESTORE PRODUCT
  // ==========================================================

  const handleRestore = async (id) => {
    const confirmRestore =
      window.confirm(
        "Are you sure you want to restore this product?"
      );

    if (!confirmRestore) {
      return;
    }


    try {
      setActionLoading(id);

      const result =
        await restoreProduct(id);


      if (result.success) {
        /*
         * Update the local product
         * immediately after successful
         * restore.
         */

        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product._id === id
                  ? {
                      ...product,
                      isActive: true,
                    }
                  : product
            )
        );

        showToast(
          result.message ||
            "Product restored successfully.",
          "success"
        );

      } else {
        showToast(
          result.message ||
            "Failed to restore product.",
          "error"
        );
      }

    } catch (error) {
      console.error(
        "Restore Product Error:",
        error
      );

      showToast(
        "Error restoring product.",
        "error"
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalProducts =
    products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.isActive !== false
    ).length;

  const inactiveProducts =
    products.filter(
      (product) =>
        product.isActive === false
    ).length;


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <Loading />;
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="admin-products-page">

      <div className="container">

        {/* ==================================================
            HEADER
        ================================================== */}

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


        {/* ==================================================
            PRODUCT SUMMARY
        ================================================== */}

        <div className="admin-products-summary">

          <div className="summary-card">

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

          </div>


          <div className="summary-card">

            <span>
              Active
            </span>

            <strong>
              {activeProducts}
            </strong>

          </div>


          <div className="summary-card">

            <span>
              Inactive
            </span>

            <strong>
              {inactiveProducts}
            </strong>

          </div>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

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

          /* ==================================================
             PRODUCTS TABLE
          ================================================== */

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
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.map(
                  (product) => {

                    const isActive =
                      product.isActive !== false;

                    const isProcessing =
                      actionLoading ===
                      product._id;


                    return (
                      <tr
                        key={product._id}
                        className={
                          !isActive
                            ? "product-row-inactive"
                            : ""
                        }
                      >

                        {/* ==================================
                            IMAGE
                        ================================== */}

                        <td>

                          {product.image ? (

                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-thumbnail"
                            />

                          ) : (

                            <span>
                              No Image
                            </span>

                          )}

                        </td>


                        {/* ==================================
                            NAME
                        ================================== */}

                        <td>
                          {product.name}
                        </td>


                        {/* ==================================
                            CATEGORY
                        ================================== */}

                        <td>
                          {product.category}
                        </td>


                        {/* ==================================
                            PRICE
                        ================================== */}

                        <td>
                          {formatPrice(
                            product.price
                          )}
                        </td>


                        {/* ==================================
                            STOCK
                        ================================== */}

                        <td>
                          {product.stock}
                        </td>


                        {/* ==================================
                            STATUS
                        ================================== */}

                        <td>

                          {isActive ? (

                            <span className="status-badge status-active">
                              Active
                            </span>

                          ) : (

                            <span className="status-badge status-inactive">
                              Inactive
                            </span>

                          )}

                        </td>


                        {/* ==================================
                            ACTIONS
                        ================================== */}

                        <td>

                          <div className="product-actions">

                            {/* EDIT */}

                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="btn btn-small btn-secondary"
                            >
                              Edit
                            </Link>


                            {/* DELETE */}

                            {isActive && (

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product._id
                                  )
                                }
                                className="btn btn-small btn-danger"
                                disabled={
                                  isProcessing
                                }
                              >
                                {isProcessing
                                  ? "..."
                                  : "Delete"}
                              </button>

                            )}


                            {/* RESTORE */}

                            {!isActive && (

                              <button
                                type="button"
                                onClick={() =>
                                  handleRestore(
                                    product._id
                                  )
                                }
                                className="btn btn-small btn-success"
                                disabled={
                                  isProcessing
                                }
                              >
                                {isProcessing
                                  ? "..."
                                  : "Restore"}
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}


// ==========================================================
// EXPORT
// ==========================================================

export default AdminProducts;