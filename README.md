# Mini ERP - Frontend Interface

This is the frontend client for the **Mini ERP – Inventory & Sales Management System**. It provides a beautiful, responsive, and intuitive user interface built with modern web technologies.

## Tech Stack
- **React 19 & Vite**: Fast and modern UI development.
- **TypeScript**: Typed language for better developer experience and code safety.
- **Tailwind CSS 4**: Utility-first CSS framework for rapid and responsive styling.
- **Redux Toolkit & RTK Query**: State management and efficient data fetching/caching.
- **Lucide React**: Beautiful and consistent iconography.
- **React Router DOM**: Client-side routing.
- **Redux Persist**: Persisting auth state across browser reloads.

## Key Features
- **Secure Authentication**: JWT-based login with persistent sessions.
- **Interactive Dashboard**: View key metrics (Total Products, Total Sales) and Low Stock warnings at a glance.
- **Product Management (CRUD)**:
  - Add new products with image uploads.
  - View products in a responsive data table.
  - Edit existing products dynamically.
  - Delete products with safety confirmations.
  - Smart Search with Debounce.
  - Server-side Pagination.
- **Sales Creation**:
  - Add multiple products to a shopping cart.
  - Real-time stock validation (prevents selling more than what's available).
  - Automatic calculation of subtotal and grand totals.
- **Dynamic Role & Permission Management**: 
  - Complete UI to create roles and assign specific permissions.
  - Dynamic sidebar and route protection based on user permissions.
- **Real-Time Notifications (Socket.io)**: 
  - Instant dashboard data refresh and push notifications when a new sale is created by any user.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing with an interactive sidebar and dropdowns.

## Prerequisites
- Node.js (v18 or higher)
- Backend API running locally or deployed.

## Setup & Installation

1. **Clone the repository and navigate to the frontend folder**:
   ```bash
   git clone <repository-url>
   cd erp-inventory-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   The frontend communicates with the backend via API endpoints. By default, it uses `http://localhost:5000/api/v1`. If your backend is hosted elsewhere, update the `baseUrl` in `src/redux/api/baseApi.ts`.

4. **Run the application**:
   - For development:
     ```bash
     npm run dev
     ```
     The app will be available at `http://localhost:5173`.
   - For production build:
     ```bash
     npm run build
     npm run preview
     ```

## Admin Login Credentials
To log into the system and explore its features, you can use the following default admin credentials:
- **Email**: `admin@erp.com`
- **Password**: `password123`
