import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {
  
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
