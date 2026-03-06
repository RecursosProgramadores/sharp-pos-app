import { useState, useEffect, useCallback } from "react";
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
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  useRealtimeNotifications,
  requestNotificationPermission,
  type RealtimeNotification,
} from "@/hooks/useRealtimeNotifications";
import { CommandPalette } from "./CommandPalette";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

function timeAgo(date: Date): string {
  const diff = Math.round((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Justo ahora";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hora(s)`;
  return `Hace ${Math.floor(diff / 86400)} día(s)`;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "high-contrast">("light");
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleNewNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 20));
  }, []);

  useRealtimeNotifications(handleNewNotification);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

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
    <>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-300",
          sidebarCollapsed ? "left-20" : "left-64"
        )}
      >
        {/* Search trigger */}
        <Button
          variant="outline"
          className="relative w-full max-w-md justify-start text-muted-foreground gap-2"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Buscar clientes, servicios, productos...</span>
          <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
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
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 bg-popover">
              <div className="border-b border-border p-4 flex items-center justify-between">
                <h4 className="font-display text-lg">Notificaciones</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
                    Marcar leídas
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No hay notificaciones nuevas
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                        notification.unread && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (notification.type === "reservation") {
                          navigate("/admin/reservas");
                        }
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === notification.id ? { ...n, unread: false } : n
                          )
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread ? "bg-secondary" : "bg-transparent"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{notification.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(notification.time)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => navigate("/admin/reservas")}
                  >
                    Ver todas las reservas
                  </Button>
                </div>
              )}
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
              <DropdownMenuItem onClick={() => navigate("/admin/configuracion")}>
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              {role === "admin" && (
                <DropdownMenuItem onClick={() => navigate("/admin/configuracion")}>
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

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
