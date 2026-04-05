import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "./cart.css";

const CartDrawer = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isCartOpen ? "visible" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <span className="cart-icon-wrap">🛒</span>
            <h2>Your Cart</h2>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </div>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-illustration">🍰</div>
              <p>Your cart is empty</p>
              <span>Add some sweet treats!</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.product_id}>
                <img
                  src={item.image || "/images/fallback.svg"}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">₹{item.price} each</p>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product_id, -1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.product_id, +1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <p className="cart-item-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-tax">
              <span>GST (5%)</span>
              <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
            </div>
            <div className="cart-grand">
              <span>Total</span>
              <span>₹{(totalPrice * 1.05).toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <button
              className="continue-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;