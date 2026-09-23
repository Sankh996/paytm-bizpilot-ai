/**
 * Fictional Demo Transaction Dataset for Paytm BizPilot AI
 * Merchant: Raj General Store (Fictional Small Retail / Kirana Merchant)
 * 
 * DISCLAIMER:
 * This is 100% fictional demo data created for the Paytm Build for India AI Hackathon.
 * It contains NO real Paytm merchant data, personal information, real phone numbers, or customer IDs.
 */

export const MERCHANT_PROFILE = {
  merchantId: "MERCH_RAJ_0142",
  businessName: "Raj General Store",
  merchantCategory: "Grocery & Daily Essentials (Kirana)",
  location: "Sector 18, Noida, Uttar Pradesh",
  soundboxActive: true,
  currency: "INR",
  currencySymbol: "₹",
  dataPeriodDays: 30
};

// Realistic retail inventory for an Indian Kirana store
const INVENTORY = {
  Dairy: [
    { name: "Amul Taaza Milk 500ml", price: 27 },
    { name: "Amul Gold Milk 500ml", price: 33 },
    { name: "Mother Dairy Curd 400g", price: 35 },
    { name: "Amul Butter 100g", price: 58 },
    { name: "Paneer Fresh 200g", price: 90 },
    { name: "Amul Cow Ghee 500ml", price: 310 }
  ],
  Grocery: [
    { name: "Aashirvaad Shudh Chakki Atta 5kg", price: 235 },
    { name: "Fortune Sunlite Refined Oil 1L", price: 145 },
    { name: "Tata Salt Vacuum Evaporated 1kg", price: 28 },
    { name: "Madhur Pure Sugar 1kg", price: 52 },
    { name: "India Gate Basmati Rice 1kg", price: 120 },
    { name: "Tata Sampann Toor Dal 500g", price: 88 },
    { name: "Catch Turmeric Powder 100g", price: 32 }
  ],
  Snacks: [
    { name: "Parle-G Glucose Biscuits 250g", price: 25 },
    { name: "Haldiram Bhujia Sev 200g", price: 55 },
    { name: "Lay's India's Magic Masala 50g", price: 20 },
    { name: "Britannia Good Day Butter 120g", price: 30 },
    { name: "Kurkure Masala Munch 90g", price: 20 },
    { name: "Cadbury Dairy Milk 50g", price: 40 }
  ],
  Beverages: [
    { name: "Tata Tea Gold 250g", price: 140 },
    { name: "Nescafe Classic Coffee 50g", price: 175 },
    { name: "Thums Up Soft Drink 750ml", price: 40 },
    { name: "Frooti Mango Drink 600ml", price: 35 },
    { name: "Bisleri Mineral Water 1L", price: 20 },
    { name: "Maaza Mango 1.2L", price: 65 }
  ],
  "Personal Care": [
    { name: "Dettol Original Soap 75g", price: 38 },
    { name: "Colgate Strong Teeth 100g", price: 65 },
    { name: "Clinic Plus Strong Shampoo 175ml", price: 95 },
    { name: "Lifebuoy Total Handwash Refill 180ml", price: 50 },
    { name: "Parachute Pure Coconut Oil 200ml", price: 78 }
  ],
  Household: [
    { name: "Surf Excel Quick Wash Detergent 1kg", price: 155 },
    { name: "Vim Dishwash Bar 300g", price: 25 },
    { name: "Good Knight Gold Flash Machine + Refill", price: 95 },
    { name: "Harpic Disinfectant Toilet Cleaner 500ml", price: 98 },
    { name: "Colin Glass Cleaner 500ml", price: 105 }
  ]
};

/**
 * Deterministic pseudo-random generator with a fixed seed.
 * Ensures the exact same realistic dataset across reloads and runs.
 */
function createPseudoRandom(seed = 123456789) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generates 30 days of realistic transactions for Raj General Store.
 * 
 * Embedded Patterns for Future AI Analysis:
 * 1. Morning Peak (08:00 - 10:30): Strong in Dairy & Breakfast items.
 * 2. Evening Rush (17:30 - 21:30): Peak footfall and largest ticket sizes (Grocery + Snacks).
 * 3. Payment preference: High UPI adoption (~72%), reflecting Paytm Soundbox merchant reality.
 * 4. Customer retention: ~68% Repeat customers, who spend ~40% higher than new walk-ins.
 * 5. Opportunity/Anomaly: In week 4 (days 23-30), "Beverages" sales experience an unexpected ~50% drop
 *    (simulating out-of-stock cold drinks / cooler failure) - perfect for AI detection in later steps!
 */
export function generateMockTransactions() {
  const rand = createPseudoRandom(42);
  const transactions = [];
  let txnCounter = 1001;

  // Base date range: 30 days ending on September 23, 2026
  const endDate = new Date(2026, 8, 23); // Month is 0-indexed: 8 = September
  const startDate = new Date(2026, 7, 25); // 7 = August

  const categories = Object.keys(INVENTORY);

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayOffset);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Weekend boost: slightly more transactions on Saturdays and Sundays
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const baseTxnCount = isWeekend ? 9 : 7;
    const dayTxnCount = baseTxnCount + Math.floor(rand() * 4); // 7-12 transactions per day

    for (let t = 0; t < dayTxnCount; t++) {
      // Determine realistic time slot based on store hours (07:30 AM to 10:00 PM)
      // Weighted towards morning (25%) and evening (55%), with afternoon lull (20%)
      const timeSlotRoll = rand();
      let hour, minute;

      if (timeSlotRoll < 0.25) {
        // Morning Milk/Breakfast Rush: 07:30 - 10:30
        hour = 7 + Math.floor(rand() * 4);
        minute = Math.floor(rand() * 60);
        if (hour === 7) minute = 30 + Math.floor(rand() * 30);
      } else if (timeSlotRoll < 0.45) {
        // Afternoon quiet hours: 11:00 - 16:30
        hour = 11 + Math.floor(rand() * 6);
        minute = Math.floor(rand() * 60);
      } else {
        // Evening Rush: 17:00 - 21:30
        hour = 17 + Math.floor(rand() * 5);
        minute = Math.floor(rand() * 60);
        if (hour === 21) minute = Math.floor(rand() * 30);
      }

      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const isoTimestamp = `${dateStr}T${timeStr}:00.000Z`;

      // Customer Type: 68% Repeat, 32% New
      const isRepeat = rand() < 0.68;
      const customerType = isRepeat ? "Repeat" : "New";

      // Select Category
      let chosenCategory;
      const catRoll = rand();

      if (hour <= 10 && catRoll < 0.50) {
        // Morning preference for Dairy
        chosenCategory = "Dairy";
      } else {
        chosenCategory = categories[Math.floor(rand() * categories.length)];
      }

      // Intentional Trend Anomaly: Week 4 (dayOffset >= 21) sharp decline in Beverages
      // Simulates cooler downtime or distributor stockout
      if (chosenCategory === "Beverages" && dayOffset >= 21 && rand() < 0.75) {
        chosenCategory = "Snacks"; // Customer bought snacks instead
      }

      // Pick an item from category
      const itemsList = INVENTORY[chosenCategory];
      const primaryItem = itemsList[Math.floor(rand() * itemsList.length)];

      // Basket size: Repeat customers often buy 1 to 3 items, new customers often buy 1 item
      let quantity = 1;
      let totalAmount = primaryItem.price;

      if (isRepeat && rand() < 0.45) {
        // Multi-pack or multi-item purchase
        quantity = Math.floor(rand() * 2) + 2; // 2 or 3
        totalAmount = primaryItem.price * quantity;
      } else if (rand() < 0.15) {
        // Small add-on impulse item
        totalAmount += 20; // e.g. added a small biscuit/gum
      }

      // Payment method: 72% UPI, 20% Cash, 8% Card
      const payRoll = rand();
      let paymentMethod;
      if (payRoll < 0.72) {
        paymentMethod = "UPI";
      } else if (payRoll < 0.92) {
        paymentMethod = "Cash";
      } else {
        paymentMethod = "Card";
      }

      // Settlement Status:
      // Cash is always Settled instantly.
      // Digital payments: 96% Settled, 3% Pending, 1% Failed
      let settlementStatus = "Settled";
      if (paymentMethod !== "Cash") {
        const statusRoll = rand();
        if (statusRoll > 0.99) {
          settlementStatus = "Failed";
        } else if (statusRoll > 0.96) {
          settlementStatus = "Pending";
        }
      }

      transactions.push({
        id: `TXN-${txnCounter++}`,
        date: dateStr,
        time: timeStr,
        timestamp: isoTimestamp,
        amount: totalAmount,
        paymentMethod: paymentMethod,
        customerType: customerType,
        productCategory: chosenCategory,
        productName: primaryItem.name + (quantity > 1 ? ` (x${quantity})` : ""),
        settlementStatus: settlementStatus
      });
    }
  }

  return transactions;
}

// Export pre-generated static transaction collection for immediate use
export const mockTransactions = generateMockTransactions();
export const transactions = mockTransactions;
