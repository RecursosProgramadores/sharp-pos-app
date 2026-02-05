import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  UserCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: ("admin" | "cajero")[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin", roles: ["admin"] },
  { icon: CalendarCheck, label: "Reservas", path: "/admin/reservas", roles: ["admin", "cajero"] },
  { icon: Users, label: "Barberos", path: "/admin/barberos", roles: ["admin", "cajero"] },
  { icon: Package, label: "Inventario", path: "/admin/inventario", roles: ["admin", "cajero"] },
  { icon: ShoppingCart, label: "Punto de Venta", path: "/admin/pos", roles: ["admin", "cajero"] },
  { icon: UserCheck, label: "Clientes", path: "/admin/clientes", roles: ["admin", "cajero"] },
  { icon: BarChart3, label: "Reportes", path: "/admin/reportes", roles: ["admin"] },
  { icon: Settings, label: "Configuración", path: "/admin/configuracion", roles: ["admin"] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { role, loading } = useAuth();

  // Filtrar items según el rol del usuario
  const filteredNavItems = navItems.filter((item) => {
    if (!role) return false;
    return item.roles.includes(role);
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Scissors className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-xl text-sidebar-foreground tracking-wider">
              BARBER PRO
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-4">
        {loading ? (
          // Estado de carga
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/50" />
          </div>
        ) : filteredNavItems.length === 0 ? (
          // Sin items - posible error de rol
          <div className="px-3 py-4 text-sm text-sidebar-foreground/50 text-center">
            {!collapsed && "Cargando menú..."}
          </div>
        ) : (
          // Mostrar items de navegación
          filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  "nav-item",
                  isActive && "active"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })
        )}
      </nav>

      {/* Rol indicator */}
      {!collapsed && role && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50 text-center">
            <p className="text-xs text-sidebar-foreground/60">Sesión activa</p>
            <p className="text-sm font-medium text-sidebar-foreground capitalize">
              {role === "admin" ? "Administrador" : "Cajero"}
            </p>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  );
}
