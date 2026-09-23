import React from 'react';

/**
 * Header Component
 * Displays application branding, merchant identity, Paytm Soundbox status, and active date filter.
 */
export default function Header({ merchantProfile }) {
  const { businessName, merchantCategory, location, soundboxActive } = merchantProfile;

  return (
    <header className="dashboard-header">
      <div className="header-brand-section">
        <div className="brand-logo-badge">
          <div className="paytm-pill">
            <span className="paytm-logo-text">Paytm</span>
            <span className="bizpilot-badge">BizPilot AI</span>
          </div>
          <span className="hackathon-tag">Track 1: Merchant Growth AI</span>
        </div>
        <h1 className="header-tagline">AI Business Partner for Smarter Merchant Growth</h1>
      </div>

      <div className="header-merchant-section">
        <div className="merchant-info-card">
          <div className="merchant-avatar">
            <span>🏪</span>
          </div>
          <div className="merchant-details">
            <div className="merchant-title-row">
              <h2 className="merchant-name">{businessName}</h2>
              {soundboxActive && (
                <span className="soundbox-badge" title="Demo Merchant Environment - Local Analytics Engine Connected">
                  <span className="pulse-dot"></span>
                  Demo Merchant • Analytics Connected
                </span>
              )}
            </div>
            <p className="merchant-meta">
              <span>{merchantCategory}</span> • <span>{location}</span>
            </p>
          </div>
        </div>

        <div className="date-filter-badge">
          <span className="calendar-icon">📅</span>
          <div>
            <div className="filter-label">Reporting Period</div>
            <div className="filter-val">Last 30 Days (25 Aug – 23 Sep 2026)</div>
          </div>
        </div>
      </div>
    </header>
  );
}
