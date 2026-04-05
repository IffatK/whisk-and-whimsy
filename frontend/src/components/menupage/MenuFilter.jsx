import React, { useState } from "react";
import { category, price } from "../../util/filter";

const MenuFilter = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const handleCategoryClick = (newCategory) => {
    setSelectedCategory(newCategory);
    onFilterChange(newCategory, selectedPrice);
  };

  const handlePriceClick = (priceFilter) => {
    setSelectedPrice(priceFilter);
    onFilterChange(selectedCategory, priceFilter);
  };

  return (
    <div className="filtermenu filter-panel">
      {/* Category Filter */}
      <div className="filter-group">
        <h4>Category</h4>
        <ul className="filter-list">
          <li
            className={selectedCategory === "" ? "active" : ""}
            onClick={() => handleCategoryClick("")}
          >
            All Categories
          </li>

          {category.map((elem) => (
            <li
              key={elem.labelName}
              className={selectedCategory === elem.for ? "active" : ""}
              onClick={() => handleCategoryClick(elem.for)}
            >
              {elem.labelName}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="filter-group">
        <h4>Price</h4>
        <ul className="filter-list">
          <li
            className={selectedPrice === "" ? "active" : ""}
            onClick={() => handlePriceClick("")}
          >
            All Prices
          </li>

          {price.map((elem) => (
            <li
              key={elem.labelName}
              className={
                selectedPrice?.labelName === elem.labelName ? "active" : ""
              }
              onClick={() => handlePriceClick(elem)}
            >
              {elem.labelName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuFilter;