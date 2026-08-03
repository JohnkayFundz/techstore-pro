import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const topProducts = [
  {
    id: 1,
    name: "MacBook Pro M4",
    category: "Laptop",
    sold: 156,
    revenue: "$374,400",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    category: "Phone",
    sold: 132,
    revenue: "$158,400",
  },
  {
    id: 3,
    name: "Sony WH-1000XM6",
    category: "Headphones",
    sold: 97,
    revenue: "$38,800",
  },
  {
    id: 4,
    name: "Samsung Galaxy S26",
    category: "Phone",
    sold: 84,
    revenue: "$84,000",
  },
];

function TopProducts() {
  return (
    <section className="top-products">
      <div className="section-header">
        <h2>Top Selling Products</h2>

        <Link to="/admin/products" className="view-all-btn">
          View All <FiArrowRight />
        </Link>
      </div>

      <div className="top-products-list">
        {topProducts.map((product) => (
          <div key={product.id} className="top-product-card">
            <div>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
            </div>

            <div className="top-product-stats">
              <span>{product.sold} sold</span>
              <strong>{product.revenue}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopProducts;