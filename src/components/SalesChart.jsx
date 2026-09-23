import React, { useState } from 'react';

/**
 * SalesChart Component
 * Renders a crisp, interactive 30-day revenue trend using pure responsive SVG.
 * 
 * Features:
 * - Hover tooltips displaying exact date, revenue, and transaction count
 * - Summary chips (Peak Day, Daily Average, Total Volume)
 * - Deterministic data passed down via props
 */
export default function SalesChart({ dailyData = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="chart-card empty-state">
        <p>No daily sales data available.</p>
      </div>
    );
  }

  // Dimensions for SVG coordinate mapping
  const width = 800;
  const height = 260;
  const padding = { top: 25, right: 30, bottom: 45, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute scale boundaries
  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 100);
  const minRevenue = 0;
  // Round upper grid line to nearest clean number (e.g., 2000, 2500)
  const yUpper = Math.ceil(maxRevenue / 500) * 500;

  // Calculate coordinates for points
  const points = dailyData.map((d, index) => {
    const x = padding.left + (index / (dailyData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.revenue / yUpper) * chartHeight;
    return { ...d, x, y, index };
  });

  // Build SVG path strings for line and area fill
  const linePath = points.reduce((path, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${path} L ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${padding.top + chartHeight} L ${points[0].x},${padding.top + chartHeight} Z`;

  // Summary statistics
  const totalRev = dailyData.reduce((s, d) => s + d.revenue, 0);
  const dailyAvg = Math.round(totalRev / dailyData.length);
  const peakDay = dailyData.reduce((max, d) => (d.revenue > max.revenue ? d : max), dailyData[0]);

  // Format short date: "25 Aug"
  const formatShortDate = (isoStr) => {
    const parts = isoStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(parts[1], 10) - 1;
    return `${parts[2]} ${months[m]}`;
  };

  return (
    <div className="dashboard-card sales-chart-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Daily Sales Trend (30 Days)</h3>
          <p className="card-subtitle">Daily settled revenue across UPI, Cash, and Card</p>
        </div>
        <div className="chart-stats-pill-group">
          <div className="stat-pill">
            <span className="stat-label">Daily Avg:</span>
            <span className="stat-value">₹{dailyAvg.toLocaleString('en-IN')}</span>
          </div>
          <div className="stat-pill highlight">
            <span className="stat-label">Peak:</span>
            <span className="stat-value">₹{peakDay.revenue.toLocaleString('en-IN')} ({formatShortDate(peakDay.date)})</span>
          </div>
        </div>
      </div>

      <div className="svg-chart-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="responsive-sales-svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Paytm Navy-to-Cyan gradient fill */}
            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00BAF2" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#002E6E" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const val = Math.round(yUpper * ratio);
            return (
              <g key={ratio} className="grid-line-group">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray={ratio === 0 ? "0" : "3 3"}
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="axis-label"
                >
                  ₹{val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#salesGradient)" />

          {/* Line stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#00BAF2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Key X-Axis Date markers */}
          {points
            .filter((_, i) => i === 0 || i === 7 || i === 14 || i === 21 || i === points.length - 1)
            .map((pt) => (
              <text
                key={pt.date}
                x={pt.x}
                y={height - 12}
                textAnchor="middle"
                className="axis-label date-label"
              >
                {formatShortDate(pt.date)}
              </text>
            ))}

          {/* Interactive Data Points and Tooltips */}
          {points.map((pt) => (
            <g
              key={pt.date}
              className="chart-point-group"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Invisible wider target for easier mouse hovering */}
              <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" style={{ cursor: 'pointer' }} />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.date === pt.date ? "5" : "3"}
                fill={hoveredPoint?.date === pt.date ? "#002E6E" : "#00BAF2"}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip when hovering over a point */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`
            }}
          >
            <div className="tooltip-date">{formatShortDate(hoveredPoint.date)}</div>
            <div className="tooltip-amount">₹{hoveredPoint.revenue.toLocaleString('en-IN')}</div>
            <div className="tooltip-count">{hoveredPoint.count} transactions</div>
          </div>
        )}
      </div>
    </div>
  );
}
