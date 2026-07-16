<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/book-open.svg" width="64" height="64" alt="ShelfIQ Logo" />
  <h1 align="center">ShelfIQ</h1>
  <p align="center">
    <b>An AI-Powered Bookstore ERP System for Small & Medium Businesses</b>
  </p>
  <p align="center">
    Combines intelligent inventory management, automated sales tracking, predictive analytics, and actionable machine learning insights into a unified SaaS experience.
  </p>

  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" /></a>
  </p>
</div>

---

## 📖 Overview

**ShelfIQ** is a next-generation Enterprise Resource Planning (ERP) platform meticulously designed for independent bookstores and retail chain operators. Unlike traditional legacy ERP systems that rely on static spreadsheets and manual data entry, ShelfIQ leverages high-performance **FastAPI** backend services, state-of-the-art **scikit-learn** machine learning models, and an ultra-responsive **React + Tailwind CSS v4** frontend to automate operations from end to end.

From tracking real-time stock velocity and preventing inventory bottlenecks to forecasting 30-day category demand curves with Ridge regression algorithms, ShelfIQ turns everyday sales data into strategic, actionable business growth opportunities.

---

## 📸 Screenshots

| Login Page | Dashboard Overview |
| :---: | :---: |
| ![Login Page](./docs/screenshots/login.png) | ![Dashboard Overview](./docs/screenshots/dashboard.png) |
| **Books Inventory Management** | **Point of Sale (POS) & Checkout** |
| ![Books Page](./docs/screenshots/books.png) | ![Sales Page](./docs/screenshots/sales.png) |
| **Insights AI & Demand Forecasting** | **User Profile & Cloud Profile Uploads** |
| ![Insights AI](./docs/screenshots/insights_ai.png) | ![Profile Page](./docs/screenshots/profile.png) |

---

## ✨ Features

| Category | Key Features | Technical Highlights |
| :--- | :--- | :--- |
| **🔐 Authentication & Security** | • JWT Bearer Token Authentication<br>• Secure Login & Registration<br>• Role-Based Access Control (RBAC)<br>• Forgot Password via Gmail SMTP<br>• Profile Avatar Uploads | Uses `passlib` (`bcrypt`) for password hashing and `python-jose` for stateless JWT token signing. Features automated token validation and expiration workflows. |
| **📚 Inventory Management** | • Real-time Book CRUD Operations<br>• Instant Keyword & ISBN Search<br>• Dynamic Genre Filtering<br>• Automated Pagination<br>• Critical Low-Stock Alerts | Powered by SQLAlchemy ORM with optimized database indexing. Automatically triggers warning notifications when inventory drops below configured thresholds. |
| **🛒 Sales & Cart System** | • Interactive POS Checkout Cart<br>• Atomic Stock Deductions<br>• Historical Transaction Log<br>• Multi-item Order Processing | Uses transactional database boundaries to guarantee zero race conditions during stock deduction across high-velocity sales. |
| **📈 Analytics Dashboard** | • Real-time KPI Summary Cards<br>• Revenue & Profitability Analytics<br>• Top-Selling Books Leaderboard<br>• Interactive Time-Series Charts | Built with `Recharts` and `Framer Motion`. Provides instant visual clarity on cash flows, order volume, and active customer demand. |
| **🧠 Insights AI & Forecasting** | • 30-Day Revenue Projections<br>• Category Velocity Demand Curves<br>• Automated Business Recommendations<br>• Statistical Confidence Scoring | Integrates `scikit-learn` Ridge regression models trained on live historical transactional data to recommend exact inventory replenishment cycles. |
| **🎨 Modern UI/UX SaaS** | • Responsive Mobile/Desktop Layouts<br>• Seamless Dark / Light Mode<br>• Micro-interactions & Hover Overlays<br>• Glassmorphic Design Accents | Styled using **Tailwind CSS v4** and `Lucide React` icons, providing an accessible, distraction-free visual experience. |

---

## 🏗️ System Architecture

ShelfIQ follows a decoupled, cloud-native client-server architecture. The frontend Single Page Application (SPA) communicates securely with the asynchronous Python REST API via JSON payloads over HTTPS.

```mermaid
graph TD
    subgraph Client [Frontend Layer - Vercel]
        UI[React + Vite SPA]
        Router[React Router DOM v6]
        Axios[Axios HTTP Client + Interceptors]
        Charts[Recharts / Framer Motion]
    end

    subgraph API [Backend Layer - Render]
        FastAPI[FastAPI REST Engine]
        Auth[JWT & OAuth2 Security Middleware]
        Pydantic[Pydantic v2 Data Validation]
        ML[scikit-learn Insights AI Engine]
        ORM[SQLAlchemy ORM + Alembic Migrations]
    end

    subgraph Storage [Data Layer - Cloud Providers]
        Postgres[(Neon PostgreSQL Database)]
        Cloudinary[Cloudinary CDN / Local Uploads]
        SMTP[Gmail SMTP Email Server]
    end

    UI --> Router
    Router --> Axios
    Axios -- "HTTPS REST / Bearer JWT" --> FastAPI
    FastAPI --> Auth
    Auth --> Pydantic
    Pydantic --> ML
    Pydantic --> ORM
    ORM -- "SSL Connection / Pool" --> Postgres
    FastAPI -- "Multipart Upload" --> Cloudinary
    FastAPI -- "Async SMTP" --> SMTP
```

### Component Communication Workflow:
1. **Frontend Request Initiation**: The React client uses `Axios` interceptors to automatically attach the user's JWT access token to the `Authorization` header of every outgoing HTTP request.
2. **Backend Authentication & Validation**: `FastAPI` dependency injection verifies token signature and expiration, while `Pydantic` schemas strictly validate request body structure before reaching route logic.
3. **Database & AI Orchestration**: For operational data (`Sales`, `Books`), `SQLAlchemy` executes parameterized queries against **Neon PostgreSQL**. For predictive analytics, the `Insights AI` service extracts multi-table DataFrames and fits time-series regression algorithms on the fly.
4. **Response Delivery**: The API returns sanitized JSON structures. The frontend state management updates instantaneously, triggering smooth `Framer Motion` layout transitions and rendering `Recharts` data visualizations.

---

## 📂 Project Structure

```text
bookstore-erp/
├── backend/
│   ├── alembic/                       # Database migration versions and config
│   ├── app/
│   │   ├── core/                      # Core application configuration and JWT settings
│   │   │   ├── config.py              # Pydantic Settings & Env management
│   │   │   └── security.py            # Password hashing & JWT token generators
│   │   ├── db/                        # Database connection pooling and session management
│   │   │   └── database.py            # SQLAlchemy engine initialization
│   │   ├── enums/                     # Shared system enumerations (User Roles, Genres)
│   │   ├── models/                    # SQLAlchemy ORM table definitions
│   │   │   ├── user.py                # Users & Role definitions
│   │   │   ├── book.py                # Books inventory schema
│   │   │   ├── sale.py                # Sales transactional header
│   │   │   └── sale_item.py           # Sales line items & quantity mapping
│   │   ├── routers/                   # FastAPI REST endpoints
│   │   │   ├── auth.py                # Authentication, Login & Password Reset
│   │   │   ├── book.py                # Inventory CRUD operations
│   │   │   ├── sale.py                # Point of sale & checkout logic
│   │   │   ├── dashboard.py           # Analytics summary & KPI aggregators
│   │   │   └── insights.py            # Machine learning predictions endpoint
│   │   ├── schemas/                   # Pydantic v2 data validation schemas
│   │   │   ├── auth.py                # Login/Register request & response models
│   │   │   ├── book.py                # Book creation & update validation
│   │   │   └── sale.py                # Checkout item validation
│   │   └── services/                  # Business logic & external integrations
│   │       ├── email_service.py       # Gmail SMTP async email delivery
│   │       └── insights_service.py    # AI forecasting pipeline & data threshold logic
│   ├── ml/                            # Machine Learning engine
│   │   ├── predict.py                 # scikit-learn Ridge regression forecasting
│   │   └── train.py                   # Automated model retraining utilities
│   ├── uploads/                       # Local file storage for development avatars
│   ├── requirements.txt               # Backend Python package dependencies
│   └── alembic.ini                    # Alembic migration configuration
│
└── frontend/
    ├── public/                        # Static assets and browser favicons
    ├── src/
    │   ├── api/
    │   │   └── axios.js               # Centralized Axios client with JWT interceptors
    │   ├── components/                # Reusable modular UI building blocks
    │   │   ├── auth/                  # Protected route wrappers and login forms
    │   │   ├── books/                 # Book cards, inventory tables, and modals
    │   │   ├── dashboard/             # KPI summary cards and analytics charts
    │   │   ├── layout/                # Navbar, Sidebar, and App Layout shell
    │   │   ├── sales/                 # POS cart components and checkout drawer
    │   │   └── ui/                    # Design system primitives (Buttons, Badges, SearchBar)
    │   ├── context/                   # Global React Context providers (AuthContext)
    │   ├── pages/                     # Main route view components
    │   │   ├── Login.jsx              # Authentication login/registration screen
    │   │   ├── Dashboard.jsx          # Executive KPI summary screen
    │   │   ├── Books.jsx              # Books inventory & stock management page
    │   │   ├── Sales.jsx              # Point of Sale & transaction history page
    │   │   ├── InsightsAI.jsx         # AI predictive analytics & recommendations page
    │   │   ├── Profile.jsx            # User profile, notifications, and avatar upload
    │   │   └── ResetPassword.jsx      # Password recovery screen
    │   ├── services/                  # Frontend API service layer
    │   │   └── insightsService.js     # API consumer for ML predictions
    │   ├── App.jsx                    # Root router configuration
    │   ├── main.jsx                   # React DOM initialization & entry point
    │   └── index.css                  # Tailwind CSS v4 design tokens and base styles
    ├── package.json                   # NPM dependencies and build scripts
    └── vite.config.js                 # Vite bundler configuration
```

---

## 🚀 Local Setup Guide

Follow these exact steps to run the complete ShelfIQ ERP stack on your local development environment.

### Prerequisites
- **Python** `3.11+` installed
- **Node.js** `18.0+` and **NPM** installed
- **PostgreSQL** installed locally or an active **Neon** PostgreSQL cloud instance

<details>
<summary><b>🐍 Backend Setup (FastAPI + SQLAlchemy)</b></summary>

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install required Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file inside the `backend/` directory (`backend/.env`) with your database credentials and configuration keys (see [Environment Variables](#%EF%B8%8F-environment-variables) section below).

5. **Run Alembic database migrations:**
   Apply all pending schema migrations to initialize PostgreSQL tables:
   ```bash
   alembic upgrade head
   ```

6. **Start the FastAPI development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   > 🎉 Backend API is now live at: `http://localhost:8000`  
   > 📄 Interactive Swagger API docs available at: `http://localhost:8000/docs`

</details>

<details>
<summary><b>⚛️ Frontend Setup (React + Vite + Tailwind v4)</b></summary>

1. **Open a new terminal window and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file inside `frontend/` (`frontend/.env`) pointing to your local FastAPI server:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   > 🎉 Frontend application is now running at: `http://localhost:5173`

</details>

---

## ⚙️ Environment Variables

### 🐍 Backend (`backend/.env`)

| Variable Name | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:password@ep-cold-base.neon.tech/shelfiq?sslmode=require` | Connection string for your PostgreSQL database (supports Neon cloud SSL). |
| `SECRET_KEY` | **Yes** | `09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7` | 64-character cryptographic secret used to sign and verify JWT access tokens. |
| `ALGORITHM` | **Yes** | `HS256` | Cryptographic signing algorithm used for JWT generation (`HS256` recommended). |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | **Yes** | `1440` | Duration in minutes before a generated JWT access token expires (`1440` = 24 hours). |
| `SMTP_HOST` | No | `smtp.gmail.com` | Hostname of the mail server used for sending transactional emails (e.g., password reset). |
| `SMTP_PORT` | No | `587` | Port used for SMTP communication (`587` for STARTTLS, `465` for implicit SSL). |
| `SMTP_USER` | No | `your-email@gmail.com` | Email address authenticated with the SMTP mail server. |
| `SMTP_PASSWORD` | No | `abcd efgh ijkl mnop` | App password or secret key for SMTP authentication (Use Gmail App Passwords for 2FA). |
| `FRONTEND_URL` | **Yes** | `http://localhost:5173` | Exact URL of the frontend application used for CORS validation and reset link generation. |
| `BACKEND_URL` | **Yes** | `http://localhost:8000` | Public URL of the FastAPI backend used for constructing static avatar file paths. |
| `UPLOAD_DIR` | **Yes** | `uploads/profiles` | Local directory relative path where user profile avatars are stored during development. |

### ⚛️ Frontend (`frontend/.env`)

| Variable Name | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:8000` | Base endpoint URL of the FastAPI backend. Used by Axios interceptors for API calls. |

---

## 📚 API Documentation

ShelfIQ provides clean, RESTful endpoints protected by OAuth2 Bearer token authentication. Below is a summary of the core endpoints.

<details open>
<summary><b>🔐 Authentication & Authorization (`/auth`)</b></summary>

| Method | Endpoint | Description | Request Body | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register a new user account | `{ email, password, full_name, role }` | `201 Created` |
| `POST` | `/auth/login` | Authenticate and retrieve JWT token | `OAuth2PasswordRequestForm` | `200 OK` |
| `POST` | `/auth/forgot-password` | Request password recovery link via Gmail SMTP | `{ email }` | `200 OK` |
| `POST` | `/auth/reset-password` | Reset password using verified email token | `{ token, new_password }` | `200 OK` |

</details>

<details open>
<summary><b>📚 Books Inventory (`/books`)</b></summary>

| Method | Endpoint | Description | Query Parameters / Body | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `GET` | `/books` | List paginated books with search & genre filters | `?skip=0&limit=20&search=&genre=` | `200 OK` |
| `POST` | `/books` | Add a new book item to inventory *(Admin/Manager)* | `{ title, author, isbn, price, stock, genre }` | `201 Created` |
| `PUT` | `/books/{id}` | Update existing book details and stock count | `{ title, author, price, stock_quantity... }` | `200 OK` |
| `DELETE` | `/books/{id}` | Remove book record from database *(Admin only)* | `Path parameter: id` | `204 No Content` |

</details>

<details open>
<summary><b>🛒 Sales Management (`/sales`)</b></summary>

| Method | Endpoint | Description | Request Body | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `POST` | `/sales` | Process new checkout and atomically deduct stock | `{ items: [{ book_id, quantity, price }] }` | `201 Created` |
| `GET` | `/sales` | Retrieve paginated transaction history | `?skip=0&limit=50` | `200 OK` |

</details>

<details open>
<summary><b>📊 Dashboard Analytics (`/dashboard`)</b></summary>

| Method | Endpoint | Description | Response Data Structure | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `GET` | `/dashboard/summary` | Get executive KPI metrics | `{ total_revenue, total_sales, active_books, low_stock_count }` | `200 OK` |
| `GET` | `/dashboard/top-books` | Retrieve top-selling books leaderboard | `[{ title, author, total_quantity_sold, revenue_generated }]` | `200 OK` |
| `GET` | `/dashboard/sales-trend` | Get daily time-series revenue data | `[{ date: "YYYY-MM-DD", total_sales: 4500 }]` | `200 OK` |

</details>

<details open>
<summary><b>🧠 Insights AI & Machine Learning (`/insights-ai`)</b></summary>

| Method | Endpoint | Description | Response Data Structure | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `GET` | `/insights-ai/metrics` | Generate real-time ML forecast & recommendations | `{ status, metrics: { predicted_next_30_days_revenue, confidence_score }, charts, recommendations }` | `200 OK` |
| `GET` | `/insights-ai/monthly-sales` | Historical monthly aggregation for demand forecasting | `[{ month: "YYYY-MM", revenue: 12500, units_sold: 140 }]` | `200 OK` |

</details>

<details open>
<summary><b>👤 User Profile (`/profile`)</b></summary>

| Method | Endpoint | Description | Request Body | Response Status |
| :---: | :--- | :--- | :--- | :---: |
| `GET` | `/profile/me` | Get authenticated user profile details | *Headers: `Authorization: Bearer <token>`* | `200 OK` |
| `POST` | `/profile/upload-image` | Upload profile photo (`JPG/PNG/WEBP < 5MB`) | `Multipart form-data: file` | `200 OK` |

</details>

---

## 🌐 Deployment Guide

ShelfIQ is pre-configured for seamless deployment across modern cloud platforms: **Vercel** for the frontend SPA, **Render** for the Python FastAPI server, and **Neon** for serverless PostgreSQL.

### 1. Database Deployment (Neon PostgreSQL)
1. Create a free account at [Neon.tech](https://neon.tech/) and create a new project named `shelfiq-prod`.
2. Copy the provided connection string (ensure `?sslmode=require` is attached).
3. Set this connection string as your `DATABASE_URL` across your backend deployment.

### 2. Backend Deployment (Render)
1. Connect your GitHub repository on [Render.com](https://render.com/) and create a **New Web Service**.
2. **Settings**:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
3. **Environment Variables**: Add all backend `.env` variables (`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `FRONTEND_URL`, `BACKEND_URL`, etc.).
4. Click **Deploy Web Service**. Once live, copy your Render service URL (e.g., `https://shelfiq-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Import your GitHub repository on [Vercel.com](https://vercel.com/) and select the `frontend` directory as the **Root Directory**.
2. **Framework Preset**: `Vite`
3. **Build & Output Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Set to your Render backend service URL (`https://shelfiq-backend.onrender.com`).
5. Click **Deploy**. Vercel will build and distribute your frontend globally via edge CDN.

---

## 🔒 Security Architecture

ShelfIQ implements enterprise-grade security protocols across every layer:

- **🔐 Cryptographic Password Hashing**: All user passwords are salted and hashed using `passlib` with the industry-standard **Bcrypt** algorithm before database insertion. Plaintext passwords are never logged or stored.
- **🏷️ Stateless JWT Authentication**: API access requires a valid OAuth2 JSON Web Token signed via HMAC-SHA256 (`HS256`). Tokens include strict expiration timestamps (`exp`) and subject identifiers (`sub`) to prevent replay attacks.
- **🛡️ Strict CORS Protection**: The `CORSMiddleware` explicitly limits cross-origin requests to trusted origins (`FRONTEND_URL`), preventing unauthorized third-party sites from interacting with the API.
- **👥 Role-Based Access Control (RBAC)**: Route dependencies enforce explicit permission levels. Sensitive administrative actions—such as deleting inventory items or viewing company-wide revenue metrics—are locked behind `Admin` and `Manager` role checks.
- **📧 Secure SMTP Transmission**: Password recovery links are transmitted over encrypted STARTTLS / TLS connections (`Port 587/465`) and utilize one-time cryptographic tokens with limited validity windows.
- **🧼 Data Sanitization & ORM Injection Defense**: `Pydantic v2` strictly enforces type constraints on all API inputs, while `SQLAlchemy` uses parameterized query binding to neutralize 100% of SQL injection vulnerabilities.

---

## 💡 Future Improvements

We are continuously evolving ShelfIQ to meet the growing needs of enterprise bookstore networks. Roadmap priorities include:

- [ ] **🏪 Multi-Store & Branch Management**: Support for multi-location inventory synchronization, inter-branch stock transfers, and branch-specific financial ledgers.
- [ ] **🧾 Automated Invoice Generation & Export**: Instant PDF/Excel receipt and tax invoice generation (`GST/VAT` compliance) upon checkout completion.
- [ ] **📈 Advanced Prophet / ARIMA Forecasting**: Expanding the `scikit-learn` Ridge regression pipeline to incorporate Facebook Prophet and seasonal ARIMA models for multi-year trend analysis.
- [ ] **🔔 Real-Time Webhook & Email Alerts**: Automated email and SMS notifications for low-stock triggers, daily executive summaries, and reorder approvals.
- [ ] **📜 Comprehensive System Audit Logs**: Immutable activity tracking for every inventory adjustment, price update, and user login event for regulatory compliance.

---

## 👨‍💻 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/harshpandey">
        <img src="https://avatars.githubusercontent.com/u/9919?v=4" width="100px;" alt="Harsh Pandey" style="border-radius:50%;"/><br />
        <sub><b>Harsh Pandey</b></sub>
      </a><br />
      <span>💻 Lead Full-Stack Engineer & AI Architect</span>
    </td>
  </tr>
</table>

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the [LICENSE](./LICENSE) file for complete terms and conditions.

---

<div align="center">
  <p>Built with ❤️ by <b>Harsh Pandey</b> for the future of intelligent retail management.</p>
</div>
