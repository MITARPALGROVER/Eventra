# Eventra - Event Equipment Rental Platform

A modern React-based web application for renting event equipment including furniture, sound systems, lighting, décor, and appliances.

## 🚀 Features

- **User Authentication** - Login/Signup with account types (Customer/Vendor)
- **Product Catalog** - Browse 5 categories with multiple products each
- **Shopping Cart** - Add items, manage quantities, persistent storage
- **Favorites** - Save favorite items (requires login)
- **Razorpay Integration** - Dummy payment gateway for checkout
- **Responsive Design** - Mobile-first design with hamburger menu
- **Toast Notifications** - User-friendly feedback for all actions
- **State Management** - Zustand with localStorage persistence

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.4
- **State Management**: Zustand 5.0.8 with persist middleware
- **Form Handling**: React Hook Form 7.65.0
- **UI Components**: Lucide React 0.548.0 (icons)
- **Notifications**: React Hot Toast 2.6.0
- **Payments**: React Razorpay (dummy integration)

## 📁 Project Structure

```
eventra-app/
├── public/
│   └── assets/          # Static assets (images, icons)
├── src/
│   ├── components/
│   │   ├── common/      # Navbar, Footer, RazorpayCheckout
│   │   ├── layout/      # MainLayout
│   │   └── products/    # ProductCard
│   ├── pages/           # Home, Login, Signup, Cart, Categories, etc.
│   ├── stores/          # authStore, cartStore
│   ├── styles/          # index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## 🚦 Getting Started

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 💳 Razorpay Integration (Dummy)

The app includes **dummy Razorpay integration** for testing checkout flows.

**Test Mode:**
- Dummy key in code: `rzp_test_1234567890`
- Amount: Auto-calculated from cart
- Currency: INR

**Razorpay Test Cards:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**For Real Integration:**
1. Sign up at [Razorpay](https://razorpay.com)
2. Get your test API key
3. Replace key in `src/components/common/RazorpayCheckout.jsx`

## 🎨 Pages

- **Home** (`/`) - Hero, categories, testimonials, FAQ
- **Categories** (`/categories`) - All categories
- **Category Detail** (`/category/:categoryId`) - Products with filters
- **Login** (`/login`) - Authentication
- **Signup** (`/signup`) - Registration with password validation
- **Cart** (`/cart`) - Shopping cart with Razorpay checkout
- **Dashboard** (`/dashboard`) - User profile and stats
- **About** (`/about`) - Company info
- **Contact** (`/contact`) - Contact form

## 🔐 Authentication

Password requirements:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character (@, #, _, -)
- No spaces

## 🚀 Deployment

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

Drag `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

## 📄 License

MIT License

---

**Made with ❤️ using React + Vite**
