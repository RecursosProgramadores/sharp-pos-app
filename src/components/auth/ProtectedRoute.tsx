import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "cajero")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirigir cajeros a barberos (su primera página disponible)
    if (role === "cajero") {
      return <Navigate to="/barberos" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
