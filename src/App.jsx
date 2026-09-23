import React, { useMemo } from 'react';
import './App.css';

// Import realistic merchant dataset and profile
import { MERCHANT_PROFILE, mockTransactions } from './data/transactions.js';

// Import deterministic analytics & alert functions
import {
  calculateOverallMetrics,
  detectBusinessAlerts
} from './utils/analytics.js';

// Import modular dashboard components
import Header from './components/Header.jsx';
import KPICard from './components/KPICard.jsx';
import SalesChart from './components/SalesChart.jsx';
import CategoryPerformance from './components/CategoryPerformance.jsx';
import PaymentBreakdown from './components/PaymentBreakdown.jsx';
import CustomerInsights from './components/CustomerInsights.jsx';
import BusinessAlert from './components/BusinessAlert.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import AIAdvisor from './components/AIAdvisor.jsx';

/**
 * Main Application Component: Paytm BizPilot AI Merchant Dashboard
 *
 * Demonstrates:
 * - Deterministic analytics calculations
 * - Clean Paytm-themed financial UI
 * - Rule-based operational alerts
 * - AI-powered merchant business guidance
 * - Modular, reusable component architecture
 */
export default function App() {
  // Compute metrics deterministically
  const metrics = useMemo(() => {
    return calculateOverallMetrics(mockTransactions);
  }, []);

  // Detect deterministic business alerts
  const businessAlerts = useMemo(() => {
    return detectBusinessAlerts(mockTransactions);
  }, []);

  return (
    <div className="bizpilot-app-container">

      {/* 1. Merchant Header */}
      <Header merchantProfile={MERCHANT_PROFILE} />

      <main className="dashboard-main-content">

        {/* 2. Deterministic Business Alert Banner */}
        <BusinessAlert alerts={businessAlerts} />

        {/* 3. Primary KPI Summary Cards */}
        <section
          className="kpi-grid-section"
          aria-label="Key Performance Indicators"
        >

          <KPICard
            title="Total Settled Revenue"
            value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
            icon="💰"
            subtext="30-day verified collections"
            badge="Settled"
            accent="cyan"
          />

          <KPICard
            title="Total Transactions"
            value={metrics.totalTransactions.toLocaleString('en-IN')}
            icon="🧾"
            subtext="Digital QR + Counter cash"
            badge="30 Days"
            accent="navy"
          />

          <KPICard
            title="Average Ticket Size"
            value={`₹${metrics.averageValue}`}
            icon="📈"
            subtext="Avg. spend per checkout"
            badge="AOV"
            accent="blue"
          />

          <KPICard
            title="Repeat Transaction Share"
            value={`${metrics.customerBreakdown.repeatPercentage}%`}
            icon="👥"
            subtext={`${metrics.customerBreakdown.repeatCount} repeat transactions`}
            badge="Repeat"
            accent="teal"
          />

        </section>

        {/* 4. AI Business Advisor */}
        <section
          className="dashboard-full-section"
          aria-label="AI Business Advisor"
        >
          <AIAdvisor
            metrics={metrics}
            alerts={businessAlerts}
            merchantProfile={MERCHANT_PROFILE}
          />
        </section>

        {/* 5. Sales Trend & Category Performance */}
        <section className="dashboard-two-col-grid">

          <div className="grid-col-large">
            <SalesChart dailyData={metrics.revenueByDay} />
          </div>

          <div className="grid-col-small">
            <CategoryPerformance
              categoryData={metrics.categoryBreakdown}
            />
          </div>

        </section>

        {/* 6. Payment Mode & Customer Transaction Mix */}
        <section className="dashboard-two-col-grid">

          <div className="grid-col-half">
            <PaymentBreakdown
              paymentData={metrics.paymentBreakdown}
            />
          </div>

          <div className="grid-col-half">
            <CustomerInsights
              customerData={metrics.customerBreakdown}
            />
          </div>

        </section>

        {/* 7. Recent Transactions */}
        <section className="dashboard-full-section">
          <TransactionTable
            transactions={mockTransactions}
          />
        </section>

      </main>

      {/* Footer & Prototype Disclaimer */}
      <footer className="dashboard-footer">
        <div className="footer-content">

          <div className="footer-left">
            <strong>Paytm BizPilot AI</strong>
            {' — '}
            Merchant Growth AI Hackathon Project
          </div>

          <div className="footer-right">
            <span>
              Fictional merchant demo data for Raj General Store.
              No real Paytm merchant accounts accessed.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}