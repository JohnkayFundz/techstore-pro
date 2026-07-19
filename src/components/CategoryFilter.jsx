function CategoryFilter({ category, setCategory }) {
  const categories = ["All", "Laptop", "Phone", "Accessories"];

  return (
    <div className="category-filter">
      {categories.map((item) => (
        <button
          key={item}
          className={category === item ? "active" : ""}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;