import React from 'react';

/**
 * CustomerInsights Component
 * Shows repeat vs new transaction mix and spending patterns.
 *
 * Note:
 * The demo dataset classifies transactions as New or Repeat.
 * Therefore, the counts below represent transactions, not unique customers.
 */
export default function CustomerInsights({ customerData }) {
  if (!customerData) return null;

  const {
    newCount,
    repeatCount,
    totalCount,
    newPercentage,
    repeatPercentage,
    newRevenue,
    repeatRevenue
  } = customerData;

  const avgRepeatSpend =
    repeatCount > 0 ? Math.round(repeatRevenue / repeatCount) : 0;

  const avgNewSpend =
    newCount > 0 ? Math.round(newRevenue / newCount) : 0;

  return (
    <div className="dashboard-card customer-card">
      {/* Header */}
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Customer Retention & Mix</h3>
          <p className="card-subtitle">
            Repeat vs new transaction segments
          </p>
        </div>

        <span className="retention-pill">
          <strong>{repeatPercentage}%</strong> Repeat Share
        </span>
      </div>

      <div className="customer-split-container">

        {/* Transaction Mix Bar */}
        <div className="customer-ratio-bar">
          <div
            className="ratio-fill repeat"
            style={{ width: `${repeatPercentage}%` }}
            title={`Repeat transactions: ${repeatPercentage}%`}
          >
            {repeatPercentage > 20 && `${repeatPercentage}% Repeat`}
          </div>

          <div
            className="ratio-fill new"
            style={{ width: `${newPercentage}%` }}
            title={`New transactions: ${newPercentage}%`}
          >
            {newPercentage > 20 && `${newPercentage}% New`}
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="customer-cards-grid">

          {/* Repeat Segment */}
          <div className="customer-detail-box repeat-box">
            <div className="box-header">
              <span className="box-badge repeat">
                🔄 Repeat
              </span>

              <span className="box-count">
                {repeatCount} transactions
              </span>
            </div>

            <div className="box-metrics">

              <div className="metric-row">
                <span className="metric-lbl">
                  Revenue:
                </span>

                <span className="metric-val">
                  ₹{repeatRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-lbl">
                  Avg Transaction:
                </span>

                <span className="metric-val highlight">
                  ₹{avgRepeatSpend}
                </span>
              </div>

            </div>

            <div className="box-footer-note">
              Repeat transactions have a higher average ticket
              than new-customer transactions.
            </div>
          </div>

          {/* New Segment */}
          <div className="customer-detail-box new-box">
            <div className="box-header">
              <span className="box-badge new">
                ✨ New
              </span>

              <span className="box-count">
                {newCount} transactions
              </span>
            </div>

            <div className="box-metrics">

              <div className="metric-row">
                <span className="metric-lbl">
                  Revenue:
                </span>

                <span className="metric-val">
                  ₹{newRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-lbl">
                  Avg Transaction:
                </span>

                <span className="metric-val">
                  ₹{avgNewSpend}
                </span>
              </div>

            </div>

            <div className="box-footer-note">
              New-customer transactions have a lower average
              ticket than repeat transactions.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}