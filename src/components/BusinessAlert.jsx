import React from 'react';

/**
 * BusinessAlert Component
 * Renders rule-based operational alerts detected through deterministic statistical comparison.
 * 
 * IMPORTANT:
 * This component displays deterministic data-driven alerts, NOT AI-generated insights.
 */
export default function BusinessAlert({ alerts = [] }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  // Focus on the primary beverage alert as per specifications
  const primaryAlert = alerts.find((a) => a.category === 'Beverages') || alerts[0];

  return (
    <div className="business-alert-container">
      <div className="alert-card warning">
        <div className="alert-icon-col">
          <span className="alert-icon">⚠️</span>
        </div>

        <div className="alert-body">
          <div className="alert-tag-row">
            <span className="demo-alert-badge">
              ⚡ Deterministic Data-Driven Demo Alert
            </span>
            <span className="notice-subtext">
              (Calculated via rule-based run-rate analysis — NOT AI generated)
            </span>
          </div>

          <h3 className="alert-headline">
            Attention: Beverage sales have declined significantly in the latest period.
          </h3>

          <p className="alert-description">
            {primaryAlert.message} Average daily sales dropped from{' '}
            <strong>₹{primaryAlert.metrics.baselineDaily}/day</strong> down to{' '}
            <strong>₹{primaryAlert.metrics.recentDaily}/day</strong> (
            <span className="alert-stat-drop">{primaryAlert.metrics.percentageChange}%</span>
            ).
          </p>

          <div className="alert-action-box">
            <span className="action-tag">Recommended Merchant Action:</span>
            <span className="action-text">{primaryAlert.suggestedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
