// ==========================================================
// TECHSTORE PRO
// CATEGORY FILTER COMPONENT
// ==========================================================

import React from "react";
import "./CategoryFilter.css";

function CategoryFilter({
  category,
  setCategory,
  categories = [],
}) {
  return (
    <div
      className="category-filter"
      aria-label="Product categories"
      role="group"
    >
      {categories.map((item) => {
        const isActive = category === item;

        return (
          <button
            key={item}
            type="button"
            className={`category-filter__button ${
              isActive ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
            aria-pressed={isActive}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;