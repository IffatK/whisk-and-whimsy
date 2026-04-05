import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import API, { fetchUserProfile } from "../../services/api"; // adjust path
import "./cart.css";

const STEPS = ["Delivery", "Payment", "Confirm"];

const Checkout = () => {
  const { cartItems, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [delivery, setDelivery] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [payment, setPayment] = useState({
    method: "upi",
    upiId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Pre-fill delivery form from logged-in user's profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchUserProfile()
      .then((res) => {
        const user = res.data?.data ?? res.data ?? {};
        setDelivery((prev) => ({
          ...prev,
          name:    user.name    ?? "",
          phone:   user.phone   ?? "",
          email:   user.email   ?? "",
          address: user.address ?? "",
        }));
      })
      .catch(() => {}); // silently fail — user can fill manually
  }, []);

  const gst = totalPrice * 0.05;
  const grandTotal = totalPrice + gst;


  const placeOrder = async () => {
    try {
      const items = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity:   item.quantity,
        price:      item.price,
        name:       item.name,
      }));

      await API.post("/orders", {
        items,
        totalAmount: grandTotal,
        delivery_address: delivery.address,
        delivery_city:    delivery.city,
        delivery_pincode: delivery.pincode,
        delivery_phone:   delivery.phone,
        customer:         delivery.name,
        email:            delivery.email,
        pay_method:       payment.method,
      });

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      alert("Failed to place order. Please try again.");
      console.error(err);
    }
  };

  // ... rest of validation functions stay the same
  const validateDelivery = () => {
    const e = {};
    if (!delivery.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(delivery.phone)) e.phone = "Enter valid 10-digit phone";
    if (!/\S+@\S+\.\S+/.test(delivery.email)) e.email = "Enter valid email";
    if (!delivery.address.trim()) e.address = "Address is required";
    if (!delivery.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(delivery.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment.method === "upi" && !payment.upiId.trim())
      e.upiId = "UPI ID is required";
    if (payment.method === "card") {
      if (!/^\d{16}$/.test(payment.cardNumber.replace(/\s/g, "")))
        e.cardNumber = "Enter valid 16-digit card number";
      if (!payment.cardName.trim()) e.cardName = "Name on card required";
      if (!/^\d{2}\/\d{2}$/.test(payment.cardExpiry))
        e.cardExpiry = "Format: MM/YY";
      if (!/^\d{3}$/.test(payment.cardCvv)) e.cardCvv = "3-digit CVV required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateDelivery()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => s + 1);
  };


  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty">
        <div className="empty-illustration">🛒</div>
        <h2>No items in cart</h2>
        <button onClick={() => navigate("/menu")} className="checkout-btn">
          Go to Menu
        </button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-animation">
          <div className="success-circle">✓</div>
        </div>
        <h2>Order Placed!</h2>
        <p>
          Thank you, <strong>{delivery.name}</strong>! Your sweets are being
          prepared with love 🍭
        </p>
        <p className="success-total">
          Total Paid: ₹{grandTotal.toFixed(2)}
        </p>
        <p className="success-address">
          Delivering to: {delivery.address}, {delivery.city} - {delivery.pincode}
        </p>
        <button className="checkout-btn" onClick={() => navigate("/menu")}>
          Order More Sweets
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Step Indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-item ${i <= step ? "active" : ""} ${i < step ? "done" : ""}`}>
            <div className="step-circle">{i < step ? "✓" : i + 1}</div>
            <span>{s}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        {/* LEFT: Form */}
        <div className="checkout-form-wrap">
          {/* Step 0: Delivery */}
          {step === 0 && (
            <div className="form-section">
              <h3>Delivery Details</h3>
              <div className="form-grid">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Rahul Sharma" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "9876543210" },
                  { label: "Email", key: "email", type: "email", placeholder: "rahul@email.com" },
                ].map(({ label, key, type, placeholder }) => (
                  <div className="form-group" key={key}>
                    <label>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={delivery[key]}
                      onChange={(e) =>
                        setDelivery({ ...delivery, [key]: e.target.value })
                      }
                      className={errors[key] ? "input-error" : ""}
                    />
                    {errors[key] && <span className="error-msg">{errors[key]}</span>}
                  </div>
                ))}
              </div>

              <div className="form-group full-width">
                <label>Full Address</label>
                <textarea
                  rows={3}
                  placeholder="House/Flat No, Street, Landmark"
                  value={delivery.address}
                  onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={delivery.city}
                    onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                    className={errors.city ? "input-error" : ""}
                  />
                  {errors.city && <span className="error-msg">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={delivery.pincode}
                    onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })}
                    className={errors.pincode ? "input-error" : ""}
                  />
                  {errors.pincode && <span className="error-msg">{errors.pincode}</span>}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Delivery Notes (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Leave at door, call before delivery..."
                  value={delivery.notes}
                  onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-methods">
                {["upi", "card", "cod"].map((m) => (
                  <label key={m} className={`payment-option ${payment.method === m ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m}
                      checked={payment.method === m}
                      onChange={() => setPayment({ ...payment, method: m })}
                    />
                    <span className="payment-icon">
                      {m === "upi" ? "📱" : m === "card" ? "💳" : "💵"}
                    </span>
                    <span>{m === "upi" ? "UPI" : m === "card" ? "Credit / Debit Card" : "Cash on Delivery"}</span>
                  </label>
                ))}
              </div>

              {payment.method === "upi" && (
                <div className="form-group" style={{ marginTop: "1.5rem" }}>
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={payment.upiId}
                    onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                    className={errors.upiId ? "input-error" : ""}
                  />
                  {errors.upiId && <span className="error-msg">{errors.upiId}</span>}
                </div>
              )}

              {payment.method === "card" && (
                <div className="form-grid" style={{ marginTop: "1.5rem" }}>
                  <div className="form-group full-width">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={payment.cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                        setPayment({ ...payment, cardNumber: formatted });
                      }}
                      className={errors.cardNumber ? "input-error" : ""}
                    />
                    {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      className={errors.cardName ? "input-error" : ""}
                    />
                    {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="08/27"
                      maxLength={5}
                      value={payment.cardExpiry}
                      onChange={(e) => setPayment({ ...payment, cardExpiry: e.target.value })}
                      className={errors.cardExpiry ? "input-error" : ""}
                    />
                    {errors.cardExpiry && <span className="error-msg">{errors.cardExpiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={payment.cardCvv}
                      onChange={(e) => setPayment({ ...payment, cardCvv: e.target.value })}
                      className={errors.cardCvv ? "input-error" : ""}
                    />
                    {errors.cardCvv && <span className="error-msg">{errors.cardCvv}</span>}
                  </div>
                </div>
              )}

              {payment.method === "cod" && (
                <div className="cod-note">
                  <span>🏠</span>
                  <p>Pay with cash when your order arrives. Our delivery partner will collect the amount.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="form-section confirm-section">
              <h3>Order Confirmation</h3>

              <div className="confirm-block">
                <h4>📦 Delivering to</h4>
                <p>{delivery.name} · {delivery.phone}</p>
                <p>{delivery.address}, {delivery.city} - {delivery.pincode}</p>
                {delivery.notes && <p className="confirm-note">Note: {delivery.notes}</p>}
              </div>

              <div className="confirm-block">
                <h4>💳 Payment</h4>
                <p>
                  {payment.method === "upi"
                    ? `UPI: ${payment.upiId}`
                    : payment.method === "card"
                    ? `Card ending in ${payment.cardNumber.slice(-4)}`
                    : "Cash on Delivery"}
                </p>
              </div>

              <div className="confirm-block">
                <h4>🛍 Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</h4>
                {cartItems.map((item) => (
                  <div key={item.product_id} className="confirm-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="form-actions">
            {step > 0 && (
              <button className="back-btn" onClick={() => setStep((s) => s - 1)}>
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button className="checkout-btn" onClick={nextStep}>
                Continue →
              </button>
            ) : (
              <button className="checkout-btn place-order-btn" onClick={placeOrder}>
                🎉 Place Order · ₹{grandTotal.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div className="summary-item" key={item.product_id}>
                <img
                  src={item.image || "/images/fallback.svg"}
                  alt={item.name}
                />
                <div className="summary-item-info">
                  <p>{item.name}</p>
                  <div className="summary-qty-controls">
                    <button onClick={() => updateQuantity(item.product_id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, +1)}>+</button>
                  </div>
                </div>
                <div className="summary-item-right">
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  <button className="summary-remove" onClick={() => removeFromCart(item.product_id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-grand">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;