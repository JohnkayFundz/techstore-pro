// ==========================================================
// TECHSTORE PRO
// CATEGORY FILTER COMPONENT
// ==========================================================

import PropTypes from "prop-types";

import "./CategoryFilter.css";

/* ==========================================================
   CATEGORY FILTER
========================================================== */

function CategoryFilter({
  category,
  setCategory,
  categories = [],
}) {
  /* ========================================================
     EMPTY STATE
  ======================================================== */

  if (!categories.length) {
    return null;
  }

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div
      className="category-filter"
      aria-label="Product categories"
      role="group"
    >
      {categories.map((item) => {
        const isActive =
          category === item;

        return (
          <button
            key={item}
            type="button"
            className={`category-filter__button ${
              isActive ? "active" : ""
            }`}
            onClick={() =>
              setCategory(item)
            }
            aria-pressed={isActive}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================================
   PROP TYPES
========================================================== */

CategoryFilter.propTypes = {
  category: PropTypes.string,

  setCategory:
    PropTypes.func.isRequired,

  categories:
    PropTypes.arrayOf(
      PropTypes.string
    ),
};

/* ==========================================================
   EXPORT
========================================================== */

export default CategoryFilter;