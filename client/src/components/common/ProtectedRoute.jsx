import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../constants";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}