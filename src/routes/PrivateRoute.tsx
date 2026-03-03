import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { sessionUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Carregando...</div>;
  }

  if (!sessionUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
