import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const BASE_URL = "http://localhost:5000/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ FIXED

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/user/register`,
        formData
      );

      setMessage("Signup successful ✅");

      // redirect after signup
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-form">
          <h2>Create Your Sweet Account 🍰</h2>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
            />

            <div className="row">
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleChange}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account 💕"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <p>
            Already a member? <NavLink to="/login">Login 🍪</NavLink>
          </p>
        </div>

        <div className="signup-visual">
          <img src="/images/signup.png" alt="Dessert" />
        </div>

      </div>
    </div>
  );
};

export default Signup;