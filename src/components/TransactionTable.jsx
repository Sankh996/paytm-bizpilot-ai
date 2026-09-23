import React, { useState, useMemo } from 'react';

/**
 * TransactionTable Component
 * Responsive, searchable, and filterable table displaying merchant transaction records.
 */
export default function TransactionTable({ transactions = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique categories and payment methods for dropdown filters
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.productCategory));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  const paymentMethods = useMemo(() => {
    const set = new Set(transactions.map((t) => t.paymentMethod));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Filter transactions based on search query and dropdown selections
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.productCategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' || txn.productCategory === selectedCategory;

      const matchesPay =
        selectedPayment === 'ALL' || txn.paymentMethod === selectedPayment;

      return matchesSearch && matchesCat && matchesPay;
    });
  }, [transactions, searchTerm, selectedCategory, selectedPayment]);

  // Calculate pagination slice
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Settled':
        return <span className="status-badge settled">● Settled</span>;
      case 'Pending':
        return <span className="status-badge pending">⏳ Pending</span>;
      case 'Failed':
        return <span className="status-badge failed">✕ Failed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPaymentBadge = (method) => {
    switch (method) {
      case 'UPI':
        return <span className="method-pill upi">UPI</span>;
      case 'Cash':
        return <span className="method-pill cash">Cash</span>;
      case 'Card':
        return <span className="method-pill card">Card</span>;
      default:
        return <span className="method-pill">{method}</span>;
    }
  };

  return (
    <div className="dashboard-card transactions-card">
      <div className="card-header-row table-header-controls">
        <div>
          <h3 className="card-title">Recent Transactions</h3>
          <p className="card-subtitle">
            Showing {filteredTransactions.length} recorded merchant payments
          </p>
        </div>

        {/* Filter Controls */}
        <div className="table-filters-row">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search product, category, or ID..."
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
              className="table-search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={handleFilterChange(setSelectedCategory)}
            className="table-filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedPayment}
            onChange={handleFilterChange(setSelectedPayment)}
            className="table-filter-select"
          >
            {paymentMethods.map((pay) => (
              <option key={pay} value={pay}>
                Payment: {pay}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="table-responsive-wrapper">
        <table className="merchant-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>Product</th>
              <th>Category</th>
              <th className="text-right">Amount</th>
              <th>Payment</th>
              <th>Customer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="cell-id">{txn.id}</td>
                  <td className="cell-datetime">
                    <span className="date-main">{txn.date}</span>
                    <span className="time-sub">{txn.time}</span>
                  </td>
                  <td className="cell-product font-medium">{txn.productName}</td>
                  <td className="cell-category">
                    <span className="category-tag">{txn.productCategory}</span>
                  </td>
                  <td className="cell-amount text-right">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="cell-payment">{getPaymentBadge(txn.paymentMethod)}</td>
                  <td className="cell-customer">
                    <span className={`customer-badge ${txn.customerType.toLowerCase()}`}>
                      {txn.customerType}
                    </span>
                  </td>
                  <td className="cell-status">{getStatusBadge(txn.settlementStatus)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  No transactions match your search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-footer">
        <div className="pagination-info">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
          {filteredTransactions.length} total entries)
        </div>

        <div className="pagination-buttons">
          <button
            type="button"
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
