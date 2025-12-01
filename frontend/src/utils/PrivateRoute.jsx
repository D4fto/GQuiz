// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation()

  if (loading) return <div>Carregando...</div>;

  if (!user && !['/create-account'].includes(location.pathname)) return <Navigate to="/login" replace />;

  return children;
}
