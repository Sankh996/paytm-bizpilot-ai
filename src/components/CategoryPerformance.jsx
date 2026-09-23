import React from 'react';

/**
 * CategoryPerformance Component
 * Displays revenue, volume, and share across product categories with visual progress bars.
 */
export default function CategoryPerformance({ categoryData = [] }) {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Dairy': return '🥛';
      case 'Grocery': return '🌾';
      case 'Snacks': return '🍪';
      case 'Beverages': return '🥤';
      case 'Personal Care': return '🧼';
      case 'Household': return '🧹';
      default: return '📦';
    }
  };

  return (
    <div className="dashboard-card category-card">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">Category Performance</h3>
          <p className="card-subtitle">Revenue share & product category distribution</p>
        </div>
      </div>

      <div className="category-list">
        {categoryData.map((item, index) => {
          const isTop = index === 0;
          const isDeclining = item.category === 'Beverages';

          return (
            <div key={item.category} className="category-item-row">
              <div className="category-info-col">
                <span className="category-emoji">{getCategoryIcon(item.category)}</span>
                <div className="category-text">
                  <div className="category-title-row">
                    <span className="category-name">{item.category}</span>
                    {isTop && <span className="cat-badge top">Top Seller</span>}
                    {isDeclining && <span className="cat-badge alert">Declining</span>}
                  </div>
                  <span className="category-meta">{item.count} items sold</span>
                </div>
              </div>

              <div className="category-bar-col">
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill ${isTop ? 'primary' : ''} ${isDeclining ? 'warning' : ''}`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="category-numbers-col">
                <span className="category-amount">₹{item.revenue.toLocaleString('en-IN')}</span>
                <span className="category-share">{item.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
