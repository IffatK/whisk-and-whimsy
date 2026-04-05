import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";

const AdminUsers = () => {
  const { showToast } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all');
      // api.get returns { data } — handle both array and wrapped { data: [] }
      setUsers(Array.isArray(res.data) ? res.data : res.data?.data ?? []);
    } catch (err) {
      showToast("❌ Failed to load users");
    }
  };

  const filtered = users.filter(u => {
    const name  = (u.name  ?? "").toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    const role  = (u.role  ?? "user");
    const q     = search.toLowerCase();

    return (roleFilter === "All" || role === roleFilter) &&
           (name.includes(q) || email.includes(q));
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header-title">👥 Users</div>
          <div className="page-header-sub">{users.length} registered accounts</div>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="🔍 Search Name or Email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>User Info</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const role = u.role ?? "user";
              return (
                <tr key={u.user_id}>
                  <td>
                    <div style={{ fontWeight: 500, margin: "15px 0 0 0" }}>
                      {u.name ?? "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: "10px" }}>
                      {u.email ?? "—"}
                    </div>
                  </td>
                  <td>{u.phone || "N/A"}</td>
                  <td>
                    <span className={`role-pill ${role === "admin" ? "role-admin" : "role-customer"}`}>
                      {role.toUpperCase()} {/* ✅ safe — role is never null here */}
                    </span>
                  </td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">No users found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;