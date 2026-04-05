import { useState, useCallback,useEffect } from "react";
import "../styles/admin.css";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { Toast } from "../components/admin/charts";
import api,{ fetchAllOrders, fetchAllUsers } from "../services/api";
export default function Admin() {
  // ✅ Auth check from localStorage — set by Login.jsx on successful admin login
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = token && user?.role === "admin";

  // ✅ If not authed, send to /login — Login.jsx will navigate back to /admin/dashboard
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <AdminShell user={user} />;
}

// ─── Separated so hooks aren't called conditionally ──────────────────────────
function AdminShell({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [products, setProducts] = useState([]);
 const [orders, setOrders] = useState([]);
const [users, setUsers] = useState([]);
  const [toast,    setToast]    = useState(null);

  const location = useLocation();

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // hard reload clears all state
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "products":  return "Products";
      case "orders":    return "Orders";
      case "users":     return "Users";
      case "analytics": return "Analytics";
      case "settings":  return "Settings";
      default:          return "Dashboard";
    }
  };
  const fetchOrders = async () => {
  try {
    const res = await fetchAllOrders();
    setOrders(res.data.data || res.data);
  } catch {
    showToast("❌ Failed to load orders");
  }
};

const fetchUsers = async () => {
  try {
    const res = await fetchAllUsers();
    setUsers(res.data.data || res.data);
  } catch {
    showToast("❌ Failed to load users");
  }
};
useEffect(() => {
  fetchProducts();
  fetchOrders();
  fetchUsers();
}, []);
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || res.data);
    } catch {
      showToast("❌ Failed to load products");
    }
  };
  return (

    <div className="admin-shell">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
        />
      )}

      <Sidebar open={sidebarOpen} user={user} onLogout={handleLogout} />

      <div className="main-content">
        <div className="topbar">
          <span
            className="topbar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            ☰
          </span>

          <div className="topbar-title">{getPageTitle()}</div>

          <div className="topbar-search">
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>🔍</span>
            <input placeholder="Quick search..." />
          </div>

          <div className="notif-btn">
            🔔
            <div className="notif-dot" />
          </div>

          <div className="topbar-profile">
            <div className="topbar-avatar">
              {user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="topbar-name">{user?.name ?? "Admin"}</div>
          </div>
        </div>

        <div className="page-content">
          <Outlet
            context={{
              products, setProducts,
              orders,   setOrders,
              users,    setUsers,
              showToast,
              user,
              fetchProducts,
            }}
          />
        </div>
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
}