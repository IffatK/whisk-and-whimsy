import React from "react";
import { useCart } from "./CartContext";
import "./cart.css";

const CartButton = () => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <button
      className="floating-cart-btn"
      onClick={() => setIsCartOpen(true)}
      aria-label="Open cart"
    >
      🛒
      {totalItems > 0 && (
        <span className="floating-cart-badge">{totalItems}</span>
      )}
    </button>
  );
};

export default CartButton;