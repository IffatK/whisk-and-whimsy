import { BarChart } from "./charts";
import { DonutChart } from "./charts";

import { useOutletContext } from "react-router-dom";
const AdminAnalytics = () => {
   const { products, orders }= useOutletContext();
  const weeklyRevenue = Array(7).fill(0);
const weeklyOrders = Array(7).fill(0);

orders.forEach(order => {
  const day = new Date(order.created_at).getDay(); // 0–6
  weeklyRevenue[day] += Number(order.total || 0);
  weeklyOrders[day] += 1;
});
 
  const totalRevenue = orders
  .filter(o => o.status !== "Cancelled")
  .reduce((a, o) => a + Number(o.total || 0), 0);
  const avgOrder = orders.length
  ? Math.round(totalRevenue / orders.length)
  : 0;
const productSales = {};

orders.forEach(order => {
  const day = new Date(order.date).getDay();

  weeklyRevenue[day] += Number(order.total || 0);
  weeklyOrders[day] += 1;
});

const productsWithSales = products.map(p => ({
  ...p,
  sales: productSales[p.product_id] || 0
}));
  return (
    
    <div>
      <div className="page-header">
        <div>
          <div className="page-header-title">📊 Analytics</div>
          <div className="page-header-sub">Business performance overview</div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰" },
          { label: "Avg. Order Value", value: `₹${avgOrder}`, icon: "🛒" },
          { label: "Conversion Rate", value: "68.4%", icon: "📈" },
          { label: "Repeat Customers", value: "42%", icon: "❤️" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        <div className="card">
          <div className="card-title">Weekly Revenue</div>
          <BarChart data={weeklyRevenue} max={Math.max(...weeklyRevenue, 1)} type="revenue" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
            <span>Peak: ₹28,600 (Sat)</span>
            <span>Avg: ₹{Math.round(weeklyRevenue.reduce((a, b) => a + b) / 7).toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Weekly Orders</div>
          <BarChart data={weeklyOrders} max={Math.max(...weeklyOrders, 1)} type="orders" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
            <span>Peak: 84 orders (Sat)</span>
            <span>Avg: {Math.round(weeklyOrders.reduce((a, b) => a + b) / 7)} orders/day</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Category Breakdown</div>
          <DonutChart data={[
            { label: "Cakes", value: 3 },
            { label: "Cookies", value: 1 },
            { label: "Puddings", value: 2 },
            { label: "Pastries", value: 1 },
            { label: "Mousses", value: 1 },
          ]} />
        </div>

        <div className="card">
          <div className="card-title">Top Products by Revenue</div>
          {[...productsWithSales].sort((a, b) => b.sales * b.price - a.sales * a.price).slice(0, 5).map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 22, height: 22, background: `linear-gradient(135deg, var(--rose), var(--caramel))`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.sales} units sold</div>
              </div>
              <strong style={{ color: "var(--rose-dark)" }}>₹{(p.sales * p.price).toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AdminAnalytics
