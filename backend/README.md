# AURELIA — Django REST Framework Backend

Backend service for the **AURELIA** luxury minimalist e-commerce application (CodeAlpha Internship Project). Built with **Django 5.1.2**, **Django REST Framework 3.15.2**, **SimpleJWT**, and **PostgreSQL** (with zero-config SQLite development fallback).

---

## 🛠️ Tech Stack & Dependencies

- **Python**: 3.11+
- **Django**: 5.1.2
- **Django REST Framework**: 3.15.2
- **Authentication**: `djangorestframework-simplejwt` 5.3.1 (JSON Web Tokens)
- **CORS Handling**: `django-cors-headers` 4.4.0
- **Database Driver**: `psycopg2-binary` 2.9.13 (PostgreSQL adapter)
- **Environment Management**: `python-dotenv` 1.0.1

---

## 📁 Backend Directory Structure

```
backend/
├── aurelia/                       # Django project core
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py                # Environment-driven settings, CORS, JWT, DB fallback
│   ├── urls.py                    # Root URL router (/api/auth/, /api/, /api/orders/)
│   └── wsgi.py
├── accounts/                      # Authentication & user profile app
│   ├── admin.py                   # CustomUser admin
│   ├── apps.py
│   ├── models.py                  # CustomUser with email-based authentication
│   ├── serializers.py             # Register, Login, UserPublic serializers
│   ├── tests.py                   # Auth & JWT test cases
│   ├── urls.py                    # /api/auth/ endpoints
│   └── views.py                   # Register, Login, Me views
├── products/                      # Product catalog & categories app
│   ├── admin.py                   # Category, Product, Review admin
│   ├── apps.py
│   ├── management/
│   │   └── commands/
│   │       └── seed_products.py   # Repeatable database seed command from products.js
│   ├── models.py                  # Category, Product, Review models
│   ├── serializers.py             # ProductList, ProductDetail, Category, Review serializers
│   ├── tests.py                   # Product filter, sort, search, detail tests
│   ├── urls.py                    # /api/products/ & /api/categories/ endpoints
│   └── views.py                   # ProductListView, ProductDetailView, CategoryListView
├── orders/                        # Order processing & transaction management app
│   ├── admin.py                   # Order & OrderItem inline admin
│   ├── apps.py
│   ├── models.py                  # Order, OrderItem models with AUR-XXXXXX numbering
│   ├── serializers.py             # OrderCreate (atomic, server-calculated), OrderOutput
│   ├── tests.py                   # Order creation, price snapshot, stock decrement, ownership tests
│   ├── urls.py                    # /api/orders/ endpoints
│   └── views.py                   # OrderListCreateView, OrderDetailView
├── .env.example                   # Environment configuration template
├── .env                           # Local environment configuration (do not commit)
├── manage.py                      # Django CLI utility
├── requirements.txt               # Pinned Python package dependencies
└── README.md                      # Documentation & setup guide
```

---

## ⚡ Quick Start & Setup

### 1. Install Dependencies

From inside the `backend/` directory:

```bash
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

By default, leaving `DB_NAME` blank activates the **SQLite fallback** (`db.sqlite3`), allowing immediate local development without installing PostgreSQL.

### 3. Hosted / Cloud PostgreSQL Setup

The backend natively supports PostgreSQL through `psycopg2-binary`. It connects via either a single connection URL or discrete parameters:

#### Option A: Hosted Database URL (Neon, Supabase, Render, Railway, AWS RDS)
Set in your host environment or `.env`:
```env
DATABASE_URL=postgresql://user:password@ep-sample-12345.us-east-2.aws.neon.tech:5432/aurelia_prod?sslmode=require
```

#### Option B: Discrete Parameters
```env
DB_NAME=aurelia_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_SSLMODE=require
```

#### Option C: Local SQLite Fallback
Leave both `DATABASE_URL` and `DB_NAME` empty. The backend automatically activates `db.sqlite3` with zero configuration.

### 4. Run Database Migrations

Apply the initial schema to create all tables and indexes:

```bash
python manage.py migrate
```

### 5. Seed the Product Catalog

Populate the database with the exact canonical catalog from `src/data/products.js`:

```bash
python manage.py seed_products
```

> **Note**: This command is idempotent (uses `update_or_create`) and can be run safely at any time to re-sync catalog products without duplicate records.

### 6. Create Superuser (Optional for Django Admin)

```bash
python manage.py createsuperuser
```

### 7. Run the Development Server

```bash
python manage.py runserver 8000
```

The API will be live at `http://localhost:8000/api/`.

---

## 🧪 Automated Test Suite

A comprehensive test suite with 25 test cases covers:
- Product list, detail, filtering, searching, sorting
- User registration, duplicate email handling, input validation
- Login with valid credentials and error handling for invalid passwords
- JWT token refresh and protected endpoints
- Order creation with server-side price calculation (client price tampering ignored)
- Automatic free shipping threshold enforcement (>= ₹4,999)
- Atomic stock decrement with race-condition prevention (`select_for_update`)
- Insufficient stock rejection
- Order ownership enforcement (users cannot inspect other users' orders)

Run the full test suite with:

```bash
python manage.py test
```

Expected result:
```
Ran 29 tests in 18.717s
OK
```

---

## 🚀 Render Deployment — Single Web Service Architecture

The entire Aurelia application (React Vite frontend + Django REST backend + WhiteNoise static asset serving + PostgreSQL) deploys as **ONE unified Render Web Service**.

### Architecture:
```
Browser Request
      │
      ▼
Render HTTPS Edge (https://aurelia-ecommerce.onrender.com)
      │
      ▼
Gunicorn WSGI Server (port $PORT)
      │
      ├── WhiteNoise Middleware
      │     ├── /assets/*  ──► Directly serves built JS/CSS bundles (immutable cache)
      │     ├── /images/*  ──► Directly serves product images
      │     └── /static/*  ──► Serves Django admin static files
      │
      └── Django URL Router
            ├── /admin/*   ──► Django Admin Dashboard
            ├── /api/*     ──► Django REST Framework API Endpoints
            ├── /api/...   ──► Explicit JSON 404 (Never returns HTML!)
            └── /* (SPA)   ──► Serves dist/index.html (React Router handles /shop, /cart, /orders, etc.)
```

### Option 1: One-Click Deploy via Render Blueprint (`render.yaml`)

1. Connect your GitHub repository to Render.
2. Click **New +** → **Blueprint**.
3. Select your repository. Render will automatically detect [`render.yaml`](file:///c:/Users/HP/OneDrive/Desktop/Code_Alpha_Aurelia/render.yaml).
4. Render provisions both the **PostgreSQL Database** (`aurelia-db`) and the **Web Service** (`aurelia-ecommerce`), automatically binding `DATABASE_URL`.
5. Click **Apply**.

---

### Option 2: Manual Setup via Render Dashboard

#### Step A: Create the PostgreSQL Database
1. In Render Dashboard, click **New +** → **PostgreSQL**.
2. Name: `aurelia-db`
3. Database: `aurelia`
4. User: `aurelia_user`
5. Plan: `Free`
6. Click **Create Database**.
7. Once provisioned, copy the **Internal Database URL** (e.g. `postgresql://aurelia_user:...@dpg-...:5432/aurelia`).

#### Step B: Create the Web Service
1. Click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name**: `aurelia-ecommerce`
   - **Region**: Same region as your database (e.g. `Oregon`)
   - **Branch**: `master` or `main`
   - **Root Directory**: *(leave blank — repository root)*
   - **Runtime**: `Python`
   - **Build Command**:
     ```bash
     ./build.sh
     ```
     *(Or direct command: `npm install && npm run build && pip install -r backend/requirements.txt && python backend/manage.py migrate --no-input && python backend/manage.py seed_products && python backend/manage.py collectstatic --no-input`)*
   - **Start Command**:
     ```bash
     gunicorn --chdir backend aurelia.wsgi:application --bind 0.0.0.0:$PORT
     ```
   - **Plan**: `Free`

#### Step C: Add Environment Variables in Render Dashboard
Under **Environment Variables**, configure:

| Variable | Value / Description | Required |
|---|---|---|
| `DEBUG` | `False` | Yes |
| `SECRET_KEY` | Generate a random 50+ character string (or click **Generate**) | Yes |
| `DATABASE_URL` | Paste the **Internal Database URL** from Step A | Yes |
| `ALLOWED_HOSTS` | `.onrender.com` (Render automatically appends your external hostname) | Yes |
| `CORS_ALLOWED_ORIGINS` | `https://aurelia-ecommerce.onrender.com` | Yes |
| `VITE_API_BASE_URL` | `/api` | Yes |
| `VITE_USE_MOCK` | `false` | Yes |
| `PYTHON_VERSION` | `3.11.9` | Optional |
| `NODE_VERSION` | `20.18.0` | Optional |

4. Click **Create Web Service**.

---

## 📡 Implemented API Endpoints Reference

### 🔐 Authentication (`/api/auth/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new user; returns `{ user, token }` | None |
| `POST` | `/api/auth/login/` | Log in with email + password; returns `{ user, token }` | None |
| `POST` | `/api/auth/refresh/` | Refresh expired access token | None |
| `GET` | `/api/auth/me/` | Current user profile | Bearer JWT |

### 🛍️ Products & Categories (`/api/`)

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/products/` | `category`, `search`, `sort`, `priceMin`, `priceMax`, `rating`, `inStockOnly`, `featured`, `newArrival` | Returns `{ count, results: [...] }` |
| `GET` | `/api/products/<slug>/` | None | Single product with `reviewsList` and `relatedProducts` |
| `GET` | `/api/categories/` | None | All categories list `[{ id, name, tagline, image }]` |

### 📦 Orders (`/api/orders/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/orders/` | List current user's orders (plain array, newest first) | Bearer JWT |
| `POST` | `/api/orders/` | Create order from cart items; calculates totals & verifies stock | Bearer JWT |
| `GET` | `/api/orders/<order_number>/` | Get details for an order (owner only, e.g. `AUR-123456`) | Bearer JWT |

---

## 🔗 Frontend Compatibility Guarantee

The backend responses match the existing frontend API contracts in `src/services/api.js`:
- Auth responses return `{ user: { id, name, email, phone, memberSince, addresses }, token }`.
- Product list returns `{ count, results }` with camelCase aliases (`shortDescriptor`, `originalPrice`, `secondaryImage`, `newArrival`).
- Product detail returns `reviewsList` and `relatedProducts`.
- Orders return `{ id, date, status, total, subtotal, shipping, tax, paymentMethod, shippingAddress, items }`.
- Order creation calculates prices server-side and outputs unique `AUR-XXXXXX` IDs.
