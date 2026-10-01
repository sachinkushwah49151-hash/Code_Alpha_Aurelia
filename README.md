# NOVA — Modern E-Commerce Store

> *"Everything you want. Nothing you don't."*

**CodeAlpha Full-Stack E-Commerce Internship Project — Phase 1 Deliverable**

An exceptionally polished, minimalist, and editorial e-commerce frontend prototype inspired by modern luxury tech brands (Linear, Aesop, Apple, Nothing). Built with React 19, Tailwind CSS v4, React Router 7, and Lucide Icons.

---

## 🌟 Visual & Architectural Highlights

- **Aesthetic Direction**: High-fashion, modern tech editorial styling with a sophisticated warm off-white canvas (`#faf9f8`), deep obsidian contrast typography, generous whitespace, subtle borders, and smooth micro-interactions.
- **Product-Focused Design**: Custom 4:5 image proportions, hover transition between primary and secondary product views, animated quick-add, and reactive wishlist hearts.
- **Asymmetric Editorial Hero**: Clean typographic layout paired with layered product spotlight composition.
- **Centralized API Architecture**: Decoupled service layer (`src/services/api.js`) with complete endpoint contracts ready for direct Phase 2 Django REST Framework integration without rewriting any UI components.
- **Persistent State**: Shopping cart, wishlist items, mock user authentication session, and order history persist across browser reloads via `localStorage`.
- **Zero Broken Assets**: 100% verified Unsplash CDN product and lifestyle imagery with responsive aspect ratio scaling.
- **Dynamic SEO**: Real-time document title management for all routes (`useDocumentTitle`).

---

## 🚀 Routes Implemented

| Route | Page | Key Features |
|---|---|---|
| `/` | **Home** | Asymmetric hero, curated category blocks, "Featured right now" grid, "Designed for everyday" editorial story, new arrivals, service trust metrics, private newsletter signup, comprehensive footer. |
| `/shop` | **Product Catalog** | Live search, category filtering, price range filters, rating filters, multi-criteria sorting (Price, Newest, Rating, Featured), active filter chips, 4-column responsive grid, empty search state. |
| `/product/:id` | **Product Details** | Multi-photo interactive gallery, color variant selector, quantity stepper, stock limits, "Add to Cart" + "Buy Now", tech specifications, customer reviews, related items grid. |
| `/cart` | **Shopping Cart** | Cart items list, line item subtotals, quantity controls, free shipping progress bar, promo code engine (`NOVA10` for 10% off), estimated GST, empty cart state with direct category shortcuts. |
| `/checkout` | **Checkout UI** | Multi-step contact info, shipping address form with validation, delivery speed selection (Standard Free vs Priority Air ₹299), payment method selector (Cards, UPI, COD), and confirmation modal with generated Order ID. |
| `/login` | **Sign In** | Split editorial desktop layout with lifestyle imagery, input validation, "Remember terminal", forgot password prompt, and a **1-Click Demo Account Quick Fill** button for instant evaluation. |
| `/register` | **Registration** | Split layout, full name, email, password strength check, password confirmation matching, and terms acknowledgment. |
| `/orders` | **My Orders** | Order cards with status badges (`Processing`, `Shipped`, `Delivered`, `Cancelled`), date, item thumbnails, order totals, interactive order fulfillment timeline modal, and mock invoice download. |
| `/profile` | **User Profile** | Collector profile overview, order statistics, wishlist count, editable personal contact details modal, saved shipping destinations management, and password security modal. |
| `*` | **404 Not Found** | Architectural 404 screen guiding users back to Home or Catalog. |

---

## 🛠️ Tech Stack

### Frontend (Phase 1)
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Google Fonts — Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

### Backend & Database (Planned for Phase 2)
- **Backend Framework**: Django 5.x + Django REST Framework (DRF)
- **Database**: PostgreSQL (Supabase / Neon / Hosted)
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Payment Gateway**: Stripe / Razorpay Webhooks
- **Deployment Strategy**:
  - Frontend: Vercel / Netlify
  - Backend: Render / Railway
  - Database: Supabase PostgreSQL

---

## 📁 Component & Project Architecture

```
Code_Alpha/
├── .env                         # Active environment configuration
├── .env.example                 # Example configuration template
├── index.html                   # HTML entry with Plus Jakarta Sans & SEO meta
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite config with React & Tailwind v4 plugins
│
└── src/
    ├── assets/                  # Static assets & brand vectors
    │
    ├── components/              # Modular, reusable UI components
    │   ├── Badge.jsx            # Pill badge with neutral, emerald, amber variants
    │   ├── Button.jsx           # Button with primary, secondary, outline & loading spinner
    │   ├── CartItem.jsx         # Line item card with thumbnail, variant & stepper
    │   ├── CategoryCard.jsx     # Image-led category block with zoom & overlay
    │   ├── FilterPanel.jsx      # Multi-criteria filter sidebar & drawer
    │   ├── Footer.jsx           # 4-column footer with SVGs & accepted payments
    │   ├── Input.jsx            # Accessible form input with floating label & error state
    │   ├── LoadingState.jsx     # Shimmering card skeleton loaders & spinners
    │   ├── Modal.jsx            # Accessible dialog modal with ESC listener & blur
    │   ├── Navbar.jsx           # Sticky navbar, announcement bar, drawer & search
    │   ├── OrderSummary.jsx     # Financial calculator, free shipping bar & promo code
    │   ├── ProductCard.jsx      # Editorial card with secondary image hover & quick add
    │   ├── ProductGrid.jsx      # Responsive 4-column product grid container
    │   ├── SearchBar.jsx        # Instant modal search with live matches
    │   └── ToastContainer.jsx   # Non-blocking animated toast notifications
    │
    ├── context/
    │   └── CartContext.jsx      # Global state: cart, wishlist, orders, user, toasts
    │
    ├── data/
    │   └── products.js          # Curated dataset of 16 products & categories
    │
    ├── pages/                   # Application route views
    │   ├── Home.jsx             # Visual centerpiece homepage
    │   ├── Shop.jsx             # Filterable product catalog
    │   ├── ProductDetails.jsx   # Product page with gallery, specs & reviews
    │   ├── Cart.jsx             # Shopping cart view
    │   ├── Checkout.jsx         # Multi-step checkout experience
    │   ├── Login.jsx            # Member sign-in with 1-click demo fill
    │   ├── Register.jsx         # New member registration
    │   ├── Orders.jsx           # Order tracking & history
    │   ├── Profile.jsx          # Profile details & address book
    │   └── NotFound.jsx         # 404 fallback page
    │
    ├── services/
    │   └── api.js               # Centralized DRF API client & mock adapter
    │
    └── utils/
        ├── formatters.js        # Indian Rupee (₹) and date formatters
        └── useDocumentTitle.js  # Dynamic SEO document title hook
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (already generated from `.env.example`):

```bash
# Centralized API endpoint for Django REST Framework
VITE_API_URL=http://localhost:8000/api

# Enable mock data fallback during Phase 1 prototype testing
VITE_USE_MOCK=true
```

When connecting the real Django backend in Phase 2, set `VITE_USE_MOCK=false`.

---

## 🏃 How to Run the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 🔌 Planned Backend Architecture (Phase 2 Preparation)

The frontend API service layer (`src/services/api.js`) is specifically structured to interface with Django REST Framework (DRF) endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products/` | Filterable, searchable, sorted list of products |
| `GET` | `/api/products/<id>/` | Detailed product specifications and customer reviews |
| `GET` | `/api/categories/` | List of categories with metadata |
| `POST` | `/api/auth/login/` | JWT token authentication (returns `{ access, refresh, user }`) |
| `POST` | `/api/auth/register/` | Create new collector account |
| `GET` | `/api/cart/` | Retrieve authenticated user's cart from database |
| `POST` | `/api/cart/` | Add item with quantity and selected variant |
| `PATCH` | `/api/cart/<item_id>/` | Modify line item quantity |
| `DELETE` | `/api/cart/<item_id>/` | Remove line item |
| `POST` | `/api/orders/` | Place order and initialize payment intent |
| `GET` | `/api/orders/` | Retrieve user's order history |
| `GET` | `/api/profile/` | Fetch user details and saved shipping addresses |
| `PUT` | `/api/profile/` | Update profile information |

---

## 🧪 Interactive Demo Features to Test

1. **Global Search**: Click the magnifying glass in the navbar or press `/` on your keyboard to test real-time product suggestions.
2. **Promotional Discounts**: In the Shopping Cart or Checkout, apply promo code `NOVA10` to receive a 10% discount, or `FREESHIP` for complimentary delivery.
3. **Wishlist**: Click the heart on any product card to toggle wishlist status; notice the indicator badge on the desktop navbar.
4. **1-Click Sign In**: On the `/login` page, click **"1-Click Quick Fill"** to populate demo user credentials (`alex.vance@studio-nova.co`) and enter the profile dashboard.
5. **Checkout & Order Creation**: Complete checkout with either Card, UPI, or Cash on Delivery to see the order confirmation modal with a generated reference number and instant reflection in `/orders`.
6. **Responsive Drawer**: Shrink your browser window to test the mobile slide-out navigation drawer with categories and quick search.
