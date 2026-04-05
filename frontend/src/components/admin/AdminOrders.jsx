import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", color: "#d97706" },
  shipped: { bg: "#e0e7ff", color: "#4f46e5" },
  delivered: { bg: "#dcfce7", color: "#16a34a" },
  cancelled: { bg: "#fee2e2", color: "#dc2626" }
};

const AdminOrders = () => {
  const { showToast } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      showToast("❌ Failed to load orders",err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      showToast("📝 Order status updated!");
      fetchOrders();
    } catch (err) {
      showToast("❌ Failed to update order", err);
    }
  };

 const filtered = orders.filter(o =>
  (statusFilter === "All" || (o.status || "").toLowerCase() === statusFilter.toLowerCase()) &&
  (
    (o.id || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.customer || "").toLowerCase().includes(search.toLowerCase())
  )
);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header-title">📦 Orders</div>
          <div className="page-header-sub">{orders.length} total orders</div>
        </div>
      </div>
      
      <div className="card">
        <div className="table-toolbar">
          <input className="search-input" placeholder="🔍 Search Order ID or Customer..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {["All", "pending", "shipped", "delivered", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><strong style={{fontFamily:"monospace"}}>{o.id?.substring(0,8)}</strong></td>
                <td>
                  <div style={{fontWeight:500}}>{o.customer}</div>
                  <div style={{fontSize:11, color:"var(--text-muted)"}}>{o.email}</div>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td><strong>₹{o.total}</strong></td>
                <td>
                  <span className="role-pill" style={{background: STATUS_COLORS[o.status]?.bg, color: STATUS_COLORS[o.status]?.color}}>
                   {o.status?.toLowerCase().toUpperCase()}
                  </span>
                </td>
                <td>
                  <select 
                    className="form-input" 
                    style={{padding: '4px 8px', width: 'auto',margin:"10px 0px",textAlign:"center", display:"flex",alignItems:"center",justifyContent:"center"}}
                    value={o.status?.toLowerCase()}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
             <div className="empty-state-icon">📦</div>
             <div className="empty-state-text">No orders found</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminOrders;
