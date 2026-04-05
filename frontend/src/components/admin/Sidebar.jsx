import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
export const navItems = [
  { key: "dashboard", icon: "🏠", label: "Dashboard" },
  { key: "product", icon: "🎂", label: "Products" },
  { key: "orders", icon: "📦", label: "Orders", badge: "3" },
  { key: "users", icon: "👥", label: "Users" },
  { key: "analytics", icon: "📊", label: "Analytics" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];

const Sidebar = ({ open, user, onLogout }) => {
  return (
   <nav className={`sidebar admin-shell  ${open ? "open" : ""}`}>
      
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
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
        >
          <span className="nav-icon">🎂</span>
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
        >
          <span className="nav-icon">📦</span>
          Orders
          <span className="nav-badge">3</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
        >
          <span className="nav-icon">👥</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
        >
          <span className="nav-icon">📊</span>
          Analytics
        </NavLink>

        {/* Settings */}
        <div className="sidebar-section-label">Settings</div>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `nav-item${isActive ? " active" : ""} `
          }
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
            style={{
              background: `linear-gradient(135deg, var(--rose), var(--caramel))`,
            }}
          >
            AU
          </div>

          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.name || "Admin"}
            </div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>

          <span
            className="logout-btn"
            title="Logout"
            onClick={onLogout}
          >
            ⏻
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;