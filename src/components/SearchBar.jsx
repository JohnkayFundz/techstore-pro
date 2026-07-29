import { FiSearch, FiX } from "react-icons/fi";

function SearchBar({ search, setSearch }) {
  const clearSearch = () => setSearch("");

  return (
    <div
      className="search-bar"
      role="search"
      aria-label="Product search"
    >
      <FiSearch className="search-icon" />

      <input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search products"
      />

      {search && (
        <button
          type="button"
          className="clear-search"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <FiX />
        </button>
      )}
    </div>
  );
}

export default SearchBar;