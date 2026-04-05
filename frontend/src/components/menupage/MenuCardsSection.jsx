import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../cart/CartContext";
import "../../styles/menu.css";

const BASE_URL = "http://localhost:5000/api";

// -------------------- Menu Card --------------------
const MenuCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = cartItems.find(
    (i) => i.product_id === product.product_id
  );

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card">
      <a
        href={`/product/${product.product_id}`}
        className="menu-card-link"
      >
        <div className="menu-card-img-wrap">
          <img
            src={product.image || "https://images.unsplash.com/photo-1605475128023-7d5c6b0d6f7b"}
            alt={product.name}
          />
        </div>

        <div className="menu-card-body">
          <h3 className="dessert-name">
            {product.name}
          </h3>
          <p className="dessert-subtitle">
            {product.description}
          </p>
          <p className="menu-card-price">
            ₹{product.price}
          </p>
        </div>
      </a>

      <button
        className={`add-to-cart-btn ${
          added ? "added" : ""
        } ${inCart ? "in-cart" : ""}`}
        onClick={handleAdd}
      >
        {added
          ? "✓ Added!"
          : inCart
          ? `🛒 Add More (${inCart.quantity})`
          : "Add to Cart"}
      </button>
    </div>
  );
};

// -------------------- Main Section --------------------
const MenuCardsSection = ({
  selectedCategory,
  selectedPrice,
  toggleFilter,
}) => {
  const [products, setProducts] = useState([]);
  const [searchMenu, setSearchMenu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ✅ FIXED API CALL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        setProducts(res.data.data); // ✅ FIXED
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // -------------------- Filtering --------------------
  const filteredProducts = products.filter((elem) => {
    const matchesSearch = elem.name
      .toLowerCase()
      .includes(searchMenu.toLowerCase());

    const matchesCategory =
      !selectedCategory || elem.category === selectedCategory;

    const matchesPrice = (() => {
      if (!selectedPrice) return true;
      if (typeof selectedPrice === "function") return selectedPrice(elem.price);
      if (typeof selectedPrice.fn === "function") return selectedPrice.fn(elem.price);
      if (typeof selectedPrice.for === "function") return selectedPrice.for(elem.price);
      return true;
    })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // -------------------- Pagination --------------------
  const startPage = (currentPage - 1) * itemsPerPage;
  const displayedContent = filteredProducts.slice(
    startPage,
    startPage + itemsPerPage
  );

  const totalPage = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  return (
    <div className="menucardcontents">
      <div className="search-section">
        <h1 className="filterbutton" onClick={toggleFilter}>
          Filter ---
        </h1>

        <input
          name="menubar-search"
          type="text"
          placeholder="Search for your favorite treat..."
          value={searchMenu}
          onChange={(e) => {
            setSearchMenu(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="menu-card-container">
        {displayedContent.length > 0 ? (
          displayedContent.map((elem) => (
            <MenuCard
              key={elem.product_id}
              product={elem}
            />
          ))
        ) : (
          <p className="no-results">No items found! 🍰</p>
        )}
      </div>

      {totalPage > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <p>
            {currentPage} of {totalPage}
          </p>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPage)
              )
            }
            disabled={currentPage === totalPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuCardsSection;