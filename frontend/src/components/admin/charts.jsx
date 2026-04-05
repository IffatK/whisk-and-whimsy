/**
 * charts.jsx — Recharts-powered, fully importable
 *
 * Drop-in replacement for the original charts.jsx.
 * Same prop API as before — works with all existing parent components.
 *
 * Install peer dep if not already:  npm install recharts
 *
 * Usage examples:
 *   import { BarChart, DonutChart, Toast, StatusPill } from "./charts";
 *
 *   <BarChart data={[42, 78, 55, 91, 63, 110, 38]} max={130} type="orders" />
 *   <DonutChart data={[{ label: "Cakes", value: 38 }, ...]} />
 *   <Toast msg="Order placed!" icon="🎉" />
 *   <StatusPill status="Active" />
 */

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { DAYS } from "./data";

/* ─── Shared tokens ─────────────────────────────────────── */
const PALETTE = ["#FF8FAB", "#D4845A", "#C9B8E8", "#A8C5A0", "#F2A654"];
const CHOCOLATE = "#3B1F0E";
const CREAM = "#FAF3E8";
const MUTED = "#9E8A78";

/* ══════════════════════════════════════════════════════════
   BAR CHART
   Props (same as original):
     data  — number[]          e.g. [42, 78, 55, 91, 63, 110, 38]
     max   — number            used as Y-axis domain ceiling
     type  — "orders" | string controls bar colour
══════════════════════════════════════════════════════════ */

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <p style={s.tooltipLabel}>{label}</p>
      <p style={s.tooltipValue}>{payload[0].value}</p>
    </div>
  );
};

export const BarChart = ({ data = [], max, type }) => {
  // Convert raw number array → recharts-friendly [{ day, value }]
  const chartData = data.map((v, i) => ({ day: DAYS?.[i] ?? `D${i + 1}`, value: v }));
  const yMax = max ?? Math.max(...data, 0);
  const barColor = type === "orders" ? "#D4845A" : "#C9B8E8";

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={160}>
        <ReBarChart data={chartData} barCategoryGap="32%">
          <CartesianGrid vertical={false} stroke={CREAM} strokeWidth={1.5} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: MUTED, fontFamily: "DM Sans, sans-serif", fontSize: 12 }}
          />
          <YAxis
            domain={[0, yMax]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: MUTED, fontFamily: "DM Sans, sans-serif", fontSize: 11 }}
            width={28}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(59,31,14,0.04)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive>
            {chartData.map((_, i) => (
              <Cell key={i} fill={barColor} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   DONUT CHART
   Props (same as original):
     data — { label: string; value: number }[]
══════════════════════════════════════════════════════════ */

const DonutCenterLabel = ({ cx, cy, total }) => (
  <>
    <text
      x={cx} y={cy - 7}
      textAnchor="middle" fontSize={11}
      fill={MUTED} fontFamily="DM Sans, sans-serif"
    >
      Total
    </text>
    <text
      x={cx} y={cy + 13}
      textAnchor="middle" fontSize={19}
      fill={CHOCOLATE}
      fontFamily="Playfair Display, serif"
      fontWeight="bold"
    >
      {total}
    </text>
  </>
);

export const DonutChart = ({ data = [] }) => {
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="donut-wrap">
      <PieChart width={140} height={140}>
        <Pie
          data={data}
          cx={65}
          cy={65}
          innerRadius={44}
          outerRadius={62}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          paddingAngle={2}
          isAnimationActive
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <g>
          <DonutCenterLabel cx={65} cy={65} total={total} />
        </g>
      </PieChart>

      {/* Legend — same class names as original */}
      <div>
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={i} className="legend-item">
              <div className="legend-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span style={{ color: "var(--text-muted, #9E8A78)" }}>{d.label}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontWeight: 600,
                  color: "var(--text, #3B1F0E)",
                  paddingLeft: 12,
                }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   TOAST
   Props (same as original):
     msg  — string
     icon — string (default "✓")
══════════════════════════════════════════════════════════ */

export const Toast = ({ msg, icon = "✓" }) => (
  <div className="toast">
    {icon} {msg}
  </div>
);

/* ══════════════════════════════════════════════════════════
   STATUS PILL
   Props (same as original):
     status — string  e.g. "Active", "Pending", "Cancelled"
══════════════════════════════════════════════════════════ */

export const StatusPill = ({ status }) => {
  const s = status.toLowerCase().replace(/\s+/g, "-");
  return (
    <span className={`status-pill status-${s}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
};

/* ─── Tooltip styles (self-contained, no CSS file needed) ── */
const s = {
  tooltip: {
    background: "#fff",
    border: `1.5px solid ${CREAM}`,
    borderRadius: 10,
    padding: "8px 14px",
    boxShadow: "0 4px 16px rgba(59,31,14,0.1)",
    fontFamily: "DM Sans, sans-serif",
  },
  tooltipLabel: {
    margin: 0,
    fontSize: 11,
    color: MUTED,
  },
  tooltipValue: {
    margin: "2px 0 0",
    fontSize: 18,
    fontWeight: 700,
    color: CHOCOLATE,
    fontFamily: "Playfair Display, serif",
  },
};