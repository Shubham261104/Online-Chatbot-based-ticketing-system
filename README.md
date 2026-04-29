# 🏛️ MTicket: Online Chatbot-based Museum Ticketing System

MTicket is a modernized, full-stack museum ticketing platform designed to provide a premium, seamless, and interactive experience for cultural explorers. It combines state-of-the-art UI/UX with powerful features like an AI-powered booking assistant, real-time availability tracking, and secure authentication.

---

## ✨ Key Features

### 🎨 Modern & Interactive UI
- **Live Backgrounds**: Mouse-tracking spotlights and animated mesh gradients for a premium "Cultural" atmosphere.
- **Dynamic Homepage**: Live visitor counters, real-time event tickers, and interactive statistics with count-up animations.
- **Fluid Experience**: Powered by `framer-motion` for silky-smooth transitions and scroll-triggered animations.

### 🤖 AI-Powered Chatbot
- Integrated AI assistant to help users book tickets, check event timings, and answer museum-related queries in seconds.

### 🔒 Secure Authentication
- **Google-Style Auth**: Sophisticated simulated Google OAuth flow with a custom account picker.
- **Advanced Validation**: Real-time password strength tracking and secure JWT-based backend authentication.
- **Welcome Emails**: Automated professional email notifications upon registration.

### 📅 Advanced Booking & Events
- **Real-time Slot Tracking**: Live availability pulsing indicators and background data polling.
- **Interactive Shows Grid**: Filterable events with wishlist support, live search, and detailed booking workflows.
- **Dynamic Pricing**: Instant cost calculation based on visitor types (Adult/Child) and ticket categories.

### 📜 Legal & Compliance
- Integrated professional pages for **Privacy Policy**, **Terms of Service**, and **Cookie Policy**.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Core framework for a fast, component-based UI.
- **Tailwind CSS**: For high-performance, responsive styling.
- **Framer Motion**: Powering complex animations and interactive states.
- **Lucide React**: Premium iconography.
- **React Toastify**: Elegant notification system.

### Backend
- **Laravel (PHP)**: Robust API and business logic.
- **JWT-Auth**: Secure token-based authentication.
- **MySQL**: Persistent data storage.
- **SMTP/Log Mailer**: Handling automated notifications.

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.x + Composer
- Node.js (v16+) + npm
- MySQL Server

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Shubham261104/Online-Chatbot-based-ticketing-system.git
   cd Online-Chatbot-based-ticketing-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   php artisan migrate
   php artisan serve
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📬 Contact & Support

For queries or support, feel free to reach out via the in-app Contact Us section or open an issue on the repository.

---

*Built with ❤️ for the future of Cultural Discovery.*
