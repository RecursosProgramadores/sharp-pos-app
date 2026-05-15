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

  // Si ya no está cargando y no hay rol, significa que el usuario no tiene permisos asignados
  if (!loading && role === null) {
    console.warn("Usuario autenticado sin rol asignado.");
    return <Navigate to="/auth" state={{ error: "Acceso no autorizado o usuario inactivo" }} replace />;
  }

  // Esperar a que el rol se cargue (solo si aún está cargando o es el estado inicial)
  if (role === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Confirmando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si se especifican roles permitidos, verificar
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirigir cajeros a reservas (su primera página disponible)
    if (role === "cajero") {
      // Si ya está en una ruta permitida para cajero, no redirigir
      const cajeroRoutes = ["/admin/reservas", "/admin/barberos", "/admin/inventario", "/admin/pos", "/admin/clientes"];
      if (cajeroRoutes.includes(location.pathname)) {
        return <>{children}</>;
      }
      return <Navigate to="/admin/reservas" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
