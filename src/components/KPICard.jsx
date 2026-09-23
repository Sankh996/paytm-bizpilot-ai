import React from 'react';

/**
 * Reusable KPI Card Component
 * Formats key operational metrics with icons, badges, and contextual subtext.
 * 
 * @param {object} props
 * @param {string} props.title - Metric title (e.g. "Total Sales")
 * @param {string|number} props.value - Formatted value
 * @param {string} props.icon - Emoji or icon symbol
 * @param {string} props.subtext - Contextual help text or secondary detail
 * @param {string} props.badge - Small status badge (e.g. "Settled", "30 Days")
 * @param {string} props.accentColor - Accent color class or indicator
 */
export default function KPICard({
  title,
  value,
  icon,
  subtext,
  badge,
  accent = 'cyan'
}) {
  return (
    <div className={`kpi-card accent-${accent}`}>
      <div className="kpi-card-header">
        <span className="kpi-title">{title}</span>
        <div className="kpi-icon-wrap">{icon}</div>
      </div>
      <div className="kpi-value-row">
        <div className="kpi-value">{value}</div>
        {badge && <span className="kpi-badge">{badge}</span>}
      </div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
}
