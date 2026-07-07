import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Products from "../features/products/pages/Products";
import AddProduct from "../features/products/pages/AddProduct";
import EditProduct from "../features/products/pages/EditProduct";
import Sales from "../features/sales/pages/Sales";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Roles from "../features/roles/pages/Roles";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/products/add-product",
            element: <AddProduct />,
          },
          {
            path: "/products/edit-product/:id",
            element: <EditProduct />,
          },
          {
            path: "/sales",
            element: <Sales />,
          },
          {
            path: "/roles",
            element: <Roles />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
