# AURELIA — Curated for the way you live.

> *"Curated for the way you live."*

**CodeAlpha Full-Stack E-Commerce Internship Project — Phase 1 & 1.5 Deliverable**

An exceptionally polished, minimalist, and editorial e-commerce frontend prototype inspired by modern luxury design studios and premium hardware brands (Linear, Aesop, Apple, Nothing, Bang & Olufsen). Built with React 19, Tailwind CSS v4, Three.js, React Router 7, and Lucide Icons.

---

## 🌟 Visual & Architectural Highlights (Phase 1.5 Upgrade)

- **New Brand Identity**: Complete rebrand to **AURELIA** with editorial wordmark, warm amber/champagne accents, and refined typography.
- **Interactive 3D WebGL Hero Canvas**: Custom Three.js floating champagne-lustre torus geometry, inner satin accent ring, orbiting halo bead, and ambient starfield. Responds smoothly to cursor parallax with linear interpolation (`lerp`) and gracefully degrades for mobile screens or users with `prefers-reduced-motion`.
- **Editorial Category Bento Grid**: 6-tile asymmetric bento showcase spanning Audio, Fashion, Lifestyle, Electronics, Home & Living, and Travel with hover zoom, subtle elevation, and direct catalog filter navigation.
- **3D Perspective Spotlight Section**: Signature hardware showcase featuring the *Aurelia Air X1* with layered 3D depth tags, active lighting glow, color variant switching, live specifications, and direct add to bag.
- **Substantially Expanded Catalog**: **32 curated luxury products** across 8 diverse categories (*Electronics, Audio, Fashion, Accessories, Home, Lifestyle, Work & Study, Travel*). Every product has verified Unsplash imagery with secondary hover shots and graceful fallback handlers.
- **Slide-Over Cart Drawer (`CartDrawer.jsx`)**: Instant slide-out drawer accessible from anywhere on the site with free shipping progress bar (₹5,000 threshold), quantity controls, quick line-item removal, and direct checkout CTA.
- **Micro-Interactions & Pulse Feedback**: Cart badge pulses when items are added, product cards feature staggered entrance reveals, secondary photo transitions, and instant toast notifications.
- **Centralized API Architecture**: Decoupled service layer (`src/services/api.js`) with complete endpoint contracts ready for direct Phase 2 Django REST Framework integration without rewriting UI components.
- **Persistent State**: Shopping cart, wishlist items, mock user authentication session, and order history persist across browser reloads via `localStorage` with backward-compatible migration keys.
- **Dynamic SEO**: Real-time document title management for all routes (`useDocumentTitle`).

---

## 🚀 Routes Implemented

| Route | Page | Key Features |
|---|---|---|
| `/` | **Home** | Interactive 3D WebGL hero, 6-tile Category Bento Grid, "Curated For You" grid, Aurelia Air X1 3D Perspective Spotlight, New Arrivals carousel, Editorial Brand Manifesto, Service Trust highlights, Concierge Newsletter, and comprehensive footer. |
| `/shop` | **Product Catalog** | 32 products across 8 categories, live real-time search, category filters, price range sliders, rating filters, multi-criteria sorting (Price, Newest, Rating, Featured), active filter pills, responsive 4-column grid, and clean empty search state. |
| `/product/:id` | **Product Details** | Multi-photo interactive gallery, color variant selector, quantity stepper, stock limits, "Add to Bag" + "Buy Now", tech specifications table, customer reviews, and related items grid. |
| `/cart` | **Shopping Cart** | Cart items list, line item subtotals, quantity controls, free shipping progress bar, promo code engine (`AURELIA10` for 10% off, `FREESHIP`), estimated GST, and direct catalog shortcuts. |
| `/checkout` | **Checkout UI** | Multi-step contact info, shipping address form with validation, delivery speed selection (Standard Free vs Priority Air ₹299), payment method selector (Cards, UPI, COD), and confirmation modal with generated Order ID (`AUR-XXXXXX`). |
| `/login` | **Sign In** | Split editorial desktop layout with lifestyle imagery, input validation, forgot password prompt, and a **1-Click Demo Account Quick Fill** button for instant evaluation. |
| `/register` | **Registration** | Split layout, full name, email, password strength check, password confirmation matching, and terms acknowledgment. |
| `/orders` | **My Orders** | Order cards with status badges (`Processing`, `Shipped`, `Delivered`, `Cancelled`), date, item thumbnails, order totals, interactive order fulfillment timeline modal, and mock invoice download. |
| `/profile` | **User Profile** | Collector profile overview, order statistics, wishlist count, editable personal contact details modal, saved shipping destinations management, and password security modal. |
| `*` | **404 Not Found** | Architectural 404 screen guiding users back to Home or Catalog. |

---

## 🛠️ Tech Stack

### Frontend (Phase 1 & 1.5)
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) (Custom WebGL canvas with resource disposal & fallback)
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
├── index.html                   # HTML entry with Plus Jakarta Sans & AURELIA branding
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite config with React & Tailwind v4 plugins
│
└── src/
    ├── assets/                  # Brand vectors and icons
    │
    ├── components/              # Modular, reusable UI components
    │   ├── Badge.jsx            # Pill badge with neutral, emerald, amber variants
    │   ├── Button.jsx           # Button with primary, secondary, outline & loading spinner
    │   ├── CartDrawer.jsx       # Slide-over cart drawer with free-shipping bar & checkout CTA
    │   ├── CartItem.jsx         # Line item card with thumbnail, variant & stepper
    │   ├── CategoryBentoGrid.jsx# 6-tile editorial Bento Grid for core categories
    │   ├── CategoryCard.jsx     # Image-led category block with zoom & overlay
    │   ├── FeaturedProductShowcase.jsx # 3D perspective spotlight card for Aurelia Air X1
    │   ├── FilterPanel.jsx      # Multi-criteria filter sidebar & drawer
    │   ├── Footer.jsx           # 4-column footer with studio links & accepted payments
    │   ├── Hero3DCanvas.jsx     # Interactive Three.js WebGL canvas with cursor parallax
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
    │   └── CartContext.jsx      # Global state: cart, drawer, wishlist, orders, user, toasts
    │
    ├── data/
    │   └── products.js          # Curated dataset of 32 luxury products across 8 categories
    │
    ├── pages/                   # Application route views
    │   ├── Home.jsx             # Centerpiece homepage with 3D hero, Bento & spotlight
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

Create a `.env` file in the root directory (already configured):

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

1. **3D WebGL Canvas**: Move your mouse across the Hero section on the homepage to observe the floating geometric torus and particle field tilt in 3D perspective with soft ambient lighting.
2. **Category Bento Grid**: Explore the 6-tile bento grid directly below the hero and click any category to filter the catalog.
3. **3D Featured Product Spotlight**: Scroll to the *Aurelia Air X1* showcase on the homepage, test color switcher buttons, and add to bag directly.
4. **Slide-Over Cart Drawer**: Click the bag icon in the navbar or click "Add to Bag" on any card to see the animated slide-over drawer with free shipping progress bar.
5. **Global Search**: Click the magnifying glass in the navbar or press `/` on your keyboard to test real-time product suggestions across all 32 items.
6. **Promotional Discounts**: In the Cart Drawer or Checkout, apply promo code `AURELIA10` to receive a 10% discount, or `FREESHIP` for complimentary delivery.
7. **Wishlist**: Click the heart on any product card to toggle wishlist status; notice the indicator badge on the desktop navbar.
8. **1-Click Sign In**: On the `/login` page, click **"1-Click Quick Fill"** to populate demo user credentials (`alex.vance@studio-aurelia.co`) and enter the profile dashboard.
9. **Checkout & Order Creation**: Complete checkout with either Card, UPI, or Cash on Delivery to see the order confirmation modal with a generated reference number (`AUR-XXXXXX`) and instant reflection in `/orders`.
10. **Responsive Design**: Test on mobile viewports to inspect the slide-out navigation drawer, touch-friendly touch targets, and optimized layouts.
