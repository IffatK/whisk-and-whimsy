import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../images/logo.png";

const BASE_URL = "http://localhost:5000/api";
const POLL_INTERVAL = 60000;

const Sidebar = ({ open, user, onLogout }) => {
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/orders/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // getAllOrders returns { data: [...] }
        const orders = res.data.data ?? [];
        const count = orders.filter((o) => o.status === "pending").length;
        setPendingOrders(count);
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
      }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`sidebar admin-shell ${open ? "open" : ""}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <div>
          <img src={logo} alt="Whisk & Whimsy" className="sidebar-logo-icon" />
          <div className="sidebar-brand-sub">Admin Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">🎂</span>
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">📦</span>
          Orders
          {pendingOrders > 0 && (
            <span className="nav-badge">{pendingOrders}</span>
          )}
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">👥</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          Analytics
        </NavLink>

        <div className="sidebar-section-label">Settings</div>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
        >
          <span className="nav-icon">⚙️</span>
          Settings
        </NavLink>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div
            className="sidebar-avatar"
            style={{ background: `linear-gradient(135deg, var(--rose), var(--caramel))` }}
          >
            AU
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "Admin"}</div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>
          <span className="logout-btn" title="Logout" onClick={onLogout}>⏻</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;