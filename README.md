# Mini ERP — Frontend

This is the frontend for the **Mini ERP – Inventory & Sales Management System**, built with React, TypeScript, and Redux Toolkit.

## 🔗 Live Links
- **Live Frontend**: https://smart-erp-dashboard.vercel.app
- **Live Backend API**: *(Add your Render URL here)*
- **Frontend GitHub**: https://github.com/Alok4D/erp-inventory-frontend
- **Backend GitHub**: https://github.com/Alok4D/erp-inventory-backend

## 🔑 Admin Login Credentials
| Field | Value |
|-------|-------|
| Email | `admin@erp.com` |
| Password | `password123` |

## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type-safe JavaScript |
| Redux Toolkit & RTK Query | State management & API calls |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| SweetAlert2 | Beautiful alert modals |
| Socket.io Client | Real-time updates |
| Vite | Build tool |

## ✨ Features
- **JWT Authentication**: Login, logout, token refresh with persistent sessions.
- **Role-Based UI**: Dashboard components shown/hidden based on user role & permissions.
- **Product Management**: Search, paginate, add, edit, delete products with image upload.
- **Sales Management**: Multi-product cart, live stock checks, process & view sales history.
- **Role & Permission Management**: Dynamic role creation and granular permission control.
- **Dashboard**: Real-time stats — revenue, total products, low-stock alerts.
- **Responsive Design**: Fully responsive layout for mobile and desktop.
- **Skeleton Loading**: Smooth skeleton UI while data is being fetched.

## 📋 Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Alok4D/erp-inventory-frontend.git
cd erp-inventory-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_BASE_URL=http://localhost:5000/api/v1
```
> For production, replace with your deployed backend URL.

### 4. Run the application

**Development mode:**
```bash
npm run dev
```

The app will start on `http://localhost:5173`.

**Production build:**
```bash
npm run build
```

## 📁 Project Structure
```
src/
├── app/                    # Redux store setup
├── components/
│   ├── layout/             # Navbar, Sidebar, DashboardLayout
│   └── ui/                 # Reusable UI components (Skeleton, etc.)
├── features/
│   ├── auth/               # Login, Signup pages
│   ├── dashboard/          # Dashboard page & widgets
│   ├── products/           # Products page, table, modals
│   ├── sales/              # Sales history & create sale
│   └── roles/              # Roles page & modals
├── layouts/                # Page layout wrappers
├── redux/
│   └── features/           # RTK Query API slices (auth, product, sale, role)
├── routes/                 # React Router configuration
└── App.tsx                 # Root component
```

## 🔐 Role & Permission System
The app dynamically controls access based on the authenticated user's role and permissions fetched from the backend:

| Permission | Description |
|------------|-------------|
| `view_products` | Can view product list |
| `create_product` | Can add new products |
| `update_product` | Can edit products |
| `delete_product` | Can delete products |
| `view_sales` | Can view sales history |
| `create_sale` | Can create a new sale |
| `delete_sale` | Can delete a sale |
| `manage_roles` | Can manage roles & permissions |
