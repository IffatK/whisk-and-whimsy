import { useState } from "react";
import { BarChart, DonutChart, StatusPill } from "./charts";
import { WEEKLY_REVENUE, WEEKLY_ORDERS, avatarColors } from "./data";
import { useOutletContext } from "react-router-dom"; 
const Dashboard = () => {
  const { products, orders, users }= useOutletContext(); 
  const [chartType, setChartType] = useState("revenue");
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0);
  // eslint-disable-next-line no-unused-vars
  const topProduct = [...products].sort((a, b) => b.sales - a.sales)[0];
  const pending = orders.filter(o => o.status === "Pending" || o.status === "Preparing").length;

  return (
    <div>
      <div className="stats-grid">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18.4%", up: true, icon: "💰", bg: "💸" },
          { label: "Total Orders", value: orders.length, change: "+12.1%", up: true, icon: "📦", bg: "📦" },
          { label: "Total Users", value: users.length, change: "+8.7%", up: true, icon: "👥", bg: "👤" },
          { label: "Pending Orders", value: pending, change: "-4.2%", up: false, icon: "⏳", bg: "⏰" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-bg">{s.bg}</div>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up ? "up" : "down"}`}>{s.change} vs last week</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">
              Sales Overview
              <div className="chart-tabs">
                <button className={`chart-tab${chartType === "revenue" ? " active" : ""}`} onClick={() => setChartType("revenue")}>Revenue</button>
                <button className={`chart-tab${chartType === "orders" ? " active" : ""}`} onClick={() => setChartType("orders")}>Orders</button>
              </div>
            </div>
            <BarChart
              data={chartType === "revenue" ? WEEKLY_REVENUE : WEEKLY_ORDERS}
              max={chartType === "revenue" ? 30000 : 90}
              type={chartType === "orders" ? "orders" : "revenue"}
            />
          </div>

          <div className="card">
            <div className="card-title">
              Recent Orders
              <button className="card-action">View all →</button>
            </div>
            {orders.slice(0, 5).map((o, i) => (
              <div key={i} className="mini-order">
                <div className="mini-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                  {o.customer.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="mini-order-info">
                  <div className="mini-order-name">{o.customer}</div>
                  <div className="mini-order-id">{o.id} · {o.items} items</div>
                </div>
                <div>
                  <div className="mini-order-amount">₹{o.total}</div>
                  <StatusPill status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Top Selling Products</div>
            {[...products].sort((a, b) => b.sales - a.sales).slice(0, 5).map((p, i) => (
              <div key={i} className="top-product">
                <img src={p.image} alt={p.name} className="top-product-img" />
                <div className="top-product-info">
                  <div className="top-product-name">{p.name}</div>
                  <div className="top-product-sales">{p.sales} sold · ₹{p.price}</div>
                  <div className="top-product-bar">
                    <div className="top-product-fill" style={{ width: `${(p.sales / 240) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Order Status</div>
            <DonutChart data={[
              { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length },
              { label: "Preparing", value: orders.filter(o => o.status === "Preparing").length },
              { label: "Pending", value: orders.filter(o => o.status === "Pending").length },
              { label: "Cancelled", value: orders.filter(o => o.status === "Cancelled").length },
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;