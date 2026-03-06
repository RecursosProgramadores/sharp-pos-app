import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  UserPlus,
  PlusCircle,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const pages = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Reservas", icon: Calendar, path: "/admin/reservas" },
  { name: "Barberos", icon: Scissors, path: "/admin/barberos" },
  { name: "Inventario", icon: Package, path: "/admin/inventario" },
  { name: "Punto de Venta", icon: ShoppingCart, path: "/admin/pos" },
  { name: "Clientes", icon: Users, path: "/admin/clientes" },
  { name: "Reportes", icon: BarChart3, path: "/admin/reportes" },
  { name: "Configuración", icon: Settings, path: "/admin/configuracion" },
];

const actions = [
  { name: "Nueva Venta", icon: ShoppingCart, path: "/admin/pos" },
  { name: "Nuevo Cliente", icon: UserPlus, path: "/admin/clientes" },
  { name: "Nueva Reserva", icon: PlusCircle, path: "/admin/reservas" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, acciones..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup heading="Páginas">
          {pages.map((page) => (
            <CommandItem
              key={page.path}
              onSelect={() => runCommand(page.path)}
              className="cursor-pointer"
            >
              <page.icon className="mr-2 h-4 w-4" />
              {page.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones rápidas">
          {actions.map((action) => (
            <CommandItem
              key={action.name}
              onSelect={() => runCommand(action.path)}
              className="cursor-pointer"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
