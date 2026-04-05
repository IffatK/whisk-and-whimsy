import { useState } from "react";
import { BarChart, DonutChart, StatusPill } from "./charts";
import { avatarColors } from "./data";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { products, orders, users } = useOutletContext();
  const [chartType, setChartType] = useState("revenue");

  // ✅ Total revenue
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((a, o) => a + Number(o.total || 0), 0);

  // ✅ Pending orders
  const pending = orders.filter(
    o => o.status === "pending" || o.status === "Preparing"
  ).length;

  // ✅ Weekly data
  const weeklyRevenue = Array(7).fill(0);
  const weeklyOrders = Array(7).fill(0);

  orders.forEach(order => {
 const d = new Date(order.created_at || order.date);

if (isNaN(d)) return;

const day = d.getDay();
    weeklyRevenue[day] += Number(order.total || 0);
    weeklyOrders[day] += 1;
  });

  // ✅ Category map
  const categoryMap = {};
  products.forEach(p => {
    categoryMap[p.category] = 0;
  });

 orders.forEach(order => {
  const today = new Date();
  const d = new Date(order.created_at || order.date);
  if (isNaN(d)) return;

  const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));

  if (diff >= 0 && diff < 7) {
    const index = 6 - diff; // so today is last bar
    weeklyRevenue[index] += Number(order.total || 0);
    weeklyOrders[index] += 1;
  }
});

  // ✅ Status count
  const statusCount = {};
  orders.forEach(o => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  });

  const statusData = Object.entries(statusCount).map(([label, value]) => ({
    label,
    value
  }));

  // ✅ Product revenue
const productMap = {};
products.forEach(p => {
  productMap[p.product_id || p.id] = p;
});
const productRevenue = {};

orders.forEach(order => {
  
  order.items?.forEach(item => {
   
   const product = productMap[item.product_id || item.productId];

    if (!product) return;

    if (!productRevenue[product.name]) {
      productRevenue[product.name] = 0;
    }

    productRevenue[product.name] +=
      Number(product.price || 0) * (item.quantity || 1);
  });
});

  const topProducts = Object.entries(productRevenue)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
console.log("orders:", orders);
console.log("products:", products);
  return (
    <div>
      {/* ===== STATS ===== */}
      <div className="stats-grid">
        {[
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            change: "+18.4%",
            up: true,
            icon: "💰",
            bg: "💸"
          },
          {
            label: "Total Orders",
            value: orders.length,
            change: "+12.1%",
            up: true,
            icon: "📦",
            bg: "📦"
          },
          {
            label: "Total Users",
            value: users.length,
            change: "+8.7%",
            up: true,
            icon: "👥",
            bg: "👤"
          },
          {
            label: "Pending Orders",
            value: pending,
            change: "-4.2%",
            up: false,
            icon: "⏳",
            bg: "⏰"
          }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-bg">{s.bg}</div>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up ? "up" : "down"}`}>
              {s.change} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* LEFT */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">
              Sales Overview
              <div className="chart-tabs">
                <button
                  className={`chart-tab${
                    chartType === "revenue" ? " active" : ""
                  }`}
                  onClick={() => setChartType("revenue")}
                >
                  Revenue
                </button>
                <button
                  className={`chart-tab${
                    chartType === "orders" ? " active" : ""
                  }`}
                  onClick={() => setChartType("orders")}
                >
                  Orders
                </button>
              </div>
            </div>

            <BarChart
              data={chartType === "revenue" ? weeklyRevenue : weeklyOrders}
              max={
                chartType === "revenue"
                  ? Math.max(...weeklyRevenue, 1)
                  : Math.max(...weeklyOrders, 1)
              }
              type={chartType}
            />
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="card-title">
              Recent Orders
              <button className="card-action">View all →</button>
            </div>

            {orders.slice(0, 5).map((o, i) => (
              <div key={i} className="mini-order">
                <div
                  className="mini-avatar"
                  style={{
                    background: avatarColors[i % avatarColors.length]
                  }}
                >
                  {o.customer?.name?.split(" ").map(w => w[0]).join("")}
                </div>

                <div className="mini-order-info">
                  <div className="mini-order-name">{o.customer?.name}</div>
                  <div className="mini-order-id">
                    {o.id} · {o.items?.length || 0} items
                  </div>
                </div>

                <div>
                  <div className="mini-order-amount">₹{o.total}</div>
                  <StatusPill status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Top Products */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Top Selling Products</div>

            {topProducts.map((p, i) => (
              <div key={i} className="top-product">
                <div className="top-product-info">
                  <div className="top-product-name">{p.name}</div>
                  <div className="top-product-sales">
                    ₹{p.revenue.toLocaleString()}
                  </div>

                  <div className="top-product-bar">
                    <div
                      className="top-product-fill"
                      style={{
                        width: `${
                          (p.revenue / topProducts[0].revenue) * 100
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="card">
            <div className="card-title">Order Status</div>
            <DonutChart data={statusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;