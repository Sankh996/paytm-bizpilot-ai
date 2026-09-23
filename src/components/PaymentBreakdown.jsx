import React from 'react';

/**
 * PaymentBreakdown Component
 * Displays settlement and volume distribution between UPI, Cash, and Card.
 */
export default function PaymentBreakdown({ paymentData = [] }) {
  const getMethodDetails = (method) => {
    switch (method) {
      case 'UPI':
        return {
          icon: '⚡',
          label: 'UPI (Paytm QR & Soundbox)',
          tag: 'Most Popular',
          accent: 'upi-accent'
        };
      case 'Cash':
        return {
          icon: '💵',
          label: 'Cash (Counter)',
          tag: 'Instant Settlement',
          accent: 'cash-accent'
        };
      case 'Card':
        return {
          icon: '💳',
          label: 'Debit / Credit Card',
          tag: 'POS Terminal',
          accent: 'card-accent'
        };
      default:
        return {
          icon: '💰',
          label: method,
          tag: '',
          accent: 'default-accent'
        };
    }
  };

  return (
    <div className="dashboard-card payment-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Payment Breakdown</h3>
          <p className="card-subtitle">Collection channels & payment modes</p>
        </div>
      </div>

      {/* Visual combined split bar */}
      <div className="payment-stacked-bar">
        {paymentData.map((item) => (
          <div
            key={item.method}
            className={`bar-segment segment-${item.method.toLowerCase()}`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.method}: ${item.percentage}% (₹${item.revenue})`}
          />
        ))}
      </div>

      <div className="payment-methods-grid">
        {paymentData.map((item) => {
          const details = getMethodDetails(item.method);
          return (
            <div key={item.method} className={`payment-method-box ${details.accent}`}>
              <div className="payment-box-top">
                <span className="method-icon">{details.icon}</span>
                <span className="method-percentage">{item.percentage}%</span>
              </div>
              <div className="method-name">{details.label}</div>
              <div className="method-revenue">₹{item.revenue.toLocaleString('en-IN')}</div>
              <div className="method-txns">{item.count} transactions</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
