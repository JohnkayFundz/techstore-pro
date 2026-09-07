// ==========================================================
// TECHSTORE PRO
// ADMIN PRODUCTS PAGE
// ==========================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
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

  const [searchParams, setSearchParams] =
    useSearchParams();

  const {
    showToast,
  } = useToast();

  const searchQuery =
    searchParams.get("search") || "";


  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await getAdminProducts();

      if (result?.success) {
        const productList =
          result.data ||
          result.products ||
          [];

        setProducts(
          Array.isArray(productList)
            ? productList
            : []
        );
      } else {
        const message =
          result?.message ||
          "Failed to load products.";

        setError(message);
        showToast(message, "error");
      }
    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error loading products.";

      setError(message);
      showToast(message, "error");
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
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return [
        product?.name,
        product?.category,
        product?.description,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [products, searchQuery]);


  const clearSearch = () => {
    setSearchParams({});
  };


  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const handleDelete = async (id) => {
    if (!window.confirm(
      "Are you sure you want to delete this product?"
    )) {
      return;
    }

    try {
      setActionLoading(id);

      const result =
        await deleteProduct(id);

      if (result?.success) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
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
          result?.message ||
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
        error?.response?.data?.message ||
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
    if (!window.confirm(
      "Are you sure you want to restore this product?"
    )) {
      return;
    }

    try {
      setActionLoading(id);

      const result =
        await restoreProduct(id);

      if (result?.success) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
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
          result?.message ||
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
        error?.response?.data?.message ||
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

        <div className="page-header">
          <div>
            <h1>🛒 Products</h1>
            <p>Manage store products</p>
          </div>

          <Link
            to="/admin/products/new"
            className="btn btn-primary"
          >
            Add Product
          </Link>
        </div>

        <div className="admin-products-summary">
          <div className="summary-card">
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>

          <div className="summary-card">
            <span>Active</span>
            <strong>{activeProducts}</strong>
          </div>

          <div className="summary-card">
            <span>Inactive</span>
            <strong>{inactiveProducts}</strong>
          </div>
        </div>

        {error && (
          <div
            className="alert alert-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {searchQuery && (
          <div className="products-search-state">
            <span>
              Showing {filteredProducts.length} of {totalProducts} products for “{searchQuery}”
            </span>

            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
            >
              Clear search
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchQuery
                ? `No products match “${searchQuery}”.`
                : "No products found."}
            </p>

            {searchQuery ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearSearch}
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/admin/products/new"
                className="btn btn-primary"
              >
                Create First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const isActive =
                    product.isActive !== false;

                  const isProcessing =
                    actionLoading === product._id;

                  return (
                    <tr
                      key={product._id}
                      className={
                        !isActive
                          ? "product-row-inactive"
                          : ""
                      }
                    >
                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>

                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stock}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            isActive
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="product-actions">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </Link>

                          {isActive ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(product._id)
                              }
                              className="btn btn-small btn-danger"
                              disabled={isProcessing}
                              aria-label={`Delete ${product.name}`}
                            >
                              {isProcessing
                                ? "..."
                                : "Delete"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(product._id)
                              }
                              className="btn btn-small btn-success"
                              disabled={isProcessing}
                              aria-label={`Restore ${product.name}`}
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminProducts;
