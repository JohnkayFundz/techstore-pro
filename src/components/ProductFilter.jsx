function ProductFilter({
  category,
  setCategory,
  categories,
}) {
  return (
    <div className="filter-container">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="filter-select"
      >
        <option value="All">All Categories</option>

        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductFilter;