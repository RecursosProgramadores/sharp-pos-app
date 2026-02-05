import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "cajero")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Esperar a que el rol se cargue
  if (role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirigir cajeros a barberos (su primera página disponible)
    if (role === "cajero") {
      // Si ya está en una ruta permitida para cajero, no redirigir
      const cajeroRoutes = ["/barberos", "/inventario", "/pos", "/clientes"];
      if (cajeroRoutes.includes(location.pathname)) {
        return <>{children}</>;
      }
      return <Navigate to="/barberos" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
