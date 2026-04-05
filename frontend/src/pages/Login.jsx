import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab]           = useState("user"); // "user" | "admin"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);

  const resetForm = (newTab) => {
    setTab(newTab);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/user/login", { email, password });

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const role = data.user?.role ?? "user";

      if (tab === "admin") {
        if (role !== "admin") {
          setMessage("⚠️ This account does not have admin access.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }
        // ✅ Navigate directly — no prop needed
        navigate("/admin/dashboard");
      } else {
        if (role === "admin") {
          setMessage("⚠️ Use the Admin tab to log in as admin.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return;
        }
        setMessage("Welcome back to Whisk & Whimsy 🍰");
        setTimeout(() => navigate("/profile"), 800);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = tab === "admin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        .ww-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          background: #fdf6f0;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Soft background blobs */
        .ww-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          z-index: 0;
        }
        .ww-blob-1 {
          width: 420px; height: 420px;
          background: #f9c8d9;
          top: -100px; left: -100px;
        }
        .ww-blob-2 {
          width: 360px; height: 360px;
          background: #fde8c8;
          bottom: -80px; right: -80px;
        }
        .ww-blob-3 {
          width: 240px; height: 240px;
          background: #c8e8f9;
          top: 40%; left: 60%;
          opacity: 0.2;
        }

        /* Card */
        .ww-card {
          position: relative;
          z-index: 1;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 8px 48px rgba(180,100,80,0.10), 0 1px 0 rgba(255,255,255,0.9) inset;
          width: 100%;
          max-width: 860px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          min-height: 540px;
        }
        @media (max-width: 640px) {
          .ww-card { grid-template-columns: 1fr; }
          .ww-visual { display: none; }
        }

        /* Visual panel */
        .ww-visual {
          position: relative;
          background: linear-gradient(145deg, #f9c8d9 0%, #fde8c8 60%, #f7d6b0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          overflow: hidden;
        }
        .ww-visual-emoji {
          font-size: 5rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 16px rgba(200,80,80,0.18));
          animation: floatEmoji 3.5s ease-in-out infinite;
        }
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .ww-visual-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #5a2a1a;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        .ww-visual-sub {
          font-size: 0.9rem;
          color: #9a5a3a;
          text-align: center;
          opacity: 0.85;
        }
        .ww-visual-dots {
          display: flex;
          gap: 6px;
          margin-top: 2rem;
        }
        .ww-visual-dots span {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(90,42,26,0.25);
        }
        .ww-visual-dots span.active {
          background: #c0604a;
          width: 22px;
          border-radius: 4px;
          transition: width 0.3s;
        }

        /* Form panel */
        .ww-form-panel {
          padding: 2.8rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Tabs */
        .ww-tabs {
          display: flex;
          background: #f7ede8;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 2rem;
          gap: 4px;
        }
        .ww-tab {
          flex: 1;
          padding: 0.55rem 0.5rem;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.22s ease;
          background: transparent;
          color: #a07060;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ww-tab.active {
          background: #fff;
          color: #c0604a;
          box-shadow: 0 2px 12px rgba(192,96,74,0.13);
        }
        .ww-tab:hover:not(.active) {
          background: rgba(255,255,255,0.5);
        }

        /* Heading */
        .ww-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #3a1a0a;
          margin-bottom: 0.3rem;
          transition: all 0.2s;
        }
        .ww-subheading {
          font-size: 0.87rem;
          color: #b07060;
          margin-bottom: 1.6rem;
        }

        /* Inputs */
        .ww-field {
          margin-bottom: 1rem;
        }
        .ww-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #9a5a3a;
          margin-bottom: 0.35rem;
          letter-spacing: 0.02em;
        }
        .ww-input {
          width: 100%;
          padding: 0.72rem 1rem;
          border: 1.5px solid #edd8cc;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem;
          color: #3a1a0a;
          background: #fdf8f5;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          outline: none;
        }
        .ww-input:focus {
          border-color: #c0604a;
          box-shadow: 0 0 0 3px rgba(192,96,74,0.10);
          background: #fff;
        }
        .ww-input::placeholder { color: #cca898; }

        /* Button */
        .ww-btn {
          width: 100%;
          padding: 0.78rem;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.97rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: all 0.22s ease;
          letter-spacing: 0.01em;
        }
        .ww-btn-user {
          background: linear-gradient(135deg, #e8856a 0%, #c0604a 100%);
          color: #fff;
          box-shadow: 0 4px 18px rgba(192,96,74,0.28);
        }
        .ww-btn-user:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(192,96,74,0.35);
        }
        .ww-btn-admin {
          background: linear-gradient(135deg, #4a3060 0%, #2e1a40 100%);
          color: #fff;
          box-shadow: 0 4px 18px rgba(46,26,64,0.28);
        }
        .ww-btn-admin:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(46,26,64,0.35);
        }
        .ww-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* Message */
        .ww-message {
          margin-top: 0.9rem;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          font-size: 0.87rem;
          text-align: center;
        }
        .ww-message.error {
          background: #fff0ee;
          color: #c0604a;
          border: 1px solid #f5ccc4;
        }
        .ww-message.success {
          background: #eefaf3;
          color: #2a7a50;
          border: 1px solid #b8ead0;
        }

        /* Admin hint */
        .ww-hint {
          margin-top: 1rem;
          padding: 0.6rem 0.9rem;
          background: #f3eeff;
          border: 1px solid #d8c8f0;
          border-radius: 10px;
          font-size: 0.8rem;
          color: #6a4a90;
          text-align: center;
        }
        .ww-hint span { font-weight: 500; }

        /* Signup link */
        .ww-signup {
          margin-top: 1.2rem;
          text-align: center;
          font-size: 0.85rem;
          color: #a07060;
        }
        .ww-signup a {
          color: #c0604a;
          font-weight: 500;
          text-decoration: none;
        }
        .ww-signup a:hover { text-decoration: underline; }

        /* Tab switch animation */
        .ww-form-body {
          animation: fadeSlide 0.22s ease;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="ww-login-root">
        <div className="ww-blob ww-blob-1" />
        <div className="ww-blob ww-blob-2" />
        <div className="ww-blob ww-blob-3" />

        <div className="ww-card">
          {/* Left visual */}
          <div className="ww-visual">
            <div className="ww-visual-emoji">{isAdmin ? "🔐" : "🧁"}</div>
            <div className="ww-visual-title">Whisk &amp; Whimsy</div>
            <div className="ww-visual-sub">
              {isAdmin
                ? "Admin dashboard — manage your bakery"
                : "Your sweet journey awaits ✨"}
            </div>
            <div className="ww-visual-dots">
              <span className={!isAdmin ? "active" : ""} />
              <span className={isAdmin ? "active" : ""} />
            </div>
          </div>

          {/* Right form */}
          <div className="ww-form-panel">
            {/* Tabs */}
            <div className="ww-tabs">
              <button
                className={`ww-tab ${tab === "user" ? "active" : ""}`}
                onClick={() => resetForm("user")}
              >
                🍓 Customer
              </button>
              <button
                className={`ww-tab ${tab === "admin" ? "active" : ""}`}
                onClick={() => resetForm("admin")}
              >
                ⚙️ Admin
              </button>
            </div>

            <div className="ww-form-body" key={tab}>
              <div className="ww-heading">
                {isAdmin ? "Admin Sign In" : "Welcome Back 🍓"}
              </div>
              <div className="ww-subheading">
                {isAdmin
                  ? "Sign in to manage orders, products & users"
                  : "Log in to continue your sweet journey"}
              </div>

              <form onSubmit={handleLogin}>
                <div className="ww-field">
                  <label className="ww-label">Email address</label>
                  <input
                    className="ww-input"
                    type="email"
                    placeholder={isAdmin ? "admin@whiskwhimsy.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="ww-field">
                  <label className="ww-label">Password</label>
                  <input
                    className="ww-input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`ww-btn ${isAdmin ? "ww-btn-admin" : "ww-btn-user"}`}
                  disabled={loading}
                >
                  {loading
                    ? "Signing in…"
                    : isAdmin
                    ? "Sign In to Dashboard →"
                    : "Login 💕"}
                </button>
              </form>

              {message && (
                <div className={`ww-message ${message.includes("❌") || message.includes("⚠️") ? "error" : "success"}`}>
                  {message}
                </div>
              )}

              {isAdmin && (
                <div className="ww-hint">
                  Hint: <span>admin@whiskandwhimsy.com</span> / <span>admin123</span>
                </div>
              )}

              {!isAdmin && (
                <p className="ww-signup">
                  New here?{" "}
                  <NavLink to="/signup">Create an account 🍪</NavLink>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;