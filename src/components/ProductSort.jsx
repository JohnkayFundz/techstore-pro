function ProductSort({ sort, setSort }) {
  return (
    <div className="sort-container">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="sort-select"
      >
        <option value="default">Sort By</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
        <option value="name-asc">Name: A → Z</option>
        <option value="name-desc">Name: Z → A</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}

export default ProductSort;