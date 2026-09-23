# 🚀 Paytm BizPilot AI

AI-powered merchant growth assistant for small Indian retailers.

## 🌐 Live Demo

👉 **[Open Paytm BizPilot AI](https://paytm-bizpilot-ai.onrender.com/)**

## 📌 About the Project

Paytm BizPilot AI is an AI-powered merchant intelligence dashboard designed to help small retailers understand their business performance and take practical actions.

The system combines deterministic transaction analytics with Sarvam AI to provide:

- 📊 Business performance insights
- 🔎 Automated business signal detection
- 🤖 AI-powered merchant advice
- 📈 Category and payment analytics
- 👥 Customer transaction insights
- 💡 Action-oriented recommendations

## ✨ Key Features

### 📊 Merchant Dashboard

Provides a quick overview of:

- Total revenue
- Total transactions
- Average transaction value
- Repeat transaction share
- Daily sales trends
- Category performance
- Payment method distribution

### 🚨 Business Alerts

The analytics layer automatically detects important business signals from transaction data.

Example:

- Beverage sales velocity dropped by approximately 74% during the final part of the reporting period.

### 🤖 AI Business Advisor

The AI Advisor uses **Sarvam AI (`sarvam-105b`)** to answer merchant questions using verified analytics context.

The AI separates responses into:

- **Verified Data**
- **Business Interpretation**
- **Suggested Actions**

This helps prevent unsupported business claims and keeps recommendations grounded in the available data.

### 🔍 Transaction Analytics

The dashboard provides:

- Searchable transactions
- Payment method filtering
- Customer transaction classification
- Transaction pagination
- Category-level performance analysis

## 🧠 AI Architecture

```text
Transaction Data
       ↓
Deterministic Analytics
       ↓
Compact Business Context
       ↓
Sarvam AI
       ↓
Merchant Insight
       ↓
Suggested Action
```

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express
- CORS
- dotenv

### AI
- Sarvam AI
- `sarvam-105b`
- Official Sarvam JavaScript SDK

### Deployment
- GitHub
- Render

## 📁 Project Structure

```text
paytm-bizpilot-ai/
│
├── public/
├── server/
│   └── index.js
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sankh996/paytm-bizpilot-ai.git
cd paytm-bizpilot-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SARVAM_API_KEY=your_sarvam_api_key
PORT=3001
```

> Never commit your actual API key to GitHub.

### 4. Build the frontend

```bash
npm run build
```

### 5. Start the backend

```bash
npm run server
```

The application will be available at:

```text
http://localhost:3001
```

## 🔐 Security

- API keys are stored using environment variables.
- The `.env` file is excluded from Git through `.gitignore`.
- No API keys or secrets are included in the public repository.

## 🧪 Demo Data

This project currently uses **fictional merchant transaction data** for demonstration purposes.

No real Paytm merchant account or production Paytm transaction data is accessed.

## 👨‍💻 Developer

**Sankhadeep Ganguly**

GitHub:  
https://github.com/Sankh996/paytm-bizpilot-ai

## 🏆 Hackathon

Built for the **Paytm Build for India AI Hackathon — Track 1: Merchant Growth AI**.