import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is employee and trying to access dashboard, redirect to products
  if (user?.role === 'employee' && location.pathname === '/') {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}
