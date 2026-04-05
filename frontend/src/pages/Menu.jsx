import React, { useState } from "react";
import Banner from "../components/menupage/Banner";
import MenuCardsSection from "../components/menupage/MenuCardsSection";
import MenuFilter from "../components/menupage/MenuFilter";
import CartDrawer from "../components/cart/Cartdrawer";
import CartButton from "../components/cart/Cartbutton";
import "../styles/menu.css";
const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => setShowFilter(!showFilter);

  const closeFilter = (e) => {
    if (e.target.classList.contains("overlay")) setShowFilter(false);
  };

  const handleFilterChange = (category, price) => {
    setSelectedCategory(category);
    setSelectedPrice(price);
  };

  return (
    <div className="menupage-section">
      <Banner />

      {showFilter && (
        <div className="overlay" onClick={closeFilter}>
          <MenuFilter onFilterChange={handleFilterChange} />
        </div>
      )}

      <MenuCardsSection
        selectedCategory={selectedCategory}
        selectedPrice={selectedPrice}
        toggleFilter={toggleFilter}
      />

      {/* Cart Floating Button */}
      <CartButton />

      {/* Cart Slide-in Drawer */}
      <CartDrawer />
    </div>
  );
};

export default Menu;