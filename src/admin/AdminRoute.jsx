import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "admin@booktales.com";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;