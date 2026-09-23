/**
 * Deterministic Business Analytics Utilities for Paytm BizPilot AI
 * 
 * Provides pure JavaScript functions to calculate retail KPIs from transaction data:
 * - Revenue, transaction counts, average order value
 * - Daily trends, category breakdowns, payment method splits
 * - Customer retention metrics (Repeat vs New)
 * - Peak trading hours
 * 
 * NOTE: These calculations are 100% deterministic (no AI involved).
 */

/**
 * 1. Total Revenue
 * Calculates total sales amount, defaulting to only settled transactions.
 * 
 * @param {Array} transactions - Array of transaction objects
 * @param {boolean} onlySettled - If true, only sums "Settled" transactions
 * @returns {number} Total revenue in INR
 */
export function calculateTotalRevenue(transactions = [], onlySettled = true) {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;

  return transactions.reduce((sum, txn) => {
    if (onlySettled && txn.settlementStatus !== "Settled") {
      return sum;
    }
    return sum + (Number(txn.amount) || 0);
  }, 0);
}

/**
 * 2. Total Transactions Count
 * 
 * @param {Array} transactions
 * @returns {number} Count of total transactions
 */
export function calculateTotalTransactions(transactions = []) {
  if (!Array.isArray(transactions)) return 0;
  return transactions.length;
}

/**
 * 3. Average Transaction Value (ATV / Ticket Size)
 * 
 * @param {Array} transactions
 * @param {boolean} onlySettled
 * @returns {number} Average amount per transaction rounded to 2 decimal places
 */
export function calculateAverageTransactionValue(transactions = [], onlySettled = true) {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;

  const validTransactions = onlySettled
    ? transactions.filter((t) => t.settlementStatus === "Settled")
    : transactions;

  if (validTransactions.length === 0) return 0;

  const total = validTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  return Math.round((total / validTransactions.length) * 100) / 100;
}

/**
 * 4. Revenue by Day
 * Groups sales and transaction count by date in chronological order.
 * 
 * @param {Array} transactions
 * @param {boolean} onlySettled
 * @returns {Array<{ date: string, revenue: number, count: number }>}
 */
export function calculateRevenueByDay(transactions = [], onlySettled = true) {
  if (!Array.isArray(transactions)) return [];

  const dayMap = {};

  for (const txn of transactions) {
    if (onlySettled && txn.settlementStatus !== "Settled") continue;

    const dateKey = txn.date;
    if (!dayMap[dateKey]) {
      dayMap[dateKey] = { date: dateKey, revenue: 0, count: 0 };
    }
    dayMap[dateKey].revenue += Number(txn.amount) || 0;
    dayMap[dateKey].count += 1;
  }

  // Sort dates chronologically
  return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 5. Revenue by Product Category
 * Calculates sales volume, transaction frequency, and share percentage per category.
 * 
 * @param {Array} transactions
 * @param {boolean} onlySettled
 * @returns {Array<{ category: string, revenue: number, count: number, percentage: number }>}
 */
export function calculateRevenueByCategory(transactions = [], onlySettled = true) {
  if (!Array.isArray(transactions)) return [];

  const categoryMap = {};
  let totalRevenue = 0;

  for (const txn of transactions) {
    if (onlySettled && txn.settlementStatus !== "Settled") continue;

    const cat = txn.productCategory || "Uncategorized";
    const amount = Number(txn.amount) || 0;

    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, revenue: 0, count: 0 };
    }
    categoryMap[cat].revenue += amount;
    categoryMap[cat].count += 1;
    totalRevenue += amount;
  }

  return Object.values(categoryMap)
    .map((item) => ({
      ...item,
      percentage: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue); // Highest revenue first
}

/**
 * 6. Revenue by Payment Method
 * Breakdown between UPI, Cash, and Card.
 * 
 * @param {Array} transactions
 * @param {boolean} onlySettled
 * @returns {Array<{ method: string, revenue: number, count: number, percentage: number }>}
 */
export function calculateRevenueByPaymentMethod(transactions = [], onlySettled = true) {
  if (!Array.isArray(transactions)) return [];

  const methodMap = {};
  let totalRevenue = 0;

  for (const txn of transactions) {
    if (onlySettled && txn.settlementStatus !== "Settled") continue;

    const method = txn.paymentMethod || "Unknown";
    const amount = Number(txn.amount) || 0;

    if (!methodMap[method]) {
      methodMap[method] = { method, revenue: 0, count: 0 };
    }
    methodMap[method].revenue += amount;
    methodMap[method].count += 1;
    totalRevenue += amount;
  }

  return Object.values(methodMap)
    .map((item) => ({
      ...item,
      percentage: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * 7. Customer Type Breakdown (New vs Repeat)
 * 
 * @param {Array} transactions
 * @returns {{
 *   newCount: number,
 *   repeatCount: number,
 *   totalCount: number,
 *   newPercentage: number,
 *   repeatPercentage: number,
 *   newRevenue: number,
 *   repeatRevenue: number
 * }}
 */
export function calculateCustomerTypeMetrics(transactions = []) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      newCount: 0,
      repeatCount: 0,
      totalCount: 0,
      newPercentage: 0,
      repeatPercentage: 0,
      newRevenue: 0,
      repeatRevenue: 0
    };
  }

  let newCount = 0;
  let repeatCount = 0;
  let newRevenue = 0;
  let repeatRevenue = 0;

  for (const txn of transactions) {
    const isSettled = txn.settlementStatus === "Settled";
    const amount = Number(txn.amount) || 0;

    if (txn.customerType === "Repeat") {
      repeatCount++;
      if (isSettled) repeatRevenue += amount;
    } else {
      newCount++;
      if (isSettled) newRevenue += amount;
    }
  }

  const total = newCount + repeatCount;

  return {
    newCount,
    repeatCount,
    totalCount: total,
    newPercentage: total > 0 ? Math.round((newCount / total) * 1000) / 10 : 0,
    repeatPercentage: total > 0 ? Math.round((repeatCount / total) * 1000) / 10 : 0,
    newRevenue,
    repeatRevenue
  };
}

/**
 * 8. Peak Transaction Hours
 * Analyzes footfall and sales across operating hours (07:00 to 22:00).
 * 
 * @param {Array} transactions
 * @returns {{
 *   hourlyBreakdown: Array<{ hour: number, label: string, count: number, revenue: number }>,
 *   peakHour: { hour: number, label: string, count: number, revenue: number } | null
 * }}
 */
export function calculatePeakTransactionHours(transactions = []) {
  if (!Array.isArray(transactions)) {
    return { hourlyBreakdown: [], peakHour: null };
  }

  // Pre-populate operational hours (07:00 to 22:00)
  const hourMap = {};
  for (let h = 7; h <= 22; h++) {
    const nextH = h + 1;
    const label = `${String(h).padStart(2, "0")}:00 - ${String(nextH).padStart(2, "0")}:00`;
    hourMap[h] = { hour: h, label, count: 0, revenue: 0 };
  }

  for (const txn of transactions) {
    if (!txn.time) continue;
    const hour = parseInt(txn.time.split(":")[0], 10);
    const amount = Number(txn.amount) || 0;

    if (hourMap[hour]) {
      hourMap[hour].count += 1;
      if (txn.settlementStatus === "Settled") {
        hourMap[hour].revenue += amount;
      }
    }
  }

  const hourlyBreakdown = Object.values(hourMap);

  // Identify peak hour by transaction count
  let peakHour = null;
  for (const item of hourlyBreakdown) {
    if (!peakHour || item.count > peakHour.count) {
      peakHour = item;
    }
  }

  return {
    hourlyBreakdown,
    peakHour
  };
}

/**
 * Consolidated Summary KPI Helper
 * Aggregates all basic metrics into one clean snapshot.
 * 
 * @param {Array} transactions
 * @returns {object} Full merchant metrics summary
 */
export function calculateOverallMetrics(transactions = []) {
  const totalRevenue = calculateTotalRevenue(transactions);
  const totalTransactions = calculateTotalTransactions(transactions);
  const averageValue = calculateAverageTransactionValue(transactions);
  const revenueByDay = calculateRevenueByDay(transactions);
  const categoryBreakdown = calculateRevenueByCategory(transactions);
  const paymentBreakdown = calculateRevenueByPaymentMethod(transactions);
  const customerBreakdown = calculateCustomerTypeMetrics(transactions);
  const peakHours = calculatePeakTransactionHours(transactions);

  return {
    totalRevenue,
    totalTransactions,
    averageValue,
    revenueByDay,
    categoryBreakdown,
    paymentBreakdown,
    customerBreakdown,
    peakHours
  };
}

/**
 * 9. Deterministic Business Alert Detection
 * Analyzes transaction patterns to detect anomalies (such as category sales drops).
 * 
 * NOTE: This is rule-based mathematical analysis, NOT an AI model.
 * 
 * @param {Array} transactions
 * @returns {Array<object>} Array of detected business alerts
 */
export function detectBusinessAlerts(transactions = []) {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  const alerts = [];

  // Group transactions by date
  const sortedDates = [...new Set(transactions.map((t) => t.date))].sort();
  if (sortedDates.length < 14) return alerts; // Need enough history

  // Split into Baseline period (first ~70% of days) and Recent period (last ~30% of days)
  const splitIndex = Math.floor(sortedDates.length * 0.7);
  const baselineDates = new Set(sortedDates.slice(0, splitIndex));
  const recentDates = new Set(sortedDates.slice(splitIndex));

  const baselineDaysCount = baselineDates.size;
  const recentDaysCount = recentDates.size;

  const baselineCatSales = {};
  const recentCatSales = {};

  for (const txn of transactions) {
    if (txn.settlementStatus !== "Settled") continue;
    const cat = txn.productCategory || "Other";
    const amount = Number(txn.amount) || 0;

    if (baselineDates.has(txn.date)) {
      baselineCatSales[cat] = (baselineCatSales[cat] || 0) + amount;
    } else if (recentDates.has(txn.date)) {
      recentCatSales[cat] = (recentCatSales[cat] || 0) + amount;
    }
  }

  // Calculate daily run-rate for each category and check for significant drops (>35%)
  for (const cat of Object.keys(baselineCatSales)) {
    const baselineDailyRate = baselineCatSales[cat] / baselineDaysCount;
    const recentDailyRate = (recentCatSales[cat] || 0) / recentDaysCount;

    if (baselineDailyRate > 0) {
      const percentageChange = ((recentDailyRate - baselineDailyRate) / baselineDailyRate) * 100;

      if (percentageChange < -35) {
        alerts.push({
          id: `ALERT_${cat.toUpperCase().replace(/\s+/g, "_")}_DROP`,
          severity: "warning",
          category: cat,
          title: `Attention: ${cat} sales have declined significantly in the latest period.`,
          message: `${cat} sales experienced a ${Math.abs(Math.round(percentageChange))}% decrease in daily velocity during the last ${recentDaysCount} days compared to previous weeks.`,
          metrics: {
            baselineDaily: Math.round(baselineDailyRate),
            recentDaily: Math.round(recentDailyRate),
            percentageChange: Math.round(percentageChange * 10) / 10
          },
          suggestedAction: `Check product availability, inspect cooler/shelf placement, or review vendor re-ordering for ${cat}.`,
          detectionType: "Deterministic Data-Driven Demo Alert"
        });
      }
    }
  }

  return alerts;
}
