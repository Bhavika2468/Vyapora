# Vyapora – AI-Powered Business Management for Small Shopkeepers

**Vyapora** is an AI-powered, WhatsApp-first business management platform designed to help small shopkeepers and local businesses digitize and simplify their daily operations.

Many small businesses still manage inventory, customer records, orders, and credit (udhaar) manually. Vyapora brings these activities together in one easy-to-use dashboard, with AI-powered assistance and a familiar WhatsApp-based workflow.

## 🚀 Key Features

### 1. Business Dashboard
- View total revenue, orders, pending payments, and outstanding udhaar.
- Monitor low-stock products and recent business activity.
- Get an overview of business performance.

### 2. Smart Inventory Management
- Add, edit, delete, and restock products.
- Track available stock and product details.
- Identify low-stock items through alerts.
- Use voice input to describe inventory updates in natural language.
- Review and confirm parsed inventory entries before saving.

### 3. AI-Powered Order Management
- Capture and organize customer orders.
- Convert natural-language order messages into structured order details.
- Track order status and payment information.
- Keep inventory updated when orders are accepted.

### 4. Customer Management
- Maintain customer profiles and contact details.
- View purchase history and customer activity.
- Track customer-specific outstanding balances.
- Organize customers into segments such as New, Growing, Loyal, and VIP.

### 5. Udhaar & Payment Tracking
- Record customer credit and payments.
- Monitor pending and overdue balances.
- Maintain a clear transaction history.
- Support payment follow-up workflows.

### 6. AI-Powered Customer Intelligence
- Generate customer summaries from available business records.
- Identify purchase patterns and frequently bought products.
- Understand payment behaviour.
- Provide suggested follow-ups and customer insights.

### 7. WhatsApp Integration (Planned Backend Integration)
- Receive customer orders through WhatsApp.
- Send order confirmations and status updates.
- Share payment reminders.
- Support text, voice, and image-based interactions.

## 🧠 AI Capabilities

Vyapora is designed to use AI to understand everyday business conversations, including Hindi and Hinglish messages.

The planned AI workflow includes:
- Natural-language order extraction.
- Intent classification, such as new order, payment, inventory purchase, and order-status enquiry.
- Voice-to-text processing.
- Structured inventory and order extraction.
- Customer behaviour summaries.

**Planned AI stack:** Google Gemini as the primary AI service, Groq as a fallback, and rule-based parsing as a final fallback.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| AI Integration | Google Gemini API, Groq API |
| Messaging | WhatsApp Business Cloud API |
| Voice Input | Browser Speech Recognition / Backend Speech-to-Text |
| API Communication | REST APIs |

*The current frontend starter includes demo interactions and commented backend integration points. Features requiring external services will become functional as the backend and APIs are connected.*

## 🏗️ Project Architecture

```text
Customer
   |
   v
WhatsApp Business API
   |
   v
Backend (Node.js + Express)
   |
   v
Message Processing
   |
   +----> Intent Classification
   |
   +----> Gemini AI
   |        |
   |        v
   |     Groq Fallback
   |        |
   |        v
   |     Rule-Based Parser
   |
   v
Business Logic
   |
   +----> Inventory Management
   +----> Order Management
   +----> Customer Management
   +----> Udhaar & Payments
   |
   v
MySQL Database
   |
   v
REST APIs
   |
   v
Vyapora Dashboard
```

## 📂 Project Structure

```text
Vyapora/
│
├── index.html       # Main dashboard and application layout
├── styles.css       # UI styling and responsive design
├── app.js           # Frontend logic and demo interactions
└── README.md        # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- A modern web browser.
- Visual Studio Code (recommended).
- Live Server extension (recommended).

### Installation

1. Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

2. Open the project folder:

```bash
cd Vyapora
```

3. Open the folder in Visual Studio Code.

4. Run `index.html` using the Live Server extension.

5. Explore the dashboard and individual feature panels.

## 🔌 Backend Integration

The frontend contains prepared integration points for connecting the backend.

In `app.js`, configure:

```javascript
const API_BASE_URL = "http://localhost:5000";
const USE_BACKEND = false;
```

Once the backend is running:

1. Update `API_BASE_URL` with the backend server URL.
2. Set `USE_BACKEND` to `true`.
3. Connect the frontend functions to the corresponding REST API endpoints.
4. Configure the database and external API credentials on the backend.

Keep API keys and secret credentials on the backend. Never expose them in frontend JavaScript.

## 🌱 Future Enhancements

- Full WhatsApp Business Cloud API integration.
- Multilingual AI support for Hindi, Hinglish, and regional Indian languages.
- Advanced voice-based inventory and order management.
- Predictive inventory and demand analysis.
- Business performance reports and PDF exports.
- Smart customer retention and follow-up recommendations.
- Business creditworthiness insights and loan-readiness indicators.
- Mobile application for shopkeepers.

## 💡 What Makes Vyapora Different?

Vyapora is designed around how local Indian shopkeepers actually work. Instead of requiring complicated forms and manual data entry for every task, it aims to let shopkeepers interact naturally through WhatsApp and voice.

Its combination of inventory management, order processing, customer intelligence, and udhaar tracking creates a unified digital assistant for everyday business operations.

## 🎯 Project Vision

**Making business management simple, accessible, and intelligent for every small shopkeeper.**

Vyapora aims to empower local businesses with practical AI tools, helping them save time, reduce manual errors, build stronger customer relationships, and make better business decisions.

---

**Project Name:** Vyapora  
**Category:** AI for Small Business / Business Management  
**Track:** Prune  
**Built for:** Hackathon Project
