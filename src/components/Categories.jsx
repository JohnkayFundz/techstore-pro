import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      id: 1,
      title: "Laptops",
      icon: "💻",
      description: "Powerful laptops for work, gaming and creativity",
      link: "/products?category=Laptop",
    },
    {
      id: 2,
      title: "Smartphones",
      icon: "📱",
      description: "Latest smartphones with premium features",
      link: "/products?category=Phone",
    },
    {
      id: 3,
      title: "Accessories",
      icon: "🎧",
      description: "Headphones, keyboards and tech essentials",
      link: "/products?category=Accessories",
    },
  ];

  return (
    <section className="categories">
      <div className="container">
        <div className="section-title">
          <h2>Shop By Category</h2>

          <p>
            Explore our collection of premium technology products.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="category-card"
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;