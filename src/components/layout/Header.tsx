import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Moon,
  Sun,
  Contrast,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const notifications = [
  { id: 1, title: "Nueva cita agendada", time: "Hace 5 min", unread: true },
  { id: 2, title: "Stock bajo: Gel fijador", time: "Hace 1 hora", unread: true },
  { id: 3, title: "Pago recibido #1234", time: "Hace 2 horas", unread: false },
];

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "high-contrast">("light");
  const unreadCount = notifications.filter((n) => n.unread).length;
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleThemeChange = (newTheme: "light" | "dark" | "high-contrast") => {
    setTheme(newTheme);
    document.documentElement.classList.remove("dark", "high-contrast");
    if (newTheme !== "light") {
      document.documentElement.classList.add(newTheme);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada correctamente");
    navigate("/auth");
  };

  const getRoleLabel = () => {
    if (role === "admin") return "Administrador";
    if (role === "cajero") return "Cajero";
    return "Usuario";
  };

  const getUserName = () => {
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Usuario";
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-300",
        sidebarCollapsed ? "left-20" : "left-64"
      )}
    >
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes, servicios, productos..."
          className="pl-10 input-search"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              {theme === "light" && <Sun className="h-5 w-5" />}
              {theme === "dark" && <Moon className="h-5 w-5" />}
              {theme === "high-contrast" && <Contrast className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleThemeChange("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange("high-contrast")}>
              <Contrast className="mr-2 h-4 w-4" />
              Alto contraste
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 bg-popover">
            <div className="border-b border-border p-4">
              <h4 className="font-display text-lg">Notificaciones</h4>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                    notification.unread && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                      notification.unread ? "bg-secondary" : "bg-transparent"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <Button variant="ghost" className="w-full text-sm">
                Ver todas las notificaciones
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{getUserName()}</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel()}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </DropdownMenuItem>
            {role === "admin" && (
              <DropdownMenuItem onClick={() => navigate("/configuracion")}>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
