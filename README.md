# Mini ERP — Frontend

**Welcome to Inventory & Sales Management System** — a modern and user-friendly Mini ERP designed to simplify product inventory, sales tracking, and business management. Easily manage products, Sales History, monitor stock, and view real-time business insights through an intuitive dashboard.


## 🔗 Live Links
- **Live Frontend**: https://smart-erp-dashboard.vercel.app
- **Frontend GitHub**: https://github.com/Alok4D/erp-inventory-frontend
- **Backend GitHub**: https://github.com/Alok4D/erp-inventory-backend

## 🔑 Admin Login Credentials
| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `123456` |

## ✨ Features Implemented

### 1. Dashboard & Analytics
- Real-time statistics displaying **Total Products**, **Total Sales**, and **Total Revenue**.
- **Low Stock Alerts**: Dedicated section showing products that are running out of stock (less than 5 items).
- Dynamic skeleton loading states for a smooth user experience.

### 2. Authentication & Authorization
- **JWT-Based Login**: Secure login system with persistent sessions.
- **Role-Based UI (RBAC)**: Interface elements (e.g., sidebar links, action buttons) are dynamically hidden or shown based on the user's specific permissions (Admin vs Manager vs Employee).

### 3. Product Management
- **Full CRUD**: Create, Read, Update, and Delete products.
- **Advanced Data Table**: Displays products with Pagination and Real-time Search functionality.
- **Stock Management**: Tracks Purchase Price, Selling Price, and current Stock Quantity.
- **Image Support**: Displays product images seamlessly.

### 4. Sales Management (Point of Sale)
- **Interactive POS Interface**: Add multiple products to a cart before submitting a sale.
- **Smart Search**: Search for products by name or SKU. If a search yields exactly one result, the system automatically selects it for faster checkout.
- **Auto-Clear**: Automatically clears the search bar after adding an item to the cart.
- **Real-Time Stock Validation**: Prevents users from adding more quantity to the cart than is currently available in stock.
- **Sales History**: View past sales records with proper pagination.

### 5. Role & Permission Management
- **Dynamic Roles**: Create new roles (e.g., "Cashier", "Supervisor") directly from the UI.
- **Granular Permissions**: Assign specific permissions (e.g., `view_products`, `create_sale`, `manage_roles`) to any role.

## 🛠️ Tech Stack
- **React 18** (UI Framework)
- **TypeScript** (Type Safety)
- **Redux Toolkit & RTK Query** (State Management & API Data Fetching)
- **React Router v6** (Client-side Routing)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **SweetAlert2** (Toast & Alert Modals)
- **Vite** (Build Tool)

---

## 🚀 Project Setup & Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Alok4D/erp-inventory-frontend.git
cd erp-inventory-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the frontend project:
```env
VITE_BASE_URL=http://localhost:5000/api/v1
```
*(Note: If your backend is deployed, replace the URL with your live backend API link)*

### 4. Run the application
Start the development server:
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

### 5. Build for Production
To create a production build:
```bash
npm run build
```

---

## 📁 Project Structure
```
src/
├── app/                    # Redux store setup
├── components/             # Shared components
│   ├── layout/             # Navbar, Sidebar, DashboardLayout
│   └── ui/                 # Reusable UI elements (Skeleton, etc.)
├── features/               # Feature-based modules
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard components
│   ├── products/           # Product list, creation, editing
│   ├── sales/              # Point of sale, sales history
│   └── roles/              # Role management
├── layouts/                # Page layout wrappers
├── redux/                  # State management
│   └── features/           # RTK Query API slices
├── routes/                 # React Router configuration
└── App.tsx                 # Root component
```
